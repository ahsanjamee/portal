export const operations = {
  "get_super-admin-end-users": {
    path: "/super-admin/end-users",
    method: "get",
  },
  "get_super-admin-admins": {
    path: "/super-admin/admins",
    method: "get",
  },
  "patch_super-admin-end-users-id-status": {
    path: "/super-admin/end-users/:id/status",
    method: "patch",
  },
  "patch_super-admin-admins-id-status": {
    path: "/super-admin/admins/:id/status",
    method: "patch",
  },
  "delete_super-admin-end-users-id": {
    path: "/super-admin/end-users/:id",
    method: "delete",
  },
  "delete_super-admin-admins-id": {
    path: "/super-admin/admins/:id",
    method: "delete",
  },
  "get_super-admin-sms-stats": {
    path: "/super-admin/sms-stats",
    method: "get",
  },
  "get_super-admin-sms-stats-summary": {
    path: "/super-admin/sms-stats/summary",
    method: "get",
  },
  "post_super-admin-export-users": {
    path: "/super-admin/export/users",
    method: "post",
  },
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
    path: "/user/auth/super-admin/login",
    method: "post",
  },
  "get_user-id": {
    path: "/user/:id",
    method: "get",
  },
  "get_user-profile": {
    path: "/user/profile",
    method: "get",
  },
  "put_user-profile-end-user-id": {
    path: "/user/profile/end-user/:id",
    method: "put",
  },
  "put_user-profile-admin-id": {
    path: "/user/profile/admin/:id",
    method: "put",
  },
  "put_user-profile-image": {
    path: "/user/profile/image",
    method: "put",
  },
  post_prescription: {
    path: "/prescription",
    method: "post",
  },
  get_prescription: {
    path: "/prescription",
    method: "get",
  },
  "get_prescription-patients": {
    path: "/prescription/patients",
    method: "get",
  },
  "get_prescription-id": {
    path: "/prescription/:id",
    method: "get",
  },
  "put_prescription-id": {
    path: "/prescription/:id",
    method: "put",
  },
  "delete_prescription-id": {
    path: "/prescription/:id",
    method: "delete",
  },
  "get_super-admin-prescriptions": {
    path: "/super-admin/prescriptions",
    method: "get",
  },
  "get_super-admin-prescriptions-id": {
    path: "/super-admin/prescriptions/:id",
    method: "get",
  },
  "delete_super-admin-prescriptions-id": {
    path: "/super-admin/prescriptions/:id",
    method: "delete",
  },
  "get_farmers-prescriptions": {
    path: "/farmers/prescriptions",
    method: "get",
  },
  "get_farmers-prescriptions-id": {
    path: "/farmers/prescriptions/:id",
    method: "get",
  },
  "get_super-admin-medicines-public": {
    path: "/super-admin/medicines/public",
    method: "get",
  },
  "get_super-admin-medicines": {
    path: "/super-admin/medicines",
    method: "get",
  },
  "post_super-admin-medicines": {
    path: "/super-admin/medicines",
    method: "post",
  },
  "put_super-admin-medicines-id": {
    path: "/super-admin/medicines/:id",
    method: "put",
  },
  "delete_super-admin-medicines-id": {
    path: "/super-admin/medicines/:id",
    method: "delete",
  },
} as const;
