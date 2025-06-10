import { useGlobalStoreSelector } from "@/stores/global.store";
import { LoadingOverlay } from "@mantine/core";
import { FC, PropsWithChildren } from "react";

export const MobileAuthLayout: FC<PropsWithChildren> = ({ children }) => {
  const showOverlay = useGlobalStoreSelector((s) => s.showOverly);

  return (
    <div className="h-screen w-full bg-gradient-to-br from-green-50 to-blue-50 relative flex flex-col">
      <LoadingOverlay
        visible={showOverlay}
        zIndex={1000}
        overlayProps={{ radius: "sm", blur: 1 }}
      />

      {/* Header */}
      <div className="w-full bg-white/80 backdrop-blur-sm border-b border-gray-200 p-4 flex justify-center flex-shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">A</span>
          </div>
          <h1 className="text-xl font-bold text-gray-900">ADI Portal</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="flex justify-center py-8 px-4">
          <div className="w-full max-w-lg">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="p-6 sm:p-8">{children}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="w-full bg-white/80 backdrop-blur-sm border-t border-gray-200 p-4 flex-shrink-0">
        <div className="text-center">
          <p className="text-sm text-gray-600">ADI</p>
          <p className="text-xs text-gray-500 mt-1">
            Connecting farmers, service providers, and agricultural experts
          </p>
        </div>
      </div>
    </div>
  );
};
