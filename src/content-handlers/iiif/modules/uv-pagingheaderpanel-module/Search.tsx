import React, { useState, useRef, useEffect } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { OpenSeadragonExtensionEvents } from "../../extensions/uv-openseadragon-extension/Events";
import { IIIFExtensionHost } from "../../IIIFExtensionHost";
import OpenSeadragonExtension from "../../extensions/uv-openseadragon-extension/Extension";

interface Props {
  extensionHost: IIIFExtensionHost;
  extension: OpenSeadragonExtension;
  content: any;
}

function Icon() {
  return (
    <svg
      width="30"
      height="30"
      viewBox="0 0 30 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="13" cy="13" r="8" stroke="white" stroke-width="4" />
      <line
        x1="20"
        y1="20"
        x2="27"
        y2="27"
        stroke="white"
        stroke-width="5"
        stroke-linecap="straight"
      />
    </svg>
  );
}

const Search: React.FC<Props> = ({ extensionHost, extension, content }) => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef(null);
  const suggestionsRef = useRef<HTMLUListElement>(null);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  const search = (terms: string): void => {
    extensionHost.publish(OpenSeadragonExtensionEvents.SEARCH, terms);
  };

  const fetchSuggestions = async (term: string) => {
    const autocompleteService = extension.getAutoCompleteUri();
    if (!autocompleteService) return;

    try {
      const response = await fetch(autocompleteService.replace("{0}", term));
      const results = await response.json();
      const matches = results.terms.map((result: any) => result.match);
      setSuggestions(matches);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setSuggestions([]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setHighlightedIndex(-1);

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    if (value.length >= 2) {
      debounceTimer.current = setTimeout(() => {
        fetchSuggestions(value);
      }, 300);
    } else {
      setSuggestions([]);
    }
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
    if (suggestions.length > 0) {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setHighlightedIndex((prev) =>
            prev < suggestions.length - 1 ? prev + 1 : prev
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0));
          break;
        case "Tab":
        e.preventDefault();
        if (e.shiftKey) {
            setHighlightedIndex(prev => prev > 0 ? prev - 1 : 0);
        } else {
            setHighlightedIndex(prev => 
            prev < suggestions.length - 1 ? prev + 1 : prev
            );
        }
        break;
        case "Enter":
          e.preventDefault();
          if (highlightedIndex >= 0) {
            const selectedTerm = suggestions[highlightedIndex];
            go(selectedTerm);
          } else if (searchTerm) {
            go(searchTerm);
          }
          break;
        case "Escape":
          setSuggestions([]);
          break;
      }
    } else if (e.key === "Enter" && searchTerm) {
      go(searchTerm);
    }
  };

  const go = (term) => {
    setOpen(false);
    setSuggestions([]);
    setSearchTerm("");
    search(term);
  };

  const handleSuggestionClick = (suggestion: string) => {
    search(suggestion);
    setOpen(false);
    setSearchTerm("");
    setSuggestions([]);
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
            placeholder={content.enterKeyword}
            value={searchTerm}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className="h-[22px] px-2 py-1 text-background focus:outline-none"
            role="combobox"
            aria-expanded={suggestions.length > 0}
            aria-controls="search-suggestions"
            aria-activedescendant={
              highlightedIndex >= 0
                ? `suggestion-${highlightedIndex}`
                : undefined
            }
          />
          <div className="tailwind-scroll max-h-[230px] overflow-y-auto">
            {suggestions.length > 0 && (
              <ul
                ref={suggestionsRef}
                id="search-suggestions"
                role="listbox"
                className="py-1"
              >
                {suggestions.map((suggestion, index) => (
                  <li
                    key={suggestion}
                    id={`suggestion-${index}`}
                    role="option"
                    aria-selected={index === highlightedIndex}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className={`h-[22px] px-2 py-1 text-black hover:bg-gray-100 hover:text-background cursor-pointer ${
                      index === highlightedIndex ? "bg-gray-100" : ""
                    }`}
                  >
                    {suggestion}
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

export default Search;
