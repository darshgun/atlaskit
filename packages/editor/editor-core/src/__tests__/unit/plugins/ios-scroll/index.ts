import {
  createEditorFactory,
  scrollIntoView,
} from '@atlaskit/editor-test-helpers';
import { iOSScrollPluginKey } from '../../../../plugins/ios-scroll';
import { setKeyboardHeight } from '../../../../plugins/ios-scroll/commands';

describe('iOS Scroll Plugin', () => {
  const defaultScrollMargin = {
    top: 5,
    bottom: 5,
    right: 0,
    left: 0,
  };
  const defaultScrollThreshold = {
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
  };
  let _webkit: any;
  let _windowInnerHeight: number;
  let _scrollingEl: Element;

  const createEditor = createEditorFactory();
  const editor = () => {
    const editor = createEditor({
      editorProps: { appearance: 'mobile' },
      pluginKey: iOSScrollPluginKey,
    });
    const { editorView } = editor;
    setKeyboardHeight(0)(editorView.state, editorView.dispatch);
    scrollIntoView(editor.editorView);
    return editor;
  };

  beforeEach(() => {
    _webkit = (window as any).webkit;
    _windowInnerHeight = (window as any).innerHeight;
    _scrollingEl = (document as any).scrollingElement;
    (window as any).webkit = {};
    (window as any).innerHeight = 600;
    (document as any).scrollingElement = { clientHeight: 600 };
  });

  afterEach(() => {
    (window as any).webkit = _webkit;
    (window as any).window.innerHeight = _windowInnerHeight;
    (document as any).scrollingElement = _scrollingEl;
  });

  it("initially leaves scroll values so we use ProseMirror's default", () => {
    const { plugin } = editor();
    const { scrollMargin, scrollThreshold } = plugin.spec.props;
    expect([scrollMargin, scrollThreshold]).toEqual([undefined, undefined]);
  });

  describe("when keyboard's height changes", () => {
    it('updates scroll values', () => {
      const { editorView, plugin } = editor();
      setKeyboardHeight(350)(editorView.state, editorView.dispatch);

      const { scrollMargin, scrollThreshold } = plugin.props;
      expect([scrollMargin, scrollThreshold]).toEqual([
        { ...defaultScrollMargin, bottom: 350 },
        { ...defaultScrollThreshold, bottom: 394 },
      ]);
    });

    describe('and window.innerHeight changes', () => {
      it('updates scroll values', () => {
        const { editorView, plugin } = editor();
        setKeyboardHeight(350)(editorView.state, editorView.dispatch);
        (window as any).innerHeight = 800;
        scrollIntoView(editorView);

        const { scrollMargin, scrollThreshold } = plugin.props;
        expect([scrollMargin, scrollThreshold]).toEqual([
          { ...defaultScrollMargin, bottom: 550 },
          { ...defaultScrollThreshold, bottom: 594 },
        ]);
      });
    });
  });

  describe('when window.innerHeight changes', () => {
    it('updates scroll values', () => {
      const { editorView, plugin } = editor();
      (window as any).innerHeight = 800;
      scrollIntoView(editorView);

      const { scrollMargin, scrollThreshold } = plugin.props;
      expect([scrollMargin, scrollThreshold]).toEqual([
        { ...defaultScrollMargin, bottom: 200 },
        { ...defaultScrollThreshold, bottom: 244 },
      ]);
    });

    describe('and keyboard height changes', () => {
      it('updates scroll values', () => {
        const { editorView, plugin } = editor();
        (window as any).innerHeight = 800;
        scrollIntoView(editorView);
        setKeyboardHeight(350)(editorView.state, editorView.dispatch);

        const { scrollMargin, scrollThreshold } = plugin.props;
        expect([scrollMargin, scrollThreshold]).toEqual([
          { ...defaultScrollMargin, bottom: 550 },
          { ...defaultScrollThreshold, bottom: 594 },
        ]);
      });
    });
  });
});
