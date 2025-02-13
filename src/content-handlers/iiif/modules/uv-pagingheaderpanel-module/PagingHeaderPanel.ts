const $ = require("jquery");
import { IIIFEvents } from "../../IIIFEvents";
import { OpenSeadragonExtensionEvents } from "../../extensions/uv-openseadragon-extension/Events";
import { HeaderPanel } from "../uv-shared-module/HeaderPanel";
import OpenSeadragonExtension from "../../extensions/uv-openseadragon-extension/Extension";
import { Mode } from "../../extensions/uv-openseadragon-extension/Mode";
import { sanitize } from "../../../../Utils";
import { Bools } from "@edsilv/utils";
import { Canvas, LanguageMap, ManifestType } from "manifesto.js";
import { Config } from "../../extensions/uv-openseadragon-extension/config/Config";
import { createElement } from "react";
import PagingHeaderPanelLeftOptions from "./PagingHeaderPanelLeftOptions";

export class PagingHeaderPanel extends HeaderPanel<
  Config["modules"]["pagingHeaderPanel"]
> {
  $galleryButton: JQuery;
  $imageModeLabel: JQuery;
  $imageModeOption: JQuery;
  $imageSelectionBox: JQuery;
  $modeOptions: JQuery;
  $oneUpButton: JQuery;
  $pageModeLabel: JQuery;
  $pageModeOption: JQuery;
  $pagingToggleButtons: JQuery;
  $selectionBoxOptions: JQuery;
  $twoUpButton: JQuery;

  constructor($element: JQuery) {
    super($element);
  }

  create(): void {
    this.setConfig("pagingHeaderPanel");

    super.create();

    this.extensionHost.subscribe(IIIFEvents.SETTINGS_CHANGE, () => {
      this.updatePagingToggle();
    });

    this.extensionHost.subscribe(IIIFEvents.LEFTPANEL_EXPAND_FULL_START, () => {
      this.openGallery();
    });

    this.extensionHost.subscribe(
      IIIFEvents.LEFTPANEL_COLLAPSE_FULL_START,
      () => {
        this.closeGallery();
      }
    );

    this.$modeOptions = $('<div class="mode"></div>');
    this.$centerOptions.append(this.$modeOptions);

    this.$imageModeLabel = $(
      '<label for="image">' + this.content.image + "</label>"
    );
    this.$modeOptions.append(this.$imageModeLabel);
    this.$imageModeOption = $(
      '<input type="radio" id="image" name="mode" tabindex="0"/>'
    );
    this.$modeOptions.append(this.$imageModeOption);

    this.$pageModeLabel = $('<label for="page"></label>');
    this.$modeOptions.append(this.$pageModeLabel);
    this.$pageModeOption = $(
      '<input type="radio" id="page" name="mode" tabindex="0"/>'
    );
    this.$modeOptions.append(this.$pageModeOption);

    if (Bools.getBool(this.options.imageSelectionBoxEnabled, true)) {
      this.$selectionBoxOptions = $(
        '<div class="image-selectionbox-options"></div>'
      );
      this.$centerOptions.append(this.$selectionBoxOptions);
      this.$imageSelectionBox = $(
        '<select class="image-selectionbox" name="image-select" tabindex="0" ></select>'
      );
      this.$selectionBoxOptions.append(this.$imageSelectionBox);

      for (
        let imageIndex = 0;
        imageIndex < this.extension.helper.getTotalCanvases();
        imageIndex++
      ) {
        const canvas: Canvas =
          this.extension.helper.getCanvasByIndex(imageIndex);
        const label: string = sanitize(
          <string>(
            LanguageMap.getValue(
              canvas.getLabel(),
              this.extension.helper.options.locale
            )
          )
        );
        this.$imageSelectionBox.append(
          "<option value=" + imageIndex + ">" + label + "</option>"
        );
      }

      this.$imageSelectionBox.change(() => {
        const imageIndex: number = parseInt(this.$imageSelectionBox.val());
        this.extensionHost.publish(
          OpenSeadragonExtensionEvents.IMAGE_SEARCH,
          imageIndex
        );
      });
    }

    if (this.isPageModeEnabled()) {
      this.$pageModeOption.attr("checked", "checked");
      this.$pageModeOption.removeAttr("disabled");
      this.$pageModeLabel.removeClass("disabled");
    } else {
      this.$imageModeOption.attr("checked", "checked");
      // disable page mode option.
      this.$pageModeOption.attr("disabled", "disabled");
      this.$pageModeLabel.addClass("disabled");
    }

    if (this.extension.helper.getManifestType() === ManifestType.MANUSCRIPT) {
      this.$pageModeLabel.text(this.content.folio);
    } else {
      this.$pageModeLabel.text(this.content.page);
    }

    this.$galleryButton = $(`
          <button class="btn imageBtn gallery" title="${this.content.gallery}">
            <i class="uv-icon-gallery" aria-hidden="true"></i>
            <span class="sr-only">${this.content.gallery}</span>
          </button>
        `);
    this.$rightOptions.prepend(this.$galleryButton);

    this.$pagingToggleButtons = $('<div class="pagingToggleButtons"></div>');
    this.$rightOptions.prepend(this.$pagingToggleButtons);

    this.$oneUpButton = $(`
          <button class="btn imageBtn one-up" title="${this.content.oneUp}">
            <i class="uv-icon-one-up" aria-hidden="true"></i>
            <span class="sr-only">${this.content.oneUp}</span>
          </button>`);
    this.$pagingToggleButtons.append(this.$oneUpButton);

    this.$twoUpButton = $(`
          <button class="btn imageBtn two-up" title="${this.content.twoUp}">
            <i class="uv-icon-two-up" aria-hidden="true"></i>
            <span class="sr-only">${this.content.twoUp}</span>
          </button>
        `);
    this.$pagingToggleButtons.append(this.$twoUpButton);

    this.updatePagingToggle();
    this.updateGalleryButton();

    this.$oneUpButton.onPressed(() => {
      const enabled: boolean = false;
      this.updateSettings({ pagingEnabled: enabled });
      this.extensionHost.publish(
        OpenSeadragonExtensionEvents.PAGING_TOGGLED,
        enabled
      );
    });

    this.$twoUpButton.onPressed(() => {
      const enabled: boolean = true;
      this.updateSettings({ pagingEnabled: enabled });
      this.extensionHost.publish(
        OpenSeadragonExtensionEvents.PAGING_TOGGLED,
        enabled
      );
    });

    this.$galleryButton.onPressed(() => {
      this.extensionHost.publish(IIIFEvents.TOGGLE_EXPAND_LEFT_PANEL);
    });


    // check if the book has more than one page, otherwise hide prev/next options.
    if (this.extension.helper.getTotalCanvases() === 1) {
      this.$centerOptions.hide();
    }

    // ui event handlers.

    // If page mode is disabled, we don't need to show radio buttons since
    // there is only one option:
    if (!this.config.options.pageModeEnabled) {
      this.$imageModeLabel.hide();
      this.$imageModeOption.hide();
      this.$pageModeLabel.hide();
      this.$pageModeOption.hide();
    } else {
      // Only activate click actions for mode buttons when controls are
      // visible, since otherwise, clicking on the "Image" label can
      // trigger unexpected/undesired side effects.
      this.$imageModeOption.on("click", () => {
        this.extensionHost.publish(
          OpenSeadragonExtensionEvents.MODE_CHANGE,
          Mode.image.toString()
        );
      });

      this.$pageModeOption.on("click", () => {
        this.extensionHost.publish(
          OpenSeadragonExtensionEvents.MODE_CHANGE,
          Mode.page.toString()
        );
      });
    }


    if (this.options.modeOptionsEnabled === false) {
      this.$modeOptions.hide();
      this.$centerOptions.addClass("modeOptionsDisabled");
    }

    if (this.options.helpEnabled === false) {
      this.$helpButton.hide();
    }



    // todo: discuss on community call
    // Get visible element in centerOptions with greatest tabIndex
    // var $elementWithGreatestTabIndex: JQuery = this.$centerOptions.getVisibleElementWithGreatestTabIndex();

    // // cycle focus back to start.
    // if ($elementWithGreatestTabIndex) {
    //     $elementWithGreatestTabIndex.blur(() => {
    //         if (this.extension.tabbing && !this.extension.shifted) {
    //             this.$nextButton.focus();
    //         }
    //     });
    // }

    // this.$nextButton.blur(() => {
    //     if (this.extension.tabbing && this.extension.shifted) {
    //         setTimeout(() => {
    //             $elementWithGreatestTabIndex.focus();
    //         }, 100);
    //     }
    // });

    if (!Bools.getBool(this.options.pagingToggleEnabled, true)) {
      this.$pagingToggleButtons.hide();
    }

    this.leftOptionsRoot.render(
      createElement(PagingHeaderPanelLeftOptions, {
        extensionHost: this.extensionHost,
        extension: this.extension,
        content: this.content,
        pageMode: this.isPageModeEnabled(),
        onClick: (index: number) => {
          this.extensionHost.publish(
            OpenSeadragonExtensionEvents.IMAGE_SEARCH,
            index
          );
        },
      })
    );
  }

  openGallery(): void {
    this.$oneUpButton.removeClass("on");
    this.$twoUpButton.removeClass("on");
    this.$galleryButton.addClass("on");
  }

  closeGallery(): void {
    this.updatePagingToggle();
    this.$galleryButton.removeClass("on");
  }

  isPageModeEnabled(): boolean {
    return (
      this.config.options.pageModeEnabled &&
      (<OpenSeadragonExtension>this.extension).getMode().toString() ===
        Mode.page.toString()
    );
  }

  updatePagingToggle(): void {
    if (!this.pagingToggleIsVisible()) {
      this.$pagingToggleButtons.hide();
      return;
    }

    if ((<OpenSeadragonExtension>this.extension).isPagingSettingEnabled()) {
      this.$oneUpButton.removeClass("on");
      this.$twoUpButton.addClass("on");
    } else {
      this.$twoUpButton.removeClass("on");
      this.$oneUpButton.addClass("on");
    }
  }

  pagingToggleIsVisible(): boolean {
    return (
      Bools.getBool(this.options.pagingToggleEnabled, true) &&
      this.extension.helper.isPagingAvailable()
    );
  }

  updateGalleryButton(): void {
    if (!this.galleryIsVisible()) {
      this.$galleryButton.hide();
    }
  }

  galleryIsVisible(): boolean {
    return (
      Bools.getBool(this.options.galleryButtonEnabled, true) &&
      this.extension.isLeftPanelEnabled()
    );
  }

  resize(): void {
    super.resize();

    // hide toggle buttons below minimum width
    if (this.extension.isMobileMetric()) {
      if (this.pagingToggleIsVisible()) this.$pagingToggleButtons.hide();
      if (this.galleryIsVisible()) this.$galleryButton.hide();
    } else {
      if (this.pagingToggleIsVisible()) this.$pagingToggleButtons.show();
      if (this.galleryIsVisible()) this.$galleryButton.show();
    }
  }
}
