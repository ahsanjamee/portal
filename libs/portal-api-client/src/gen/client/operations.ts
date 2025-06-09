export const operations = {
  "post_user-register-end-user": {
    path: "/user/register/end-user",
    method: "post",
  },
  "post_user-register-admin": {
    path: "/user/register/admin",
    method: "post",
  },
  "post_user-auth-login": {
    path: "/user/auth/login",
    method: "post",
  },
  "post_user-auth-verify-otp": {
    path: "/user/auth/verify-otp",
    method: "post",
  },
  "post_user-auth-verify-mobile-registration": {
    path: "/user/auth/verify-mobile-registration",
    method: "post",
  },
  "post_user-auth-send-otp": {
    path: "/user/auth/send-otp",
    method: "post",
  },
  "post_user-auth-refresh": {
    path: "/user/auth/refresh",
    method: "post",
  },
  "post_user-auth-logout": {
    path: "/user/auth/logout",
    method: "post",
  },
  "post_user-auth-super-admin-login": {
    path: "/user/auth/super-admin-login",
    method: "post",
  },
  "get_user-id": {
    path: "/user/:id",
    method: "get",
  },
} as const;
