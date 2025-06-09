import { useTranslate } from '@/translations/provider';
import { ActionIcon, Group, Tooltip } from '@mantine/core';
import { ArrowLeft, ArrowRight, CaretUpDown } from '@phosphor-icons/react';
import {
    MantineReactTable,
    MRT_RowData,
    MRT_TableInstance,
    useMantineReactTable,
    type MRT_ColumnFilterFnsState,
    type MRT_ColumnFiltersState,
    type MRT_PaginationState,
    type MRT_SortingState,
} from 'mantine-react-table';
import { RiRefreshLine } from 'react-icons/ri';
// import { MRT_Localization_EN } from 'mantine-react-table/locales/en/index.cjs';
// import { MRT_Localization_NO } from 'mantine-react-table/locales/no/index.cjs';
type IPaginatedTableProps = {
    data: any;
    columns: any;
    error?: any;
    totalRowCount?: number;
    columnFilters?: MRT_ColumnFiltersState;
    setColumnFilters?: React.Dispatch<React.SetStateAction<MRT_ColumnFiltersState>>;
    columnFilterFns?: MRT_ColumnFilterFnsState;
    setColumnFilterFns?: React.Dispatch<React.SetStateAction<MRT_ColumnFilterFnsState>>;
    globalFilter?: string;
    setGlobalFilter?: React.Dispatch<React.SetStateAction<string>>;
    sorting?: MRT_SortingState;
    setSorting?: React.Dispatch<React.SetStateAction<MRT_SortingState>>;
    pagination?: MRT_PaginationState;
    setPagination?: React.Dispatch<React.SetStateAction<MRT_PaginationState>>;
    isLoading?: boolean;
    isFetching?: boolean;
    refetch?: () => void;
    enableRowActions: boolean;
    renderRowActions?: (row: any) => React.ReactNode;
    positionActionsColumn?: 'first' | 'last';
    tableName: string;
    enableExpanding?: boolean;
    getSubRows?: any;
    enablePagination?: boolean;
    enableGlobalFilter?: boolean;
    renderDetailPanel?: any;
    mantineTableBodyRowProps?: any;
    enableTopToolbar?: boolean;
    enableBottomToolbar?: boolean;
    enableSorting?: boolean;
    otherInitialStates?: any;
    editDisplayMode?: 'table' | 'cell';
    enableEditing?: boolean;
    mantineEditTextInputProps?: any;
    mantineTableBodyCellProps?: any;
    renderTopToolbarCustomActions?: ((props: { table: MRT_TableInstance<MRT_RowData> }) => React.ReactNode) | undefined;
};

const PaginatedTable: React.FC<IPaginatedTableProps> = ({ data, error, columns, ...props }) => {
    const t = useTranslate();
    const table = useMantineReactTable({
        columns,
        data: data ?? [],
        enableColumnFilterModes: false,
        columnFilterModeOptions: ['contains', 'startsWith', 'endsWith'],
        initialState: { showColumnFilters: false, showGlobalFilter: true, ...props.otherInitialStates },
        enableColumnActions: false,
        enableColumnFilters: false,
        manualFiltering: true,
        manualPagination: true,
        manualSorting: false,
        // enableFullScreenToggle: false,
        // enableDensityToggle: false,
        // enableHiding: false,
        mantineToolbarAlertBannerProps: error
            ? {
                  color: 'red',
                  children: 'Error loading data',
              }
            : undefined,
        renderTopToolbarCustomActions: () => (
            <Group>
                <Tooltip label={t('Refresh Data')}>
                    <ActionIcon variant="transparent" color="black" onClick={() => props.refetch?.()}>
                        <RiRefreshLine className="w-6 h-6 " />
                    </ActionIcon>
                </Tooltip>
                {/* Custom Actions on top toolbar */}
                {props.renderTopToolbarCustomActions?.({ table })}
            </Group>
        ),
        onColumnFilterFnsChange: props.setColumnFilterFns,
        onColumnFiltersChange: props.setColumnFilters,
        onGlobalFilterChange: props.setGlobalFilter,
        onPaginationChange: props.setPagination,
        onSortingChange: props.setSorting,
        getRowId: (row) => row?.id,
        getSubRows: props.getSubRows,
        enableExpanding: props.enableExpanding,
        renderDetailPanel: props.renderDetailPanel,
        enableGlobalFilter: props.enableGlobalFilter,
        rowCount: props.totalRowCount,
        state: {
            columnFilterFns: props.columnFilterFns ?? {},
            // columnFilters: props.columnFilters,
            columnFilters: props.columnFilters ?? [],
            globalFilter: props.globalFilter,
            showSkeletons: props.isLoading,
            pagination: props.pagination,
            showAlertBanner: error,
            // showProgressBars: props.isFetching,
            sorting: props.sorting,
        },
        enableRowActions: props.enableRowActions,
        renderRowActions: props.renderRowActions,
        enablePagination: props.enablePagination,
        positionActionsColumn: props.positionActionsColumn,
        mantineTableBodyRowProps: props.mantineTableBodyRowProps,
        mantineTableBodyCellProps: props.mantineTableBodyCellProps,
        // localization: language === 'en' ? MRT_Localization_EN : MRT_Localization_NO,
        enableTopToolbar: props.enableTopToolbar,
        enableBottomToolbar: props.enableBottomToolbar,
        enableSorting: props.enableSorting,
        enableEditing: props.enableEditing,
        mantineEditTextInputProps: props.mantineEditTextInputProps,
        editDisplayMode: props.editDisplayMode,
        paginationDisplayMode: 'pages',
        enableStickyHeader: true,
        // positionGlobalFilter: 'left',
        icons: {
            IconArrowsSort: () => <CaretUpDown size={16} color="#667085" weight="bold" />,
        },
        mantinePaginationProps: {
            showRowsPerPage: false,
            previousIcon: () => <ArrowLeft size={16} color="#1D2939" weight="bold" />,
            nextIcon: () => <ArrowRight size={16} color="#1D2939" weight="bold" />,
        },
    });

    return <MantineReactTable table={table} />;
};

export default PaginatedTable;
