import { useLocale } from "next-intl";
import LocaleSwitcherSelect from "./LocaleSwitcherSelector";

const LocaleSwitcher = () => {
  const locale = useLocale();

  return (
    <div className="flex justify-center items-center">
      <LocaleSwitcherSelect defaultValue={locale}></LocaleSwitcherSelect>
    </div>
  );
};

export default LocaleSwitcher;
