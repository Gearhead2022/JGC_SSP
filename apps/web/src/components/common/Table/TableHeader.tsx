import type { ReactNode } from "react";

import { RowsPerPageSelector } from "./RowsPerPageSelector";

type TableHeaderProps = {
    title?: string;
    description?: string;

    search?: string;
    searchPlaceholder?: string;
    onSearchChange?: (value: string) => void;

    limit?: number;
    limitOptions?: number[];
    onLimitChange?: (value: number) => void;

    filters?: ReactNode;
    actions?: ReactNode;
};

export function TableHeader({
    title,
    description,

    search,
    searchPlaceholder = "Search...",
    onSearchChange,

    limit,
    limitOptions = [10, 25, 50, 100],
    onLimitChange,

    filters,
    actions,

}: TableHeaderProps) {

    return (
        <div className="space-y-4">
            {(title || description) && (
                <div>
                    {title && (
                        <h2 className="text-lg font-semibold text-gray-900">
                            {title}
                        </h2>
                    )}

                    {description && (
                        <p className="mt-1 text-sm text-gray-500">
                            {description}
                        </p>
                    )}
                </div>
            )}

            <div className="flex flex-wrap items-center gap-3">
                {limit !== undefined && onLimitChange && (
                    <div className="flex items-center text-sm text-gray-600">
                        <span className="mr-2">
                            Show
                        </span>

                        <RowsPerPageSelector
                            rowsPerPage={limit}
                            options={limitOptions}
                            setRowsPerPage={(value: number) => {
                                onLimitChange(value);
                            }}
                        />

                        <span className="ml-2">
                            Entries
                        </span>
                    </div>
                )}

                {onSearchChange && (
                    <div className="flex items-center text-sm text-gray-600">
                        <span className="mr-2">
                            Search
                        </span>
                        <input
                            type="search"
                            name="table-search"
                            value={search ?? ""}
                            placeholder={searchPlaceholder}
                            autoComplete="off"
                            onChange={(event) => onSearchChange(event.target.value)}
                            className="w-full max-w-xs rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900"
                        />
                    </div>
                )}

                {filters && (
                    <div className="flex items-center gap-2">
                        {filters}
                    </div>
                )}

                {actions && (
                    <div className="ml-auto flex items-center gap-2 bg-red-900">
                        {actions}
                    </div>
                )}
            </div>
        </div>
    );
}