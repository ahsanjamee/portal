/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { useWindowEvent } from "@mantine/hooks";
import { withDevTools } from "@poly-state/core";
import { useQuery } from "@tanstack/react-query";
import { FC, PropsWithChildren } from "react";
import { Oval } from "react-loader-spinner";
import {
  GlobalStore,
  GlobalStoreContext,
  GlobalStoreType,
  getGlobalStoreCookie,
} from "./global.store";

export const GlobalStoreProvider: FC<PropsWithChildren> = ({ children }) => {
  const { isLoading, data, error, isFetching, refetch } = useQuery({
    queryKey: ["GLOBAL_STORE_HYDRATE"],
    queryFn: async (): Promise<GlobalStore> => {
      const cookies = getGlobalStoreCookie();

      const storeFactory = (init?: GlobalStoreType): GlobalStore => {
        const store = new GlobalStore(init);

        if (import.meta.env.DEV) {
          withDevTools(store, "GLOBAL_STORE");
        }

        return store;
      };

      if (!cookies) {
        return storeFactory();
      }

      // get more items here such as clients

      const store = storeFactory({
        authenticated: true,
        accessToken: cookies.accessToken,
        refreshToken: cookies.refreshToken,
        email: cookies.email,
        mobileNumber: cookies.mobileNumber,
        profile: cookies.profile,
        language: "en",
        showOverly: false,
        authType: cookies.authType,
      });

      return store;
    },
  });

  useWindowEvent("HYDRATE", () => refetch());

  if (isLoading || !data || isFetching)
    return (
      <div className="h-screen flex items-center justify-center">
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

  if (error) return <p>error...</p>;

  return (
    <GlobalStoreContext.Provider value={data}>
      {" "}
      {children}
    </GlobalStoreContext.Provider>
  );
};
