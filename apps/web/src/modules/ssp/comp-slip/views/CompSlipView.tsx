"use client";

import { Calculator, Plus, FileText } from "lucide-react";
import { useState } from "react";
import { useDisclosure } from "@/hooks/useDisclosure";
import { CompslipListItem, CreateComputationSlipSchema, formatDateApi, Pensioner } from "@repo/shared";

import Modal from "@/components/common/ModalHeader";
import { Button } from "@/components/ui/button";
import { AppToast } from "@/lib/toast";

import ComputationSlipContent from "../components/ComputationSlipContent";
import { useCompslipComputation, useCompslipList } from "../hooks/usePensionerSearch";
import { formatMonthYear } from "@/utils/format-date";
import { formatNumber } from "@/utils/format-currency";
import { useLoanCollectionHistory } from "../../loan-collection/hooks/useLoanCollection";
import LoanCollectionDetailsModal from "../components/Modals/LoanCollectionHistory";

// Shared visual tokens for the slip
const INK = "text-[#1B2430]";
const MUTED = "text-[#767F79]";
const HAIRLINE = "border-[#E2E4E1]";
const DASHED = "border-[#D3D7D4]";

const labelClass = `font-serif text-[13px] ${MUTED}`;

export default function CompSlipView() {
    const compSlipModal = useDisclosure();
    const collectionDetailsModal = useDisclosure();
    const branchName = 'EMB MAIN';

    const { mutateAsync: createComputationSlip } = useCompslipComputation();
    const { data: compslipList = [], isLoading: CompSlipLoading, } = useCompslipList(branchName);

    const [selectedComputationSlipId, setSelectedComputationSlipId] = useState<string | null>(null);
    const [selectedAccountNumber, setSelectedAccountNumber] = useState<string>("");
    const [selectedPensioner, setSelectedPensioner] = useState<Pensioner | null>(null);

    const [selectedLoan, setSelectedLoan] = useState<CompslipListItem | null>(null);

    function handleViewCollection(
        computationSlipId: string,
        accountNumber: string,
        pensioner: Pensioner,
        loan: CompslipListItem
    ) {
        setSelectedComputationSlipId(computationSlipId);
        setSelectedAccountNumber(accountNumber);
        setSelectedPensioner(pensioner);
        setSelectedLoan(loan);

        collectionDetailsModal.open();
    }
    function handleCloseCollectionDetails() {
        setSelectedComputationSlipId(null);
        setSelectedAccountNumber("");
        collectionDetailsModal.close();
    }
    function handleOpenComputation() {
        // setSelectedPensioner(selectedPensioner);
        compSlipModal.open();
    }

    function handleCloseComputation() {
        // setSelectedPensioner(null);
        compSlipModal.close();
    }

    async function handleSaveComputation(data: CreateComputationSlipSchema) {
        if (!data) return;
        try {
            const response = await createComputationSlip(data);
            compSlipModal.close();
            // setSelectedPensioner(null);

            AppToast.success(response.message ?? 'Successfully saved.');
        } catch (error) {
            AppToast.error("Failed to save.");
        }
    }


    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <div className="flex items-center gap-2">
                        <Calculator className="h-5 w-5 text-gray-600" />

                        <h1 className="text-2xl font-semibold text-gray-900">
                            Computation Slip
                        </h1>
                    </div>

                    <p className="mt-1 text-sm text-gray-500">
                        Create and manage pension loan computations.
                    </p>
                </div>

                <Button
                    type="button"
                    onClick={handleOpenComputation}
                >
                    <Plus className="h-4 w-4" />
                    New Computation
                </Button>
            </div>

            {/* Recent Computations */}
            <div className="rounded-lg border border-gray-200 bg-white">
                <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
                    <div>
                        <h2 className="text-base font-semibold text-gray-900">
                            Recent Computation Slips
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            Recently created pension loan computations.
                        </p>
                    </div>
                </div>

                <div className={`rounded-sm border ${HAIRLINE} bg-white p-8`}>
                    <ScheduleTable
                        title="Computation Slip List"
                        subtitle=""
                        columns={[
                            "status",
                            "Pensioner ID",
                            "Account #",
                            "Control #",
                            "Transaction Date",
                            "Transaction Type",
                            "effectivity Date",
                            "Supplimentary",
                            "Principal Amount",
                            "Actions",
                        ]}
                        rows={compslipList.map((item) => [
                            item.status,
                            `${Number(item.pensioner.legacyPensionerId)}`,
                            item.accountNumber,
                            item.controlNumber,
                            `${formatDateApi(item.transactionDate)}`,
                            item.transactionType,
                            `${formatMonthYear(item.effectivityDate)}`,
                            `₱${formatNumber(Number(item.supplementary))}`,
                            `₱${formatNumber(Number(item.principalAmount))}`,
                            <button
                                type="button"
                                onClick={() =>
                                    handleViewCollection(
                                        item.id,
                                        item.accountNumber,
                                        item.pensioner,
                                        item
                                    )
                                }
                                className="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-50"
                            >
                                View
                            </button>,
                        ])}
                        emptyMessage="Computation Slip List will appear here."
                    />
                </div>

                {/* Empty State */}
                {compslipList && compslipList.length < 0 &&
                    <div className="flex min-h-64 flex-col items-center justify-center px-6 py-12 text-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                            <FileText className="h-5 w-5 text-gray-500" />
                        </div>

                        <h3 className="mt-4 text-sm font-semibold text-gray-900">
                            No computation slips yet
                        </h3>

                        <p className="mt-1 max-w-sm text-sm text-gray-500">
                            Create a new computation slip to get started.
                        </p>

                        <Button
                            type="button"
                            className="mt-4"
                            onClick={handleOpenComputation}
                        >
                            <Plus className="h-4 w-4" />
                            New Computation
                        </Button>
                    </div>
                }
            </div>

            {/* Computation Slip Modal */}
            <Modal
                isOpen={compSlipModal.isOpen}
                onClose={handleCloseComputation}
                title="New Computation Slip"
                size="xl"
                footer={
                    <>
                        <Button
                            type="button"
                            onClick={handleCloseComputation}
                        >
                            Cancel
                        </Button>

                        <Button
                            type="button"
                            onClick={handleCloseComputation}
                        // disabled={!selectedPensioner}
                        >
                            Save as Draft
                        </Button>

                        <Button
                            type="submit"
                            form="computation-slip-form"
                        // disabled={!selectedPensioner}
                        >
                            Continue
                        </Button>
                    </>
                }
            >
                {/* Computation Slip Modal Content */}
                <ComputationSlipContent
                    onCreate={handleSaveComputation}
                />
            </Modal>


            <Modal
                isOpen={collectionDetailsModal.isOpen}
                onClose={() => {
                    collectionDetailsModal.close();
                    setSelectedComputationSlipId(null);
                }}
                title="Loan Collection Details"
                size="lg"
            >
                {selectedComputationSlipId && (
                    <LoanCollectionDetailsModal
                        isOpen={collectionDetailsModal.isOpen}
                        onClose={handleCloseCollectionDetails}
                        computationSlipId={selectedComputationSlipId}
                        accountNumber={selectedAccountNumber}
                        selectedPensioner={selectedPensioner}
                        selectedLoan={selectedLoan}
                    />
                )}
            </Modal>
        </div>
    );
}


