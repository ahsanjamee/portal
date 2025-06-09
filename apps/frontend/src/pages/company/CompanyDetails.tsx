// import { Button } from "@/components/ui/button";
// import { useSetTitle } from "@/stores/title-context";
// import { Loader, Text } from "@mantine/core";
// import { ArrowLeft, Export } from "@phosphor-icons/react";
// import { useLocation, useNavigate, useParams } from "react-router-dom";
// import { usersSuperAdminService } from "../users/super-admin/services/users.service";
// import { UsersSuperAdminIndex } from "../users/super-admin/UsersSuperAdminIndex";
// import { CompanyDetailsCard } from "./components/CompanyDetailsCard";

// export const CompanyDetails = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { state } = useLocation();

//   useSetTitle("Company Details");
//   const { mutate: exportAdminUsers, isPending: isExporting } =
//     usersSuperAdminService.useExportAdminUsers();

//   const handleExport = () => {
//     exportAdminUsers(
//       { companyId: id as string, panelType: "USER" },
//       {
//         onSuccess: (res) => {
//           try {
//             // Create a blob from the response
//             const blob = new Blob([res], {
//               type: "application/vnd.ms-excel",
//             });
//             const url = window.URL.createObjectURL(blob);
//             const link = document.createElement("a");
//             link.href = url;
//             link.setAttribute("download", `company_users_${id}.xlsx`);
//             document.body.appendChild(link);
//             link.click();
//             link.remove();
//             window.URL.revokeObjectURL(url);
//           } catch (error) {
//             console.error("Error downloading file:", error);
//           }
//         },
//         onError: (error) => {
//           console.error("Export failed:", error);
//         },
//       }
//     );
//   };

//   return (
//     <div className="h-full flex flex-col">
//       <div className="flex-none p-4">
//         <div className="flex justify-between items-center">
//           <div className="flex items-center">
//             <ArrowLeft
//               className="cursor-pointer"
//               onClick={() => navigate("/super-admin/company")}
//               size={20}
//             />
//             <Text fw={700} ml={25} size="32px">
//               Company details
//             </Text>
//           </div>

//           <Button variant={"default"} onClick={() => handleExport()}>
//             {isExporting ? (
//               <Loader className="ml-2" color="#10B981" size={20} />
//             ) : (
//               <>
//                 Export
//                 <Export className="ml-2" size={20} />{" "}
//               </>
//             )}
//           </Button>
//         </div>
//       </div>

//       <div className="flex-none p-4">
//         <CompanyDetailsCard
//           logo={state.logo}
//           name={state.name}
//           createdAt={state.createdAt}
//           email={state.companyOwner?.user?.email || "N/A"}
//           phone={state.phone || "N/A"}
//           address={state.address || "N/A"}
//           // subdomain={state.subdomain || 'N/A'}
//         />
//       </div>

//       <div className="flex-1 min-h-0">
//         <div className="h-full p-4">
//           <UsersSuperAdminIndex companyId={id as string} panelType="USER" />
//         </div>
//       </div>
//     </div>
//   );
// };
