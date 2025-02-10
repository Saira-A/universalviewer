import React, { useEffect, useState } from "react";
import GoTo from "./GoTo";

const PagingHeaderPanelLeftOptions = ({ helper, pageMode, onClick }) => {
  const [canvasItems, setCanvasItems] = useState([]);

  useEffect(() => {
    const canvases = helper.getCanvases();
    const canvasLabelsIndexes = canvases.map((canvas) => ({
      label: canvas.getLabel().getValue() || null,
      index: canvas.index,
    }));
    setCanvasItems(canvasLabelsIndexes);
  }, []);

  return (
    <div className="flex h-full gap-0 ml-[8px]">
      <GoTo canvasItems={canvasItems} pageMode={pageMode} onClick={onClick} />
    </div>
  );
};

export default PagingHeaderPanelLeftOptions;
