import React, {
  cloneElement,
  useState,
  useRef,
  useLayoutEffect,
  Children,
} from 'react';

interface StaggeredEntranceProps {
  /**
   * Delay in ms.
   * How long each element group will be staggered.
   * This will be multipled by the column and row of the element.
   * Defaults to `50`.
   */
  delayStep?: number;

  /**
   * Number of columns the children elements will be displayed over.
   * Use `"responsive"` to have it calculate dynamically on the client side.
   * **NOTE:** This has a big caveat that the elements will be invisible until the client side Javascript executes.
   * Defaults to `"responsive"`.
   */
  columns?: number | 'responsive';

  /**
   * Index of the column.
   * Useful if you want to have columns inside separate containers.
   * Starts from `0`.
   */
  column?: number;

  /**
   * Any child FadeIn components.
   * This will be cloned and passed a calculated delay value.
   */
  children: JSX.Element | JSX.Element[];
}

/**
 * For a list of elements that need to animate in,
 * this should be used in conjunction with entrance components.
 * This does not need Javascript to execute so it will run immediately for any SSR rendered React apps before the JS has executed.
 *
 * Will dynamically add delay to each child entrance component.
 * Unfortunately all entrance components _NEED_ to be a direct descendant.
 */
const StaggeredEntrance: React.FC<StaggeredEntranceProps> = ({
  children,
  column,
  columns = 'responsive',
  delayStep = 50,
}: StaggeredEntranceProps) => {
  const elementRefs = useRef<(HTMLElement | null)[]>([]);
  const [actualColumns, setActualColumns] = useState(() => {
    if (typeof columns === 'number') {
      // A hardcoded columns is set so bail out and set it to that!
      return columns;
    }

    if (typeof column === 'number') {
      // A hardcoded column is set so we will set actualColumns to be 1.
      return 1;
    }

    // We are in "responsive" mode.
    // So we will be calculating when the Javascript executes on the client how many columns there will be.
    return 0;
  });

  useLayoutEffect(() => {
    if (
      columns === 'responsive' &&
      elementRefs.current.length &&
      actualColumns === 0
    ) {
      let currentTop: number = 0;
      let numberColumns: number = 0;

      if (elementRefs.current.length === 1) {
        setActualColumns(1);
        return;
      }

      for (let i = 0; i < elementRefs.current.length; i++) {
        const child = elementRefs.current[i];
        if (!child) {
          break;
        }

        if (!currentTop) {
          currentTop = child.offsetTop;
        }

        if (currentTop === child.offsetTop) {
          numberColumns += 1;

          if (elementRefs.current.length - 1 === i) {
            setActualColumns(numberColumns);
          }

          continue;
        }

        setActualColumns(numberColumns);
        break;
      }
    }
    // We only want this effect to run once - on initial mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return Children.toArray(children).map((child, index) => {
    const currentColumn = column || index % actualColumns;
    const currentRow = Math.floor(index / actualColumns);
    const delayMultiplier = Math.log(currentRow + currentColumn) * 5;

    return cloneElement(child as JSX.Element, {
      playState: actualColumns === 0 ? 'paused' : 'running',
      delay:
        Math.abs(
          Math.ceil(Math.log((delayMultiplier + 1) / 2) * delayStep * 2),
        ) || 0,
      ref: (element: HTMLElement | null) =>
        (elementRefs.current[index] = element),
    });
    // Types don't support returning an array unfortunately.
    // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/20356
  }) as any;
};

export default StaggeredEntrance;
