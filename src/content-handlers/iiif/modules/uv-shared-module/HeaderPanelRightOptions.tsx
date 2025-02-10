import React from "react";
import { Download, Share2Icon, Code, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IIIFEvents } from "../../IIIFEvents";
import { IIIFExtensionHost } from "../../IIIFExtensionHost";
import { OpenSeadragonExtensionEvents } from "../../extensions/uv-openseadragon-extension/Events";

interface Props {
  extensionHost: IIIFExtensionHost;
}

const HeaderPanelRightOptions: React.FC<Props> = ({ extensionHost }) => {
  const handleDownloadClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    extensionHost.publish(
      IIIFEvents.SHOW_DOWNLOAD_DIALOGUE,
      event.currentTarget
    );
  };

  const handleShareClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    extensionHost.publish(IIIFEvents.SHOW_SHARE_DIALOGUE, event.currentTarget);
  };

  const handleEmbedClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    extensionHost.publish(IIIFEvents.SHOW_EMBED_DIALOGUE, event.currentTarget);
  };

  const handlePrintClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    extensionHost.publish(OpenSeadragonExtensionEvents.PRINT);
  };


  return (
    <div className="headerOptions">
      <Button
        variant="outline"
        className="text-white"
        size="icon"
        onClick={handleDownloadClick}
        data-panel="header"
      >
        <Download />
      </Button>
      <Button
        variant="outline"
        className="text-white"
        size="icon"
        onClick={handleShareClick}
        data-panel="header"
      >
        <Share2Icon />
      </Button>
      <Button
        variant="outline"
        className="text-white"
        size="icon"
        onClick={handleEmbedClick}
        data-panel="header"
      >
        <Code />
      </Button>
      <Button
        variant="outline"
        className="text-white"
        size="icon"
        onClick={handlePrintClick}
        data-panel="header"
      >
        <Printer />
      </Button>
    </div>
  );
};

export default HeaderPanelRightOptions;
