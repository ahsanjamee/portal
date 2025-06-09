import { Oval } from "react-loader-spinner";

export type Props = {
  height?: string;
};

export const Loader = ({ height }: Props) => {
  return (
    <div
      className={`${height ? height : "h-screen"} flex items-center justify-center`}
    >
      <Oval
        height={40}
        width={40}
        color={"#10B981"}
        visible={true}
        ariaLabel="oval-loading"
        secondaryColor={"#10B981"}
        strokeWidth={4}
        strokeWidthSecondary={4}
      />
    </div>
  );
};
