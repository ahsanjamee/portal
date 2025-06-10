import {
  AdminUserProfile,
  useGlobalStoreSelector,
} from "@/stores/global.store";
import { useSetTitle } from "@/stores/title-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const AdminProfile = () => {
  const { profile: adminProfile } = useGlobalStoreSelector((s) => s) as {
    profile: AdminUserProfile;
  };
  useSetTitle("Admin Profile");

  return (
    <div className="calc(100vh - 100px) p-4">
      <div className="max-w-4xl mx-auto">
        <Card className="w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-800 mb-6">
              Admin Profile
            </CardTitle>

            {/* Photo Section */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-gray-200 shadow-lg mb-6">
                  {adminProfile?.photo ? (
                    <img
                      src={adminProfile?.photo}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src="/avatar.svg"
                      alt="Default Avatar"
                      className="w-full h-full object-cover bg-gray-100"
                    />
                  )}
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <form className="space-y-6">
              {/* Two Column Layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={adminProfile.name}
                      disabled
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="userType">User Type</Label>
                    <Input
                      id="userType"
                      value={adminProfile.userType}
                      disabled
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={adminProfile.address}
                      disabled
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="lastDegree">Last Degree</Label>
                    <Input
                      id="lastDegree"
                      value={adminProfile.lastDegree}
                      disabled
                      className="mt-1"
                    />
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="jobPosition">Job Position</Label>
                    <Input
                      id="jobPosition"
                      value={adminProfile.jobPosition || "N/A"}
                      disabled
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="areaOfExpertise">Area of Expertise</Label>
                    <Input
                      id="areaOfExpertise"
                      value={adminProfile.areaOfExpertise}
                      disabled
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="serviceExperience">
                      Service Experience (Years)
                    </Label>
                    <Input
                      id="serviceExperience"
                      value={adminProfile.serviceExperience.toString()}
                      disabled
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
