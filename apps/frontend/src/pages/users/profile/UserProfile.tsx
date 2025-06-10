import { useGlobalStore } from "@/stores/global.store";
import { useSetTitle } from "@/stores/title-context";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const UserProfile = () => {
  const { store } = useGlobalStore();
  const navigate = useNavigate();
  useSetTitle("Profile");

  const handleLogout = () => {
    store.onLogout();
    navigate("/auth/mobile-login");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome to ADI Portal
              </h1>
              <p className="text-gray-600 mt-1">End User Dashboard</p>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>

          <div className="space-y-6">
            <div className="border-l-4 border-green-500 pl-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Profile Information
              </h2>
              <p className="text-gray-600 mt-1">
                Your profile has been successfully created. You can now access
                agricultural services and information.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-medium text-green-900">Farm Management</h3>
                <p className="text-green-700 text-sm mt-1">
                  Manage your farm data, crop information, and farming
                  activities.
                </p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-medium text-blue-900">Market Access</h3>
                <p className="text-blue-700 text-sm mt-1">
                  Connect with traders and access market information for your
                  crops.
                </p>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-medium text-purple-900">
                  Expert Consultation
                </h3>
                <p className="text-purple-700 text-sm mt-1">
                  Get advice from agricultural experts and service providers.
                </p>
              </div>

              <div className="bg-orange-50 p-4 rounded-lg">
                <h3 className="font-medium text-orange-900">Resources</h3>
                <p className="text-orange-700 text-sm mt-1">
                  Access agricultural resources, guides, and best practices.
                </p>
              </div>
            </div>

            <div className="text-center pt-6 border-t">
              <p className="text-gray-600">
                This is a basic profile page. More features will be added soon.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
