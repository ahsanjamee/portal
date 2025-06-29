import {
  AdminUserProfile,
  useGlobalStore,
  useGlobalStoreSelector,
} from "@/stores/global.store";
import { useSetTitle } from "@/stores/title-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { profileService } from "../service/profile.service";
import { notifications } from "@mantine/notifications";
import { renderGenericError } from "@/utils/utils";
import type { UpdateAdminUserProfileDto } from "@portal/portal-api-client";
import { z } from "zod";
import { cn } from "@/lib/utils";
import UploadImage from "@/components/ui/UploadImage";

// Validation schema for admin profile
const adminProfileSchema = z.object({
  id: z.string().min(1, "ID is required"),
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
  lastDegree: z
    .string()
    .min(2, "Last degree must be at least 2 characters")
    .max(100, "Last degree must be less than 100 characters"),
  areaOfExpertise: z
    .string()
    .min(2, "Area of expertise must be at least 2 characters")
    .max(100, "Area of expertise must be less than 100 characters"),
  serviceExperience: z
    .number()
    .min(0, "Service experience cannot be negative")
    .max(50, "Service experience must be less than 50 years"),
  jobPosition: z
    .string()
    .min(2, "Job position must be at least 2 characters")
    .max(100, "Job position must be less than 100 characters"),
  photo: z.string().optional(),
});

