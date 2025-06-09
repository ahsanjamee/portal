import { useGlobalStoreSelector } from "@/stores/global.store";
import { LoadingOverlay } from "@mantine/core";
import { cx } from "class-variance-authority";
import { FC, PropsWithChildren } from "react";
import { useLocation } from "react-router-dom";
import "./styles.css";

export const AuthLayout: FC<PropsWithChildren> = ({ children }) => {
  const location = useLocation();
  const showOverlay = useGlobalStoreSelector((s) => s.showOverly);

  /* ===== auth wrapper  classes ========= */
  const classes = cx(
    "sm:pt-[60px] pt-7  h-full",
    location.search.includes("user-info") && "mb-[120px]"
  );

  return (
    <div className="h-screen w-screen overflow-auto flex justify-center bg-[#F2F4F5] relative">
      <LoadingOverlay
        visible={showOverlay}
        zIndex={1000}
        overlayProps={{ radius: "sm", blur: 1 }}
      />

      <div className={classes}>
        <div className="mb-10 flex justify-center">
          <h1 className="text-2xl font-bold">ADI - Super Admin</h1>
        </div>
        <div className="sm:w-[460px] authlayout-content h-max rounded-md p-10 mb-5 shadow-[0_4px_24px_0px_rgba(0,0,0,0.04)] bg-white">
          {children}
        </div>
      </div>
    </div>
  );
};
