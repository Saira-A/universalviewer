import { ExpandPanel } from "../../extensions/config/ExpandPanel";
import { IIIFEvents } from "../../IIIFEvents";
import { BaseExpandPanel } from "./BaseExpandPanel";
import { Events } from "../../../../Events";

export class RightPanel<T extends ExpandPanel> extends BaseExpandPanel<T> {
  private manuallyToggled: boolean = false; // Flag to track if the panel state has been manually toggled

  constructor($element: JQuery) {
    super($element);
  }

  init(): void {
    super.init();

    const collapseButton = $('.collapseButton');
    const expandButton = $('.expandButton'); // Change class to expandButton

    const setManualToggled = () => {
      this.manuallyToggled = true; // Set manual toggling flag
      console.log('Manual toggled:', this.manuallyToggled);
    };

    collapseButton.on('click', () => {
      setManualToggled(); // Set manual toggling flag when collapse button is clicked
    });

    expandButton.on('click', () => {
      console.log('Expand button clicked.'); // Add logging to see if the event is triggered
      setManualToggled(); // Set manual toggling flag when expand button is clicked
    });


    // Subscribe to events to toggle expand/collapse of the right panel
    this.extensionHost.subscribe(IIIFEvents.TOGGLE_EXPAND_RIGHT_PANEL, () => {
      if (this.isFullyExpanded) {
        this.collapseFull();
      } else {
        this.expandFull();
      }

      setManualToggled(); // Set manual toggling flag
      console.log('Event toggled.');
    });

    // Listen for changes to the fullscreen mode and adjust panel state accordingly
    this.extensionHost.subscribe(Events.TOGGLE_FULLSCREEN, () => {
      const isInFullScreenMode = this.extension.isFullScreen();
      if (!this.manuallyToggled) {
        // If the panel state is not manually toggled, toggle based on fullscreen mode
        this.toggle(isInFullScreenMode);
      }

      console.log('Fullscreen toggled.');
    });

    // Initial check for fullscreen mode and adjust panel state accordingly
    if (this.extension.isFullScreen()) {
      // Open the right panel if in fullscreen mode
      if (!this.isFullyExpanded) {
        // Expand the panel only if it's not fully expanded
        this.expandFull();
      }
    }

    console.log('Initial panel state:', this.isExpanded);
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
