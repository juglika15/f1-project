"use client";

import { useState } from "react";
import { FiChevronRight, FiChevronLeft } from "react-icons/fi";

export default function PageLayout({
  children,
  list,
  race,
}: {
  children: React.ReactNode;
  list: React.ReactNode;
  race: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <main className="flex dark:bg-dark flex-grow flex-col bg-gray-100  justify-center items-center   h-screen  overflow-y-hidden">
      <div className="flex items-center justify-center w-full py-6">
        {children}
      </div>
      <div className="flex w-full gap-2 h-fit overflow-y-scroll mt-3 mb-3">
        <div
          className={` bg-gray-300 p-3 overflow-y-scroll transition-all duration-300 border-r border-gray-300 dark:border-gray-700  ${
            isCollapsed ? "w-0" : "w-1/4"
          }`}
        >
          {list}
        </div>
        <button
          onClick={() => setIsCollapsed((prev) => !prev)}
          className="absolute top-1/2 transform -translate-y-1/2 z-10 bg-white border border-gray-300 rounded-full p-2 shadow-lg hover:bg-gray-200 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 transition"
          style={{
            left: isCollapsed ? "0.5rem" : "25%",
          }}
        >
          {isCollapsed ? (
            <FiChevronRight size={20} />
          ) : (
            <FiChevronLeft size={20} />
          )}
        </button>
        <div
          className={` bg-gray-300 p-3  transition-all duration-300 border-r border-gray-300 dark:border-gray-700  ${
            isCollapsed ? "w-full" : "w-3/4"
          }`}
        >
          {race}
        </div>
      </div>
      {/* <div className="flex flex-grow w-full relative overflow-y-scroll">
        <div
          className={`transition-all duration-300 border-r border-gray-300 dark:border-gray-700  ${
            isCollapsed ? "w-16" : "w-1/3"
          }`}
        >
          <div
            className={`h-full transition-opacity duration-300 ${
              isCollapsed ? "opacity-0 pointer-events-none" : "opacity-100"
            }`}
          >
            <div className="h-full p-4 space-y-4 ">{list}</div>
          </div>
        </div>
        <button
          onClick={() => setIsCollapsed((prev) => !prev)}
          className="absolute top-1/2 transform -translate-y-1/2 z-10 bg-white border border-gray-300 rounded-full p-2 shadow-lg hover:bg-gray-200 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 transition"
          style={{
            left: isCollapsed ? "4rem" : "33%",
          }}
        >
          {isCollapsed ? (
            <FiChevronRight size={20} />
          ) : (
            <FiChevronLeft size={20} />
          )}
        </button>
        <div
          className={`transition-all duration-300 overflow-y-scroll ${
            isCollapsed ? "w-[calc(100%-4rem)]" : "w-2/3"
          } p-4`}
        >
          {race}
        </div>
      </div> */}
    </main>
  );
}
