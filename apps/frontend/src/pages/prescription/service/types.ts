import type {
    PrescriptionResponseDto,
    PrescriptionListResponseDto,
    CreatePrescriptionDto,
    UpdatePrescriptionDto,
    PrescriptionQueryDto,
    PatientInfoResponseDto,
    PaginatedDtoPrescriptionListResponseDto,
    PaginatedDtoPatientInfoResponseDto,
} from '@portal/portal-api-client';

// Re-export commonly used types for convenience
export type Prescription = PrescriptionResponseDto;
export type PrescriptionList = PrescriptionListResponseDto;
export type CreatePrescription = CreatePrescriptionDto;
export type UpdatePrescription = UpdatePrescriptionDto;
export type PrescriptionQuery = PrescriptionQueryDto;
export type PatientInfo = PatientInfoResponseDto;
export type PaginatedPrescriptions = PaginatedDtoPrescriptionListResponseDto;
export type PaginatedPatients = PaginatedDtoPatientInfoResponseDto;

// Additional utility types for UI components
export type PrescriptionFormData = CreatePrescriptionDto;
export type PrescriptionUpdateData = UpdatePrescriptionDto;

// Filter and sort options
export type PrescriptionSortField = 'createdAt' | 'updatedAt' | 'prescriptionDate' | 'patientNumber';
export type PrescriptionSortOrder = 'asc' | 'desc';

export interface PrescriptionFilters {
    patientId?: string;
    doctorId?: string;
    animalType?: string;
    dateFrom?: string;
    dateTo?: string;
    search?: string;
}

export interface PrescriptionTableColumn {
    key: string;
    label: string;
    sortable: boolean;
    width?: string;
}

// Status types for UI states
export type PrescriptionStatus = 'draft' | 'completed' | 'cancelled';

// PDF generation options
export interface PdfGenerationOptions {
    format?: 'A4' | 'Letter';
    orientation?: 'portrait' | 'landscape';
    includeSignature?: boolean;
} 