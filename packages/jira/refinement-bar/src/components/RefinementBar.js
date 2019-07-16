// @flow
/** @jsx jsx */

import {
  PureComponent,
  Children,
  // $FlowFixMe "there is no `forwardRef` export in `react`"
  forwardRef,
  createRef,
  type ElementRef,
} from 'react';
import memoize from 'memoize-one';
import { jsx } from '@emotion/core';
import Badge from '@atlaskit/badge';
import Button from '@atlaskit/button';
import AddIcon from '@atlaskit/icon/glyph/add';

import { RefinementBarProvider, RefinementBarContext } from './ContextProvider';
import Popup, { DialogInner } from './Popup';
import { FilterButton } from './FilterButton';
import { FilterManager } from './FilterManager';

import { cloneObj, objectMap, stringCompare } from '../utils';
import {
  createAndFire,
  defaultAttributes,
  withAnalyticsContext,
  withAnalyticsEvents,
} from '../analytics';

type Props = {
  createAnalyticsEvent: (*) => any,
};
type Context = Object;
type State = {
  activePopupKey: string | null,
  invalid: { [key: string]: string },
  isExpanded: boolean,
  values: Object,
};

class ActualRefinementBar extends PureComponent<Props, State> {
  constructor(props: Props, context: Context) {
    super(props, context);

    // declared here once so react-select can keep track of the keys;
    // helps with the focused option, scroll tracking etc.
    this.filterOptions = context.removeableKeys.map(this.mapKeyToOption);

    this.state = {
      activePopupKey: null,
      invalid: {},
      isExpanded: true,
      values: context.value,
    };
  }

  static contextType = RefinementBarContext;

  filterOptions: Array<Object>;

  showLessRef: ElementRef<*> = createRef();

  showAllRef: ElementRef<*> = createRef();

  analyticsTimer: TimeoutID;

  // ==============================
  // Popups
  // ==============================

  openPopup = key => () => {
    this.setState({ activePopupKey: key });
  };

  closePopup = () => {
    this.setState({ activePopupKey: null });
  };

  // ==============================
  // Analytics
  // ==============================

  handleIdleAnalyticsEvent = values => {
    clearTimeout(this.analyticsTimer);

    // NOTE: Five seconds is arbitrary. Our assumption is that it's enough time
    // to ensure the user has "committed" to a search/filter.
    const idleDuration = 5000;
    const { createAnalyticsEvent } = this.props;

    this.analyticsTimer = setTimeout(() => {
      // NOTE: we must avoid personally identifiable information, so the payload
      // SHOULD NOT contain any actual values.
      const filters = objectMap(values, (val, key) => {
        const field = this.context.fieldConfig[key];
        const filterType = field.type.name;

        // Augment where possible with additional data related to the filter
        // type. For example, number may be greater than / less than etc.
        let additionalData = null;
        switch (filterType) {
          case 'Number':
          case 'Text':
            additionalData = { type: val.type };
            break;
          default:
        }

        return {
          filterType,
          additionalData,
        };
      });

      createAndFire({
        action: 'idle-submit',
        attributes: defaultAttributes,
        filters,
      })(createAnalyticsEvent);
    }, idleDuration);
  };

  // ==============================
  // Field Handlers
  // ==============================

  handleFieldAdd = async (key: string) => {
    const field = this.context.fieldConfig[key];
    const data = field.getInitialValue();
    const meta = { action: 'add', key, data };
    const values = await cloneObj(this.state.values, { add: { [key]: data } });

    this.setState({ activePopupKey: key, values, isExpanded: true }, () => {
      this.context.onChange(values, meta);
    });
  };

  handleFieldRemove = async (key: string, event?: Event) => {
    if (event) {
      event.preventDefault();
    }

    const values = await cloneObj(this.state.values, { remove: key });

    this.setState({ values }, () => {
      this.context.onChange(values, { action: 'remove', key });
    });
  };

  handleFieldClear = async (key: string) => {
    const field = this.context.fieldConfig[key];
    const value = field.getInitialValue();
    const values = cloneObj(this.state.values, { add: { [key]: value } });

    this.setState({ values }, () => {
      this.handleIdleAnalyticsEvent(values);
      this.context.onChange(values, { action: 'clear', key });
    });
  };

  handleFieldChange = (key: string) => (value: *) => {
    const { fieldConfig } = this.context;
    const oldInvalid = this.state.invalid;
    const values = cloneObj(this.state.values, { add: { [key]: value } });

    const field = fieldConfig[key];
    const { message, isInvalid } = field.validateValue(value);

    let invalid = oldInvalid;

    if (isInvalid) {
      invalid = cloneObj(oldInvalid, { add: { [key]: message } });
    } else if (oldInvalid[key]) {
      invalid = cloneObj(oldInvalid, { remove: key });
    }

    const liveUpdateStoredValues = () => {
      // don't commit changes to context if there's invalid keys
      if (invalid[key]) {
        return;
      }

      // avoid unnecessary calls
      if (values[key] === this.context.value[key]) {
        return;
      }

      const data = values[key];
      const meta = { action: 'update', key, data };

      this.handleIdleAnalyticsEvent(values);
      this.context.onChange(values, meta);
    };

    this.setState({ invalid, values }, liveUpdateStoredValues);
  };

