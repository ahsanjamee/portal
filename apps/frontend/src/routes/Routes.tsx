"use client";
import App from "@/App";
import { Loader } from "@/components/Loader/Loader";
import { createAuthAxios } from "@/lib/http/axios.hook";
import ErrorBoundaryPage from "@/pages/404/ErrorBoundaryPage";
import ErrorPage from "@/pages/404/ErrorPage";
import { useGlobalStore, useGlobalStoreSelector } from "@/stores/global.store";
import { setAxiosClient } from "@portal/portal-api-client";
import axios from "axios";
import {
  FC,
  PropsWithChildren,
  Suspense,
  lazy,
  useEffect,
  useState,
} from "react";
import { ErrorBoundary } from "react-error-boundary";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

const ProtectedRoute: FC<PropsWithChildren> = ({ children }) => {
  const isLoggedIn = useGlobalStoreSelector((s) => s.authenticated);
  const { store } = useGlobalStore();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      window.location.href = "/login";
      return;
    }

    const axiosInstance = createAuthAxios({
      getAccessToken: () => store.getState().accessToken,
      getRefreshToken: () => store.getState().refreshToken,
      onLogout: () => {
        store.onLogout();
        localStorage.clear();
      },
      setAccessToken: (token) => {
        store.setState((p) => ({ ...p, accessToken: token }));
        localStorage.setItem("accessToken", token);
      },
      baseURL: import.meta.env.VITE_API_URL,
      normalizeArrayQuery: true,
    });

    setAxiosClient(axiosInstance);
    setIsReady(true);
  }, [isLoggedIn, store]);

  if (!isReady) {
    return <Loader />;
  }

  return <>{children}</>;
};

const PublicRoutes: FC<PropsWithChildren> = ({ children }) => {
  const instance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    validateStatus: () => true,
  });

  setAxiosClient(instance);

  return <>{children}</>;
};

type DefaultComponent = {
  default: FC;
};

type LazyFactoryProps = {
  factory: () => Promise<DefaultComponent>;
  name: string;
  dontAllowWhileloggedIn?: boolean;
};

const LazyFactory = ({
  factory,
  name,
  dontAllowWhileloggedIn,
}: LazyFactoryProps) => {
  const Component = lazy(factory);

  const Wrapped = () => (
    <ErrorBoundary FallbackComponent={ErrorBoundaryPage}>
      {dontAllowWhileloggedIn ? (
        <Suspense fallback={<Loader />}>
          <Component />
        </Suspense>
      ) : (
        <Suspense fallback={<Loader />}>
          <Component />
        </Suspense>
      )}
    </ErrorBoundary>
  );

  Wrapped.displayName = name;

  return Wrapped;
};

const components = {
  AuthLoginLazy: LazyFactory({
    factory: () =>
      import("@/pages/auth/login/AuthLogin").then((m) => ({
        default: m.AuthLogin,
      })),
    name: "AuthLoginLazy",
    dontAllowWhileloggedIn: true,
  }),

  AppLayoutForAdminLazy: LazyFactory({
    factory: () =>
      import("@/pages/layout/AppLayoutForAdmin").then((m) => ({
        default: m.AppLayoutForAdmin,
      })),
    name: "AppLayoutForAdminLazy",
  }),

  AppLayoutForUserLazy: LazyFactory({
    factory: () =>
      import("@/pages/layout/AppLayoutForUser").then((m) => ({
        default: m.AppLayoutForUser,
      })),
    name: "AppLayoutForUserLazy",
  }),

  AppLayoutForSuperAdminLazy: LazyFactory({
    factory: () =>
      import("@/pages/layout/AppLayoutForSuperAdmin").then((m) => ({
        default: m.AppLayoutForSuperAdmin,
      })),
    name: "AppLayoutForSuperAdminLazy",
  }),

  UsersAdminIndexLazy: LazyFactory({
    factory: () =>
      import("@/pages/users/admin/UsersAdminIndex").then((m) => ({
        default: m.UsersAdminIndex,
      })),
    name: "UsersAdminIndexLazy",
  }),

  UsersSuperAdminIndexLazy: LazyFactory({
    factory: () =>
      import("@/pages/users/super-admin/UsersSuperAdminIndex").then((m) => ({
        default: m.UsersSuperAdminIndex,
      })),
    name: "UsersSuperAdminIndexLazy",
  }),

  ProfileSuperAdminIndexLazy: LazyFactory({
    factory: () =>
      import("@/pages/profile/super-admin/ProfileSuperAdminIndex").then(
        (m) => ({
          default: m.ProfileSuperAdminIndex,
        })
      ),
    name: "ProfileSuperAdminIndexLazy",
  }),

  EndUsersPageLazy: LazyFactory({
    factory: () =>
      import("@/pages/users/super-admin/EndUsersPage").then((m) => ({
        default: m.EndUsersPage,
      })),
    name: "EndUsersPageLazy",
  }),

  AdminsPageLazy: LazyFactory({
    factory: () =>
      import("@/pages/users/super-admin/AdminsPage").then((m) => ({
        default: m.AdminsPage,
      })),
    name: "AdminsPageLazy",
  }),

  EndUserProfilePageLazy: LazyFactory({
    factory: () =>
      import("@/pages/users/super-admin/EndUserProfilePage").then((m) => ({
        default: m.EndUserProfilePage,
      })),
    name: "EndUserProfilePageLazy",
  }),

  AdminUserProfilePageLazy: LazyFactory({
    factory: () =>
      import("@/pages/users/super-admin/AdminUserProfilePage").then((m) => ({
        default: m.AdminUserProfilePage,
      })),
    name: "AdminUserProfilePageLazy",
  }),

  SmsStatsIndexLazy: LazyFactory({
    factory: () =>
      import("@/pages/super-admin/sms/SmsStatsIndex").then((m) => ({
        default: m.SmsStatsIndex,
      })),
    name: "SmsStatsIndexLazy",
  }),

  // Mobile Auth Components
  AuthMobileLoginLazy: LazyFactory({
    factory: () =>
      import("@/pages/auth/AuthMobileLogin").then((m) => ({
        default: m.AuthMobileLoginPage,
      })),
    name: "AuthMobileLoginLazy",
    dontAllowWhileloggedIn: true,
  }),

  AuthRegisterLazy: LazyFactory({
    factory: () =>
      import("@/pages/auth/AuthRegisterPage").then((m) => ({
        default: m.AuthRegisterPage,
      })),
    name: "AuthRegisterLazy",
    dontAllowWhileloggedIn: true,
  }),

  // Profile Pages
  UserProfileLazy: LazyFactory({
    factory: () =>
      import("@/pages/profile/farmers/UserProfile").then((m) => ({
        default: m.UserProfile,
      })),
    name: "UserProfileLazy",
  }),

  AdminProfileLazy: LazyFactory({
    factory: () =>
      import("@/pages/profile/admin/AdminProfile").then((m) => ({
        default: m.AdminProfile,
      })),
    name: "AdminProfileLazy",
  }),

  PrescriptionIndexLazy: LazyFactory({
    factory: () =>
      import("@/pages/prescription/PrescriptionIndex").then((m) => ({
        default: m.PrescriptionIndex,
      })),
    name: "PrescriptionIndexLazy",
  }),
};

