import React, { useState } from 'react';
import { Check } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface CanvasItem {
    label: string | null;
    index: number;
}

interface PagingHeaderPanelLeftOptionsProps {
    helper: any;
    canvasItems: CanvasItem[];
  }



const GoTo: React.FC<PagingHeaderPanelLeftOptionsProps> = ({ helper, canvasItems }) => {
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState("")
  
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="default"
            role="combobox"
            aria-expanded={open}
            className="w-[30px] h-[30px] justify-between p-0"
          >
        G
          </Button>
        </PopoverTrigger>
        <PopoverContent side="bottom" align="start" sideOffset={0} className="w-[150px] p-0">
          <Command>
            <CommandInput className ="text-white h-[30px]" placeholder="Go to page..." />
            <CommandList>
              <CommandEmpty>No page found.</CommandEmpty>
              <CommandGroup>
                {canvasItems.map((canvas) => (
                  <CommandItem
                    key={canvas.index}
                    value={String(canvas.index)}
                    onSelect={(currentValue) => {
                      setValue(currentValue === value ? "" : currentValue)
                      setOpen(false)
                    }}
                    className="h-[30px]"
                  >
                    {String(canvas.index)}
                    <Check
                      className={cn(
                        "ml-auto",
                        value === String(canvas.index) ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    )
}

export default GoTo
