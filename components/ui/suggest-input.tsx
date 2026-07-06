"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";

interface SuggestInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "list"> {
  /** Suggested values shown in the dropdown; the user can still type anything. */
  options: readonly string[];
}

/**
 * A free-text input backed by a native <datalist>: the field accepts any value
 * but offers common suggestions. Used for league / country / manufacturer,
 * where the real-world set is open-ended.
 */
export function SuggestInput({ options, id, ...props }: SuggestInputProps) {
  const listId = `${id ?? "suggest"}-options`;
  return (
    <>
      <Input id={id} list={listId} autoComplete="off" {...props} />
      <datalist id={listId}>
        {options.map((opt) => (
          <option key={opt} value={opt} />
        ))}
      </datalist>
    </>
  );
}
