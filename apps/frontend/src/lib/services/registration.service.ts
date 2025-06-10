import { makeMutation } from '@/lib/makeQuery/makeQuery';

import {
    type PostUserRegisterEndUserMutationRequest,
    type PostUserRegisterEndUserMutationResponse,
    type PostUserRegisterAdminMutationRequest,
    type PostUserRegisterAdminMutationResponse,
    type PostUserAuthVerifyMobileRegistrationMutationRequest,
    type PostUserAuthVerifyMobileRegistrationMutationResponse,
    userService,
} from '@portal/portal-api-client';

export const registrationService = {
    // Register end user (farmers)
    useRegisterEndUser: makeMutation<PostUserRegisterEndUserMutationResponse, PostUserRegisterEndUserMutationRequest>((data) => userService.postUserRegisterEndUser(data)),

    // Register admin user
    useRegisterAdmin: makeMutation<PostUserRegisterAdminMutationResponse, PostUserRegisterAdminMutationRequest>((data) => userService.postUserRegisterAdmin(data)),

    // Verify mobile number during registration
    useVerifyMobileRegistration: makeMutation<PostUserAuthVerifyMobileRegistrationMutationResponse, PostUserAuthVerifyMobileRegistrationMutationRequest>((data) => userService.postUserAuthVerifyMobileRegistration(data)),
}; 