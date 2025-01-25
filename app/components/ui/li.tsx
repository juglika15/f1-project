const Li = ({ children }: { children: React.ReactNode }) => {
  return (
    <li className="hover:text-f1red transition-all duration-300 ease-in-out hover:shadow-[0_0_10px_f1red] hover:scale-110">
      {children}
    </li>
  );
};

export default Li;
