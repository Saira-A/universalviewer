import React from "react";

interface HeaderButtonProps {
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  title: string;
  children: React.ReactNode;
}

const HeaderButton: React.FC<HeaderButtonProps> = ({
  onClick,
  title,
  children
}) => {
  return (
    <button
      className="header-button"
      type="button"
      onClick={onClick}
      title={title}
    >
      {children}
    </button>
  );
};

export default HeaderButton;
