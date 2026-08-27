import type { TablePaginationProps } from "./table.types";

export function TablePagination({
    pagination,
    onPageChange,
}: TablePaginationProps) {
    if (!pagination) {
        return null;
    }

    const { page, totalPages, total, limit } = pagination;

    const canGoPrevious = page > 1;
    const canGoNext = page < totalPages;

    const start = total === 0 ? 0 : (page - 1) * limit + 1;
    const end = Math.min(page * limit, total);

    const pages = Array.from(
        { length: totalPages },
        (_, index) => index + 1
    ).filter((pageNumber) => {
        if (pageNumber === 1 || pageNumber === totalPages) {
            return true;
        }

        if (Math.abs(pageNumber - page) <= 1) {
            return true;
        }

        if (
            pageNumber === page - 2 ||
            pageNumber === page + 2
        ) {
            return true;
        }

        return false;
    });

    return (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            {/* Information */}
            <p className="text-sm text-gray-500">
                Showing{" "}
                <strong className="text-gray-700">
                    {start} - {end}
                </strong>{" "}
                of {total} entries
            </p>

            {/* Pagination */}
            <div className="flex items-center gap-1">
                <button
                    type="button"
                    disabled={!canGoPrevious}
                    onClick={() => onPageChange(page - 1)}
                    className="
                        rounded-md
                        border border-gray-300
                        px-3 py-2
                        text-sm text-gray-700
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                    "
                >
                    Previous
                </button>

                {pages.map((pageNumber, index) => {
                    const previousPage = pages[index - 1];

                    const showEllipsis =
                        previousPage !== undefined &&
                        pageNumber - previousPage > 1;

                    return (
                        <div
                            key={pageNumber}
                            className="flex items-center gap-1"
                        >
                            {showEllipsis && (
                                <span className="px-2 text-gray-500">
                                    ...
                                </span>
                            )}

                            <button
                                type="button"
                                onClick={() =>
                                    onPageChange(pageNumber)
                                }
                                className={`
                                    rounded-md
                                    border
                                    px-3 py-2
                                    text-sm
                                    ${pageNumber === page
                                        ? "border-gray-900 bg-gray-900 text-white"
                                        : "border-gray-300 text-gray-700"
                                    }
                                `}
                            >
                                {pageNumber}
                            </button>
                        </div>
                    );
                })}

                <button
                    type="button"
                    disabled={!canGoNext}
                    onClick={() => onPageChange(page + 1)}
                    className="
                        rounded-md
                        border border-gray-300
                        px-3 py-2
                        text-sm text-gray-700
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                    "
                >
                    Next
                </button>
            </div>
        </div>
    );
}