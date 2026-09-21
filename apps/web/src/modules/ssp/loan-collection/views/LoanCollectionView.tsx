"use client";

import { useState, useEffect } from "react";
import { Plus, WalletCards } from "lucide-react";
import type { Pensioner } from "@repo/shared";
import Modal from "@/components/common/ModalHeader";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useDisclosure } from "@/hooks/useDisclosure";
import { AppToast } from "@/lib/toast";
import PensionerSearch from "../../comp-slip/components/PensionerSearch";
import LoanCollectionForm from "../components/LoanCollectionContent";

import type { CreateLoanCollectionPayload, } from "@repo/shared";
import LoanCollectionHistory from "../components/LoanCollectionHistory";
import { useActiveLoanByPensionerIdAndAccountNo } from "../../comp-slip/hooks/usePensionerSearch";
import { useActiveLoanCollection, useCreateLoanCollection, useLoanCollectionHistory, usePostLoanCollection } from "../hooks/useLoanCollection";


export default function LoanCollectionView() {
    const collectionModal = useDisclosure();

    const [selectedPensioner, setSelectedPensioner] = useState<Pensioner | null>(null);
    const [selectedAccountNumber, setSelectedAccountNumber,] = useState<string>("");

    const { data: activeLoansList, isLoading: isActiveLoansLoading } = useActiveLoanCollection(selectedPensioner?.id);
    const activeLoans = activeLoansList?.data ?? [];

    const { data, isLoading, isError } = useActiveLoanByPensionerIdAndAccountNo(selectedPensioner?.id, selectedAccountNumber);
    const activeLoan = data?.data;

    const { mutateAsync: createCollection, isPending } = useCreateLoanCollection();

    const { data: collectionHistory = [], isLoading: isHistoryLoading } = useLoanCollectionHistory(activeLoan?.computationSlipId);

    function handleOpenCollection() {
        collectionModal.open();
    }

    function handleCloseCollection() {
        collectionModal.close();
    }

    async function handleSaveCollection(
        data: CreateLoanCollectionPayload
    ) {
        try {
            const response =
                await createCollection(data);

            collectionModal.close();

            AppToast.success(
                response.message ??
                "Collection successfully posted."
            );
        } catch (error) {
            AppToast.error(
                "Failed to post collection."
            );
        }
    }

    useEffect(() => {
        if (
            activeLoans.length === 1 &&
            !selectedAccountNumber
        ) {
            setSelectedAccountNumber(
                activeLoans[0].accountNumber
            );
        }
    }, [
        activeLoans,
        selectedAccountNumber,
    ]);

    const { mutateAsync: postCollection, isPending: isPostingCollection } = usePostLoanCollection();

    async function handlePostCollection(
        collectionId: string
    ) {
        try {
            const response =
                await postCollection(
                    collectionId
                );

            AppToast.success(
                response.message ??
                "Collection posted successfully."
            );
        } catch {
            AppToast.error(
                "Failed to post collection."
            );
        }
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <div className="flex items-center gap-2">
                    <WalletCards className="h-5 w-5 text-gray-600" />

                    <h1 className="text-2xl font-semibold text-gray-900">
                        Loan Collection
                    </h1>
                </div>

                <p className="mt-1 text-sm text-gray-500">
                    Post and monitor monthly pension
                    loan collections.
                </p>
            </div>

            {/* Pensioner Search */}
            <div className="rounded-lg border border-gray-200 bg-white p-5">
                <PensionerSearch
                    onSelect={(pensioner) => {
                        setSelectedPensioner(pensioner);
                        setSelectedAccountNumber("");
                    }}
                />
            </div>

            {selectedPensioner && (
                <div className="rounded-lg border border-gray-200 bg-white p-5">
                    <Label className="text-sm font-medium text-gray-700">
                        Loan Account
                    </Label>

                    <select
                        value={selectedAccountNumber}
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

                        {activeLoans.map((loan) => (
                            <option
                                key={loan.computationSlipId}
                                value={loan.accountNumber}
                            >
                                {loan.accountNumber}
                                {" — "}
                                {formatCurrency(
                                    loan.remainingBalance
                                )}
                            </option>
                        ))}
                    </select>

                    {!isActiveLoansLoading &&
                        activeLoans.length === 0 && (
                            <p className="mt-2 text-sm text-gray-500">
                                No active loan accounts found for this pensioner.
                            </p>
                        )}
                </div>
            )}

            {/* Initial */}
            {!selectedPensioner && (
                <div className="rounded-lg border border-dashed border-gray-300 bg-white px-6 py-12 text-center">
                    <p className="text-sm font-medium text-gray-900">
                        Select a pensioner
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                        Search for a pensioner to
                        view their active loan.
                    </p>
                </div>
            )}

            {/* Loading */}
            {selectedPensioner &&
                selectedAccountNumber &&
                isLoading && (
                    <div className="rounded-lg border border-gray-200 bg-white p-6">
                        <p className="text-sm text-gray-500">
                            Loading selected loan...
                        </p>
                    </div>
                )}

            {/* Error */}
            {selectedPensioner &&
                selectedAccountNumber &&
                isError && (
                    <div className="rounded-lg border border-gray-200 bg-white p-6">
                        <p className="text-sm font-medium text-gray-900">
                            Loan account not found
                        </p>

                        <p className="mt-1 text-sm text-gray-500">
                            The selected loan account could not be loaded.
                        </p>
                    </div>
                )}

            {selectedPensioner &&
                !selectedAccountNumber &&
                activeLoans.length > 0 && (
                    <div className="rounded-lg border border-dashed border-gray-300 bg-white px-6 py-10 text-center">
                        <p className="text-sm font-medium text-gray-900">
                            Select a loan account
                        </p>

                        <p className="mt-1 text-sm text-gray-500">
                            Choose the loan account you want to collect from.
                        </p>
                    </div>
                )}

            {/* Active Loan */}
            {selectedPensioner &&
                activeLoan &&
                !isLoading && (
                    <div className="rounded-lg border border-gray-200 bg-white p-6">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                            <div>
                                <h2 className="text-base font-semibold text-gray-900">
                                    Active Loan
                                </h2>

                                <p className="mt-1 text-sm text-gray-500">
                                    {
                                        activeLoan.pensioner.lastName
                                    }
                                    ,{" "}
                                    {
                                        activeLoan
                                            .pensioner
                                            .firstName
                                    }{" "}
                                    {
                                        activeLoan
                                            .pensioner
                                            .middleName
                                    }
                                </p>
                            </div>

                            {(activeLoan.loanStatus != 'CLOSED') && (
                                <Button
                                    type="button"
                                    onClick={
                                        handleOpenCollection
                                    }
                                >
                                    <Plus className="h-4 w-4" />
                                    Post Collection
                                </Button>
                            )}
                        </div>

                        {/* Summary */}
                        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            <SummaryCard
                                label="Installment"
                                value={formatCurrency(
                                    activeLoan.installment
                                )}
                            />

                            <SummaryCard
                                label="Remaining Balance"
                                value={formatCurrency(
                                    activeLoan.remainingBalance
                                )}
                            />

                            <SummaryCard
                                label="Paid Terms"
                                value={`${activeLoan.paidTerms} / ${activeLoan.terms}`}
                            />

                            <SummaryCard
                                label="Next Collection"
                                value={formatMonthYear(
                                    activeLoan.nextCollectionDate
                                )}
                            />
                        </div>

                        {(activeLoan.loanStatus != 'CLOSED') && (
                            <div className="mt-6 rounded-md border border-gray-200 bg-gray-50 p-4">
                                <p className="text-sm font-medium text-gray-900">
                                    Loan fully paid
                                </p>

                                <p className="mt-1 text-sm text-gray-500">
                                    No further collection
                                    is required.
                                </p>
                            </div>
                        )}
                    </div>
                )}


            {activeLoan && (
                <LoanCollectionHistory
                    collections={collectionHistory}
                    isLoading={isHistoryLoading}
                    onPost={handlePostCollection}
                />
            )}


            {/* Collection Modal */}
            {activeLoan && (
                <Modal
                    isOpen={
                        collectionModal.isOpen
                    }
                    onClose={
                        handleCloseCollection
                    }
                    title="Post Loan Collection"
                    size="lg"
                    footer={
                        <>
                            <Button
                                type="button"
                                onClick={
                                    handleCloseCollection
                                }
                            >
                                Cancel
                            </Button>

                            <Button
                                type="submit"
                                form="loan-collection-form"
                                disabled={isPending}
                            >
                                {isPending
                                    ? "Posting..."
                                    : "Post Collection"}
                            </Button>
                        </>
                    }
                >
                    <LoanCollectionForm
                        computationSlipId={
                            activeLoan.computationSlipId
                        }
                        pensionerId={
                            activeLoan.pensioner.id
                        }
                        pensionerName={`${activeLoan.pensioner.lastName}, ${activeLoan.pensioner.firstName} ${activeLoan.pensioner.middleName ?? ""}`}
                        collectionDate={
                            activeLoan.nextCollectionDate
                        }
                        installment={
                            activeLoan.installment
                        }
                        remainingBalance={
                            activeLoan.remainingBalance
                        }
                        onCreate={
                            handleSaveCollection
                        }
                    />
                </Modal>
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

function formatCurrency(
    value: number
): string {
    return new Intl.NumberFormat(
        "en-PH",
        {
            style: "currency",
            currency: "PHP",
            minimumFractionDigits: 2,
        }
    ).format(value);
}

function formatMonthYear(
    value: string
): string {
    return new Date(
        value
    ).toLocaleDateString(
        "en-PH",
        {
            month: "long",
            year: "numeric",
        }
    );
}