import Image from "next/image";
import tickets from "../../../../../public/images/icon-F1.svg";

const Tickets = () => {
  return (
    <Image
      src={tickets}
      alt="f1 logo"
      width="100"
      height="100"
      priority
      style={{ width: "20rem", height: "auto" }}
    />
  );
};

export default Tickets;
