"use client";
import AustralianGP from "@/app/components/circuits/AustralianGP";
import { useState } from "react";

const Help = () => {
  const [selected, setSelected] = useState("Paddock_Club");
  const array = [
    "Paddock_Club",
    "The_Apex",
    "RaceCube",
    "The_lounge",
    "Brabham_suite",
    "The_park",
    "Jones_Suites",
    "Clark",
  ];
  return (
    <main className="flex dark:bg-dark flex-grow flex-col bg-gray-100  justify-center items-center">
      {array.map((item) => (
        <button
          key={item}
          className="bg-gray-300 hover:bg-gray-400 text-black dark:text-white font-bold py-2 px-4 m-2 rounded"
          onClick={() => setSelected(item)}
        >
          {item}
        </button>
      ))}
      <AustralianGP selected={selected} />
    </main>
  );
};

export default Help;
