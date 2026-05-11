import React from "react";
import { NAME_ASCII } from "@/lib/constants";

export const AsciiHeader = () => {
  return (
    <div className="w-full overflow-x-auto mb-6 scrollbar-hide select-none">
      <pre className="text-[5.5px] md:text-[7px] lg:text-[8.5px] leading-none text-[var(--color-terminal-peach)] font-mono font-medium subpixel-antialiased tracking-normal">
        {NAME_ASCII}
      </pre>
    </div>
  );
};
