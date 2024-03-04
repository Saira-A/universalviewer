import { ExpandPanel } from "../../extensions/config/ExpandPanel";
import { IIIFEvents } from "../../IIIFEvents";
import { BaseExpandPanel } from "./BaseExpandPanel";
import { Events } from "../../../../Events";

export class RightPanel<T extends ExpandPanel> extends BaseExpandPanel<T> {
  private manuallyToggled: boolean = false;
  constructor($element: JQuery) {
    super($element);
  }

  init(): void {
    super.init();

    const collapseButton = $('.collapseButton');
    const expandButton = $('.expandButton');
    const title = $('.title');

    const setManualToggled = () => {
      this.manuallyToggled = true;
    };

    collapseButton.on('click', () => {
      setManualToggled();
    });

    expandButton.on('click', () => {
      setManualToggled();
    });

    title.on('click', () => {
        setManualToggled();
    });

    this.extensionHost.subscribe(IIIFEvents.TOGGLE_EXPAND_RIGHT_PANEL, () => {
      if (this.isFullyExpanded) {
        this.collapseFull();
      } else {
        this.expandFull();
      }

      setManualToggled();
    });

    this.extensionHost.subscribe(Events.TOGGLE_FULLSCREEN, () => {
      const isInFullScreenMode = this.extension.isFullScreen();
      if (!this.manuallyToggled) {
        this.toggle(isInFullScreenMode);
      }
    });

    if (this.extension.isFullScreen()) {
      if (!this.isFullyExpanded) {
        this.expandFull();
      }
    }
}

  getTargetWidth(): number {
    return this.isExpanded
      ? this.options.panelCollapsedWidth
      : this.options.panelExpandedWidth;
  }

  getTargetLeft(): number {
    return this.isExpanded
      ? this.$element.parent().width() - this.options.panelCollapsedWidth
      : this.$element.parent().width() - this.options.panelExpandedWidth;
  }

  toggleFinish(): void {
    super.toggleFinish();

    if (this.isExpanded) {
      this.extensionHost.publish(IIIFEvents.OPEN_RIGHT_PANEL);
    } else {
      this.extensionHost.publish(IIIFEvents.CLOSE_RIGHT_PANEL);
    }
    this.extension.updateSettings({ rightPanelOpen: this.isExpanded });
  }

  resize(): void {
    super.resize();

    this.$element.css({
      left: Math.floor(
        this.$element.parent().width() - this.$element.outerWidth()
      ),
    });
  }
}
