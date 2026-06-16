import React from "react";
import { NAME_ASCII } from "@/lib/constants";

export const AsciiHeader = () => {
  return (
    <div className="w-full overflow-x-auto mb-6 scrollbar-hide select-none">
      <pre className="text-[3.8px] min-[400px]:text-[5px] sm:text-[6.5px] md:text-[7.5px] lg:text-[8.5px] leading-none text-[var(--color-terminal-peach)] font-mono font-medium subpixel-antialiased tracking-normal">
        {NAME_ASCII}
      </pre>
    </div>
  );
};
