import { Button } from "@/components/ui/button";
import PaginatedTable from "@/components/ui/Table/PaginatedTable";
import { useSetTitle } from "@/stores/title-context";
import {
  Badge,
  Group,
  Stack,
  Text,
  Select,
  Card,
  SimpleGrid,
  Loader,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import {
  ChartBar,
  CheckCircle,
  XCircle,
  DeviceMobile,
  BellRinging,
  Users,
} from "@phosphor-icons/react";
import dayjs from "dayjs";
import {
  type MRT_ColumnDef,
  type MRT_PaginationState,
  type MRT_SortingState,
} from "mantine-react-table";
import { useMemo, useState } from "react";
import { smsStatsService } from "./services/sms-stats.service";

interface SmsRecord {
  id: string;
  companyName: string;
  recipientNumber: string;
  message: string;
  messageType: string;
  status: string;
  provider: string;
  errorMessage?: string;
  createdAt: string;
}

export const SmsStatsIndex = () => {
  const [sorting, setSorting] = useState<MRT_SortingState>([]);
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [search, setSearch] = useState<string>("");
  const [messageType, setMessageType] = useState<string>("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  useSetTitle("SMS Statistics");

  const queryParams = {
    page: pagination.pageIndex + 1,
    pageSize: pagination.pageSize,
    sortBy: sorting.length ? (sorting[0]?.id as string) : "createdAt",
    sort: (sorting.length ? (sorting[0]?.desc ? "desc" : "asc") : "desc") as
      | "asc"
      | "desc",
    search,
    messageType: messageType || undefined,
    startDate: startDate ? startDate.toISOString() : undefined,
    endDate: endDate ? endDate.toISOString() : undefined,
  };

  const summaryParams = {
    startDate: startDate ? startDate.toISOString() : undefined,
    endDate: endDate ? endDate.toISOString() : undefined,
  };

  const { data, isLoading, error, isFetching, refetch } =
    smsStatsService.useGetSmsStats(queryParams, {
      queryKey: ["super-admin", "sms-stats", queryParams],
    });

  const { data: summaryData, isLoading: summaryLoading } =
    smsStatsService.useGetSmsStatsSummary(summaryParams, {
      queryKey: ["super-admin", "sms-stats", "summary", summaryParams],
    });

  const clearFilters = () => {
    setSearch("");
    setMessageType("");
    setStartDate(null);
    setEndDate(null);
  };

  const columns = useMemo<MRT_ColumnDef<SmsRecord>[]>(
    () => [
      {
        accessorKey: "recipientNumber",
        header: "Recipient",
        maxSize: 200,
        size: 150,
        Cell: ({ row }) => (
          <Text className="block text-sm leading-5 text-[#1D2823] font-mono">
            {row.original.recipientNumber}
          </Text>
        ),
      },
      {
        accessorKey: "message",
        header: "Message",
        maxSize: 300,
        size: 250,
        Cell: ({ row }) => (
          <Text
            className="block text-sm leading-5 text-[#1D2823]"
            lineClamp={2}
          >
            {row.original.message}
          </Text>
        ),
        enableSorting: false,
      },
      {
        accessorKey: "messageType",
        header: "Type",
        maxSize: 150,
        size: 120,
        Cell: ({ row }) => {
          const type = row.original.messageType;
          const getTypeColor = (type: string) => {
            switch (type) {
              case "OTP":
                return "blue";
              case "ADMIN_NOTIFICATION":
                return "green";
              case "END_USER_NOTIFICATION":
                return "orange";
              case "OTHER":
                return "other";
              default:
                return "gray";
            }
          };

          const getDisplayName = (type: string) => {
            switch (type) {
              case "OTP":
                return "OTP";
              case "ADMIN_NOTIFICATION":
                return "Service Provider";
              case "END_USER_NOTIFICATION":
                return "Farmer";
              case "OTHER":
                return "other";
              default:
                return type;
            }
          };

          return (
            <Badge variant="light" color={getTypeColor(type)} size="sm">
              {getDisplayName(type)}
            </Badge>
          );
        },
      },
      {
        accessorKey: "status",
        header: "Status",
        maxSize: 100,
        size: 80,
        Cell: ({ row }) => (
          <Badge
            variant="light"
            color={row.original.status === "SUCCESS" ? "green" : "red"}
            size="sm"
          >
            {row.original.status}
          </Badge>
        ),
      },
      {
        accessorKey: "provider",
        header: "Provider",
        maxSize: 120,
        size: 100,
        Cell: ({ row }) => (
          <Text className="block text-sm leading-5 text-[#1D2823]">
            {row.original.provider}
          </Text>
        ),
      },
      {
        accessorKey: "createdAt",
        header: "Sent At",
        Cell: ({ cell }) =>
          dayjs(cell.getValue() as string).format("MMM D, YYYY HH:mm"),
      },
    ],
    []
  );

  const renderSummaryCards = () => {
    if (summaryLoading) {
      return (
        <Card className="p-6">
          <Group justify="center">
            <Loader size="sm" />
            <Text>Loading summary...</Text>
          </Group>
        </Card>
      );
    }

    if (!summaryData) return null;

    const cards = [
      {
        title: "Total SMS",
        value: summaryData.total?.toLocaleString() || "0",
        icon: ChartBar,
        color: "blue",
      },
      {
        title: "Success Rate",
        value: `${summaryData.successRate || 0}%`,
        icon: CheckCircle,
        color: "green",
      },
      {
        title: "Failed SMS",
        value: summaryData.failed?.toLocaleString() || "0",
        icon: XCircle,
        color: "red",
      },
      {
        title: "OTP Messages",
        value: summaryData.otpCount?.toLocaleString() || "0",
        icon: DeviceMobile,
        color: "blue",
      },
      {
        title: "Admin Notifications",
        value: summaryData.adminNotificationCount?.toLocaleString() || "0",
        icon: BellRinging,
        color: "green",
      },
      {
        title: "User Notifications",
        value: summaryData.endUserNotificationCount?.toLocaleString() || "0",
        icon: Users,
        color: "orange",
      },
    ];

    return (
      <SimpleGrid cols={{ base: 1, sm: 2, md: 4, lg: 6 }} className="mb-6">
        {cards.map((card, index) => (
          <Card key={index} className="p-4 text-center">
            <Group justify="center" className="mb-2">
              <card.icon
                size={24}
                color={`var(--mantine-color-${card.color}-6)`}
              />
            </Group>
            <Text size="xl" fw={700} className="mb-1">
              {card.value}
            </Text>
            <Text size="sm" c="dimmed">
              {card.title}
            </Text>
          </Card>
        ))}
      </SimpleGrid>
    );
  };

  return (
    <>
      <Group justify="space-between" className="mb-4">
        <Stack gap={0}>
          <Text fz={"32px"} fw={600} c={"#062E26"}>
            SMS Statistics
          </Text>
          <Text c={"#3E4945"} fz={"14px"} fw={500}>
            Monitor SMS delivery and performance metrics
          </Text>
        </Stack>
      </Group>

      {renderSummaryCards()}

      <Group className="mb-4" gap="md">
        <DateInput
          placeholder="Start date"
          value={startDate}
          onChange={setStartDate}
          clearable
          maxDate={new Date()}
          w={180}
        />
        <DateInput
          placeholder="End date"
          value={endDate}
          onChange={setEndDate}
          clearable
          maxDate={new Date()}
          w={180}
        />
        <Select
          placeholder="Filter by message type"
          value={messageType}
          onChange={(value) => setMessageType(value || "")}
          data={[
            { value: "", label: "All Types" },
            { value: "OTP", label: "OTP" },
            { value: "ADMIN_NOTIFICATION", label: "Admin Notifications" },
            { value: "END_USER_NOTIFICATION", label: "End User Notifications" },
            { value: "OTHER", label: "Other Messages" },
          ]}
          clearable
          w={200}
        />
        <Button variant="outline" onClick={clearFilters} size="sm">
          Clear Filters
        </Button>
      </Group>

      <PaginatedTable
        columns={columns}
        data={data?.items ?? []}
        totalRowCount={data?.pagination?.total ?? 0}
        sorting={sorting}
        setSorting={setSorting}
        pagination={pagination}
        setPagination={setPagination}
        isLoading={isLoading}
        error={error}
        isFetching={isFetching}
        refetch={refetch}
        tableName="SMS Records"
        globalFilter={search}
        setGlobalFilter={setSearch}
        enableRowActions={false}
      />
    </>
  );
};