export const AdminProfile = () => {
  const { profile: adminProfile } = useGlobalStoreSelector((s) => s) as {
    profile: AdminUserProfile;
  };

  const { email, mobileNumber } = useGlobalStoreSelector((s) => s);

  const { store } = useGlobalStore();

  useSetTitle("Admin Profile");

  const [isEditing, setIsEditing] = useState(false);
  const [file, setFile] = useState<string>(() => adminProfile?.photo || "");
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const [formData, setFormData] = useState<
    UpdateAdminUserProfileDto & { id: string; photo?: string }
  >({
    id: adminProfile?.userId || "",
    name: adminProfile?.name || "",
    email: email === mobileNumber ? "" : email || "",
    address: adminProfile?.address || "",
    userType: adminProfile?.userType,
    lastDegree: adminProfile?.lastDegree || "",
    areaOfExpertise: adminProfile?.areaOfExpertise || "",
    serviceExperience: adminProfile?.serviceExperience || 0,
    jobPosition: adminProfile?.jobPosition || "",
    photo: file,
  });

  const { mutate: updateProfile, isPending: isUpdating } =
    profileService.useUpdateAdminProfile({
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

      // Validate the form data
      const validatedData = adminProfileSchema.parse(formData);

      // If validation passes, update the profile
      updateProfile(
        validatedData as UpdateAdminUserProfileDto & { id: string }
      );
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
      id: adminProfile?.userId || "",
      name: adminProfile?.name || "",
      email: email === mobileNumber ? "" : email || "",
      address: adminProfile?.address || "",
      userType: adminProfile?.userType,
      lastDegree: adminProfile?.lastDegree || "",
      areaOfExpertise: adminProfile?.areaOfExpertise || "",
      serviceExperience: adminProfile?.serviceExperience || 0,
      jobPosition: adminProfile?.jobPosition || "",
      photo: file,
    });
    setValidationErrors({});
    setIsEditing(false);
  };

  // Update form data when profile changes
  useEffect(() => {
    if (adminProfile) {
      setFormData({
        id: adminProfile.userId || "",
        name: adminProfile.name || "",
        email: email === mobileNumber ? "" : email || "",
        address: adminProfile.address || "",
        userType: adminProfile.userType,
        lastDegree: adminProfile.lastDegree || "",
        areaOfExpertise: adminProfile.areaOfExpertise || "",
        serviceExperience: adminProfile.serviceExperience || 0,
        jobPosition: adminProfile.jobPosition || "",
        photo: file,
      });
    }
  }, [adminProfile, email]);

  // Update form data when file changes
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

  return (
    <div className="calc(100vh - 100px) p-4">
      <div className="max-w-4xl mx-auto">
        <Card className="w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-800 mb-6">
              Admin Profile
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
                <div className="mb-6">
                  {isEditing ? (
                    <UploadImage file={file} setFile={setFile} />
                  ) : (
                    <img
                      src={file || "/avatar.svg"}
                      alt="Profile"
                      className="w-24 h-24 rounded-full object-cover bg-gray-100 border-4 border-gray-200 shadow-lg"
                    />
                  )}
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <form className="space-y-6">
              {/* Personal Information Section */}
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
                        isEditing ? formData.name : adminProfile?.name || "N/A"
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
                    <Label htmlFor="userType">User Type</Label>
                    <Input
                      id="userType"
                      value={adminProfile?.userType || "N/A"}
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
                          : adminProfile?.address || "N/A"
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
                    <Label htmlFor="email">Email *</Label>
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

              {/* Professional Information Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
                  Professional Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="jobPosition">Job Position *</Label>
                    <Input
                      id="jobPosition"
                      value={
                        isEditing
                          ? formData.jobPosition
                          : adminProfile?.jobPosition || "N/A"
                      }
                      disabled={!isEditing}
                      onChange={(e) => {
                        if (isEditing) {
                          setFormData((prev) => ({
                            ...prev,
                            jobPosition: e.target.value,
                          }));
                          clearFieldError("jobPosition");
                        }
                      }}
                      className={cn(
                        "mt-1",
                        getFieldError("jobPosition") && "border-red-500"
                      )}
                    />
                    {getFieldError("jobPosition") && (
                      <p className="text-sm text-red-500 mt-1">
                        {getFieldError("jobPosition")}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="lastDegree">Last Degree *</Label>
                    <Input
                      id="lastDegree"
                      value={
                        isEditing
                          ? formData.lastDegree
                          : adminProfile?.lastDegree || "N/A"
                      }
                      disabled={!isEditing}
                      onChange={(e) => {
                        if (isEditing) {
                          setFormData((prev) => ({
                            ...prev,
                            lastDegree: e.target.value,
                          }));
                          clearFieldError("lastDegree");
                        }
                      }}
                      className={cn(
                        "mt-1",
                        getFieldError("lastDegree") && "border-red-500"
                      )}
                    />
                    {getFieldError("lastDegree") && (
                      <p className="text-sm text-red-500 mt-1">
                        {getFieldError("lastDegree")}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="areaOfExpertise">Area of Expertise *</Label>
                    <Input
                      id="areaOfExpertise"
                      value={
                        isEditing
                          ? formData.areaOfExpertise
                          : adminProfile?.areaOfExpertise || "N/A"
                      }
                      disabled={!isEditing}
                      onChange={(e) => {
                        if (isEditing) {
                          setFormData((prev) => ({
                            ...prev,
                            areaOfExpertise: e.target.value,
                          }));
                          clearFieldError("areaOfExpertise");
                        }
                      }}
                      className={cn(
                        "mt-1",
                        getFieldError("areaOfExpertise") && "border-red-500"
                      )}
                    />
                    {getFieldError("areaOfExpertise") && (
                      <p className="text-sm text-red-500 mt-1">
                        {getFieldError("areaOfExpertise")}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="serviceExperience">
                      Service Experience (Years) *
                    </Label>
                    <Input
                      id="serviceExperience"
                      type="number"
                      min="0"
                      max="50"
                      value={
                        isEditing
                          ? formData.serviceExperience?.toString()
                          : adminProfile?.serviceExperience?.toString() || "N/A"
                      }
                      disabled={!isEditing}
                      onChange={(e) => {
                        if (isEditing) {
                          setFormData((prev) => ({
                            ...prev,
                            serviceExperience: parseInt(e.target.value) || 0,
                          }));
                          clearFieldError("serviceExperience");
                        }
                      }}
                      className={cn(
                        "mt-1",
                        getFieldError("serviceExperience") && "border-red-500"
                      )}
                    />
                    {getFieldError("serviceExperience") && (
                      <p className="text-sm text-red-500 mt-1">
                        {getFieldError("serviceExperience")}
                      </p>
                    )}
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
