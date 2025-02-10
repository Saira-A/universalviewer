import React, { useState, useRef, useEffect } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

interface Props {
  numPages: number;
  onClick: (value: string) => void;
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
      <path d="M2 2.5L15 15L2 27.5V2.5Z"/>
      <path d="M15 2.5L28 15L15 27.5V2.5Z"/>
    </svg>
  );
}

const GoTo: React.FC<Props> = ({ numPages, onClick }) => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const pageRange = Array.from({ length: numPages }, (_, i) => i + 1);

  const filteredItems = pageRange.filter((item) =>
    (item).toString().includes(searchTerm)
  ).map(String);

  const handleSelect = (value: string) => {
    onClick(value);
    setOpen(false);
    setSearchTerm("");
  };


  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="default"
          className="w-[30px] h-[30px] justify-center p-0"
        >
          <Icon />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        side="bottom"
        align="start"
        sideOffset={0}
        className="w-[90px] p-0 text-xs bg-white"
          >
        <input
          ref={inputRef}
          type="text"
          placeholder="Go to page..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              // Pass the input value (searchTerm) to the onClick function
              handleSelect(searchTerm);
            }
          }}
          className="w-full h-[22px] px-2 py-1 text-background focus:outline-none"
        />
        <div className="py-2">
          <div className="tailwind-scroll max-h-[230px] overflow-y-auto" ref={dropdownRef}>
            {filteredItems.map((item) => (
              <div
                key={item}
                tabIndex={0}
                onClick={() => handleSelect(item)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSelect(item);
                  }
                }}
                className="h-[22px] px-2 py-1 text-black hover:bg-gray-100 hover:text-background cursor-pointer focus:bg-gray-100 focus:text-background"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default GoTo;