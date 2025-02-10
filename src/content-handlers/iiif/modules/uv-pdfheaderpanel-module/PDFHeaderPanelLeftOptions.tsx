import React from "react";
import GoTo from "./GoTo";

const PDFHeaderPanelLeftOptions = ({ numPages, onClick }) => {
  return (
    <div className="flex h-full gap-0 ml-[8px]">
      {numPages > 1 && <GoTo numPages={numPages} onClick={onClick} />}
    </div>
  );
};

export default PDFHeaderPanelLeftOptions;
