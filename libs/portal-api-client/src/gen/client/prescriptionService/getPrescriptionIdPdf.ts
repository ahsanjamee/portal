import client from "@/client";
import type { ResponseConfig } from "@/client";
import type {
  GetPrescriptionIdPdfQueryResponse,
  GetPrescriptionIdPdfPathParams,
} from "../../types/GetPrescriptionIdPdf";

/**
 * @description Download prescription as PDF
 * @summary Download prescription as PDF (Admin only - own prescriptions)
 * @link /prescription/:id/pdf
 */
export async function getPrescriptionIdPdf(
  id: GetPrescriptionIdPdfPathParams["id"],
  options: Partial<Parameters<typeof client>[0]> = {},
): Promise<ResponseConfig<GetPrescriptionIdPdfQueryResponse>> {
  const res = await client<GetPrescriptionIdPdfQueryResponse>({
    method: "get",
    url: `/prescription/${id}/pdf`,
    ...options,
  });
  return res;
}
