import type { ReactNode } from "react";

/** Renders `code` spans written with backticks in the data as <code>. */
export const withCode = (text: string): ReactNode =>
  text.split("`").map((part, index) =>
    index % 2 === 1 ? (
      <code key={index} className="font-mono text-[0.92em] text-foreground">
        {part}
      </code>
    ) : (
      part
    ),
  );

export { formatMonth } from "./dates";
