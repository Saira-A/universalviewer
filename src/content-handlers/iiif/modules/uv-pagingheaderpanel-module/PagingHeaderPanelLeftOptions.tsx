import React, { useEffect, useState } from "react";
import GoTo from "./GoTo";
import Search from "./Search";
import { IExtension } from "../uv-shared-module/IExtension";
import { IIIFExtensionHost } from "../../IIIFExtensionHost";
import OpenSeadragonExtension from "../../extensions/uv-openseadragon-extension/Extension";

interface Props {
  extensionHost: IIIFExtensionHost;
  extension: IExtension;
  content: any;
  pageMode: boolean;
  onClick: any;
}

const PagingHeaderPanelLeftOptions: React.FC<Props> = ({
  extensionHost,
  extension,
  content,
  pageMode,
  onClick,
}) => {
  type CanvasItem = { label: string | null; index: number };
  const [canvasItems, setCanvasItems] = useState<CanvasItem[]>([]);

  const searchEnabled: boolean =
    (extension as OpenSeadragonExtension)?.isSearchEnabled() ?? false;

  useEffect(() => {
    const canvases = extension.helper.getCanvases();
    const canvasLabelsIndexes = canvases.map((canvas) => ({
      label: canvas.getLabel().getValue() || null,
      index: canvas.index,
    }));
    setCanvasItems(canvasLabelsIndexes);

    console.log(content);
  }, []);

  return (
    <div className="flex h-full gap-0 ml-[8px]">
      {searchEnabled && (
        <Search
          extensionHost={extensionHost}
          extension={extension as OpenSeadragonExtension}
          content={content}
        />
      )}
      {canvasItems.length > 1 && (
        <GoTo
          canvasItems={canvasItems}
          pageMode={pageMode}
          onClick={onClick}
          content={content}
        />
      )}
    </div>
  );
};

export default PagingHeaderPanelLeftOptions;
