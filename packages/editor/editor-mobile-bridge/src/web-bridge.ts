type Padding = { top: number; right: number; bottom: number; left: number };

export const defaultPadding = [32, 16, 32, 16];

export default abstract class WebBridge {
  constructor() {
    // Set initial page padding (necessary for seeing the gap cursor for some content nodes).
    // This may be overwritten at runtime by a native bridge consumer.
    this.setPadding(...defaultPadding);
  }

  private padding: Padding = { top: 0, right: 0, bottom: 0, left: 0 };

  abstract getRootElement(): HTMLElement | null;

  setPadding(
    top: number = 0,
    right: number = 0,
    bottom: number = 0,
    left: number = 0,
  ) {
    let root = this.getRootElement();
    if (root) {
      root.style.padding = `${top}px ${right}px ${bottom}px ${left}px`;
      this.padding = { top, right, bottom, left };
    }
  }

  getPadding(): Padding {
    return this.padding;
  }

  reload(): void {
    window.location.reload();
  }
}
