import client from "@/client";
import type { ResponseConfig } from "@/client";
import type {
  GetSuperAdminPrescriptionsPatientPatientidQueryResponse,
  GetSuperAdminPrescriptionsPatientPatientidPathParams,
  GetSuperAdminPrescriptionsPatientPatientidQueryParams,
} from "../../types/GetSuperAdminPrescriptionsPatientPatientid";

/**
 * @description Get prescriptions by patient
 * @summary Get prescriptions for a specific patient (Super Admin only)
 * @link /super-admin/prescriptions/patient/:patientId
 */
export async function getSuperAdminPrescriptionsPatientPatientid(
  patientId: GetSuperAdminPrescriptionsPatientPatientidPathParams["patientId"],
  params?: GetSuperAdminPrescriptionsPatientPatientidQueryParams,
  options: Partial<Parameters<typeof client>[0]> = {},
): Promise<
  ResponseConfig<GetSuperAdminPrescriptionsPatientPatientidQueryResponse>
> {
  const res =
    await client<GetSuperAdminPrescriptionsPatientPatientidQueryResponse>({
      method: "get",
      url: `/super-admin/prescriptions/patient/${patientId}`,
      params,
      ...options,
    });
  return res;
}
