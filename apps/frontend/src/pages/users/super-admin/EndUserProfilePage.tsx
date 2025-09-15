import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSetTitle } from "@/stores/title-context";
import { ArrowLeft } from "@phosphor-icons/react";
import { useNavigate, useLocation } from "react-router-dom";
import type { UserWithProfileResponseDto } from "@portal/portal-api-client";

export const EndUserProfilePage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useSetTitle("End User Profile");

  // Get user data from route state
  const user = location.state?.user as UserWithProfileResponseDto;

  if (!user) {
    return (
      <div className="p-4">
        <Button
          variant="outline"
          onClick={() => navigate("/super-admin/end-users")}
          className="mb-4"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to End Users
        </Button>
        <Alert>
          <AlertDescription>
            No user data provided. Please return to the user list and try again.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Helper function to render farm-specific data based on user type
  const renderFarmData = () => {
    const endUserProfile = user.profile as any; // Cast to access farmData
    if (!endUserProfile?.farmData) return null;

    const farmData = endUserProfile.farmData as any;

    switch (user.profile?.userType) {
      case "DAIRY_FARMER":
        return (
          <>
            <div>
              <Label htmlFor="totalCattlePopulation">
                Total Cattle Population
              </Label>
              <Input
                id="totalCattlePopulation"
                value={farmData.totalCattlePopulation?.toString() || "N/A"}
                disabled
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="totalMilkingCow">Total Milking Cows</Label>
              <Input
                id="totalMilkingCow"
                value={farmData.totalMilkingCow?.toString() || "N/A"}
                disabled
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="totalMilkProductionPerDay">
                Daily Milk Production (Liters)
              </Label>
              <Input
                id="totalMilkProductionPerDay"
                value={farmData.totalMilkProductionPerDay?.toString() || "N/A"}
                disabled
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="totalCalf">Total Calves</Label>
              <Input
                id="totalCalf"
                value={farmData.totalCalf?.toString() || "N/A"}
                disabled
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="totalFemaleCalf">Female Calves</Label>
              <Input
                id="totalFemaleCalf"
                value={farmData.totalFemaleCalf?.toString() || "N/A"}
                disabled
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="totalMaleCalf">Male Calves</Label>
              <Input
                id="totalMaleCalf"
                value={farmData.totalMaleCalf?.toString() || "N/A"}
                disabled
                className="mt-1"
              />
            </div>
          </>
        );

      case "POULTRY_FARMER":
        return (
          <>
            <div>
              <Label htmlFor="farmType">Farm Type</Label>
              <Input
                id="farmType"
                value={farmData.farmType || "N/A"}
                disabled
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="totalBird">Total Birds</Label>
              <Input
                id="totalBird"
                value={farmData.totalBird?.toString() || "N/A"}
                disabled
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="totalEggProductionPerDay">
                Daily Egg Production (Pieces)
              </Label>
              <Input
                id="totalEggProductionPerDay"
                value={farmData.totalEggProductionPerDay?.toString() || "N/A"}
                disabled
                className="mt-1"
              />
            </div>
          </>
        );

      case "FISH_FARMER":
        return (
          <>
            <div>
              <Label htmlFor="totalPondAreaDecimal">
                Total Pond Area (Decimal)
              </Label>
              <Input
                id="totalPondAreaDecimal"
                value={farmData.totalPondAreaDecimal?.toString() || "N/A"}
                disabled
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="fishType">Fish Type</Label>
              <Input
                id="fishType"
                value={farmData.fishType || "N/A"}
                disabled
                className="mt-1"
              />
            </div>
          </>
        );

      case "AGRICULTURE_FARMER":
        return (
          <>
            <div>
              <Label htmlFor="totalAgricultureLandDecimal">
                Total Land (Decimal)
              </Label>
              <Input
                id="totalAgricultureLandDecimal"
                value={
                  farmData.totalAgricultureLandDecimal?.toString() || "N/A"
                }
                disabled
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="typeOfAgriculture">Type of Agriculture</Label>
              <Input
                id="typeOfAgriculture"
                value={farmData.typeOfAgriculture || "N/A"}
                disabled
                className="mt-1"
              />
            </div>
          </>
        );
      case "PET_OWNER":
        return (
          <>
            <div>
              <Label htmlFor="petBird">Pet Bird</Label>
              <Input
                id="petBird"
                value={farmData.petBird || "N/A"}
                disabled
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="petAnimal">Pet Animal</Label>
              <Input
                id="petAnimal"
                value={farmData.petAnimal || "N/A"}
                disabled
                className="mt-1"
              />
            </div>
          </>
        );
      default:
        return (
          <div>
            <Label htmlFor="farmData">Farm Data</Label>
            <Input id="farmData" value="N/A" disabled className="mt-1" />
          </div>
        );
    }
  };

  const getUserTypeDisplay = (userType: string) => {
    return (
      userType
        ?.replace(/_/g, " ")
        .toLowerCase()
        .replace(/\b\w/g, (l) => l.toUpperCase()) || "N/A"
    );
  };

  return (
    <div className="calc(100vh - 100px) p-4">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="outline"
          onClick={() => navigate("/super-admin/end-users")}
          className="mb-4"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to End Users
        </Button>

        <Card className="w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-800 mb-6">
              End User Profile
            </CardTitle>

            {/* Photo Section */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-gray-200 shadow-lg mb-6">
                  <img
                    src="/avatar.svg"
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
                      value={user.profile?.name || "N/A"}
                      disabled
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="userType">Farmer Type</Label>
                    <Input
                      id="userType"
                      value={getUserTypeDisplay(user.profile?.userType || "")}
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
                      value={user.profile?.address || "N/A"}
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

              {/* Farm Information Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
                  Farm Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {renderFarmData()}
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
