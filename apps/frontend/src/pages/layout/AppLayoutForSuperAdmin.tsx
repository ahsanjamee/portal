import { LogoutIcon } from "@/components/icons/AllIcons";
import { useGlobalStore } from "@/stores/global.store";
import NiceModal from "@ebay/nice-modal-react";
import { AppShell, Burger, Group, NavLink, Stack } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  ChatIcon,
  ReceiptIcon,
  UserCheckIcon,
  UsersIcon,
  Pill,
} from "@phosphor-icons/react";
import { RiUserFill } from "react-icons/ri";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { PrimaryTopbar } from "./topbar/PrimaryTopbar";

export const AppLayoutForSuperAdmin = () => {
  const navigate = useNavigate();
  const [opened, { toggle }] = useDisclosure();

  const location = useLocation();

  const links = [
    { label: "Profile", to: "/super-admin/profile", icon: <RiUserFill /> },
    {
      label: "End Users",
      to: "/super-admin/end-users",
      icon: <UsersIcon size={20} />,
    },
    {
      label: "Admin Users",
      to: "/super-admin/admins",
      icon: <UserCheckIcon size={20} />,
    },
    {
      label: "SMS Stats",
      to: "/super-admin/sms-stats",
      icon: <ChatIcon size={20} />,
    },
    {
      label: "Prescriptions",
      to: "/super-admin/prescriptions",
      icon: <ReceiptIcon size={20} />,
    },
    {
      label: "Medicines",
      to: "/super-admin/medicines",
      icon: <Pill size={20} />,
    },
  ];

  const { store } = useGlobalStore();

  return (
    <AppShell
      header={{ height: 64 }}
      navbar={{
        width: 240,
        breakpoint: "sm",
        collapsed: { mobile: !opened },
      }}
      padding="20px"
    >
      <AppShell.Header zIndex={99} p="md">
        <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
        <div className="w-full ml-4 -mt-[30px] sm:mt-0 sm:ml-0">
          <PrimaryTopbar />
        </div>
      </AppShell.Header>

      <AppShell.Navbar
        py="md"
        pr="md"
        className="flex justify-between z-10 bg-stone-100"
      >
        <div>
          {links.map((link) => (
            <NavLink
              key={link.to}
              onClick={() => {
                navigate(link.to);
                toggle();
              }}
              active={location.pathname.startsWith(link.to)}
              leftSection={link.icon}
              label={link.label}
              className="pl-4 text-[#697D95]"
              variant="link"
            />
          ))}
        </div>

        <Stack>
          <div className="border-t-[1px] border-[#323232] border-opacity-10">
            <Group
              align="center"
              gap={"sm"}
              ml={"md"}
              bg={"#fff"}
              className="mt-[-1px] w-full pl-0 pt-5 py-2 px-4 cursor-pointer border-t-[1px] border-[#323232] border-opacity-10"
              onClick={() => store.onLogout()}
            >
              <div className="flex items-center gap-2 bg-main-bg w-full p-2 rounded-lg">
                <LogoutIcon />
                <span className="text-base font-medium leading-5 text-black">
                  Log out
                </span>
              </div>
            </Group>
          </div>
        </Stack>
      </AppShell.Navbar>

      <AppShell.Main className="bg-[#F1F1F5] h-[calc(100vh-64px)] overflow-auto">
        <NiceModal.Provider>
          <Outlet />
        </NiceModal.Provider>
      </AppShell.Main>
    </AppShell>
  );
};
