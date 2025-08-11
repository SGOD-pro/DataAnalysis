"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
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
import { columnTypes } from "@/data";
import { Badge } from "./ui/badge";

export function ComboboxDemo({
  selectedValues,
}: {
  selectedValues?: (value: string[]) => void;
}) {
  const [value, setValue] = React.useState<null | string[]>();

  return (
    <Popover
      onOpenChange={(e) => {
        if (value && value.length != 0 && !e) selectedValues?.(value);
      }}
    >
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" className="justify-between w-full">
          {value?.length ? `${value.length + " Selected"}` : "Select features"}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <Command>
          <CommandInput placeholder="Search framework..." className="h-9" />
          <CommandList>
            <CommandEmpty>No framework found.</CommandEmpty>
            <CommandGroup>
              {columnTypes.map((data, index) => (
                <CommandItem
                  key={index}
                  value={data.name}
                  onSelect={(currentValue) => {
                    setValue((prev) =>
                      prev?.includes(currentValue)
                        ? prev.filter((val) => val !== currentValue)
                        : [...(prev || []), currentValue]
                    );
                  }}
                >
                  {data.name} <Badge variant={"secondary"}>{data.type}</Badge>
                  <Check
                    className={cn(
                      "ml-auto",
                      value?.includes(data.name) ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
