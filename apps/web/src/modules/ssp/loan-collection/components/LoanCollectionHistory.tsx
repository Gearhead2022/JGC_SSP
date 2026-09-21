"use client";

import { Button } from "@/components/ui/button";
import type {
    LoanCollectionHistoryItem,
} from "@repo/shared";
import { CircleAlertIcon, CircleCheckIcon, CircleChevronDown, CircleDashedIcon, CircleUser } from "lucide-react";

type LoanCollectionHistoryProps = {
    collections: LoanCollectionHistoryItem[];
    isLoading?: boolean;
    onPost?: (id: string) => void;
};

export default function LoanCollectionHistory({
    collections,
    isLoading = false,
    onPost
}: LoanCollectionHistoryProps) {
    return (
        <>
            <div className="rounded-lg border border-gray-200 bg-white">
                <div className="border-b border-gray-200 px-5 py-4">
                    <h2 className="text-base font-semibold text-gray-900">
                        Collection History
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        Posted loan collection transactions.
                    </p>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                            <tr className="border-b border-gray-200">
                                <th className="px-4 py-3 text-left font-medium text-gray-600">
                                    Status
                                </th>
                                <th className="px-4 py-3 text-left font-medium text-gray-600">
                                    Collection Month
                                </th>

                                <th className="px-4 py-3 text-right font-medium text-gray-600">
                                    Beginning Balance
                                </th>

                                <th className="px-4 py-3 text-right font-medium text-gray-600">
                                    Collection
                                </th>

                                <th className="px-4 py-3 text-right font-medium text-gray-600">
                                    Ending Balance
                                </th>

                                <th className="px-4 py-3 text-left font-medium text-gray-600">
                                    Remarks
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="px-4 py-8 text-center text-gray-500"
                                    >
                                        Loading collection history...
                                    </td>
                                </tr>
                            ) : collections.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="px-4 py-8 text-center text-gray-500"
                                    >
                                        No collections posted yet.
                                    </td>
                                </tr>
                            ) : (
                                collections.map((collection) => (
                                    <tr
                                        key={collection.id}
                                        className={`border-b border-gray-100 last:border-b-0 ${collection.status === 'POSTED' ? 'bg-green-900/5' : ''}`}
                                    >
                                        <td className="px-4 py-3 text-gray-900">
                                            {collection.status === 'POSTED' ? <CircleCheckIcon className="h-5 w-5 text-green-600" /> : <CircleDashedIcon className="h-5 w-5 text-yellow-600" />}
                                        </td>
                                        <td className="px-4 py-3 text-gray-900">
                                            {formatMonthYear(
                                                collection.collectionDate
                                            )}
                                        </td>

                                        <td className="px-4 py-3 text-right text-gray-900">
                                            {formatCurrency(
                                                collection.beginningBalance
                                            )}
                                        </td>

                                        <td className="px-4 py-3 text-right font-medium text-gray-900">
                                            {formatCurrency(
                                                collection.amount
                                            )}
                                        </td>

                                        <td className="px-4 py-3 text-right text-gray-900">
                                            {formatCurrency(
                                                collection.endingBalance
                                            )}
                                        </td>

                                        <td className="px-4 py-3 text-gray-500">
                                            {collection.remarks || "—"}
                                        </td>

                                        <td>
                                            {collection.status === "PENDING" && onPost && (
                                                <Button
                                                    type="button"
                                                    onClick={() =>
                                                        onPost?.(collection.id)
                                                    }
                                                >
                                                    Post
                                                </Button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white">
                <div className="bg-blue-900/20 p-5">
                    <div className="flex items-center gap-4 text-black">
                        <span className="fs-sm">LEGEND:</span>

                        <span className="flex items-center gap-1">
                            <CircleCheckIcon className="h-5 w-5 text-green-600" />
                            <span className="text-sm">POSTED</span>
                        </span>

                        <span className="flex items-center gap-1">
                            <CircleDashedIcon className="h-5 w-5 text-yellow-600" />
                            <span className="text-sm">PENDING</span>
                        </span>

                        <span className="flex items-center gap-1">
                            <CircleAlertIcon className="h-5 w-5 text-red-600" />
                            <span className="text-sm">CANCELED</span>
                        </span>
                    </div>
                </div>
            </div>
        </>
    );
}

function formatCurrency(
    value: number
): string {
    return new Intl.NumberFormat("en-PH", {
        style: "currency",
        currency: "PHP",
        minimumFractionDigits: 2,
    }).format(value);
}

function formatMonthYear(
    value: string
): string {
    return new Date(value).toLocaleDateString(
        "en-PH",
        {
            month: "long",
            year: "numeric",
        }
    );
}