import { useSetTitle } from "@/stores/title-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "@phosphor-icons/react";
import { useNavigate, useLocation } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { UserWithProfileResponseDto } from "@portal/portal-api-client";

export const AdminUserProfilePage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useSetTitle("Admin User Profile");

  // Get user data from route state
  const user = location.state?.user as UserWithProfileResponseDto;

  if (!user) {
    return (
      <div className="p-4">
        <Button
          variant="outline"
          onClick={() => navigate("/super-admin/admins")}
          className="mb-4"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to Admin Users
        </Button>
        <Alert>
          <AlertDescription>
            No user data provided. Please return to the user list and try again.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const getUserTypeDisplay = (userType: string) => {
    return (
      userType
        ?.replace(/_/g, " ")
        .toLowerCase()
        .replace(/\b\w/g, (l) => l.toUpperCase()) || "N/A"
    );
  };

  const adminProfile = user.profile as any;

  return (
    <div className="calc(100vh - 100px) p-4">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="outline"
          onClick={() => navigate("/super-admin/admins")}
          className="mb-4"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to Admin Users
        </Button>

        <Card className="w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-800 mb-6">
              Admin User Profile
            </CardTitle>

            {/* Photo Section */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-gray-200 shadow-lg mb-6">
                  <img
                    src={adminProfile?.photo || "/avatar.svg"}
                    alt="User Avatar"
                    className="w-full h-full object-cover bg-gray-100"
                  />
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <form className="space-y-6">
              {/* Basic Information Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={adminProfile?.name || "N/A"}
                      disabled
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="userType">User Type</Label>
                    <Input
                      id="userType"
                      value={getUserTypeDisplay(adminProfile?.userType || "")}
                      disabled
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="mobileNumber">Mobile Number</Label>
                    <Input
                      id="mobileNumber"
                      value={user.mobileNumber || "N/A"}
                      disabled
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      value={
                        user.email === user.mobileNumber
                          ? "N/A"
                          : user.email || "N/A"
                      }
                      disabled
                      className="mt-1"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={adminProfile?.address || "N/A"}
                      disabled
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="isVerified">Verification Status</Label>
                    <Input
                      id="isVerified"
                      value={user.isVerified ? "Verified" : "Not Verified"}
                      disabled
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="isActive">Account Status</Label>
                    <Input
                      id="isActive"
                      value={user.isActive ? "Active" : "Inactive"}
                      disabled
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              {/* Professional Information Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
                  Professional Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="lastDegree">Education</Label>
                    <Input
                      id="lastDegree"
                      value={adminProfile?.lastDegree || "N/A"}
                      disabled
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="areaOfExpertise">Area of Expertise</Label>
                    <Input
                      id="areaOfExpertise"
                      value={adminProfile?.areaOfExpertise || "N/A"}
                      disabled
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="serviceExperience">
                      Service Experience
                    </Label>
                    <Input
                      id="serviceExperience"
                      value={
                        adminProfile?.serviceExperience
                          ? `${adminProfile.serviceExperience} years`
                          : "N/A"
                      }
                      disabled
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="jobPosition">Job Position</Label>
                    <Input
                      id="jobPosition"
                      value={adminProfile?.jobPosition || "N/A"}
                      disabled
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              {/* Account Information Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
                  Account Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="createdAt">Account Created</Label>
                    <Input
                      id="createdAt"
                      value={new Date(user.createdAt).toLocaleDateString()}
                      disabled
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="updatedAt">Last Updated</Label>
                    <Input
                      id="updatedAt"
                      value={new Date(user.updatedAt).toLocaleDateString()}
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
