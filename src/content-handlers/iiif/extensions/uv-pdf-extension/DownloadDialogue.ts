import { DownloadDialogue as BaseDownloadDialogue } from "../../modules/uv-dialogues-module/DownloadDialogue";
import { DownloadOption } from "../../modules/uv-shared-module/DownloadOption";

export class DownloadDialogue extends BaseDownloadDialogue {
  constructor($element: JQuery) {
    super($element);
  }

  create(): void {
    this.setConfig("downloadDialogue");

    super.create();
  }

  open(triggerButton?: HTMLElement | JQuery | null): void {
    super.open(triggerButton as HTMLElement);
    this.addEntireFileDownloadOptions();

    if (!this.$downloadOptions.find("li:visible").length) {
      this.$noneAvailable.show();
    } else {
      // select first option.
      this.$noneAvailable.hide();
    }

    this.resize();
    let buttonElement: HTMLElement | null = null;

    if (triggerButton instanceof HTMLElement) {
      buttonElement = triggerButton;
    } else if (triggerButton instanceof jQuery) {
      buttonElement = triggerButton[0] || null;
    }

    if (!buttonElement) {
      console.warn(
        "DownloadDialogue: triggerButton is not a valid HTMLElement."
      );
      return;
    }

    const panelType = buttonElement.getAttribute("data-panel");

    const arrowElement = this.$element.find(".bottom");

    if (panelType === "header") {
      console.log("Header button clicked - moving dialogue down.");
      this.$element.css("top", "30px");

      arrowElement.hide();
    } else {
      console.log("Footer button clicked - keeping default position.");
      this.$element.css("top", "");
      arrowElement.show();
    }
  }

  isDownloadOptionAvailable(option: DownloadOption): boolean {
    return super.isDownloadOptionAvailable(option);
  }
}
