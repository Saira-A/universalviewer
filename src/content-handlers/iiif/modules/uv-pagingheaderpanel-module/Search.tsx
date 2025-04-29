import React, { useState, useRef, useEffect } from "react";
import HeaderButton from "../uv-shared-module/HeaderButton";
import { OpenSeadragonExtensionEvents } from "../../extensions/uv-openseadragon-extension/Events";
import { IIIFExtensionHost } from "../../IIIFExtensionHost";
import OpenSeadragonExtension from "../../extensions/uv-openseadragon-extension/Extension";
import { Search as SearchIcon } from "../../../../icons/icons";

interface SearchProps {
  extension: OpenSeadragonExtension;
  extensionHost: IIIFExtensionHost;
  content: any;
  options: any;
}

export const Search: React.FC<SearchProps> = ({
  extension,
  extensionHost,
  content,
  options,
}) => {
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAutoComplete, setShowAutoComplete] = useState<boolean>(false);
  const [autoCompleteOptions, setAutoCompleteOptions] = useState<string[]>([]);
  const [focusedOptionIndex, setFocusedOptionIndex] = useState<number>(-1);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLUListElement>(null);
  const searchDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isSearchVisible && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSearchVisible]);

  const handleSearchSubmit = (terms: string): void => {
    extensionHost.publish(OpenSeadragonExtensionEvents.SEARCH, terms);
  };

  const fetchSuggestions = async (term: string) => {
    const autocompleteService = extension.getAutoCompleteUri();
    if (!autocompleteService) return;

    try {
      const response = await fetch(autocompleteService.replace("{0}", term));
      const results = await response.json();
      const matches = results.terms.map((result: any) => result.match);
      setAutoCompleteOptions(matches);
      setShowAutoComplete(matches.length > 0);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setAutoCompleteOptions([]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setFocusedOptionIndex(-1);
    setShowAutoComplete(false);

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    if (value.length >= 2) {
      debounceTimer.current = setTimeout(() => {
        fetchSuggestions(value);
      }, 300);
    } else {
      setAutoCompleteOptions([]);
    }
  };

  const handleInputBlur = () => {
    setTimeout(() => {
      setAutoCompleteOptions([]);
      setShowAutoComplete(false);
    }, 150);
  };

  useEffect(() => {
    if (focusedOptionIndex >= 0 && dropdownRef.current) {
      const suggestionItems = dropdownRef.current.querySelectorAll("li");
      const highlightedItem = suggestionItems[focusedOptionIndex];
      if (highlightedItem) {
        highlightedItem.scrollIntoView({
          behavior: "instant",
          block: "nearest",
        });
      }
    }
  }, [focusedOptionIndex]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isSearchVisible &&
        searchDropdownRef.current &&
        !searchDropdownRef.current.contains(event.target) &&
        !event.target.closest(".header-search-button") &&
        !event.target.closest(".dropdown")
      ) {
        setIsSearchVisible(false);
        setShowAutoComplete(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("pointerdown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSearchVisible]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (autoCompleteOptions.length > 0) {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setFocusedOptionIndex((prev) =>
            prev < autoCompleteOptions.length - 1 ? prev + 1 : prev
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setFocusedOptionIndex((prev) => (prev > 0 ? prev - 1 : 0));
          break;
        case "Tab":
          e.preventDefault();
          if (e.shiftKey) {
            setFocusedOptionIndex((prev) => (prev > 0 ? prev - 1 : 0));
          } else {
            setFocusedOptionIndex((prev) =>
              prev < autoCompleteOptions.length - 1 ? prev + 1 : prev
            );
          }
          break;
        case "Enter":
          e.preventDefault();
          if (focusedOptionIndex >= 0) {
            const selectedTerm = autoCompleteOptions[focusedOptionIndex];
            go(selectedTerm);
          } else {
            go(searchTerm);
          }
          break;
        case "Escape":
          setAutoCompleteOptions([]);
          setShowAutoComplete(false);
          setIsSearchVisible(false);
          break;
      }
    } else if (e.key === "Enter" && searchTerm.trim()) {
      // Handle Enter key when no autocomplete options are showing
      e.preventDefault();
      go(searchTerm);
    } else if (e.key === "Escape") {
      setIsSearchVisible(false);
    }
  };

  const go = (term) => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
      debounceTimer.current = null;
    }

    handleSearchSubmit(term);
    setSearchTerm("");
    setIsSearchVisible(false);
    setAutoCompleteOptions([]);
    setShowAutoComplete(false);
  };

  const handleAutoCompleteSelect = (suggestion: string) => {
    go(suggestion);
  };

  const toggleSearch = () => {
    setShowAutoComplete(false);
    setIsSearchVisible(!isSearchVisible);
    if (!isSearchVisible) {
      setSearchTerm("");
    }
  };

  return (
    <div className="search-component">
      <HeaderButton
        onClick={() => toggleSearch()}
        title="Search"
        label="Search"
        className="header-search-button"
      >
        <SearchIcon fill={isSearchVisible ? "#48c8dd" : "undefined"} />
      </HeaderButton>

      {isSearchVisible && (
        <div className="search-dropdown" ref={searchDropdownRef}>
          <div className="search-form">
            <input
              type="text"
              className="search-input"
              ref={inputRef}
              placeholder={content.enterKeyword}
              value={searchTerm}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onBlur={handleInputBlur}
              maxLength={30}
              style={{ width: "20ch" }}
              aria-label="Search text"
              aria-expanded={showAutoComplete}
              aria-autocomplete="list"
              aria-controls={showAutoComplete ? "autocomplete-list" : undefined}
              aria-activedescendant={
                focusedOptionIndex >= 0
                  ? `option-${focusedOptionIndex}`
                  : undefined
              }
            />
          </div>
          {showAutoComplete && options.autoCompleteBoxEnabled && (
            <div className="dropdown" id="text-dropdown-portal">
              {options.autoCompleteBoxEnabled && (
                <ul
                  id="autocomplete-list"
                  ref={dropdownRef}
                  className="autocomplete-dropdown"
                  style={{ width: "20ch" }}
                  role="listbox"
                >
                  {autoCompleteOptions.map((option, index) => (
                    <li
                      key={index}
                      id={`option-${index}`}
                      role="option"
                      aria-selected={focusedOptionIndex === index}
                      className={
                        focusedOptionIndex === index ? "focused-option" : ""
                      }
                      onMouseDown={() => {
                        handleAutoCompleteSelect(option);
                      }}
                      onMouseEnter={() => setFocusedOptionIndex(index)}
                    >
                      {option}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Search;
