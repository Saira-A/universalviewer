import React from "react";

interface PageToggleProps {
  onOneUpClick: () => void;
  onTwoUpClick: () => void;
  isPaged: boolean;
}

const PageToggle: React.FC<PageToggleProps> = ({ onOneUpClick, onTwoUpClick, isPaged }) => {
  if (!isPaged) return null;

  return (
    <div className="osd-controls">
      <button className="btn imageBtn one-up" title="One Up" onClick={onOneUpClick}>
        <i className="uv-icon-one-up" aria-hidden="true"></i>
        <span className="sr-only">One Up</span>
      </button>

      <button className="btn imageBtn two-up" title="Two Up" onClick={onTwoUpClick}>
        <i className="uv-icon-two-up" aria-hidden="true"></i>
        <span className="sr-only">Two Up</span>
      </button>
    </div>
  );
};

export default PageToggle;

