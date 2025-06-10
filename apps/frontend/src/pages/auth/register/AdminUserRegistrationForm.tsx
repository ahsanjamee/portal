import { ButtonLoader } from "@/components/Loader/ButtonLoader";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useSetTitle } from "@/stores/title-context";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  AdminUserRegistrationType,
  adminUserRegistrationSchema,
  ADMIN_USER_TYPES,
} from "../login/types";

interface AdminUserRegistrationFormProps {
  mobileNumber: string;
  onSubmit: (data: AdminUserRegistrationType) => void;
  onBack: () => void;
  isLoading?: boolean;
}

export const AdminUserRegistrationForm = ({
  mobileNumber,
  onSubmit,
  onBack,
  isLoading = false,
}: AdminUserRegistrationFormProps) => {
  useSetTitle("Register - Admin User Details");

  /* ======= define form ====== */
  const form = useForm<AdminUserRegistrationType>({
    resolver: zodResolver(adminUserRegistrationSchema()),
    defaultValues: {
      authType: "ADMIN" as const,
      mobileNumber: mobileNumber,
      userType: undefined,
      name: "",
      address: "",
      photo: "",
      lastDegree: "",
      areaOfExpertise: "",
      serviceExperience: 0,
      jobPosition: "",
    },
  });

  const watchUserType = form.watch("userType");

  /* ====== define submit handler ======== */
  const handleSubmit = async (values: AdminUserRegistrationType) => {
    onSubmit(values);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">
          Complete Your Professional Profile
        </h2>
        <p className="text-gray-600 mt-2">
          Provide your professional details to offer services
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="userType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Professional Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger
                      className={
                        form.formState.errors.userType?.message
                          ? "border-red-500"
                          : ""
                      }
                    >
                      <SelectValue placeholder="Select your professional type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {ADMIN_USER_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type
                          .split("_")
                          .map(
                            (word) =>
                              word.charAt(0) + word.slice(1).toLowerCase()
                          )
                          .join(" ")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm leading-5">Full Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your full name"
                    {...field}
                    hasError={!!form.formState.errors.name?.message}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm leading-5">
                  Business Address
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter your business address"
                    {...field}
                    className={
                      form.formState.errors.address?.message
                        ? "border-red-500"
                        : ""
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lastDegree"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm leading-5">
                  Highest Degree
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., Bachelor of Agriculture, PhD in Soil Science"
                    {...field}
                    hasError={!!form.formState.errors.lastDegree?.message}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="areaOfExpertise"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm leading-5">
                  Area of Expertise
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., Crop Protection, Soil Management, Agricultural Chemistry"
                    {...field}
                    hasError={!!form.formState.errors.areaOfExpertise?.message}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="serviceExperience"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm leading-5">
                  Years of Experience
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="e.g., 5"
                    {...field}
                    hasError={
                      !!form.formState.errors.serviceExperience?.message
                    }
                    onChange={(e) =>
                      field.onChange(parseInt(e.target.value) || 0)
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {watchUserType === "SERVICE_PROVIDER" && (
            <FormField
              control={form.control}
              name="jobPosition"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm leading-5">
                    Current Job Position
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Senior Agricultural Advisor, Farm Consultant"
                      {...field}
                      hasError={!!form.formState.errors.jobPosition?.message}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <div className="flex flex-col space-y-3 pt-4">
            <Button
              type="submit"
              size="lg"
              variant="default"
              disabled={isLoading}
              className="w-full px-6 py-3 rounded-sm text-[16px] leading-6 h-auto"
            >
              {isLoading ? <ButtonLoader /> : "Create Professional Account"}
            </Button>

            <Button
              type="button"
              variant="ghost"
              onClick={onBack}
              className="text-sm"
            >
              ← Back
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
