"use client";

import Modal from "@/components/common/ModalHeader";
import { Button } from "@/components/ui/button";

import {
    CompslipListItem,
    CUT_OFF_DATE_UDI,
    formatCurrency,
    generateSupplementaryLoanSchedule,
    generateUDIRebateSchedule,
    SL_RATE,
} from "@repo/shared";

import { formatMonthYear } from "@/utils/format-date";

type SupplementaryScheduleSpreadModalProps = {
    isOpen: boolean;
    onClose: () => void;
    selectedLoan: CompslipListItem | null;
};

export default function SupplementaryLoanScheduleSpreadModal({
    isOpen,
    onClose,
    selectedLoan
}: SupplementaryScheduleSpreadModalProps) {

    const slSchedule =
        selectedLoan && selectedLoan?.effectivityDate &&
            Number(selectedLoan.installment) > 0 &&
            Number(selectedLoan.supplementary) > 0
            ? generateSupplementaryLoanSchedule({
                effectivityDate: new Date(selectedLoan.effectivityDate),
                installment: Number(selectedLoan.installment),
                supplementaryAmount: Number(selectedLoan.supplementary),
                supplementaryRate: SL_RATE
            })
            : [];

    const totalSupplementaryCharge = slSchedule.reduce((total, item) => total + item.supplementaryCharge, 0);

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={selectedLoan?.accountNumber
                ? `Supplementary Loan Schedule - ${selectedLoan.accountNumber}`
                : "Supplementary Loan Schedule"}
            size="xl"
            footer={
                <Button
                    type="button"
                    onClick={onClose}
                >
                    Close
                </Button>
            }
        >
            <div className="space-y-5">
                {!selectedLoan ? (
                    <div className="rounded-md border border-gray-200 bg-gray-50 p-5">
                        <p className="text-sm font-medium text-gray-900">
                            No selected loan to display.
                        </p>

                        <p className="mt-1 text-sm text-gray-500">
                            Select a computation slip to view its loan schedule.
                        </p>
                    </div>
                ) : (
                    <div className="rounded-lg border border-gray-200 bg-white">
                        {/* Header */}
                        <div className="border-b border-gray-200 px-5 py-4">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <h2 className="text-base font-semibold text-gray-900">
                                        Loan Schedule Spread
                                    </h2>

                                    <p className="mt-1 text-sm text-gray-500">
                                        Scheduled monthly collections for this loan account.
                                    </p>
                                </div>

                                <div className="text-right">
                                    <p className="text-sm font-medium text-gray-900">
                                        {selectedLoan.accountNumber}
                                    </p>

                                    <p className="mt-1 text-xs text-gray-500">
                                        Control #{selectedLoan.controlNumber}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Loan summary */}
                        <div className="grid gap-4 border-b border-gray-200 px-5 py-4 sm:grid-cols-3">
                            <SummaryItem
                                label="Installment"
                                value={formatCurrency(Number(selectedLoan.installment))}
                            />

                            <SummaryItem
                                label="Terms"
                                value={`${slSchedule.length} months`}
                            />

                            <SummaryItem
                                label="Total SL Charge"
                                value={formatCurrency(Number(totalSupplementaryCharge))}
                            />
                        </div>

                        {/* Schedule */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50">
                                    <tr className="border-b border-gray-200">
                                        <th className="px-4 py-3 text-left font-medium text-gray-600">
                                            #
                                        </th>

                                        <th className="px-4 py-3 text-left font-medium text-gray-600">
                                            Collection Month
                                        </th>

                                        <th className="px-4 py-3 text-right font-medium text-gray-600">
                                            Beginning balance
                                        </th>

                                        <th className="px-4 py-3 text-right font-medium text-gray-600">
                                            Supplementary charge
                                        </th>

                                        <th className="px-4 py-3 text-right font-medium text-gray-600">
                                            Payment
                                        </th>

                                        <th className="px-4 py-3 text-right font-medium text-gray-600">
                                            Balance
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {slSchedule.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan={4}
                                                className="px-4 py-8 text-center text-gray-500"
                                            >
                                                No loan schedule available.
                                            </td>
                                        </tr>
                                    ) : (
                                        slSchedule.map(
                                            (
                                                schedule,
                                                index
                                            ) => (
                                                <tr
                                                    key={`${schedule.date.toISOString()}-${index}`}
                                                    className="border-b border-gray-100 last:border-b-0"
                                                >
                                                    <td className="px-4 py-3 text-gray-500">
                                                        {index + 1}
                                                    </td>

                                                    <td className="px-4 py-3 text-gray-900">
                                                        {formatMonthYear(schedule.date)}
                                                    </td>

                                                    <td className="px-4 py-3 text-right font-medium text-gray-900">
                                                        {formatCurrency(schedule.beginningBalance)}
                                                    </td>

                                                    <td className="px-4 py-3 text-right font-medium text-gray-900">
                                                        {formatCurrency(schedule.supplementaryCharge)}
                                                    </td>

                                                    <td className="px-4 py-3 text-right font-medium text-gray-900">
                                                        {formatCurrency(schedule.paymentAmount)}
                                                    </td>

                                                    <td className="px-4 py-3 text-right font-medium text-gray-900">
                                                        {formatCurrency(schedule.balance)}
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
        </Modal >
    );
}

function SummaryItem({
    label,
    value,
}: {
    label: string;
    value: string;
}) {
    return (
        <div>
            <p className="text-xs text-gray-500">
                {label}
            </p>

            <p className="mt-1 text-sm font-semibold text-gray-900">
                {value}
            </p>
        </div>
    );
}