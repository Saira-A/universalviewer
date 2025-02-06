import React, { useEffect, useState } from "react";
// import GoTo from "./GoTo";
import GoTo from "./GoTo2";

const PagingHeaderPanelLeftOptions = ({ helper, onClick }) => {

  const [canvasItems, setCanvasItems] = useState([]);

  useEffect(() => {
      const canvases = helper.getCanvases();
      const canvasLabelsIndexes = canvases.map(canvas => ({
          label: canvas.getLabel().getValue() || null,
          index: canvas.index
      }));
      setCanvasItems(canvasLabelsIndexes);
  }, []);


  return (
    <div className="flex h-full">
      <div className="w-[30px] h-full flex items-center justify-center">S</div>
      <GoTo canvasItems={canvasItems} onClick={onClick}/>
    </div>
  )
};

export default PagingHeaderPanelLeftOptions;
