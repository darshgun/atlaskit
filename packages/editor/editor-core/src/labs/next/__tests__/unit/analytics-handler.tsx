import { act } from 'react-test-renderer';
import { createEditorFactory } from './__create-editor-helper';
import { createDispatch } from '../../../../event-dispatcher';
import { analyticsEventKey } from '../../../../plugins/analytics';

describe('next/Editor – Analytics', () => {
  const createEditor = createEditorFactory();

  it('should call handleAnalyticsEvent if present', () => {
    const handleAnalyticsEvent = jest.fn();
    const payload = {};

    act(() => {
      createEditor({
        props: {
          handleAnalyticsEvent,
          onMount(actions) {
            const dispatch = createDispatch(
              actions._privateGetEventDispatcher()!,
            );
            dispatch(analyticsEventKey, payload);
          },
        },
      });
    });

    expect(handleAnalyticsEvent).toBeCalledWith(payload);
  });
});
