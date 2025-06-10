import { ModalsProvider } from "@mantine/modals";
import { useEffect, useLayoutEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuthAxios } from "./lib/http/axios.hook";
import { useGlobalStore, useGlobalStoreSelector } from "./stores/global.store";
import { getRedirectURL } from "./utils/auth.utils";

function App() {
  const isLoggedIn = useGlobalStoreSelector((s) => s.authenticated);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { store } = useGlobalStore();
  const axios = useAuthAxios();
  const [axiosInjected, setAxiosInjected] = useState(false);
  const isSuperAdmin = useGlobalStoreSelector(
    (s) => s.authType === "SUPER_ADMIN"
  );

  const isAdmin = useGlobalStoreSelector((s) => s.authType === "ADMIN");
  const isEndUser = useGlobalStoreSelector((s) => s.authType === "END_USER");

  useEffect(() => {
    const hasRedirectUrl = getRedirectURL();

    if (!isLoggedIn) {
      // Check if coming from admin or user paths
      const isFromAdminOrUser =
        pathname.startsWith("/admin") || pathname.startsWith("/user");

      let navigateTo;
      if (isFromAdminOrUser) {
        // If coming from admin or user paths, go to /auth/login
        navigateTo = hasRedirectUrl
          ? `/auth/login?redirect_url=${hasRedirectUrl}`
          : "/auth/login";
      } else {
        // Otherwise, go to /login
        navigateTo = hasRedirectUrl
          ? `/login?redirect_url=${hasRedirectUrl}`
          : "/login";
      }

      navigate(navigateTo);
      return;
    }

    if (isSuperAdmin) {
      if (!pathname.startsWith("/super-admin")) {
        navigate("/super-admin/profile");
      }
      return;
    } else if (isAdmin) {
      if (!pathname.startsWith("/admin")) {
        navigate("/admin/profile");
      }
      return;
    } else if (isEndUser) {
      if (!pathname.startsWith("/user")) {
        navigate("/user/profile");
      }
      return;
    }
  }, [axios, isLoggedIn, isSuperAdmin, navigate, pathname, store]);

  useLayoutEffect(() => {
    setAxiosInjected(true);
  }, [axios]);

  if (!axiosInjected) return null;
  if (!isLoggedIn) return null;

  return (
    <ModalsProvider>
      <Outlet />
    </ModalsProvider>
  );
}

export default App;