/** Minimal table for the amortization spreads — no card chrome, just a title and hairline rules. */
function ScheduleTable({
    title,
    subtitle,
    columns,
    rows,
    emptyMessage,
}: {
    title: string;
    subtitle?: string;
    columns: string[];
    rows: React.ReactNode[][];
    emptyMessage: string;
}) {
    return (
        <div>
            <div className={`flex items-baseline justify-between border-b ${HAIRLINE} pb-2`}>
                <h3 className={`font-serif text-[15px] ${INK}`}>{title}</h3>
                {subtitle && (
                    <span className={`font-mono text-[12px] ${MUTED}`}>{subtitle}</span>
                )}
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className={`border-b ${HAIRLINE}`}>
                            {columns.map((col, i) => (
                                <th
                                    key={col}
                                    className={`py-2.5 font-serif text-[13px] font-normal ${MUTED} ${i === 0 ? "text-left" : "text-right"
                                        }`}
                                >
                                    {col}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody>
                        {rows.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={columns.length}
                                    className={`py-6 text-center font-serif text-sm ${MUTED}`}
                                >
                                    {emptyMessage}
                                </td>
                            </tr>
                        ) : (
                            rows.map((row, rowIndex) => (
                                <tr key={rowIndex} className={`border-b ${DASHED} last:border-b-0`}>
                                    {row.map((cell, i) => (
                                        <td
                                            key={i}
                                            className={`py-2.5 ${i === 0
                                                ? `font-serif text-[13px] ${INK}`
                                                : `font-mono text-[13px] text-right ${INK}`
                                                }`}
                                        >
                                            {cell}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}