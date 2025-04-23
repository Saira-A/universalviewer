import React, { useState, useRef, useEffect } from "react";
import { Canvas } from "manifesto.js";
import HeaderButton from "../uv-shared-module/HeaderButton";
import { IIIFExtensionHost } from "../../IIIFExtensionHost";
import { IIIFEvents } from "../../IIIFEvents";
import { Goto as GoToIcon } from "../../../../icons/icons";

interface GoToProps {
  helper: any;
  extensionHost: IIIFExtensionHost;
  content: any;
  options: any;
}

export const GoTo: React.FC<GoToProps> = ({
  helper,
  extensionHost,
  content,
  options,
}) => {
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAutoComplete, setShowAutoComplete] = useState<boolean>(false);
  const [autoCompleteWidth, setAutoCompleteWidth] = useState(0);
  const [autoCompleteOptions, setAutoCompleteOptions] = useState<Canvas[]>([]);
  const [focusedOptionIndex, setFocusedOptionIndex] = useState<number>(-1);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLUListElement>(null);
  const searchDropdownRef = useRef<HTMLDivElement>(null);

  const pageModeEnabled = Boolean(options.pageModeEnabled);
  const allCanvases: Canvas[] = helper.getCanvases();

  const getInputWidth = () => {
    // Default minimum width
    let maxLabelLength = 6;

    if (pageModeEnabled) {
      for (const canvas of allCanvases) {
        const labelLength = canvas?.getLabel()?.getValue()?.length;
        if (labelLength === undefined) continue;
        if (labelLength > maxLabelLength) {
          maxLabelLength = labelLength;
        }
      }
    } else {
      for (const canvas of allCanvases) {
        const labelLength = String(canvas?.index).length;
        if (labelLength === undefined) continue;
        if (labelLength > maxLabelLength) {
          maxLabelLength = labelLength;
        }
      }
    }

    const maxWidth = 20;
    const clampedLength = Math.min(maxLabelLength, maxWidth);
    return `${clampedLength}ch`;
  };

  useEffect(() => {
    if (focusedOptionIndex >= 0 && dropdownRef.current) {
      const focusedOption = document.getElementById(
        `option-${focusedOptionIndex}`
      );
      if (focusedOption) {
        focusedOption.scrollIntoView({
          behavior: "instant",
          block: "nearest",
        });
      }
    }
  }, [focusedOptionIndex]);

  useEffect(() => {
    if (isSearchVisible && inputRef.current) {
      updateSearchFieldValue();
      const element = document.querySelector(".search-dropdown");
      if (element) {
        const rect = element.getBoundingClientRect();
        console.log("Width:", rect.width);
        setAutoCompleteWidth(rect.width);
      }
    }
  }, [isSearchVisible]);

  const updateSearchFieldValue = () => {
    const canvas = helper.getCurrentCanvas();
    let value: string;
    if (pageModeEnabled) {
      value = canvas.getLabel().getValue();
    } else {
      value = String(canvas.getIndex() + 1);
    }
    setSearchTerm(value);
  };

  extensionHost.subscribe(
    IIIFEvents.CANVAS_INDEX_CHANGE,
    (canvasIndex: number) => {
      updateSearchFieldValue();
    }
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setFocusedOptionIndex(-1);

    if (options.autoCompleteBoxEnabled) {
      let results: Canvas[] = [];

      if (pageModeEnabled) {
        results = allCanvases.filter((canvas) => {
          const label = canvas.getLabel().getValue()?.toLowerCase();
          return label?.includes(value);
        });
      } else {
        results = allCanvases.filter((canvas, index) =>
          String(index).startsWith(value)
        );
      }

      setAutoCompleteOptions(results);
      setShowAutoComplete(results.length > 0 && value.length > 0);
    }
  };

  const handleInputBlur = () => {
    // Add a small delay before hiding autocomplete to allow click events to register
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

  useEffect(() => {
    const handleScroll = (event) => {
      if (
        showAutoComplete &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setShowAutoComplete(false);
      }
    };

    window.addEventListener("scroll", handleScroll, true);

    return () => {
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [showAutoComplete]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isSearchVisible &&
        searchDropdownRef.current &&
        !searchDropdownRef.current.contains(event.target) &&
        !event.target.closest(".header-goto-button") &&
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
            if (pageModeEnabled) {
              const target = allCanvases.find(
                (canvas) => canvas.getLabel().getValue() === searchTerm
              );
              if (target) {
                go(target);
              }
            } else {
              const target = allCanvases.find(
                (canvas) => String(canvas.index) === searchTerm
              );
              if (target) {
                go(target);
              }
            }
          }
          break;
        case "Escape":
          setAutoCompleteOptions([]);
          setShowAutoComplete(false);
          setIsSearchVisible(false);
          break;
      }
    } else if (e.key === "Enter" && searchTerm.trim()) {
      if (pageModeEnabled) {
        const target = allCanvases.find(
          (canvas) => canvas.getLabel().getValue() === searchTerm
        );
        if (target) {
          go(target);
        }
      } else {
        const target = allCanvases.find(
          (canvas) => String(canvas.index) === searchTerm
        );
        if (target) {
          go(target);
        }
      }
    } else if (e.key === "Escape") {
      setIsSearchVisible(false);
    }
  };

  const go = (selection: Canvas) => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
      debounceTimer.current = null;
    }

    extensionHost.publish(IIIFEvents.CANVAS_INDEX_CHANGE, selection.index);

    setSearchTerm("");
    setIsSearchVisible(false);
    setAutoCompleteOptions([]);
    setShowAutoComplete(false);
  };

  const handleAutoCompleteSelect = (selection: Canvas) => {
    go(selection);
  };

  const handleInputFocus = () => {
    setSearchTerm("");
    setFocusedOptionIndex(-1);
    setAutoCompleteOptions(allCanvases);
    setShowAutoComplete(true);
  };

  const toggleSearch = () => {
    setShowAutoComplete(false);
    setIsSearchVisible(!isSearchVisible);
    if (!isSearchVisible) {
      setSearchTerm("");
    }
  };

  const handleGoButtonClick = () => {
    if (pageModeEnabled) {
      const target = allCanvases.find(
        (canvas) => canvas.getLabel().getValue() === searchTerm
      );
      if (target) {
        go(target);
      }
    } else {
      const target = allCanvases.find(
        (canvas) => String(canvas.index) === searchTerm
      );
      if (target) {
        go(target);
      }
    }
  };

  return (
    <div className="search-component">
      <HeaderButton
        onClick={() => toggleSearch()}
        title="Go to"
        label="Go to"
        className="header-goto-button"
      >
  <GoToIcon fill={isSearchVisible ? "#48c8dd" : "undefined"} />
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
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              maxLength={30}
              aria-label="Search text"
              aria-expanded={showAutoComplete}
              aria-autocomplete="list"
              aria-controls={showAutoComplete ? "autocomplete-list" : undefined}
              aria-activedescendant={
                focusedOptionIndex >= 0
                  ? `option-${focusedOptionIndex}`
                  : undefined
              }
              style={{ width: getInputWidth() }}
            />
            <button
              className="search-go-button"
              onClick={handleGoButtonClick}
              aria-label="Search"
            >
              Go
            </button>
          </div>
          {showAutoComplete && options.autoCompleteBoxEnabled && (
            <div className="dropdown" id="text-dropdown-portal">
              {options.autoCompleteBoxEnabled && (
                <ul
                  id="autocomplete-list"
                  ref={dropdownRef}
                  className="autocomplete-dropdown"
                  style={{ width: autoCompleteWidth }}
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
                      {pageModeEnabled
                        ? option.getLabel().getValue()
                        : String(option.index)}
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

export default GoTo;
