import React, { useState } from "react";
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
  onClick: (index: number) => void;
}

const GoTo: React.FC<Props> = ({ canvasItems, onClick }) => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredItems = canvasItems.filter((item) =>
    String(item.index + 1).includes(searchTerm)
  );

  const handleCanvasSelect = (index: number) => {
    onClick(index);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="default"
          className="w-[30px] h-[30px] justify-between p-0"
        >
          G
        </Button>
      </PopoverTrigger>
      <PopoverContent
        side="bottom"
        align="start"
        sideOffset={0}
        className="w-[150px] p-0 text-xs"
        style={{
          height: "auto",
        }}
      >
        <input
          type="text"
          placeholder="Go to image..."
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full h-[22px] mb-2 px-2 py-1 text-background focus:outline-none"
        />
        <div className="tailwind-scroll max-h-[250px] overflow-y-auto">
            {filteredItems.map((item) => (
              <div
                key={item.index}
                onClick={() => handleCanvasSelect(item.index)}
                className="h-[22px] px-2 py-1 hover:bg-gray-100 hover:text-background cursor-pointer"
              >
                {item.index + 1}
              </div>
            ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default GoTo;