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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useSetTitle } from "@/stores/title-context";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { UserTypeSelectionType, userTypeSelectionSchema } from "../login/types";

interface UserTypeSelectionFormProps {
  mobileNumber: string;
  onSubmit: (data: UserTypeSelectionType) => void;
  onBack: () => void;
  isLoading?: boolean;
}

export const UserTypeSelectionForm = ({
  mobileNumber,
  onSubmit,
  onBack,
  isLoading = false,
}: UserTypeSelectionFormProps) => {
  useSetTitle("Register - Select User Type");

  /* ======= define form ====== */
  const form = useForm<UserTypeSelectionType>({
    resolver: zodResolver(userTypeSelectionSchema()),
    defaultValues: {
      userType: undefined,
    },
  });

  /* ====== define submit handler ======== */
  const handleSubmit = async (values: UserTypeSelectionType) => {
    onSubmit(values);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">
          Select Account Type
        </h2>
        <p className="text-gray-600 mt-2">
          Mobile number verified:{" "}
          <span className="font-semibold">{mobileNumber}</span>
        </p>
        <p className="text-gray-600 text-sm">
          Choose the type of account you want to create
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="userType"
            render={({ field }) => (
              <FormItem className="space-y-4">
                <FormLabel className="text-sm leading-5">
                  Account Type
                </FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="space-y-4"
                  >
                    <div className="flex items-start space-x-3 border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                      <RadioGroupItem
                        value="END_USER"
                        id="end-user"
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <label htmlFor="end-user" className="cursor-pointer">
                          <div className="font-medium text-gray-900">User</div>
                          <div className="text-sm text-gray-600 mt-1">
                            Dairy farmers, Poultry farmers, Fish farmers,
                            Agriculture farmers
                          </div>
                        </label>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                      <RadioGroupItem
                        value="ADMIN"
                        id="admin"
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <label htmlFor="admin" className="cursor-pointer">
                          <div className="font-medium text-gray-900">
                            Admin User
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            Service providers, traders, and chemists
                          </div>
                        </label>
                      </div>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-col space-y-3">
            <Button
              type="submit"
              size="lg"
              variant="default"
              disabled={isLoading}
              className="w-full px-6 py-3 rounded-sm text-[16px] leading-6 h-auto"
            >
              {isLoading ? <ButtonLoader /> : "Continue"}
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
