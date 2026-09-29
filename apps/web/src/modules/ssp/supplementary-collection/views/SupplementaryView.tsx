"use client";

import {
    formatCurrency,
    Pensioner,
    SupplementaryLoanCollection,
} from "@repo/shared";

import { WalletCards } from "lucide-react";
import { useState } from "react";

import { useActiveLoanCollection } from "../../loan-collection/hooks/useLoanCollection";

import {
    usePostSupplementaryCollection,
    useSupplementaryByPensionerIdAndAccountNo,
} from "../hooks/useSupplementaryCollection";

import PensionerSearch from "../../comp-slip/components/PensionerSearch";

import { Label } from "@/components/ui/label";
import { formatMonthYear } from "@/utils/format-date";
import { AppToast } from "@/lib/toast";

export default function SupplementaryCollectionView() {
    const [
        selectedPensioner,
        setSelectedPensioner,
    ] = useState<Pensioner | null>(null);

    const [
        selectedAccountNumber,
        setSelectedAccountNumber,
    ] = useState<string>("");

    /**
     * Active loan accounts belonging to pensioner.
     */
    const {
        data: activeLoansList,
        isLoading: isActiveLoansLoading,
    } = useActiveLoanCollection(
        selectedPensioner?.id
    );

    const activeLoans =
        activeLoansList?.data ?? [];

    /**
     * Supplementary collection history
     * for selected loan account.
     */
    const {
        data,
        isLoading,
        isError,
    } =
        useSupplementaryByPensionerIdAndAccountNo(
            selectedPensioner?.id,
            selectedAccountNumber
        );

    const supplementaryCollections:
        SupplementaryLoanCollection[] =
        data?.data ?? [];

    /**
     * Assuming backend returns newest first.
     *
     * If backend currently orders oldest first,
     * reverse the repository ordering instead.
     */
    const latestCollection =
        supplementaryCollections[0] ?? null;

    /**
     * Current loan information can also
     * come from activeLoans.
     */
    const selectedLoan =
        activeLoans.find(
            (loan) =>
                loan.accountNumber ===
                selectedAccountNumber
        );

    const { mutateAsync: postCollection, isPending: isPosting } = usePostSupplementaryCollection(selectedPensioner?.id, selectedAccountNumber);


    async function handlePostCollection(
        collectionId: string
    ) {
        try {
            await postCollection(
                collectionId
            );

            AppToast.success(
                "Supplementary collection posted successfully."
            );
        } catch (error) {
            AppToast.error(
                "Failed to post collection."
            );
        }
    }

    return (
        <div className="space-y-6">
            {/* HEADER */}
            <div>
                <div className="flex items-center gap-2">
                    <WalletCards className="h-5 w-5 text-gray-600" />

                    <h1 className="text-2xl font-semibold text-gray-900">
                        Supplementary Loan Collection
                    </h1>
                </div>

                <p className="mt-1 text-sm text-gray-500">
                    View supplementary loan balances,
                    charges, and collection history.
                </p>
            </div>

            {/* PENSIONER SEARCH */}
            <div className="rounded-lg border border-gray-200 bg-white p-5">
                <PensionerSearch
                    onSelect={(pensioner) => {
                        setSelectedPensioner(
                            pensioner
                        );

                        setSelectedAccountNumber(
                            ""
                        );
                    }}
                />
            </div>

            {/* ACCOUNT SELECT */}
            {selectedPensioner && (
                <div className="rounded-lg border border-gray-200 bg-white p-5">
                    <Label className="text-sm font-medium text-gray-700">
                        Loan Account
                    </Label>

                    <select
                        value={
                            selectedAccountNumber
                        }
                        onChange={(event) =>
                            setSelectedAccountNumber(
                                event.target.value
                            )
                        }
                        disabled={
                            isActiveLoansLoading ||
                            activeLoans.length === 0
                        }
                        className="mt-2 h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-900 outline-none focus:border-gray-500 disabled:bg-gray-100"
                    >
                        <option value="">
                            {isActiveLoansLoading
                                ? "Loading loan accounts..."
                                : "Select loan account"}
                        </option>

                        {activeLoans.map(
                            (loan) => (
                                <option
                                    key={
                                        loan.computationSlipId
                                    }
                                    value={
                                        loan.accountNumber
                                    }
                                >
                                    {
                                        loan.accountNumber
                                    }
                                    {" — "}
                                    {formatCurrency(
                                        Number(
                                            loan.supplementaryBalance ??
                                            0
                                        )
                                    )}
                                </option>
                            )
                        )}
                    </select>

                    {!isActiveLoansLoading &&
                        activeLoans.length ===
                        0 && (
                            <p className="mt-2 text-sm text-gray-500">
                                No active loan
                                accounts found for
                                this pensioner.
                            </p>
                        )}
                </div>
            )}

            {/* INITIAL */}
            {!selectedPensioner && (
                <div className="rounded-lg border border-dashed border-gray-300 bg-white px-6 py-12 text-center">
                    <p className="text-sm font-medium text-gray-900">
                        Select a pensioner
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                        Search for a pensioner to
                        view their supplementary
                        loan.
                    </p>
                </div>
            )}

            {/* WAITING FOR ACCOUNT */}
            {selectedPensioner &&
                !selectedAccountNumber &&
                activeLoans.length > 0 && (
                    <div className="rounded-lg border border-dashed border-gray-300 bg-white px-6 py-10 text-center">
                        <p className="text-sm font-medium text-gray-900">
                            Select a loan account
                        </p>

                        <p className="mt-1 text-sm text-gray-500">
                            Choose the loan account
                            whose supplementary
                            information you want to
                            view.
                        </p>
                    </div>
                )}

            {/* LOADING */}
            {selectedPensioner &&
                selectedAccountNumber &&
                isLoading && (
                    <div className="rounded-lg border border-gray-200 bg-white p-6">
                        <p className="text-sm text-gray-500">
                            Loading supplementary
                            loan information...
                        </p>
                    </div>
                )}

            {/* ERROR */}
            {selectedPensioner &&
                selectedAccountNumber &&
                isError && (
                    <div className="rounded-lg border border-gray-200 bg-white p-6">
                        <p className="text-sm font-medium text-gray-900">
                            Unable to load
                            supplementary
                            collections.
                        </p>

                        <p className="mt-1 text-sm text-gray-500">
                            The selected loan
                            account could not be
                            loaded.
                        </p>
                    </div>
                )}

            {/* LOAN SUMMARY */}
            {selectedPensioner &&
                selectedAccountNumber &&
                selectedLoan &&
                !isLoading &&
                !isError && (
                    <div className="rounded-lg border border-gray-200 bg-white p-6">
                        <div>
                            <h2 className="text-base font-semibold text-gray-900">
                                Supplementary Loan
                            </h2>

                            <p className="mt-1 text-sm text-gray-500">
                                {
                                    selectedPensioner.lastName
                                }
                                ,{" "}
                                {
                                    selectedPensioner.firstName
                                }{" "}
                                {
                                    selectedPensioner.middleName
                                }
                            </p>

                            <p className="mt-1 text-xs text-gray-500">
                                {
                                    selectedLoan.accountNumber
                                }
                            </p>
                        </div>

                        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            <SummaryCard
                                label="Current SL Balance"
                                value={formatCurrency(
                                    Number(
                                        selectedLoan.supplementaryBalance ??
                                        0
                                    )
                                )}
                            />

                            <SummaryCard
                                label="Latest SL Payment"
                                value={formatCurrency(
                                    latestCollection?.amount ??
                                    0
                                )}
                            />

                            <SummaryCard
                                label="Latest Ending Balance"
                                value={formatCurrency(
                                    latestCollection?.endingBalance ??
                                    Number(
                                        selectedLoan.supplementaryBalance ??
                                        0
                                    )
                                )}
                            />

                            <SummaryCard
                                label="Collection Status"
                                value={
                                    latestCollection?.status ??
                                    "No collection"
                                }
                            />
                        </div>
                    </div>
                )}

            {/* COLLECTION HISTORY */}
            {selectedPensioner &&
                selectedAccountNumber &&
                !isLoading &&
                !isError && (
                    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
                        <div className="border-b border-gray-200 px-5 py-4">
                            <h2 className="text-base font-semibold text-gray-900">
                                Supplementary
                                Collection History
                            </h2>

                            <p className="mt-1 text-sm text-gray-500">
                                Payments applied to supplementary charges and principal.
                            </p>
                        </div>

                        <div className="overflow-x-auto mb-20">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50">
                                    <tr className="border-b border-gray-200">
                                        <th className="px-4 py-3 text-left font-medium text-gray-600">
                                            Date
                                        </th>

                                        <th className="px-4 py-3 text-right font-medium text-gray-600">
                                            Amount
                                        </th>

                                        <th className="px-4 py-3 text-right font-medium text-gray-600">
                                            Beginning
                                            Balance
                                        </th>

                                        <th className="px-4 py-3 text-right font-medium text-gray-600">
                                            Charge Paid
                                        </th>

                                        <th className="px-4 py-3 text-right font-medium text-gray-600">
                                            Principal Paid
                                        </th>

                                        <th className="px-4 py-3 text-right font-medium text-gray-600">
                                            Ending Balance
                                        </th>

                                        <th className="px-4 py-3 text-center font-medium text-gray-600">
                                            Status
                                        </th>

                                        <th className="px-4 py-3 text-center font-medium text-gray-600">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {supplementaryCollections.length === 0 ? (
                                        <tr>
                                            <td colSpan={8}
                                                className="px-4 py-8 text-center text-gray-500"
                                            >
                                                No supplementary collections yet.
                                            </td>
                                        </tr>
                                    ) : (
                                        supplementaryCollections.map((collection) => (
                                            <tr
                                                key={collection.id}
                                                className="border-b border-gray-100 last:border-b-0">

                                                <td className="px-4 py-3 text-gray-900">
                                                    {formatMonthYear(
                                                        new Date(
                                                            collection.collectionDate
                                                        )
                                                    )}
                                                </td>

                                                <td className="px-4 py-3 text-right text-gray-900">
                                                    {formatCurrency(collection.amount)}
                                                </td>

                                                <td className="px-4 py-3 text-right text-gray-900">
                                                    {formatCurrency(collection.beginningBalance)}
                                                </td>

                                                <td className="px-4 py-3 text-right text-gray-900">
                                                    {formatCurrency(collection.chargePaid)}
                                                </td>

                                                <td className="px-4 py-3 text-right text-gray-900">
                                                    {formatCurrency(collection.principalPaid)}
                                                </td>

                                                <td className="px-4 py-3 text-right font-medium text-gray-900">
                                                    {formatCurrency(collection.endingBalance)}
                                                </td>

                                                <td className="px-4 py-3 text-center text-gray-900">
                                                    {collection.status}
                                                </td>

                                                <td className="px-4 py-3 text-center">
                                                    {collection.status === "PENDING" ? (
                                                        <button
                                                            type="button"
                                                            disabled={isPosting}
                                                            onClick={() =>
                                                                handlePostCollection(
                                                                    collection.id
                                                                )
                                                            }
                                                            className="
                                                                rounded-md
                                                                border border-gray-300
                                                                px-3 py-1.5
                                                                text-xs font-medium
                                                                text-gray-700
                                                                transition
                                                                hover:bg-gray-50
                                                                disabled:cursor-not-allowed
                                                                disabled:opacity-50
                                                            "
                                                        >
                                                            {isPosting
                                                                ? "Posting..."
                                                                : "Post"}
                                                        </button>
                                                    ) : (
                                                        <span className="text-xs text-gray-400">
                                                            —
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        )
                                        )
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
        </div>
    );
}

function SummaryCard({
    label,
    value,
}: {
    label: string;
    value: string;
}) {
    return (
        <div className="rounded-md bg-gray-50 p-4">
            <p className="text-xs text-gray-500">
                {label}
            </p>

            <p className="mt-1 text-sm font-semibold text-gray-900">
                {value}
            </p>
        </div>
    );
}