import client from "@/client";
import type { ResponseConfig } from "@/client";
import type {
  GetPrescriptionPatientsQueryResponse,
  GetPrescriptionPatientsQueryParams,
} from "../../types/GetPrescriptionPatients";

/**
 * @description Get all patients (end users) for prescription form
 * @summary Get all end users for patient selection in prescription form
 * @link /prescription/patients
 */
export async function getPrescriptionPatients(
  params?: GetPrescriptionPatientsQueryParams,
  options: Partial<Parameters<typeof client>[0]> = {},
): Promise<ResponseConfig<GetPrescriptionPatientsQueryResponse>> {
  const res = await client<GetPrescriptionPatientsQueryResponse>({
    method: "get",
    url: `/prescription/patients`,
    params,
    ...options,
  });
  return res;
}
