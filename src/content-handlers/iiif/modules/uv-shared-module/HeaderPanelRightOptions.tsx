import React, { useState, useEffect } from "react";
import {
  Download,
  Share2Icon,
  Code,
  Printer,
  MaximizeIcon,
  MinimizeIcon,
  SettingsIcon,
  Grid2X2Icon,
  BookMarkedIcon,
  MailIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { IIIFEvents } from "../../IIIFEvents";
import { Events } from "../../../../Events";
import { IIIFExtensionHost } from "../../IIIFExtensionHost";
import { OpenSeadragonExtensionEvents } from "../../extensions/uv-openseadragon-extension/Events";

interface Props {
  extensionHost: IIIFExtensionHost;
}

const HeaderPanelRightOptions: React.FC<Props> = ({ extensionHost }) => {
  const [isFullScreen, setIsFullScreen] = useState(false);

  const handleFullScreenClick = () => {
    extensionHost.publish(Events.TOGGLE_FULLSCREEN);
  };

  useEffect(() => {
    const handleToggleFullScreen = () => setIsFullScreen((prev) => !prev);
    const handleExitFullScreen = () => setIsFullScreen(false);

    extensionHost.subscribe(Events.TOGGLE_FULLSCREEN, handleToggleFullScreen);
    extensionHost.subscribe(Events.EXIT_FULLSCREEN, handleExitFullScreen);

    return () => {
      setIsFullScreen(false);
    };
  }, [extensionHost]);

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

  const handleSettingsClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    extensionHost.publish(
      IIIFEvents.SHOW_SETTINGS_DIALOGUE,
      event.currentTarget
    );
  };

  const handleGalleryClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    extensionHost.publish(
      IIIFEvents.TOGGLE_EXPAND_LEFT_PANEL,
      event.currentTarget
    );
  };

  const handleFeedbackClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    extensionHost.publish(
      IIIFEvents.FEEDBACK,
      event.currentTarget
    );
  };

  const handleBookmarkClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    extensionHost.publish(
      IIIFEvents.BOOKMARK,
      event.currentTarget
    );
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
      <Button
        variant="outline"
        className="text-white"
        size="icon"
        onClick={handleBookmarkClick}
        data-panel="header"
      >
        <BookMarkedIcon />
      </Button>
      <Button
        variant="outline"
        className="text-white"
        size="icon"
        onClick={handleFeedbackClick}
        data-panel="header"
      >
        <MailIcon />
      </Button>
      <Button
        variant="outline"
        className="text-white"
        size="icon"
        onClick={handleGalleryClick}
        data-panel="header"
      >
        <Grid2X2Icon />
      </Button>
      <Button
        variant="outline"
        className="text-white"
        size="icon"
        onClick={handleSettingsClick}
        data-panel="header"
      >
        <SettingsIcon />
      </Button>
      <Button
        variant="outline"
        className="text-white"
        size="icon"
        onClick={handleFullScreenClick}
      >
        {isFullScreen ? <MinimizeIcon /> : <MaximizeIcon />}
      </Button>
    </div>
  );
};

export default HeaderPanelRightOptions;
