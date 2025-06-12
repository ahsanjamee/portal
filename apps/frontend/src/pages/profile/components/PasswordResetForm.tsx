// import { ButtonLoader } from '@/components/Loader/ButtonLoader';
// import { Button } from '@/components/ui/button';
// import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
// import { Separator } from '@/components/ui/separator';
// import { useTranslate } from '@/translations/provider';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { Input } from '@mantine/core';
// import { notifications } from '@mantine/notifications';
// import { IconEye, IconEyeOff, IconLock } from '@tabler/icons-react';
// import { omit } from 'lodash';
// import { useState } from 'react';
// import { useForm } from 'react-hook-form';
// import { useLocation } from 'react-router-dom';
// import { z } from 'zod';
// import { profileService } from '../service/profile.service';

// const PasswordResetForm = () => {
//     const t = useTranslate();
//     const [showCurrentPassword, setShowCurrentPassword] = useState(false);
//     const [showNewPassword, setShowNewPassword] = useState(false);
//     const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//     const location = useLocation();

//     const { mutate: updateSuperAdminPassword, isPending: isUpdatingSuperAdminPassword } =
//         profileService.useSuperAdminUpdatePassword({
//             onSuccess: () => {
//                 notifications.show({ message: 'Password updated successfully', color: 'green' });
//                 form.reset();
//             },
//         });
//     const { mutate: updateAdminPassword, isPending: isUpdatingAdminPassword } = profileService.useAdminUpdatePassword({
//         onSuccess: () => {
//             notifications.show({ message: 'Password updated successfully', color: 'green' });
//             form.reset();
//         },
//     });
//     const formSchema = z
//         .object({
//             oldPassword: z.string().min(1, 'Old password is required'),
//             password: z.string().min(8, 'Password must be min 8 characters'),
//             confirmPassword: z.string().min(1, 'Confirm password is required'),
//         })
//         .refine((data) => data.password === data.confirmPassword, {
//             message: t("Passwords don't match"),
//             path: ['confirmPassword'],
//         });

//     const form = useForm<z.infer<typeof formSchema>>({
//         resolver: zodResolver(formSchema),
//         defaultValues: {
//             oldPassword: '',
//             password: '',
//             confirmPassword: '',
//         },
//         mode: 'onChange',
//     });

//     const onSubmit = async (data: z.infer<typeof formSchema>) => {
//         if (location.pathname === '/super-admin/profile') {
//             await updateSuperAdminPassword(omit(data, 'confirmPassword'));
//         } else {
//             await updateAdminPassword(omit(data, 'confirmPassword'));
//         }
//     };

//     return (
//         <Form {...form}>
//             <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
//                 <div className="flex w-full justify-between mb-8 items-center">
//                     <div>
//                         <h3 className="text-xl font-medium">Password</h3>
//                         <div className="text-sm text-gray-500">Update your password here.</div>
//                     </div>
//                     <Button variant="default">
//                         {isUpdatingSuperAdminPassword || isUpdatingAdminPassword ? <ButtonLoader /> : 'Change password'}
//                     </Button>
//                 </div>
//                 <Separator className="border-t-[1px] border-[#EAECF0] my-5" />
//                 <div className="space-y-6 max-w-[860px]">
//                     <div className="flex items-center gap-12">
//                         <div className="flex-1 max-w-[200px]">
//                             <label className="text-base leading-6 text-[#1D2823]">{'Old password'}</label>
//                         </div>
//                         <div className="flex-1">
//                             <div className="relative">
//                                 <FormField
//                                     control={form.control}
//                                     name="oldPassword"
//                                     render={({ field }) => (
//                                         <FormItem>
//                                             <FormControl>
//                                                 <Input
//                                                     type={showCurrentPassword ? 'text' : 'password'}
//                                                     placeholder={'Old password'}
//                                                     value={field.value}
//                                                     onChange={field.onChange}
//                                                     leftSection={<IconLock size={16} className="text-gray-500" />}
//                                                 />
//                                             </FormControl>
//                                             <FormMessage />
//                                         </FormItem>
//                                     )}
//                                 />
//                                 <button
//                                     type="button"
//                                     onClick={() => setShowCurrentPassword(!showCurrentPassword)}
//                                     className="text-gray-500 hover:text-gray-700 cursor-pointer z-10 absolute right-2.5 top-2.5"
//                                 >
//                                     {showCurrentPassword ? <IconEye size={16} /> : <IconEyeOff size={16} />}
//                                 </button>
//                             </div>
//                         </div>
//                     </div>

//                     <div className="flex items-center gap-12">
//                         <div className="flex-1 max-w-[200px]">
//                             <label className="text-base text-[#1D2823]">{'New password'}</label>
//                         </div>
//                         <div className="flex-1">
//                             <div className="relative">
//                                 <FormField
//                                     control={form.control}
//                                     name="password"
//                                     render={({ field }) => (
//                                         <FormItem>
//                                             <FormControl>
//                                                 <Input
//                                                     type={showNewPassword ? 'text' : 'password'}
//                                                     placeholder={'New password'}
//                                                     value={field.value}
//                                                     onChange={field.onChange}
//                                                     leftSection={<IconLock size={16} className="text-gray-500" />}
//                                                 />
//                                             </FormControl>
//                                             <FormMessage />
//                                         </FormItem>
//                                     )}
//                                 />
//                                 <button
//                                     type="button"
//                                     onClick={() => setShowNewPassword(!showNewPassword)}
//                                     className="text-gray-500 hover:text-gray-700 cursor-pointer z-10 absolute right-2.5 top-2.5"
//                                 >
//                                     {showNewPassword ? <IconEye size={16} /> : <IconEyeOff size={16} />}
//                                 </button>
//                             </div>
//                         </div>
//                     </div>

//                     <div className="flex items-center gap-12">
//                         <div className="flex-1 max-w-[200px]">
//                             <label className="text-base text-[#1D2823]">{'Confirm password'}</label>
//                         </div>
//                         <div className="flex-1">
//                             <div className="relative">
//                                 <FormField
//                                     control={form.control}
//                                     name="confirmPassword"
//                                     render={({ field }) => (
//                                         <FormItem>
//                                             <FormControl>
//                                                 <Input
//                                                     type={showConfirmPassword ? 'text' : 'password'}
//                                                     placeholder={'Confirm password'}
//                                                     value={field.value}
//                                                     onChange={field.onChange}
//                                                     leftSection={<IconLock size={16} className="text-gray-500" />}
//                                                 />
//                                             </FormControl>
//                                             <FormMessage />
//                                         </FormItem>
//                                     )}
//                                 />
//                                 <button
//                                     type="button"
//                                     onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                                     className="text-gray-500 hover:text-gray-700 cursor-pointer z-10 absolute right-2.5 top-2.5"
//                                 >
//                                     {showConfirmPassword ? <IconEye size={16} /> : <IconEyeOff size={16} />}
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </form>
//         </Form>
//     );
// };

// export default PasswordResetForm;
