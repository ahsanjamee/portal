import {
  EndUserProfile,
  useGlobalStore,
  useGlobalStoreSelector,
} from "@/stores/global.store";
import { useSetTitle } from "@/stores/title-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { profileService } from "../service/profile.service";
import { notifications } from "@mantine/notifications";
import { renderGenericError } from "@/utils/utils";
import type { UpdateEndUserProfileDto } from "@portal/portal-api-client";
import { z } from "zod";
import { cn } from "@/lib/utils";
import UploadImage from "@/components/ui/UploadImage";

// Base schema for common fields
const baseProfileSchema = z.object({
  id: z.string().nullable(),
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters"),
  email: z
    .string()
    .email("Please enter a valid email address")
    .min(1, "Email is required"),
  address: z
    .string()
    .min(5, "Address must be at least 5 characters")
    .max(200, "Address must be less than 200 characters"),
  userType: z.string().min(1, "User type is required"),
  photo: z.string().optional(),
});

// Farm data schemas based on user type
const dairyFarmSchema = z.object({
  totalCattlePopulation: z
    .number()
    .min(1, "Total cattle population must be at least 1"),
  totalMilkingCow: z.number().min(0, "Total milking cows cannot be negative"),
  totalMilkProductionPerDay: z
    .number()
    .min(0, "Daily milk production cannot be negative"),
  totalCalf: z.number().min(0, "Total calves cannot be negative"),
  totalFemaleCalf: z.number().min(0, "Female calves cannot be negative"),
  totalMaleCalf: z.number().min(0, "Male calves cannot be negative"),
});

const poultryFarmSchema = z.object({
  farmType: z.string().min(1, "Farm type is required"),
  totalBird: z.number().min(1, "Total birds must be at least 1"),
  totalEggProductionPerDay: z
    .number()
    .min(0, "Daily egg production cannot be negative"),
});

const fishFarmSchema = z.object({
  totalPondAreaDecimal: z
    .number()
    .min(0.01, "Pond area must be at least 0.01 decimal"),
  fishType: z.string().min(1, "Fish type is required"),
});

const agricultureFarmSchema = z.object({
  totalAgricultureLandDecimal: z
    .number()
    .min(0.01, "Land area must be at least 0.01 decimal"),
  typeOfAgriculture: z.string().min(1, "Type of agriculture is required"),
});

// Function to get the appropriate schema based on user type
const getValidationSchema = (userType: string) => {
  const baseSchema = baseProfileSchema;

  switch (userType) {
    case "DAIRY_FARMER":
      return baseSchema.extend({
        farmData: dairyFarmSchema,
      });
    case "POULTRY_FARMER":
      return baseSchema.extend({
        farmData: poultryFarmSchema,
      });
    case "FISH_FARMER":
      return baseSchema.extend({
        farmData: fishFarmSchema,
      });
    case "AGRICULTURE_FARMER":
      return baseSchema.extend({
        farmData: agricultureFarmSchema,
      });
    default:
      return baseSchema.extend({
        farmData: z.object({}).optional(),
      });
  }
};

