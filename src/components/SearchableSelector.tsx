"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/components/ui/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface SearchableSelectorProps<T> {
  items: T[];
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  getItemValue: (item: T) => string;
  getItemLabel: (item: T) => string;
  getItemSearchValue?: (item: T) => string;
  renderItem?: (item: T) => React.ReactNode;
  className?: string;
}

export function SearchableSelector<T>({
  items,
  value,
  onValueChange,
  placeholder = "Seleccionar...",
  searchPlaceholder = "Buscar...",
  emptyMessage = "No se encontraron resultados.",
  getItemValue,
  getItemLabel,
  getItemSearchValue,
  renderItem,
  className,
}: SearchableSelectorProps<T>) {
  const [open, setOpen] = React.useState(false);

  const selectedItem = React.useMemo(
    () => items.find((item) => getItemValue(item) === value),
    [items, value, getItemValue],
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between font-normal", className)}
        >
          <span className="truncate">
            {selectedItem ? getItemLabel(selectedItem) : placeholder}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[--radix-popover-trigger-width + 100px] p-0"
        align="start"
      >
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList className="max-h-[400px]">
            <CommandEmpty>{emptyMessage}</CommandEmpty>
            <CommandGroup>
              {items.map((item) => {
                const itemValue = getItemValue(item);
                // We want to combine label and search value for filtering
                const searchLabel = getItemLabel(item);
                const extraSearch = getItemSearchValue
                  ? ` ${getItemSearchValue(item)}`
                  : "";
                const filterValue = `${searchLabel}${extraSearch}`;

                return (
                  <CommandItem
                    key={itemValue}
                    value={filterValue}
                    onSelect={() => {
                      onValueChange(itemValue);
                      setOpen(false);
                    }}
                  >
                    <div className="flex items-center gap-2 flex-1">
                      <Check
                        className={cn(
                          "h-4 w-4 shrink-0",
                          value === itemValue ? "opacity-100" : "opacity-0",
                        )}
                      />
                      <div className="flex-1">
                        {renderItem ? renderItem(item) : getItemLabel(item)}
                      </div>
                    </div>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
