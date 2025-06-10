import { useGlobalStore } from "@/stores/global.store";
import { useSetTitle } from "@/stores/title-context";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const AdminProfile = () => {
  const { store } = useGlobalStore();
  const navigate = useNavigate();
  useSetTitle("Admin Profile");

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
              <p className="text-gray-600 mt-1">Professional Dashboard</p>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>

          <div className="space-y-6">
            <div className="border-l-4 border-blue-500 pl-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Professional Profile
              </h2>
              <p className="text-gray-600 mt-1">
                Your professional account has been successfully created. You can
                now offer services to farmers and other users.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-medium text-blue-900">
                  Service Management
                </h3>
                <p className="text-blue-700 text-sm mt-1">
                  Manage your professional services and consultation offerings.
                </p>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-medium text-green-900">
                  Client Consultation
                </h3>
                <p className="text-green-700 text-sm mt-1">
                  Connect with farmers and provide expert agricultural advice.
                </p>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-medium text-purple-900">
                  Business Analytics
                </h3>
                <p className="text-purple-700 text-sm mt-1">
                  Track your service performance and client satisfaction.
                </p>
              </div>

              <div className="bg-orange-50 p-4 rounded-lg">
                <h3 className="font-medium text-orange-900">
                  Professional Network
                </h3>
                <p className="text-orange-700 text-sm mt-1">
                  Connect with other professionals and expand your network.
                </p>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-medium text-yellow-800">Profile Status</h3>
              <p className="text-yellow-700 text-sm mt-1">
                Your professional profile is being reviewed. You'll be notified
                once verification is complete.
              </p>
            </div>

            <div className="text-center pt-6 border-t">
              <p className="text-gray-600">
                This is a basic admin profile page. More professional tools will
                be added soon.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
