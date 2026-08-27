import PermissionGuard from "@/components/guards/PermissionGuard";
import type { TableBodyProps } from "./table.types";

export function TableBody<T>({
    columns,
    data,
    rowKey,
    onView,
    onEdit,
    onDelete,
    rowActions,
    actionsHeader = "Actions",

}: TableBodyProps<T>) {
    const hasActions =
        !!onView ||
        !!onEdit ||
        !!onDelete ||
        !!rowActions?.length;

    return (
        <div className="overflow-x-auto rounded-md border border-gray-200">
            <table className="w-full border-collapse">
                <thead className="bg-gray-50">
                    <tr>
                        {columns.map((column) => (
                            <th
                                key={column.key}
                                className={`
                                    px-4
                                    py-3
                                    text-left
                                    text-xs
                                    font-semibold
                                    uppercase
                                    tracking-wide
                                    text-gray-600
                                    ${column.headerClassName ?? ""}
                                `}
                            >
                                {column.header}
                            </th>
                        ))}

                        {hasActions && (
                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">
                                {actionsHeader}
                            </th>
                        )}
                    </tr>
                </thead>

                <tbody className="divide-y divide-gray-100 bg-white">
                    {data.map((row, index) => (
                        <tr
                            key={
                                rowKey
                                    ? rowKey(row)
                                    : index
                            }
                            className="hover:bg-gray-50"
                        >
                            {columns.map(
                                (column) => (
                                    <td
                                        key={column.key}
                                        className={`
                                            px-4
                                            py-3
                                            text-sm
                                            text-gray-700
                                            ${column.className ?? ""}
                                        `}
                                    >
                                        {column.render(
                                            row
                                        )}
                                    </td>
                                )
                            )}

                            {hasActions && (
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-2">
                                        {onView && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    onView(
                                                        row
                                                    )
                                                }
                                                className="text-sm text-blue-600 hover:underline"
                                            >
                                                View
                                            </button>
                                        )}

                                        {onEdit && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    onEdit(
                                                        row
                                                    )
                                                }
                                                className="text-sm text-amber-600 hover:underline"
                                            >
                                                Edit
                                            </button>
                                        )}

                                        {onDelete && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    onDelete(
                                                        row
                                                    )
                                                }
                                                className="text-sm text-red-600 hover:underline"
                                            >
                                                Delete
                                            </button>
                                        )}

                                        {rowActions?.map((action) => {
                                            if (action.hidden?.(row)) {
                                                return null;
                                            }

                                            const button = (
                                                <button
                                                    key={action.key}
                                                    type="button"
                                                    disabled={action.disabled?.(row)}
                                                    onClick={() => action.onClick(row)}
                                                    className={
                                                        action.className ??
                                                        "flex items-center gap-1 text-sm text-gray-900 hover:underline disabled:cursor-not-allowed disabled:opacity-50"
                                                    }
                                                >
                                                    {action.icon}
                                                    {action.label}
                                                </button>
                                            );

                                            if (!action.permission) {
                                                return button;
                                            }

                                            return (
                                                <PermissionGuard
                                                    key={action.key}
                                                    permissions={[action.permission]}
                                                >
                                                    {button}
                                                </PermissionGuard>
                                            );
                                        })}
                                    </div>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}