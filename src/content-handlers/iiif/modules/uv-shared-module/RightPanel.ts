import { ExpandPanel } from "../../extensions/config/ExpandPanel";
import { IIIFEvents } from "../../IIIFEvents";
import { BaseExpandPanel } from "./BaseExpandPanel";

export class RightPanel<T extends ExpandPanel> extends BaseExpandPanel<T> {
  private fullscreenEnabled: boolean;

  constructor($element: JQuery, fullscreenEnabled: boolean) {
    super($element);
    this.fullscreenEnabled = fullscreenEnabled;
  }

  create(): void {
    super.create();
    this.$element.width(this.options.panelCollapsedWidth);

    const updatePanelBasedOnScreenWidth = () => {
        const isLargeScreen = window.innerWidth >=  1200;

        if (this.fullscreenEnabled && isLargeScreen) {
            // Always set shouldOpenPanel to true to open the right panel by default
            const shouldOpenPanel: boolean = true;

            if (shouldOpenPanel) {
                this.toggle(true);
            }
        } else {
            // Close the panel if it's currently open and the screen is not large enough
            if (this.isExpanded) {
                this.toggle(false);
            }
        }
    };

    // Initial update
    updatePanelBasedOnScreenWidth();

    // Add a window resize event listener
    window.addEventListener('resize', updatePanelBasedOnScreenWidth);

    this.extensionHost.subscribe(IIIFEvents.TOGGLE_EXPAND_RIGHT_PANEL, () => {
        if (this.isFullyExpanded) {
            this.collapseFull();
        } else {
            this.expandFull();
        }
    });
  }


  init(): void {
    super.init();

    const isLargeScreen = window.innerWidth >= 1200;

    if (isLargeScreen) {
        // Always set shouldOpenPanel to true to open the right panel by default on large screens
        const shouldOpenPanel: boolean = true;

        if (shouldOpenPanel) {
            this.toggle(true);
        }
    }

    this.extensionHost.subscribe(IIIFEvents.TOGGLE_EXPAND_RIGHT_PANEL, () => {
        if (this.isFullyExpanded) {
            this.collapseFull();
        } else {
            this.expandFull();
        }
    });
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
