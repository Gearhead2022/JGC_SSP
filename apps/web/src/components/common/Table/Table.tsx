import { TableBody } from "./TableBody";
import { TableEmpty } from "./TableEmpty";
import { TableHeader } from "./TableHeader";
import { TableLoading } from "./TableLoading";
import { TablePagination } from "./TablePagination";
import type { TableProps } from "./table.types";

export function Table<T>({
    title,
    description,

    search,
    searchPlaceholder,
    onSearchChange,

    limit,
    limitOptions,
    onLimitChange,

    filters,
    actions,

    columns,
    data,
    rowKey,

    isLoading = false,
    emptyMessage = "No records found.",

    onView,
    onEdit,
    onDelete,

    rowActions,

    actionsHeader,

    pagination,
    onPageChange,
}: TableProps<T>) {

    return (
        <div className="space-y-4 bg-white">
            <TableHeader
                title={title}
                description={description}

                search={search}
                searchPlaceholder={searchPlaceholder}
                onSearchChange={onSearchChange}

                limit={limit}
                limitOptions={limitOptions}
                onLimitChange={onLimitChange}

                filters={filters}
                actions={actions}
            />

            {isLoading ? (
                <TableLoading
                    columns={
                        columns.length +
                        (onView ||
                            onEdit ||
                            onDelete
                            ? 1
                            : 0)
                    }
                />
            ) : data.length === 0 ? (
                <TableEmpty
                    message={emptyMessage}
                />
            ) : (
                <TableBody
                    columns={columns}
                    data={data}
                    rowKey={rowKey}
                    onView={onView}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    rowActions={rowActions}
                    actionsHeader={
                        actionsHeader
                    }
                />
            )}

            {pagination && (
                <TablePagination
                    pagination={pagination}
                    onPageChange={onPageChange}
                />
            )}
        </div>
    );
}