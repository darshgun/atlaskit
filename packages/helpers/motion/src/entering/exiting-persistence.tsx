import React, { useRef, useContext, createContext, Children } from 'react';
import { isReducedMotion } from '../utils/accessibility';
import { useForceRender } from '../utils/use-force-render';

/**
 * Internally we will be playing with an element that will always have a key defined.
 */
type ElementWithKey = JSX.Element & { key: string };

/**
 * Externally children may or may not have a key.
 */
type ChildElement = JSX.Element | boolean;

/**
 * Consumers can use either a single element or multiple elements.
 */
type ChildNode = ChildElement[] | ChildElement;

interface ExitingPersistenceProps {
  /**
   * Children can be any valid react node.
   * Either a single element,
   * multiple elements.
   * or multiple elements in an array.
   */
  children: ChildNode;

  /**
   * When elements are exiting will exit all elements first and then mount the new ones.
   * Defaults to `false`.
   */
  exitThenEnter?: boolean;
}

interface ExitingMotionProps {
  /**
   * Will perform an exit animation instead of an enter animation.
   */
  isExiting?: boolean;

  /**
   * Will be called when the animation has completed.
   */
  onFinish?: () => void;
}

// We define empty context here so the object doesn't change.
const emptyContext = {};

const ExitingContext = createContext<ExitingMotionProps>(emptyContext);

const isAnyPreviousKeysMissingFromCurrent = (
  currentMap: { [key: string]: ElementWithKey },
  previous: ElementWithKey[],
): boolean => {
  for (let i = 0; i < previous.length; i++) {
    const element = previous[i];
    const key = element.key;
    if (!currentMap[key]) {
      return true;
    }
  }

  return false;
};

/**
 * This method will wrap any React element with a context provider. We're using context (instead of
 * cloneElement) so we can communicate between multiple elements without the need of prop drilling
 * (results in a better API for consumers).
 */
const wrapChildWithContextProvider = (
  child: JSX.Element,
  value: ExitingMotionProps = emptyContext,
) => {
  return (
    <ExitingContext.Provider key={`${child.key}-provider`} value={value}>
      {child}
    </ExitingContext.Provider>
  );
};

const spliceNewElementsIntoPrevious = (
  current: ElementWithKey[],
  previous: ElementWithKey[],
): ElementWithKey[] => {
  const splicedChildren: ElementWithKey[] = previous.concat([]);

  for (let i = 0; i < current.length; i++) {
    const child = current[i];
    // TODO: Can we do this better than a find()?
    const childIsNew = !previous.find(x => x.key === child.key);

    if (childIsNew) {
      // This will insert the new element after the previous element.
      splicedChildren.splice(i + 1, 0, child);
    }
  }

  return splicedChildren;
};

const childrenToObj = (children: ElementWithKey[]) => {
  return children.reduce<{ [key: string]: ElementWithKey }>((acc, child) => {
    acc[child.key] = child;
    return acc;
  }, {});
};

/**
 * This function will convert all children types to an array while also filtering out non-valid React elements.
 */
const childrenToArray = (children: ChildNode): ElementWithKey[] => {
  const childrenAsArray: ElementWithKey[] = [];

  // We convert children to an array using this helper method as it will add keys to children that do not
  // have them, such as when we have hardcoded children that are conditionally rendered.
  Children.toArray(children).forEach(child => {
    // We ignore any boolean children to make our code a little more simple later on.
    if (typeof child !== 'boolean') {
      // Children WILL have a key after being forced into an array using the React.Children helper.
      childrenAsArray.push(child as ElementWithKey);
    }
  });

  return childrenAsArray;
};

/**
 * This handles the case when a render updates during an exit motion.
 * If any child is mounted again we removed them from the exiting children object and return true.
 */
const hasAnyExitingChildMountedAgain = (
  exitingChildren: React.MutableRefObject<{
    [key: string]: boolean;
  }>,
  children: ElementWithKey[],
): boolean => {
  let exitingChildMountedAgain = false;

  children.forEach(child => {
    if (exitingChildren.current[child.key]) {
      exitingChildMountedAgain = true;
      delete exitingChildren.current[child.key];
    }
  });

  return exitingChildMountedAgain;
};

const ExitingPersistence: React.FC<ExitingPersistenceProps> = (
  props: ExitingPersistenceProps,
): any => {
  const children = childrenToArray(props.children);
  const childrenObj = childrenToObj(children);
  const previousChildren = useRef<ElementWithKey[]>([]);
  const persistedChildren = useRef<ElementWithKey[]>([]);
  const forceRender = useForceRender();
  const exitingChildren = useRef<{ [key: string]: boolean }>({});

  if (isReducedMotion()) {
    return children;
  }

  // This entire block can't be an effect because we need it to run synchronously during a render
  // else when elements are being removed they will be remounted instead of being updated.
  if (
    previousChildren.current.length &&
    isAnyPreviousKeysMissingFromCurrent(childrenObj, previousChildren.current)
  ) {
    if (
      persistedChildren.current.length === 0 ||
      hasAnyExitingChildMountedAgain(exitingChildren, children)
    ) {
      persistedChildren.current = previousChildren.current;
    }

    // We have persisted children now set from previous children. Let's update previous children
    // so we have it available next render.
    previousChildren.current = children;

    return (props.exitThenEnter
      ? persistedChildren.current
      : spliceNewElementsIntoPrevious(children, persistedChildren.current)
    ).map(child => {
      const currentChild = childrenObj[child.key];
      if (!currentChild) {
        // We've found an exiting child - mark it!
        exitingChildren.current[child.key] = true;

        return wrapChildWithContextProvider(child, {
          isExiting: true,
          onFinish: () => {
            delete exitingChildren.current[child.key];

            // We will only remove the exiting elements when any subsequent exiting elements have also finished.
            // Think of removing many items from a todo list - when removing a few over a few clicks we don't
            // want the list jumping around when they exit.
            if (Object.keys(exitingChildren.current).length === 0) {
              // Set previous children to nothing.
              // This let's us skip the next render check as it's assumed children and previous will be the same.
              previousChildren.current = [];
              persistedChildren.current = [];

              // Re-render after the element(s) have animated away which will end up rendering the latest children.
              forceRender();
            }
          },
        });
      }

      return wrapChildWithContextProvider(currentChild);
    });
  } else {
    previousChildren.current = children;
  }

  return children.map(child => wrapChildWithContextProvider(child));
};

export const useExitingPersistence = () => {
  return useContext(ExitingContext);
};

export default ExitingPersistence;
