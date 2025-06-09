import { useTranslate } from '@/translations/provider';

import { ButtonLoader } from '@/components/Loader/ButtonLoader';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import UploadImageWithOptions from '@/components/ui/UploadImageWithOptions';
import { useGlobalStore, useGlobalStoreSelector } from '@/stores/global.store';
import { zodResolver } from '@hookform/resolvers/zod';
import { notifications } from '@mantine/notifications';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import 'react-phone-number-input/style.css';
import { z } from 'zod';
import { profileService } from '../service/profile.service';
import { UpdateProfileDTO } from '../service/types';
import './styles.css';

export default function ProfileForm() {
    const t = useTranslate();
    const [file, setFile] = useState<string>('');
    const { store } = useGlobalStore();
    const { user } = useGlobalStoreSelector((state) => state);
    // const [number, setNumber] = useState('');
    // const [numberError, setNumberError] = useState<string | null>(null);

    const { mutateAsync, isPending: uploading } = profileService.useUpdateAvatar();

    const { mutate, isPending: isLoading } = profileService.useUpdateProfile({
        onSuccess(data) {
            notifications.show({ message: 'Profile updated successfully', color: 'green' });
            store.setUser(data);
        },
        onError(e) {
            notifications.show({ message: (e as any).message, color: 'red' });
        },
    });

    const formSchema = z.object({
        firstName: z.string().trim().min(1, t('First name is required')),
        lastName: z.string().trim().min(1, t('Last name is required')),
        phoneNumber: z.string().optional(),
        avatar: z.string().optional(),
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstName: user?.firstName || '',
            lastName: user?.lastName || '',
            phoneNumber: user?.phoneNumber || '',
            avatar: user?.avatar || '',
        },
    });

    useEffect(() => {
        if (user) {
            setFile(user.avatar);
            form.setValue('firstName', user?.firstName || '');
            form.setValue('lastName', user?.lastName || '');
        }
    }, [form, user]);

    const onSubmit = (data: z.infer<typeof formSchema>) => {
        // if (number.length > 0 && !isValidPhoneNumber(number)) {
        //     setNumberError('Invalid Phone Number');
        //     return;
        // }
        const payload: UpdateProfileDTO = {
            firstName: data.firstName,
            lastName: data.lastName,
            avatar: file,
        };
        mutate(payload);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
                <div className="flex w-full justify-between mb-9 items-center">
                    <div>
                        <h3 className="text-xl font-medium">Profile info</h3>
                        <div className="text-sm text-gray-500">Update profile photo and details here.</div>
                    </div>
                    <Button disabled={!form.formState.isValid} variant="default" className="w-24">
                        {isLoading ? <ButtonLoader /> : 'Save'}
                    </Button>
                </div>
                <Separator className="border-t-[1px] border-[#EAECF0] my-5" />
                <div className="max-w-[840px] flex gap-12">
                    <div className="flex-1 max-w-72">
                        <h4 className="text-base leading-6 text-[#1D2823]">Full name</h4>
                    </div>
                    <div className="flex flex-col lg:flex-row gap-5">
                        <FormField
                            control={form.control}
                            name="firstName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input placeholder="Garfield" {...field} className="w-[250px]" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="lastName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input placeholder="Tanner" {...field} className="w-[250px]" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </div>
                <Separator className="border-t-[1px] border-[#EAECF0] my-5" />
                <div className="max-w-[840px] flex gap-12">
                    <div className="flex-1 max-w-72">
                        <h4 className="text-base leading-6 text-[#1D2823]">{t('Email')}</h4>
                    </div>
                    <div className="flex-1">
                        <Input value={user?.email} disabled className="w-[250px] lg:w-[520px]" />
                    </div>
                </div>
                <Separator className="border-t-[1px] border-[#EAECF0] my-5" />

                <div>
                    <div className="max-w-[840px] flex gap-12">
                        <div className="flex-1 max-w-72">
                            <h4 className="text-base leading-6 text-[#1D2823]">Photo</h4>
                            <span className="text-base leading-6 text-[#697D95]">
                                This will be displayed on your profile.
                            </span>
                        </div>
                        <div className="flex-1 flex items-start gap-5">
                            <UploadImageWithOptions
                                file={file}
                                setFile={setFile}
                                mutateAsync={mutateAsync}
                                uploading={uploading}
                                fullWidth
                            />
                        </div>
                    </div>

                    {/* <div className="max-w-[840px] flex gap-12">
                        <div className="flex-1 max-w-72">
                            <h4 className="text-base leading-6 text-[#1D2823]">Phone Number</h4>
                        </div>
                        <div className="flex-1">
                            <FormField
                                control={form.control}
                                name="phoneNumber"
                                render={() => (
                                    <FormItem className="relative">
                                        <div className="flex items-center">
                                            <FormControl>
                                                <PhoneInput
                                                    value={number}
                                                    onChange={(v) => {
                                                        const formatted = v?.trim().toLowerCase().toString() || '';
                                                        setNumber(formatted);
                                                        setNumberError(null);
                                                    }}
                                                    international
                                                    inputComponent={Input}
                                                    defaultCountry="NO"
                                                    autoComplete="off"
                                                />
                                            </FormControl>
                                        </div>
                                        <Text className="absolute left-0 -bottom-5 z-10 w-full text-red-500" size="xs">
                                            {numberError}
                                        </Text>
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div> */}
                </div>
            </form>
        </Form>
    );
}
