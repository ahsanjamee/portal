import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/notifications/styles.css";
import "mantine-react-table/styles.css";
import "./styles/globals.css";

import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import ReactDOM from "react-dom/client";
import { TooltipProvider } from "./components/ui/tooltip.tsx";
import { Routes } from "./routes/Routes.tsx";
import { GlobalStoreProvider } from "./stores/global-store.provider.tsx";
import { TitleProvider } from "./stores/title-context.tsx";
import { theme } from "./theme/index.tsx";
import { queryClient } from "./utils/reactQueryClient.ts";

const bootstrap = async () => {
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <MantineProvider theme={theme}>
          <ModalsProvider>
            <GlobalStoreProvider>
              <TitleProvider>
                <Routes />
                <Notifications
                  position="top-right"
                  autoClose={2000}
                  zIndex={999999}
                />

                {import.meta.env.DEV && (
                  <ReactQueryDevtools position="bottom" />
                )}
              </TitleProvider>
            </GlobalStoreProvider>
          </ModalsProvider>
        </MantineProvider>
        {/* </WithCaptureURLState> */}
      </TooltipProvider>
    </QueryClientProvider>
  );
};

bootstrap();
