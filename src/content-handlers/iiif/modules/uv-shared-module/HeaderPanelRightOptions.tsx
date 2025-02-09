import React from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IIIFEvents } from "../../IIIFEvents";
import { IIIFExtensionHost } from "../../IIIFExtensionHost";

interface Props {
  extensionHost: IIIFExtensionHost;
}

const HeaderPanelRightOptions: React.FC<Props> = ({ extensionHost }) => {
  const handleDownloadClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    extensionHost.publish(IIIFEvents.SHOW_DOWNLOAD_DIALOGUE, event.currentTarget);
  };    
  

  return (
    <div className="headerOptions">
      <Button variant="outline" size="icon" onClick={handleDownloadClick}>
        <Download />
      </Button>
    </div>
  );
};

export default HeaderPanelRightOptions;
