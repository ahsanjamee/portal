import { LogoutIcon } from "@/components/icons/AllIcons";
import { useGlobalStore } from "@/stores/global.store";
import NiceModal from "@ebay/nice-modal-react";
import { AppShell, Burger, Group, NavLink, Stack } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { UserIcon, Receipt } from "@phosphor-icons/react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { PrimaryTopbar } from "./topbar/PrimaryTopbar";

export const AppLayoutForAdmin = () => {
  const navigate = useNavigate();
  const [opened, { toggle }] = useDisclosure();

  const location = useLocation();

  const links = [
    {
      label: "Profile",
      to: "/admin/profile",
      icon: <UserIcon size={20} weight="fill" color="#859992" />,
    },
    {
      label: "Prescriptions",
      to: "/admin/prescriptions",
      icon: <Receipt size={20} weight="fill" color="#859992" />,
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
      padding="32px"
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
        className="h-[calc(100vh-64px)] flex justify-between z-10 bg-stone-100"
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
              className="pl-4 text-[#859992] text-base font-[500]"
              variant="link"
            />
          ))}
        </div>

        <Stack justify="space-between">
          {/* <CountriesDropdown /> */}

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
                <span className="text-[13px] font-medium leading-5 text-black">
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
