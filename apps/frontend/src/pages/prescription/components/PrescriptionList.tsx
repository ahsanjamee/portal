import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PaginatedTable from "@/components/ui/Table/PaginatedTable";
import { DownloadIcon, PencilIcon, TrashIcon } from "@phosphor-icons/react";
import { format } from "date-fns";
import { MRT_ColumnDef } from "mantine-react-table";
import React from "react";
import { RiLoader2Line } from "react-icons/ri";

interface PrescriptionListItem {
  id: string;
  reference: string;
  doctorName: string;
  patientName: string;
  animalType: string;
  consultancyFee?: number;
  date: string;
  followUpDate?: string;
  createdAt: string;
}

interface PrescriptionListProps {
  data: PrescriptionListItem[];
  loading?: boolean;
  error?: any;
  totalRowCount?: number;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onDownload?: (id: string) => void;
  onRefresh?: () => void;
  // Pagination props
  columnFilters?: any;
  setColumnFilters?: any;
  globalFilter?: string;
  setGlobalFilter?: any;
  sorting?: any;
  setSorting?: any;
  pagination?: any;
  setPagination?: any;
  prescriptionDownloadId?: string;
  prescriptionDownloadLoading?: boolean;
}

export const PrescriptionList: React.FC<PrescriptionListProps> = ({
  data,
  loading = false,
  error,
  totalRowCount = 0,
  onEdit,
  onDelete,
  onDownload,
  onRefresh,
  columnFilters,
  setColumnFilters,
  globalFilter,
  setGlobalFilter,
  sorting,
  setSorting,
  pagination,
  setPagination,
  prescriptionDownloadId,
  prescriptionDownloadLoading,
}) => {
  const columns: MRT_ColumnDef<PrescriptionListItem>[] = [
    {
      accessorKey: "reference",
      header: "Reference",
      size: 120,
      Cell: ({ cell }) => (
        <Badge variant="outline" className="font-mono">
          {cell.getValue<string>()}
        </Badge>
      ),
    },
    {
      accessorKey: "patientName",
      header: "Patient Name",
      size: 150,
    },
    {
      accessorKey: "animalType",
      header: "Animal Type",
      size: 120,
      Cell: ({ cell }) => (
        <Badge variant="secondary">{cell.getValue<string>()}</Badge>
      ),
    },
    {
      accessorKey: "doctorName",
      header: "Doctor",
      size: 150,
    },
    {
      accessorKey: "consultancyFee",
      header: "Fee (Tk)",
      size: 100,
      Cell: ({ cell }) => {
        const fee = cell.getValue<number>();
        return fee ? `৳${fee.toLocaleString()}` : "-";
      },
    },
    {
      accessorKey: "date",
      header: "Date",
      size: 120,
      Cell: ({ cell }) => {
        const date = cell.getValue<string>();
        return format(new Date(date), "dd/MM/yyyy");
      },
    },
    {
      accessorKey: "followUpDate",
      header: "Follow-up",
      size: 120,
      Cell: ({ cell }) => {
        const date = cell.getValue<string>();
        return date ? format(new Date(date), "dd/MM/yyyy") : "-";
      },
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      size: 120,
      Cell: ({ cell }) => {
        const date = cell.getValue<string>();
        return format(new Date(date), "dd/MM/yyyy");
      },
    },
  ];

  const renderRowActions = (row: any) => {
    const prescription = row.row.original as PrescriptionListItem;

    return (
      <div className="flex items-center gap-2">
        {onDownload && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDownload(prescription.id)}
            title="Download PDF"
          >
            {prescriptionDownloadLoading &&
            prescriptionDownloadId === prescription.id ? (
              <RiLoader2Line size={16} className="animate-spin" />
            ) : (
              <DownloadIcon size={16} />
            )}
          </Button>
        )}

        {onEdit && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(prescription.id)}
            title="Edit Prescription"
          >
            <PencilIcon size={16} />
          </Button>
        )}

        {onDelete && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(prescription.id)}
            title="Delete Prescription"
            className="text-red-600 hover:text-red-700"
          >
            <TrashIcon size={16} />
          </Button>
        )}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Prescriptions</CardTitle>
      </CardHeader>
      <CardContent>
        <PaginatedTable
          data={data}
          columns={columns}
          error={error}
          totalRowCount={totalRowCount}
          isLoading={loading}
          isFetching={loading}
          refetch={onRefresh}
          enableRowActions={true}
          renderRowActions={renderRowActions}
          positionActionsColumn="last"
          tableName="prescriptions"
          enablePagination={true}
          enableGlobalFilter={true}
          enableSorting={true}
          enableTopToolbar={true}
          enableBottomToolbar={true}
          columnFilters={columnFilters}
          setColumnFilters={setColumnFilters}
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
          sorting={sorting}
          setSorting={setSorting}
          pagination={pagination}
          setPagination={setPagination}
        />
      </CardContent>
    </Card>
  );
};
