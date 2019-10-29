import {
  createEditorFactory,
  scrollIntoView,
  insertText,
} from '@atlaskit/editor-test-helpers';

describe('ScrollGutter Plugin', () => {
  const createEditor = createEditorFactory();
  const scrollIntoViewSpy = jest.fn();

  const mockCaretTopPosition = (top: number) => {
    jest.spyOn(window, 'getSelection').mockReturnValue({
      rangeCount: 1,
      getRangeAt: jest.fn(() => ({
        getClientRects: jest.fn(() => [{ top }]),
      })),
    } as any);
  };

  beforeEach(() => {
    // plugin manually creates scroll gutter div element
    // mock scrollIntoView as it won't exist by default and plugin will crash
    const _createElement = document.createElement.bind(document);
    jest.spyOn(document, 'createElement').mockImplementation(tagName => {
      const el = _createElement(tagName);
      el.scrollIntoView = scrollIntoViewSpy;
      return el;
    });
    // mock full-page editor finding .fabric-editor-popup-scroll-parent
    jest
      .spyOn(document, 'querySelector')
      .mockReturnValue(_createElement('div'));
  });

  afterEach(() => {
    jest.restoreAllMocks();
    scrollIntoViewSpy.mockReset();
  });

  it('scrolls to gutter element', () => {
    mockCaretTopPosition(500);
    const { editorView } = createEditor({
      editorProps: { appearance: 'full-page' },
    });

    insertText(editorView, 'hi');
    scrollIntoView(editorView);
    expect(scrollIntoViewSpy).toHaveBeenCalled();
  });

  describe('for mobile', () => {
    let _webkit: any;

    beforeEach(() => {
      // pretend to be on iOS
      _webkit = (window as any).webkit;
      (window as any).webkit = {};
    });

    afterEach(() => {
      (window as any).webkit = _webkit;
    });

    it('does not scroll to gutter element', () => {
      mockCaretTopPosition(500);
      const { editorView } = createEditor({
        editorProps: { appearance: 'mobile' },
      });

      insertText(editorView, 'hi');
      scrollIntoView(editorView);
      expect(scrollIntoViewSpy).not.toHaveBeenCalled();
    });
  });
});
