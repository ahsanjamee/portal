import client from "@/client";
import type { ResponseConfig } from "@/client";
import type {
  GetSuperAdminPrescriptionsDoctorDoctoridQueryResponse,
  GetSuperAdminPrescriptionsDoctorDoctoridPathParams,
  GetSuperAdminPrescriptionsDoctorDoctoridQueryParams,
} from "../../types/GetSuperAdminPrescriptionsDoctorDoctorid";

/**
 * @description Get prescriptions by doctor
 * @summary Get prescriptions created by a specific doctor (Super Admin only)
 * @link /super-admin/prescriptions/doctor/:doctorId
 */
export async function getSuperAdminPrescriptionsDoctorDoctorid(
  doctorId: GetSuperAdminPrescriptionsDoctorDoctoridPathParams["doctorId"],
  params?: GetSuperAdminPrescriptionsDoctorDoctoridQueryParams,
  options: Partial<Parameters<typeof client>[0]> = {},
): Promise<
  ResponseConfig<GetSuperAdminPrescriptionsDoctorDoctoridQueryResponse>
> {
  const res =
    await client<GetSuperAdminPrescriptionsDoctorDoctoridQueryResponse>({
      method: "get",
      url: `/super-admin/prescriptions/doctor/${doctorId}`,
      params,
      ...options,
    });
  return res;
}
