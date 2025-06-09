"use client";
import App from "@/App";
import { Loader } from "@/components/Loader/Loader";
import { createAuthAxios } from "@/lib/http/axios.hook";
import ErrorBoundaryPage from "@/pages/404/ErrorBoundaryPage";
import ErrorPage from "@/pages/404/ErrorPage";
import { useGlobalStore, useGlobalStoreSelector } from "@/stores/global.store";
import { setAxiosClient } from "@portal/portal-api-client";
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
      baseURL: import.meta.env.VITE_OUTLET_URL,
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

  ProfileAdminIndexLazy: LazyFactory({
    factory: () =>
      import("@/pages/profile/admin/ProfileAdminIndex").then((m) => ({
        default: m.ProfileAdminIndex,
      })),
    name: "ProfileAdminIndexLazy",
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

  CompanyIndexLazy: LazyFactory({
    factory: () =>
      import("@/pages/company/CompanyIndex").then((m) => ({
        default: m.CompanyIndex,
      })),
    name: "CompanyIndexLazy",
  }),

  CompanyDetailsLazy: LazyFactory({
    factory: () =>
      import("@/pages/company/CompanyDetails").then((m) => ({
        default: m.CompanyDetails,
      })),
    name: "CompanyDetailsLazy",
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
                  Component: components.ProfileAdminIndexLazy,
                },
              ],
            },
          ],
        },
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
              path: "/super-admin/company",
              Component: components.CompanyIndexLazy,
            },
            {
              path: "/super-admin/company/details/:id",
              Component: components.CompanyDetailsLazy,
            },

            {
              path: "/super-admin/profile",
              Component: components.ProfileSuperAdminIndexLazy,
            },
          ],
        },
      ],
    },

    {
      path: "/login",
      Component: components.AuthLoginLazy,
    },
    {
      path: "/super-admin/login",
      Component: components.AuthLoginLazy,
    },

    {
      path: "*",
      element: <ErrorPage title="Page Doesn't Exist" />,
    },
  ]);

  return <RouterProvider router={router} />;
};