export const UserProfile = () => {
  const { profile: userProfile } = useGlobalStoreSelector((s) => s) as {
    profile: EndUserProfile;
  };

  const { email, mobileNumber } = useGlobalStoreSelector((s) => s);

  const { store } = useGlobalStore();

  useSetTitle("Profile");

  const [isEditing, setIsEditing] = useState(false);
  const [file, setFile] = useState<string>(() => userProfile?.photo || "");
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const [formData, setFormData] = useState<
    UpdateEndUserProfileDto & { id: string; photo?: string }
  >({
    id: userProfile?.userId || "",
    name: userProfile?.name || "",
    email: email === mobileNumber ? "" : email || "",
    address: userProfile?.address || "",
    userType: userProfile?.userType,
    farmData: userProfile?.farmData || {},
    photo: file,
  });

  const { mutate: updateProfile, isPending: isUpdating } =
    profileService.useUpdateEndUserProfile({
      onSuccess: (data) => {
        notifications.show({
          title: "Success",
          message: "Profile updated successfully",
          color: "green",
        });
        setIsEditing(false);
        store.onUpdateProfile(data);
      },
      onError: (error) => {
        renderGenericError(error);
      },
    });

  const handleSave = () => {
    try {
      // Clear previous errors
      setValidationErrors({});

      // Get the appropriate schema based on user type
      const schema = getValidationSchema(userProfile?.userType || "");

      // Validate the form data
      const validatedData = schema.parse(formData);

      // If validation passes, update the profile
      updateProfile(validatedData as UpdateEndUserProfileDto & { id: string });
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Handle validation errors
        const errors: Record<string, string> = {};
        error.errors.forEach((err) => {
          const path = err.path.join(".");
          errors[path] = err.message;
        });
        setValidationErrors(errors);

        notifications.show({
          title: "Validation Error",
          message: "Please fix the form errors before submitting",
          color: "red",
        });
      } else {
        renderGenericError(error);
      }
    }
  };

  const handleCancel = () => {
    setFormData({
      id: userProfile?.userId || "",
      name: userProfile?.name || "",
      address: userProfile?.address || "",
      userType: userProfile?.userType,
      farmData: userProfile?.farmData || {},
      email: email === mobileNumber ? "" : email || "",
      photo: file,
    });
    setValidationErrors({});
    setIsEditing(false);
  };

  // Helper function to update farm data
  const updateFarmData = (field: string, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      farmData: {
        ...prev.farmData,
        [field]: value,
      },
    }));

    // Clear validation error for this field when user starts typing
    if (validationErrors[`farmData.${field}`]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[`farmData.${field}`];
        return newErrors;
      });
    }
  };

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      photo: file,
    }));
  }, [file]);

  // Helper function to get field error
  const getFieldError = (fieldPath: string) => {
    return validationErrors[fieldPath];
  };

  // Helper function to clear field error
  const clearFieldError = (fieldPath: string) => {
    if (validationErrors[fieldPath]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldPath];
        return newErrors;
      });
    }
  };

  // Helper function to render farm-specific data based on user type
  const renderFarmData = () => {
    if (!userProfile?.farmData) return null;

    const farmData = isEditing
      ? (formData.farmData as any)
      : (userProfile.farmData as any);

    switch (userProfile.userType) {
      case "DAIRY_FARMER":
        return (
          <>
            <div>
              <Label htmlFor="totalCattlePopulation">
                Total Cattle Population *
              </Label>
              <Input
                id="totalCattlePopulation"
                type="number"
                min="1"
                value={
                  isEditing
                    ? farmData.totalCattlePopulation || ""
                    : farmData.totalCattlePopulation?.toString() || "N/A"
                }
                disabled={!isEditing}
                onChange={(e) =>
                  isEditing &&
                  updateFarmData(
                    "totalCattlePopulation",
                    parseInt(e.target.value) || 0
                  )
                }
                className={cn(
                  "mt-1",
                  getFieldError("farmData.totalCattlePopulation") &&
                    "border-red-500"
                )}
              />
              {getFieldError("farmData.totalCattlePopulation") && (
                <p className="text-sm text-red-500 mt-1">
                  {getFieldError("farmData.totalCattlePopulation")}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="totalMilkingCow">Total Milking Cows *</Label>
              <Input
                id="totalMilkingCow"
                type="number"
                min="0"
                value={
                  isEditing
                    ? farmData.totalMilkingCow || ""
                    : farmData.totalMilkingCow?.toString() || "N/A"
                }
                disabled={!isEditing}
                onChange={(e) =>
                  isEditing &&
                  updateFarmData(
                    "totalMilkingCow",
                    parseInt(e.target.value) || 0
                  )
                }
                className={cn(
                  "mt-1",
                  getFieldError("farmData.totalMilkingCow") && "border-red-500"
                )}
              />
              {getFieldError("farmData.totalMilkingCow") && (
                <p className="text-sm text-red-500 mt-1">
                  {getFieldError("farmData.totalMilkingCow")}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="totalMilkProductionPerDay">
                Daily Milk Production (Liters) *
              </Label>
              <Input
                id="totalMilkProductionPerDay"
                type="number"
                min="0"
                step="0.1"
                value={
                  isEditing
                    ? farmData.totalMilkProductionPerDay || ""
                    : farmData.totalMilkProductionPerDay?.toString() || "N/A"
                }
                disabled={!isEditing}
                onChange={(e) =>
                  isEditing &&
                  updateFarmData(
                    "totalMilkProductionPerDay",
                    parseFloat(e.target.value) || 0
                  )
                }
                className={cn(
                  "mt-1",
                  getFieldError("farmData.totalMilkProductionPerDay") &&
                    "border-red-500"
                )}
              />
              {getFieldError("farmData.totalMilkProductionPerDay") && (
                <p className="text-sm text-red-500 mt-1">
                  {getFieldError("farmData.totalMilkProductionPerDay")}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="totalCalf">Total Calves *</Label>
              <Input
                id="totalCalf"
                type="number"
                min="0"
                value={
                  isEditing
                    ? farmData.totalCalf || ""
                    : farmData.totalCalf?.toString() || "N/A"
                }
                disabled={!isEditing}
                onChange={(e) =>
                  isEditing &&
                  updateFarmData("totalCalf", parseInt(e.target.value) || 0)
                }
                className={cn(
                  "mt-1",
                  getFieldError("farmData.totalCalf") && "border-red-500"
                )}
              />
              {getFieldError("farmData.totalCalf") && (
                <p className="text-sm text-red-500 mt-1">
                  {getFieldError("farmData.totalCalf")}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="totalFemaleCalf">Female Calves *</Label>
              <Input
                id="totalFemaleCalf"
                type="number"
                min="0"
                value={
                  isEditing
                    ? farmData.totalFemaleCalf || ""
                    : farmData.totalFemaleCalf?.toString() || "N/A"
                }
                disabled={!isEditing}
                onChange={(e) =>
                  isEditing &&
                  updateFarmData(
                    "totalFemaleCalf",
                    parseInt(e.target.value) || 0
                  )
                }
                className={cn(
                  "mt-1",
                  getFieldError("farmData.totalFemaleCalf") && "border-red-500"
                )}
              />
              {getFieldError("farmData.totalFemaleCalf") && (
                <p className="text-sm text-red-500 mt-1">
                  {getFieldError("farmData.totalFemaleCalf")}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="totalMaleCalf">Male Calves *</Label>
              <Input
                id="totalMaleCalf"
                type="number"
                min="0"
                value={
                  isEditing
                    ? farmData.totalMaleCalf || ""
                    : farmData.totalMaleCalf?.toString() || "N/A"
                }
                disabled={!isEditing}
                onChange={(e) =>
                  isEditing &&
                  updateFarmData("totalMaleCalf", parseInt(e.target.value) || 0)
                }
                className={cn(
                  "mt-1",
                  getFieldError("farmData.totalMaleCalf") && "border-red-500"
                )}
              />
              {getFieldError("farmData.totalMaleCalf") && (
                <p className="text-sm text-red-500 mt-1">
                  {getFieldError("farmData.totalMaleCalf")}
                </p>
              )}
            </div>
          </>
        );

      case "POULTRY_FARMER":
        return (
          <>
            <div>
              <Label htmlFor="farmType">Farm Type *</Label>
              <Input
                id="farmType"
                value={
                  isEditing
                    ? farmData.farmType || ""
                    : farmData.farmType || "N/A"
                }
                disabled={!isEditing}
                onChange={(e) =>
                  isEditing && updateFarmData("farmType", e.target.value)
                }
                className={cn(
                  "mt-1",
                  getFieldError("farmData.farmType") && "border-red-500"
                )}
              />
              {getFieldError("farmData.farmType") && (
                <p className="text-sm text-red-500 mt-1">
                  {getFieldError("farmData.farmType")}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="totalBird">Total Birds *</Label>
              <Input
                id="totalBird"
                type="number"
                min="1"
                value={
                  isEditing
                    ? farmData.totalBird || ""
                    : farmData.totalBird?.toString() || "N/A"
                }
                disabled={!isEditing}
                onChange={(e) =>
                  isEditing &&
                  updateFarmData("totalBird", parseInt(e.target.value) || 0)
                }
                className={cn(
                  "mt-1",
                  getFieldError("farmData.totalBird") && "border-red-500"
                )}
              />
              {getFieldError("farmData.totalBird") && (
                <p className="text-sm text-red-500 mt-1">
                  {getFieldError("farmData.totalBird")}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="totalEggProductionPerDay">
                Daily Egg Production (Pieces) *
              </Label>
              <Input
                id="totalEggProductionPerDay"
                type="number"
                min="0"
                value={
                  isEditing
                    ? farmData.totalEggProductionPerDay || ""
                    : farmData.totalEggProductionPerDay?.toString() || "N/A"
                }
                disabled={!isEditing}
                onChange={(e) =>
                  isEditing &&
                  updateFarmData(
                    "totalEggProductionPerDay",
                    parseInt(e.target.value) || 0
                  )
                }
                className={cn(
                  "mt-1",
                  getFieldError("farmData.totalEggProductionPerDay") &&
                    "border-red-500"
                )}
              />
              {getFieldError("farmData.totalEggProductionPerDay") && (
                <p className="text-sm text-red-500 mt-1">
                  {getFieldError("farmData.totalEggProductionPerDay")}
                </p>
              )}
            </div>
          </>
        );

      case "FISH_FARMER":
        return (
          <>
            <div>
              <Label htmlFor="totalPondAreaDecimal">
                Total Pond Area (Decimal) *
              </Label>
              <Input
                id="totalPondAreaDecimal"
                type="number"
                min="0.01"
                step="0.01"
                value={
                  isEditing
                    ? farmData.totalPondAreaDecimal || ""
                    : farmData.totalPondAreaDecimal?.toString() || "N/A"
                }
                disabled={!isEditing}
                onChange={(e) =>
                  isEditing &&
                  updateFarmData(
                    "totalPondAreaDecimal",
                    parseFloat(e.target.value) || 0
                  )
                }
                className={cn(
                  "mt-1",
                  getFieldError("farmData.totalPondAreaDecimal") &&
                    "border-red-500"
                )}
              />
              {getFieldError("farmData.totalPondAreaDecimal") && (
                <p className="text-sm text-red-500 mt-1">
                  {getFieldError("farmData.totalPondAreaDecimal")}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="fishType">Fish Type *</Label>
              <Input
                id="fishType"
                value={
                  isEditing
                    ? farmData.fishType || ""
                    : farmData.fishType || "N/A"
                }
                disabled={!isEditing}
                onChange={(e) =>
                  isEditing && updateFarmData("fishType", e.target.value)
                }
                className={cn(
                  "mt-1",
                  getFieldError("farmData.fishType") && "border-red-500"
                )}
              />
              {getFieldError("farmData.fishType") && (
                <p className="text-sm text-red-500 mt-1">
                  {getFieldError("farmData.fishType")}
                </p>
              )}
            </div>
          </>
        );

      case "AGRICULTURE_FARMER":
        return (
          <>
            <div>
              <Label htmlFor="totalAgricultureLandDecimal">
                Total Land (Decimal) *
              </Label>
              <Input
                id="totalAgricultureLandDecimal"
                type="number"
                min="0.01"
                step="0.01"
                value={
                  isEditing
                    ? farmData.totalAgricultureLandDecimal || ""
                    : farmData.totalAgricultureLandDecimal?.toString() || "N/A"
                }
                disabled={!isEditing}
                onChange={(e) =>
                  isEditing &&
                  updateFarmData(
                    "totalAgricultureLandDecimal",
                    parseFloat(e.target.value) || 0
                  )
                }
                className={cn(
                  "mt-1",
                  getFieldError("farmData.totalAgricultureLandDecimal") &&
                    "border-red-500"
                )}
              />
              {getFieldError("farmData.totalAgricultureLandDecimal") && (
                <p className="text-sm text-red-500 mt-1">
                  {getFieldError("farmData.totalAgricultureLandDecimal")}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="typeOfAgriculture">Type of Agriculture *</Label>
              <Input
                id="typeOfAgriculture"
                value={
                  isEditing
                    ? farmData.typeOfAgriculture || ""
                    : farmData.typeOfAgriculture || "N/A"
                }
                disabled={!isEditing}
                onChange={(e) =>
                  isEditing &&
                  updateFarmData("typeOfAgriculture", e.target.value)
                }
                className={cn(
                  "mt-1",
                  getFieldError("farmData.typeOfAgriculture") &&
                    "border-red-500"
                )}
              />
              {getFieldError("farmData.typeOfAgriculture") && (
                <p className="text-sm text-red-500 mt-1">
                  {getFieldError("farmData.typeOfAgriculture")}
                </p>
              )}
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

  return (
    <div className="calc(100vh - 100px) p-4">
      <div className="max-w-4xl mx-auto">
        <Card className="w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-800 mb-6">
              Farmer Profile
            </CardTitle>

            {/* Action Buttons */}
            <div className="flex justify-center gap-4 mb-4">
              {!isEditing ? (
                <Button onClick={() => setIsEditing(true)} variant="outline">
                  Edit Profile
                </Button>
              ) : (
                <>
                  <Button
                    onClick={handleSave}
                    disabled={isUpdating}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {isUpdating ? "Saving..." : "Save Changes"}
                  </Button>
                  <Button
                    onClick={handleCancel}
                    variant="outline"
                    disabled={isUpdating}
                  >
                    Cancel
                  </Button>
                </>
              )}
            </div>

            {/* Photo Section */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className=" mb-6">
                  {isEditing ? (
                    <UploadImage file={file} setFile={setFile} />
                  ) : (
                    <img
                      src={file || "/avatar.svg"}
                      alt="Default Avatar"
                      className="w-24 h-24 rounded-full object-cover bg-gray-100"
                    />
                  )}
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
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={
                        isEditing ? formData.name : userProfile?.name || "N/A"
                      }
                      disabled={!isEditing}
                      onChange={(e) => {
                        if (isEditing) {
                          setFormData((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }));
                          clearFieldError("name");
                        }
                      }}
                      className={cn(
                        "mt-1",
                        getFieldError("name") && "border-red-500"
                      )}
                    />
                    {getFieldError("name") && (
                      <p className="text-sm text-red-500 mt-1">
                        {getFieldError("name")}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="userType">Farmer Type</Label>
                    <Input
                      id="userType"
                      value={userProfile?.userType?.replace("_", " ") || "N/A"}
                      disabled
                      className="mt-1"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="address">Address *</Label>
                    <Input
                      id="address"
                      value={
                        isEditing
                          ? formData.address
                          : userProfile?.address || "N/A"
                      }
                      disabled={!isEditing}
                      onChange={(e) => {
                        if (isEditing) {
                          setFormData((prev) => ({
                            ...prev,
                            address: e.target.value,
                          }));
                          clearFieldError("address");
                        }
                      }}
                      className={cn(
                        "mt-1",
                        getFieldError("address") && "border-red-500"
                      )}
                    />
                    {getFieldError("address") && (
                      <p className="text-sm text-red-500 mt-1">
                        {getFieldError("address")}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={
                        isEditing
                          ? formData.email
                          : email === mobileNumber
                            ? ""
                            : email
                      }
                      disabled={!isEditing}
                      onChange={(e) => {
                        if (isEditing) {
                          setFormData((prev) => ({
                            ...prev,
                            email: e.target.value,
                          }));
                          clearFieldError("email");
                        }
                      }}
                      className={cn(
                        "mt-1",
                        getFieldError("email") && "border-red-500"
                      )}
                    />
                    {getFieldError("email") && (
                      <p className="text-sm text-red-500 mt-1">
                        {getFieldError("email")}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="mobileNumber">Mobile Number</Label>
                    <Input
                      id="mobileNumber"
                      value={mobileNumber}
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