export const Routes = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <ErrorBoundary FallbackComponent={ErrorBoundaryPage}>
          <App />
        </ErrorBoundary>
      ),
      children: [
        {
          path: "/",
          element: (
            <ErrorBoundary FallbackComponent={ErrorBoundaryPage}>
              <ProtectedRoute>
                <App />
              </ProtectedRoute>
            </ErrorBoundary>
          ),
          // Admin Routes
          children: [
            {
              Component: components.AppLayoutForAdminLazy,
              children: [
                {
                  path: "/admin/users",
                  Component: components.UsersAdminIndexLazy,
                },
                {
                  path: "/admin/profile",
                  Component: components.AdminProfileLazy,
                },
                {
                  path: "/admin/prescriptions",
                  Component: components.PrescriptionIndexLazy,
                },
              ],
            },
          ],
        },

        // User Routes
        {
          path: "/",
          element: (
            <ErrorBoundary FallbackComponent={ErrorBoundaryPage}>
              <ProtectedRoute>
                <App />
              </ProtectedRoute>
            </ErrorBoundary>
          ),
          children: [
            {
              Component: components.AppLayoutForUserLazy,
              children: [
                {
                  path: "/user/profile",
                  Component: components.UserProfileLazy,
                },
              ],
            },
          ],
        },

        // Super Admin Routes
        {
          element: (
            <ProtectedRoute>
              <components.AppLayoutForSuperAdminLazy />
            </ProtectedRoute>
          ),
          children: [
            {
              path: "/super-admin/users",
              Component: components.UsersSuperAdminIndexLazy,
            },
            {
              path: "/super-admin/end-users",
              Component: components.EndUsersPageLazy,
            },
            {
              path: "/super-admin/admins",
              Component: components.AdminsPageLazy,
            },
            {
              path: "/super-admin/profile",
              Component: components.ProfileSuperAdminIndexLazy,
            },
            {
              path: "/super-admin/end-user/:id",
              Component: components.EndUserProfilePageLazy,
            },
            {
              path: "/super-admin/admin/:id",
              Component: components.AdminUserProfilePageLazy,
            },
            {
              path: "/super-admin/sms-stats",
              Component: components.SmsStatsIndexLazy,
            },
          ],
        },
      ],
    },

    {
      path: "/login",
      element: (
        <PublicRoutes>
          <components.AuthLoginLazy />
        </PublicRoutes>
      ),
    },
    {
      path: "/super-admin/login",
      element: (
        <PublicRoutes>
          <components.AuthLoginLazy />
        </PublicRoutes>
      ),
    },
    {
      path: "/auth/login",
      element: (
        <PublicRoutes>
          <components.AuthMobileLoginLazy />
        </PublicRoutes>
      ),
    },
    {
      path: "/auth/register",
      element: (
        <PublicRoutes>
          <components.AuthRegisterLazy />
        </PublicRoutes>
      ),
    },

    {
      path: "*",
      element: <ErrorPage title="Page Doesn't Exist" />,
    },
  ]);

  return <RouterProvider router={router} />;
};
