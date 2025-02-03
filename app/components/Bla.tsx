"use client";

import { useState } from "react";
import { motion, LayoutGroup } from "framer-motion";
import Image from "next/image";

const LanguageToggle2 = () => {
  const [selected, setSelected] = useState("en");

  const handleToggle = (lang: string) => {
    setSelected(lang);
    // Add additional language-switching logic here, e.g., updating context or router locale.
  };

  return (
    <LayoutGroup>
      <div className="relative flex items-center justify-between w-32 h-9 p-0 bg-gray-200 dark:bg-gray-700 rounded-full cursor-pointer select-none">
        {selected === "en" && (
          <motion.div
            layout
            className="absolute top-1 left-1 bottom-1 w-1/2 bg-white dark:bg-gray-900 rounded-full shadow-md"
            transition={{ type: "spring", stiffness: 300, damping: 40 }}
          />
        )}
        {selected === "ka" && (
          <motion.div
            layout
            className="absolute top-1 right-1 bottom-1 w-1/2 bg-white dark:bg-gray-900 rounded-full shadow-md"
            transition={{ type: "spring", stiffness: 300, damping: 40 }}
          />
        )}

        {/* English (British) side */}
        <div
          onClick={() => handleToggle("en")}
          className="flex-1 flex items-center justify-center relative z-10"
        >
          <Image
            src="https://cdn.countryflags.com/thumbs/united-kingdom/flag-3d-round-250.png"
            alt="English"
            width={23}
            height={23}
          />
        </div>

        {/* Georgian side */}
        <div
          onClick={() => handleToggle("ka")}
          className="flex-1 flex items-center justify-center relative z-10"
        >
          <Image
            src="https://cdn.countryflags.com/thumbs/georgia/flag-3d-round-250.png"
            alt="Georgian"
            width={24}
            height={24}
          />
        </div>
      </div>
    </LayoutGroup>
  );
};

export default LanguageToggle2;
