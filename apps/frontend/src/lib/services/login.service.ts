import { makeQuery, makeMutation } from '@/lib/makeQuery/makeQuery';
import {
    userService
} from '@portal/portal-api-client';
import type {
    PostUserAuthLoginMutationRequest,
    PostUserAuthLoginMutationResponse,
    PostUserAuthVerifyOtpMutationRequest,
    PostUserAuthVerifyOtpMutationResponse,
    PostUserAuthSendOtpMutationRequest,
    PostUserAuthSendOtpMutationResponse,
    PostUserAuthSuperAdminLoginMutationRequest,
    PostUserAuthSuperAdminLoginMutationResponse,
    PostUserAuthLogoutMutationRequest,
    PostUserAuthLogoutMutationResponse,
    PostUserAuthRefreshMutationRequest,
    PostUserAuthRefreshMutationResponse,
    GetUserIdQueryResponse
} from '@portal/portal-api-client';

export const loginService = {
    // Send OTP for login
    useLogin: makeMutation<PostUserAuthLoginMutationResponse, PostUserAuthLoginMutationRequest>(
        (data) => userService.postUserAuthLogin(data)
    ),

    // Verify OTP and complete login
    useVerifyOtp: makeMutation<PostUserAuthVerifyOtpMutationResponse, PostUserAuthVerifyOtpMutationRequest>(
        (data) => userService.postUserAuthVerifyOtp(data)
    ),

    // Send OTP (for resending)
    useSendOtp: makeMutation<PostUserAuthSendOtpMutationResponse, PostUserAuthSendOtpMutationRequest>(
        (data) => userService.postUserAuthSendOtp(data)
    ),

    // Super admin login
    useSuperAdminLogin: makeMutation<PostUserAuthSuperAdminLoginMutationResponse, PostUserAuthSuperAdminLoginMutationRequest>(
        (data) => userService.postUserAuthSuperAdminLogin(data)
    ),

    // Logout
    useLogout: makeMutation<PostUserAuthLogoutMutationResponse, PostUserAuthLogoutMutationRequest>(
        (data) => userService.postUserAuthLogout(data)
    ),

    // Refresh token
    useRefreshToken: makeMutation<PostUserAuthRefreshMutationResponse, PostUserAuthRefreshMutationRequest>(
        (data) => userService.postUserAuthRefresh(data)
    ),

    // Get user profile by ID
    useGetUserProfile: makeQuery<GetUserIdQueryResponse, [string]>(
        (userId) => userService.getUserId(userId),
        ['user', 'profile']
    ),
}; 