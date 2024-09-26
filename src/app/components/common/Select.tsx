import * as React from "react";

import {
  Select as ShadCnSelect,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";

type Props = {
  value: string;
  placeholer: string;
  label: string;
  options: {
    title: string;
    value: string;
  }[];
  onChange: (value: string) => void;
};

export function Select({ label, options, placeholer, value, onChange }: Props) {
  return (
    <ShadCnSelect value={value} onValueChange={(value) => onChange(value)}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder={placeholer} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>{label}</SelectLabel>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.title}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </ShadCnSelect>
  );
}
