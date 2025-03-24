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
  content: any;
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

const GoTo: React.FC<Props> = ({ canvasItems, pageMode, onClick, content }) => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef(null);
  const suggestionsRef = useRef<HTMLUListElement>(null);

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
    setHighlightedIndex(-1);
  };

  useEffect(() => {
    if (highlightedIndex >= 0 && suggestionsRef.current) {
      const suggestionItems = suggestionsRef.current.querySelectorAll("li");
      const highlightedItem = suggestionItems[highlightedIndex];
      if (highlightedItem) {
        highlightedItem.scrollIntoView({
          block: "nearest",
          behavior: "smooth",
        });
      }
    }
  }, [highlightedIndex]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (filteredItems.length > 0) {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setHighlightedIndex((prev) =>
            prev < filteredItems.length - 1 ? prev + 1 : prev
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0));
          break;
        case "Tab":
          e.preventDefault();
          if (e.shiftKey) {
            setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0));
          } else {
            setHighlightedIndex((prev) =>
              prev < filteredItems.length - 1 ? prev + 1 : prev
            );
          }
          break;
        case "Enter":
          e.preventDefault();
          if (highlightedIndex >= 0) {
            handleCanvasSelect(filteredItems[highlightedIndex].index);
          } else if (searchTerm) {
            const index = parseInt(searchTerm, 10) - 1;
            if (
              !isNaN(index) &&
              canvasItems.some((item) => item.index === index)
            ) {
              handleCanvasSelect(index);
            }
          }
          break;
        case "Escape":
          setHighlightedIndex(-1);
          break;
      }
    } else if (e.key === "Enter" && searchTerm) {
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

  useEffect(() => {
    setHighlightedIndex(-1);
  }, [searchTerm]);

  return (
    <div ref={containerRef}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            title={content.go}
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
            role="combobox"
            aria-expanded={filteredItems.length > 0}
            aria-controls="goto-suggestions"
            aria-activedescendant={
              highlightedIndex >= 0
                ? `suggestion-${highlightedIndex}`
                : undefined
            }
          />
          <div className="tailwind-scroll max-h-[230px] overflow-y-auto">
            {filteredItems.length > 0 && (
              <ul
                ref={suggestionsRef}
                id="goto-suggestions"
                role="listbox"
                className="py-1"
              >
                {filteredItems.map((item, index) => (
                  <li
                    key={item.index}
                    id={`suggestion-${index}`}
                    role="option"
                    aria-selected={index === highlightedIndex}
                    onClick={() => handleCanvasSelect(item.index)}
                    className={`h-[22px] px-2 py-1 text-black hover:bg-gray-100 hover:text-background cursor-pointer ${
                      index === highlightedIndex ? "bg-gray-100" : ""
                    }`}
                  >
                    {pageMode ? item.label : item.index + 1}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default GoTo;
