export default function TicketsLayout({
  children,
  list,
  race,
}: {
  children: React.ReactNode;
  list: React.ReactNode;
  race: React.ReactNode;
}) {
  return (
    <main className="flex flex-col items-center justify-start min-h-screen bg-gray-100 dark:bg-dark">
      <div className="flex items-center justify-center w-full py-6">
        {children}
      </div>

      <div className="flex flex-grow w-full h-screen">
        <div className="w-1/3 border-r border-gray-300">{list}</div>

        <div className="w-2/3 p-4">{race}</div>
      </div>
    </main>
  );
}
