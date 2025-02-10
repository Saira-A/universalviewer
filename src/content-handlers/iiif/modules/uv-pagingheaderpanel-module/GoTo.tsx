import React, { useState, useRef, useEffect } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

interface CanvasItem {
  label: string | null;
  index: number;
}

interface Props {
  canvasItems: CanvasItem[];
  pageMode: boolean;
  onClick: (index: number) => void;
}

function Icon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 30 30"
      width="30"
      height="30"
      fill="white"
    >
      <path d="M2 2.5L15 15L2 27.5V2.5Z" />
      <path d="M15 2.5L28 15L15 27.5V2.5Z" />
    </svg>
  );
}

const GoTo: React.FC<Props> = ({ canvasItems, pageMode, onClick }) => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef(null);

  const filteredItems = canvasItems.filter((item) => {
    if (pageMode) {
      return (
        item.label?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false
      );
    }
    return String(item.index + 1).includes(searchTerm);
  });

  const handleCanvasSelect = (index: number) => {
    onClick(index);
    setOpen(false);
    setSearchTerm("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && searchTerm) {
      const index = parseInt(searchTerm, 10) - 1;
      if (!isNaN(index) && canvasItems.some((item) => item.index === index)) {
        handleCanvasSelect(index);
      }
    }
  };

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  return (
    <div ref={containerRef}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="default"
            className="w-[30px] h-[30px] justify-center p-0 focus:outline-none focus:ring-0 focus:border-white focus:border-[1px] focus:rounded-none"
          >
            <Icon />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          side="bottom"
          align="start"
          sideOffset={0}
          className="h-auto w-auto p-0 text-xs bg-white"
          container={containerRef.current}
        >
          <input
            ref={inputRef}
            type="text"
            size={8}
            placeholder={pageMode ? "Go to page..." : "Go to image..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
            className="h-[22px] px-2 py-1 text-background focus:outline-none"
          />
          <div className="py-1">
            <div
              className="tailwind-scroll max-h-[230px] overflow-y-auto"
              ref={dropdownRef}
            >
              {filteredItems.map((item) => (
                <div
                  key={item.index}
                  tabIndex={0}
                  onClick={() => handleCanvasSelect(item.index)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleCanvasSelect(item.index);
                    }
                  }}
                  className="h-[22px] px-2 py-1 text-black hover:bg-gray-100 hover:text-background cursor-pointer focus:bg-gray-100 focus:text-background"
                >
                  {pageMode ? item.label : item.index + 1}
                </div>
              ))}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default GoTo;
