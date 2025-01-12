import Image from "next/image";
import logo from "../../../public/images/F1.svg";

const AuthFrame = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-self-center bg-gray-100 dark:bg-gray-700 gap-28">
      <Image
        className="mt-32"
        src={logo}
        alt="f1 logo"
        width="200"
        height="200"
        priority={true}
        style={{ width: "10rem", height: "auto" }}
      />
      {children}
    </div>
  );
};

export default AuthFrame;
