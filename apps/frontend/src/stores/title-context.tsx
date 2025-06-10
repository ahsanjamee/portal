/* eslint-disable react-refresh/only-export-components */
import {
  FC,
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

type TitleContextType = {
  setTitle: (title: string | null) => void;
};

const TitleContext = createContext<TitleContextType | null>(null);

export const TitleProvider: FC<PropsWithChildren> = ({ children }) => {
  const [title, setTitle] = useState<string | null>(null);
  const titlePrefix = "ADI";

  const finalPrefix = titlePrefix || "ADI";

  useEffect(() => {
    document.title = title ? `${finalPrefix} - ${title}` : finalPrefix;
  }, [finalPrefix, title]);

  return (
    <TitleContext.Provider
      value={{
        setTitle,
      }}
    >
      {children}
    </TitleContext.Provider>
  );
};

export const useSetTitle = (title: string) => {
  const context = useContext(TitleContext);

  if (!context) {
    throw new Error("useSetTitle_must_be_used_within_a_TitleProvider");
  }

  useEffect(() => {
    context.setTitle(title);
  }, [context, title]);
};
