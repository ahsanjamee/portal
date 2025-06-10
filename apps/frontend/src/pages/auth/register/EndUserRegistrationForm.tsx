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
  EndUserRegistrationType,
  endUserRegistrationSchema,
  END_USER_TYPES,
} from "../login/types";

interface EndUserRegistrationFormProps {
  mobileNumber: string;
  onSubmit: (data: EndUserRegistrationType) => void;
  onBack: () => void;
  isLoading?: boolean;
}

export const EndUserRegistrationForm = ({
  mobileNumber,
  onSubmit,
  onBack,
  isLoading = false,
}: EndUserRegistrationFormProps) => {
  useSetTitle("Register - User Details");

  /* ======= define form ====== */
  const form = useForm<EndUserRegistrationType>({
    resolver: zodResolver(endUserRegistrationSchema()),
    defaultValues: {
      authType: "END_USER" as const,
      mobileNumber: mobileNumber,
      userType: undefined,
      name: "",
      address: "",
    },
  });

  // Watch userType to conditionally render farm data fields
  const selectedUserType = form.watch("userType");

  /* ====== define submit handler ======== */
  const handleSubmit = async (values: EndUserRegistrationType) => {
    onSubmit(values);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">
          Complete Your Profile
        </h2>
        <p className="text-gray-600 mt-2">
          Tell us about yourself to get personalized services
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="userType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>User Type</FormLabel>
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
                      <SelectValue placeholder="Select user type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {END_USER_TYPES.map((type) => (
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
                <FormLabel className="text-sm leading-5">Address</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter your complete address"
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

          {/* Farm Data Section - Required */}
          {selectedUserType && (
            <div className="border-t pt-4 space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Farm Information
              </h3>

              {/* Agriculture Farmer Fields */}
              {selectedUserType === "AGRICULTURE_FARMER" && (
                <>
                  <FormField
                    control={form.control}
                    name="farmData.totalAgricultureLandDecimal"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm leading-5">
                          Total Land (Decimal) *
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="e.g., 5.5"
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseFloat(e.target.value) || 0)
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="farmData.typeOfAgriculture"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm leading-5">
                          Type of Agriculture *
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Rice cultivation, Vegetable farming"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              {/* Dairy Farmer Fields */}
              {selectedUserType === "DAIRY_FARMER" && (
                <>
                  <FormField
                    control={form.control}
                    name="farmData.totalCattlePopulation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm leading-5">
                          Total Cattle Population *
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="e.g., 20"
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseInt(e.target.value) || 0)
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="farmData.totalMilkingCow"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm leading-5">
                          Total Milking Cows *
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="e.g., 15"
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseInt(e.target.value) || 0)
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="farmData.totalMilkProductionPerDay"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm leading-5">
                          Total Milk Production Per Day (Liters) *
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="e.g., 100"
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseInt(e.target.value) || 0)
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="farmData.totalCalf"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm leading-5">
                          Total Calves *
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="e.g., 5"
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseInt(e.target.value) || 0)
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="farmData.totalFemaleCalf"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm leading-5">
                          Total Female Calves *
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="e.g., 3"
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseInt(e.target.value) || 0)
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="farmData.totalMaleCalf"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm leading-5">
                          Total Male Calves *
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="e.g., 2"
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseInt(e.target.value) || 0)
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              {/* Fish Farmer Fields */}
              {selectedUserType === "FISH_FARMER" && (
                <>
                  <FormField
                    control={form.control}
                    name="farmData.totalPondAreaDecimal"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm leading-5">
                          Total Pond Area (Decimal) *
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="e.g., 2.5"
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseFloat(e.target.value) || 0)
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="farmData.fishType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm leading-5">
                          Fish Type *
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Rohu, Catla, Mrigal"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              {/* Poultry Farmer Fields */}
              {selectedUserType === "POULTRY_FARMER" && (
                <>
                  <FormField
                    control={form.control}
                    name="farmData.farmType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm leading-5">
                          Farm Type *
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger
                              className={
                                form.formState.errors.farmData &&
                                "farmType" in form.formState.errors.farmData &&
                                form.formState.errors.farmData.farmType?.message
                                  ? "border-red-500"
                                  : ""
                              }
                            >
                              <SelectValue placeholder="Select farm type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="LAYER">Layer Farm</SelectItem>
                            <SelectItem value="BROILER">
                              Broiler Farm
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="farmData.totalBird"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm leading-5">
                          Total Birds *
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="e.g., 500"
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseInt(e.target.value) || 0)
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="farmData.totalEggProductionPerDay"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm leading-5">
                          Total Egg Production Per Day *
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="e.g., 400"
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseInt(e.target.value) || 0)
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
            </div>
          )}

          <div className="flex flex-col space-y-3 pt-4">
            <Button
              type="submit"
              size="lg"
              variant="default"
              disabled={isLoading}
              className="w-full px-6 py-3 rounded-sm text-[16px] leading-6 h-auto"
            >
              {isLoading ? <ButtonLoader /> : "Create Account"}
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
