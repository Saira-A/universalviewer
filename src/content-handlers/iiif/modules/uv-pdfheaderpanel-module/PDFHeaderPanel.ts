import { PDFExtensionEvents } from "../../extensions/uv-pdf-extension/Events";
import { Config } from "../../extensions/uv-pdf-extension/config/Config";
import { HeaderPanel } from "../uv-shared-module/HeaderPanel";
import { createElement } from "react";
import PDFHeaderPanelLeftOptions from "./PDFHeaderPanelLeftOptions";

export class PDFHeaderPanel extends HeaderPanel<
  Config["modules"]["pdfHeaderPanel"]
> {
  
  private _pdfDoc: any = null;

  constructor($element: JQuery) {
    super($element);
  }

  create(): void {
    this.setConfig("pdfHeaderPanel");

    super.create();

    this.extensionHost.subscribe(
      PDFExtensionEvents.PAGE_INDEX_CHANGE,
      (pageIndex: number) => {
        this.render();
      }
    );

    this.extensionHost.subscribe(
      PDFExtensionEvents.PDF_LOADED,
      (pdfDoc: any) => {
        this._pdfDoc = pdfDoc;
      }
    );

  }

  render(): void {

    //render PDF options react components in roots
    this.leftOptionsRoot.render(
      createElement(PDFHeaderPanelLeftOptions, {
        numPages: this._pdfDoc.numPages,
        onClick: (value: string) => {
          this.search(value);
        },
      })
    );
  }

  search(value: string): void {
    if (!value) {
      this.extension.showMessage(this.content.emptyValue);
      return;
    }

    let index: number = parseInt(value, 10);

    if (isNaN(index)) {
      this.extension.showMessage(
        this.extension.data.config!.modules.genericDialogue.content
          .invalidNumber
      );
      return;
    }

    this.extensionHost.publish(PDFExtensionEvents.SEARCH, index);
  }


  resize(): void {
    super.resize();
  }
}