  makeField = (config: Object) => (key: string) => {
    const fieldModel = this.context.fieldConfig[key];

    // Catch invalid configurations
    if (!fieldModel) {
      const likelySource = config.isRemovable ? 'value' : 'irremovableKeys';

      throw new Error(
        `Couldn't find a matching field config for key "${key}". There may be stale keys in \`${likelySource}\`.`,
      );
    }

    const { type, ...field } = fieldModel;
    const FieldView = type.view;

    // Catch missing views:
    // This should only really happen when developing a new field type
    if (!FieldView) {
      throw new Error(
        `Couldn't find the View (${type.name}) for key "${key}".`,
      );
    }

    const invalidMessage = this.state.invalid[key];
    const isInvalid = Boolean(invalidMessage);

    const initialValue = field.getInitialValue();
    const storedValue = this.context.value[key] || initialValue;
    const localValue = this.state.values[key] || initialValue;

    const hasPopup = typeof field.formatButtonLabel === 'function';
    const popupIsOpen = this.state.activePopupKey === key;

    const fieldUI = ({ scheduleUpdate }) => {
      const extra = scheduleUpdate ? { ...config, scheduleUpdate } : config;

      return (
        <FieldView
          closePopup={this.closePopup}
          field={field}
          invalidMessage={invalidMessage}
          key={key}
          onChange={this.handleFieldChange(key)}
          refinementBarValue={this.context.value}
          storedValue={storedValue}
          value={localValue}
          {...extra}
        />
      );
    };

    return hasPopup ? (
      <Popup
        key={key}
        isOpen={popupIsOpen}
        onOpen={this.openPopup(key)}
        onClose={this.closePopup}
        allowClose={!isInvalid}
        target={({ isOpen, onClick, ref }: *) => (
          <FilterButton
            field={field}
            isInvalid={isInvalid}
            isSelected={isOpen}
            onClick={onClick}
            onClear={
              stringCompare(storedValue, initialValue)
                ? null
                : () => this.handleFieldClear(key)
            }
            ref={ref}
          >
            {field.formatButtonLabel(storedValue)}
          </FilterButton>
        )}
      >
        {fieldUI}
      </Popup>
    ) : (
      fieldUI({})
    );
  };

  onChangeFilter = (options: *, meta) => {
    this.closePopup();
    switch (meta.action) {
      case 'clear-options':
        options.forEach(o => this.handleFieldRemove(o.value));
        break;
      case 'select-option':
        this.handleFieldAdd(meta.option.value);
        break;
      case 'deselect-option':
        this.handleFieldRemove(meta.option.value);
        break;
      default:
    }
  };

  getFilterValue = memoize(keys => {
    return keys.map(this.mapKeyToOption);
  });

  showAll = isExpanded => () => {
    this.setState({ isExpanded }, () => {
      // NOTE: focus is managed manually here because the show/hide buttons are
      // removed from the DOM and the user should stay focused _somewhere_ in
      // the refinement bar
      const target = isExpanded
        ? this.showLessRef.current
        : this.showAllRef.current;

      if (target && typeof target.focus === 'function') {
        target.focus();
      }
    });
  };

  mapKeyToOption = value => {
    const field = this.context.fieldConfig[value];
    const label = field.label || value;
    return { label, value }; // react-select expects this shape
  };

  render() {
    const { irremovableKeys, selectedKeys } = this.context;
    const { activePopupKey, isExpanded } = this.state;
    const FILTER_POPUP_KEY = '__refinement-bar-more-menu__';

    return (
      <Group>
        {irremovableKeys.map(this.makeField({ isRemovable: false }))}
        {isExpanded && selectedKeys.map(this.makeField({ isRemovable: true }))}

        {/* Show More/Less Control */}
        {!isExpanded && selectedKeys.length ? (
          <Button
            ref={this.showAllRef}
            onClick={this.showAll(true)}
            iconAfter={
              <Badge appearance="primary">{selectedKeys.length}</Badge>
            }
          >
            Show All
          </Button>
        ) : null}

        {/* Add Filter Popup */}
        <Popup
          onOpen={this.openPopup(FILTER_POPUP_KEY)}
          onClose={this.closePopup}
          isOpen={activePopupKey === FILTER_POPUP_KEY}
          target={({ isOpen, onClick, ref }: *) => (
            <Button
              appearance="link"
              iconBefore={<AddIcon />}
              ref={ref}
              isSelected={isOpen}
              onClick={onClick}
            >
              More
            </Button>
          )}
        >
          {({ scheduleUpdate }) => (
            <DialogInner minWidth={220}>
              <FilterManager
                options={this.filterOptions}
                onChange={this.onChangeFilter}
                scheduleUpdate={scheduleUpdate}
                value={this.getFilterValue(selectedKeys)}
              />
            </DialogInner>
          )}
        </Popup>

        {isExpanded && selectedKeys.length ? (
          <Button
            ref={this.showLessRef}
            appearance="subtle-link"
            onClick={this.showAll(false)}
          >
            Show Less
          </Button>
        ) : null}
      </Group>
    );
  }
}

// ==============================
// Styled Components
// ==============================

// eslint-disable-next-line react/no-multi-comp
const Group = forwardRef(({ children }: *, ref) => {
  const gutter = 4;
  const childArray = Children.toArray(children).filter(Boolean); // filter out null and undefined children
  return (
    <div
      ref={ref}
      css={{
        display: 'flex',
        flexWrap: 'wrap',
        margin: -gutter,
      }}
    >
      {childArray.map((child, idx) => (
        <div css={{ margin: gutter, minWidth: 0 }} key={child.key || idx}>
          {child}
        </div>
      ))}
    </div>
  );
});

// ==============================
// Main Export
// ==============================

export const RefinementBarUI = withAnalyticsContext(defaultAttributes)(
  withAnalyticsEvents()(ActualRefinementBar),
);

// ==============================
// Put it together
// ==============================

export const RefinementBar = (props: *) => (
  <RefinementBarProvider {...props}>
    <RefinementBarUI />
  </RefinementBarProvider>
);
