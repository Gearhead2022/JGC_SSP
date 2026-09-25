"use client";

import React, { useEffect, useState } from "react";
import {
    CreateComputationSlipSchema, Pensioner, TRANSACTION_TYPES, ActiveLoanCollection, generateUDIRebateSchedule,
    CUT_OFF_DATE_UDI, formatDateApi, addMonthsToDate, CalculateComputationSlipSchema, LOAN_STATUS_TYPES,
    calculateComputationSlipSchema,
    isEligibleForRenewal
} from "@repo/shared";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import PensionerSearch from "./PensionerSearch";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { generateLoanSchedule, generateSupplementaryLoanSchedule } from "@repo/shared"; // logic calculations

import { getMaximumSLTerm } from "@repo/shared"; // logic rules

import { SL_RATE } from "@repo/shared";

import { formatNumber } from "@/utils/format-currency";
import { getAge } from "@repo/shared";
import { formatDateForInput, formatMonthYear } from "@/utils/format-date";
import { useActiveLoanByPensionerIdAndAccountNo, useCalculateComputationSlip, useNextControlNumber } from "../hooks/usePensionerSearch";
import { useActiveLoanCollection } from "../../loan-collection/hooks/useLoanCollection";
import { Notebook, NotebookIcon } from "lucide-react";

type ComputationSlipContentProps = {
    onCreate?: (data: CreateComputationSlipSchema) => void;
};

// Shared visual tokens for the slip
const INK = "text-[#1B2430]";
const MUTED = "text-[#767F79]";
const HAIRLINE = "border-[#E2E4E1]";
const DASHED = "border-[#D3D7D4]";
const ACCENT = "text-[#1F4B3F]";

const labelClass = `font-serif text-[13px] ${MUTED}`;

// const labelClass =
//     "mb-1.5 block text-xs font-medium uppercase tracking-wide text-gray-500";

const inputFieldClass =
    "h-9 rounded-md border border-gray-300 bg-white px-3 " +
    "text-[14px] text-[#1B2430] shadow-sm " +
    "focus-visible:border-[#1F4B3F] focus-visible:ring-2 " +
    "focus-visible:ring-[#1F4B3F]/20";

const readOnlyFieldClass =
    "flex min-h-9 items-center rounded-md border border-green-200 " +
    "bg-green-50 px-3 py-1.5 text-[14px] font-mono text-[#1B2430]";

const readOnlyInputClass =
    "h-9 rounded-md border border-green-200 bg-green-50 px-3 " +
    "font-mono text-[14px] text-[#1B2430] shadow-none " +
    "focus-visible:ring-0";

const calculatedFieldClass =
    "flex min-h-9 items-center rounded-md border border-blue-200 " +
    "bg-blue-50 px-3 py-1.5 text-[14px] font-semibold text-[#1B2430]";

const selectFieldClass =
    "h-9 w-full rounded-md border border-gray-300 bg-white px-3 " +
    "text-[14px] text-[#1B2430] shadow-sm outline-none " +
    "focus:border-[#1F4B3F] focus:ring-2 focus:ring-[#1F4B3F]/20";

/** A single receipt-style line: label on the left, computed figure on the right. */
function SlipLine({
    label,
    value,
    emphasis = false,
}: {
    label: string;
    value: string;
    emphasis?: boolean;
}) {
    return (
        <div
            className={`flex items-baseline justify-between border-b ${DASHED} py-2.5`}
        >
            <span className={emphasis ? `font-serif text-[15px] ${INK}` : labelClass}>
                {label}
            </span>
            <span
                className={
                    emphasis
                        ? `font-mono text-[15px] font-semibold ${ACCENT}`
                        : `font-mono text-[15px] ${INK}`
                }
            >
                {value}
            </span>
        </div>
    );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
    return (
        <h3 className={`font-serif text-[15px] ${INK} border-b ${HAIRLINE} pb-2`}>
            {children}
        </h3>
    );
}

export default function ComputationSlipContent({
    onCreate,
}: ComputationSlipContentProps) {

    const { mutateAsync: calculateComputation, data: calculationResponse, isPending: isCalculating, } = useCalculateComputationSlip();

    const computation = calculationResponse?.data;

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm<CalculateComputationSlipSchema>({
        resolver: zodResolver(calculateComputationSlipSchema),

        defaultValues: {
            pensionerId: "",
            branchName: "EMB MAIN",
            accountNumber: undefined,
            transactionDate: "",
            transactionType: TRANSACTION_TYPES.new,
            installment: 0,
            terms: 0,
            supplementary: 0,
            supplementaryBalance: 0,
            supplementaryChargeMonthsToPay: 0,
            applySupplementaryCharge: false,
        },
    });

    const [branchName, setBranchName] = useState<string>('EMB MAIN');
    const [selectedPensioner, setSelectedPensioner] = useState<Pensioner | null>(null);
    const [selectedAccountNumber, setSelectedAccountNumber] = useState<string>("");
    const [supplementaryBalance, setSupplementaryBalance] = useState<number>(0);

    const installment = Number(watch("installment")) || 0;
    const loanTerms = Number(watch("terms")) || 0;
    const transactionType = watch("transactionType");
    // const supplementaryCharge = Number(watch("supplementaryCharge")) || 0;
    const supplementaryChargeMonthsToPay = Number(watch("supplementaryChargeMonthsToPay")) || 0;
    const applySupplementaryCharge = watch("applySupplementaryCharge") || false;

    const age = getAge(selectedPensioner?.birthDate);

    const { data: controlNumberPreview, isLoading: isControlNumberLoading } = useNextControlNumber(branchName);
    const { data: activeLoansList } = useActiveLoanCollection(selectedPensioner?.id);
    const { data: activeLoanSelected, isLoading, isError, } = useActiveLoanByPensionerIdAndAccountNo(selectedPensioner?.id, selectedAccountNumber);

    const activeLoans = activeLoansList?.data ?? [];
    const activeLoan = activeLoanSelected?.data;

    console.log('loans', activeLoan)

    useEffect(() => {
        if (
            transactionType === TRANSACTION_TYPES.renew &&
            activeLoan?.installment !== undefined
        ) {
            setValue("installment", Number(activeLoan.installment));

            const nextMonthOfLastPaymentDate = addMonthsToDate(
                new Date(activeLoan.effectivityDate),
                activeLoan.paidTerms
            );

            const transactionDate = formatDateApi(nextMonthOfLastPaymentDate.toDateString());

            setValue("transactionDate", transactionDate);

            const balance = Number(activeLoan.supplementaryBalance) || 0;

            console.log('balance', balance)

            setSupplementaryBalance(balance);

            setValue("supplementaryBalance", balance);
        }
    }, [transactionType, activeLoan?.installment, activeLoan?.effectivityDate, activeLoan?.paidTerms, activeLoan?.supplementaryBalance, setValue]);

    const transactionDate = watch("transactionDate");
    const supplementary = Number(watch("supplementary")) || 0;

    const udiRebate = computation?.udiRebate ?? 0;
    /**
     * Principal = installment × terms
     */
    const principalAmount = computation?.principalAmount ?? 0;

    const udi = computation?.udi ?? 0;

    const processingFee = computation?.processingFee ?? 0;

    const collectionFee = computation?.collectionFee ?? 0;

    const icod = computation?.icod ?? 0;

    const loanProtectionFee = computation?.loanProtectionFee ?? 0;

    const carriedSupplementaryCharge =
        computation?.carriedSupplementaryCharge ?? 0;

    const currentSupplementaryCharge =
        computation?.currentSupplementaryCharge ?? 0;

    const supplementaryChargeToPay =
        computation?.supplementaryChargeToPay ?? 0;

    const carriedSupplementaryChargeBreakdown =
        computation?.carriedSupplementaryChargeBreakdown ?? [];

    const supplementaryChargeBreakdown =
        computation?.supplementaryChargeBreakdown ?? [];

    const supplementaryChargeAvailableMonths =
        computation?.supplementaryChargeAvailableMonths ?? 0;

    const supplementaryChargeMonthsSelected =
        computation?.supplementaryChargeMonthsToPay ?? 0;

    const supplementaryChargeRemainingMonths =
        computation?.supplementaryChargeRemainingMonths ?? 0;

    const activeLoanBalance =
        computation?.activeLoanBalance ?? 0;

    const effectivityDate =
        computation?.effectivityDate
            ? new Date(computation.effectivityDate)
            : null;

    const CashOut = {
        grossCashout: computation?.grossCashOut ?? 0,
        netCashOut: computation?.netCashOut ?? 0,
        totalCashOut: computation?.totalCashOut ?? 0,
    };

    const loanSchedule = effectivityDate && loanTerms > 0 && installment > 0 && principalAmount > 0
        ? generateLoanSchedule({
            effectivityDate,
            installment,
            terms: loanTerms,
            principalAmount,
        })
        : [];

    const udiSchedule = transactionDate && udi > 0 && loanTerms > 0
        ? generateUDIRebateSchedule({
            transactionDate: new Date(`${transactionDate}T00:00:00`),
            udi,
            terms: loanTerms,
            cutOffDate: CUT_OFF_DATE_UDI,
        })
        : [];

    // console.log('supplementaryBalances', supplementaryBalance)

    const slSchedule =
        effectivityDate && loanTerms > 0 && installment && installment > 0
            ? generateSupplementaryLoanSchedule({
                effectivityDate,
                installment,
                supplementaryAmount: supplementary + supplementaryBalance,
                supplementaryRate: SL_RATE,
            })
            : [];

    // console.log('slSchedule', slSchedule)

    const totalSupplementaryCharge = slSchedule.reduce((total, item) => total + item.supplementaryCharge, 0);

    async function submit() {
        if (!selectedPensioner || !computation
        ) { return; }

        const payload: CreateComputationSlipSchema = {
            ...computation,

            pensionerId: selectedPensioner.id,
            branchName,
            accountNumber: transactionType === TRANSACTION_TYPES.renew
                ? selectedAccountNumber
                : undefined,

            loanStatus: LOAN_STATUS_TYPES.active,
        };

        onCreate?.(payload);
    }

    console.log('error', errors)

    useEffect(() => {
        if (
            !selectedPensioner ||
            !transactionDate ||
            installment <= 0 ||
            loanTerms <= 0
        ) {
            return;
        }

        if (
            transactionType ===
            TRANSACTION_TYPES.renew &&
            !selectedAccountNumber
        ) {
            return;
        }

        const timeout = setTimeout(
            async () => {
                await calculateComputation({
                    pensionerId: selectedPensioner.id,
                    branchName,
                    accountNumber:
                        transactionType ===
                            TRANSACTION_TYPES.renew
                            ? selectedAccountNumber
                            : undefined,

                    transactionDate,
                    transactionType,
                    installment,
                    terms: loanTerms,
                    supplementary,
                    supplementaryBalance,
                    supplementaryChargeMonthsToPay,
                    applySupplementaryCharge
                });
            },
            400
        );

        return () =>
            clearTimeout(timeout);
    }, [
        selectedPensioner,
        selectedAccountNumber,
        branchName,
        transactionDate,
        transactionType,
        installment,
        loanTerms,
        supplementary,
        supplementaryBalance,
        calculateComputation,
        supplementaryChargeMonthsToPay,
        applySupplementaryCharge
    ]);

    function handleSelectPensioner(
        pensioner: Pensioner
    ) {
        setSelectedPensioner(pensioner);
        setSelectedAccountNumber("");
        setValue("pensionerId", pensioner.id);
        setValue("accountNumber", undefined);
    }

    function handleAccountChange(
        accountNumber: string
    ) {
        setSelectedAccountNumber(accountNumber);
        setValue("accountNumber", accountNumber || undefined);
    }

    const selectedLoan = activeLoans?.find(
        (loan) => loan.accountNumber === selectedAccountNumber
    );

    const eligibility =
        transactionType === TRANSACTION_TYPES.renew && selectedLoan
            ? isEligibleForRenewal({
                loanStatus: selectedLoan.loanStatus,
                paidTerms: selectedLoan.paidTerms,
                terms: selectedLoan.terms,
                remainingBalance: selectedLoan.remainingBalance,
                transactionType
            })
            : undefined;

    return (
        <div className="space-y-2 py-2">
            <div>
                <h1 className={`font-serif text-2xl ${INK}`}>Computation slip</h1>
                <p className={`mt-1 font-serif text-sm ${MUTED}`}>
                    Enter loan terms below to generate a cash-out computation.
                </p>
            </div>

            <div className={`rounded-sm border ${HAIRLINE} bg-white p-8`}>

                <PensionerSearch onSelect={handleSelectPensioner} />

                <div className="space-y-8">
                    {selectedPensioner && (
                        <>
                            <div className={`rounded-sm border ${HAIRLINE} bg-[#FAFAF9] p-4`}>
                                <p className={labelClass}>Selected pensioner</p>

                                <div className="mt-2 flex items-start justify-between gap-4">
                                    <div>
                                        <p className={`font-serif text-[15px] ${INK}`}>
                                            {selectedPensioner.lastName}, {selectedPensioner.firstName}{" "}
                                            {selectedPensioner.middleName}
                                        </p>
                                        <p className={`mt-0.5 font-mono text-[12px] ${MUTED}`}>
                                            ID {selectedPensioner.id}
                                        </p>
                                    </div>

                                    <div className="text-right">
                                        <p className={`font-mono text-[15px] ${INK}`}>
                                            ₱
                                            {formatNumber(Number(selectedPensioner.actualPension))}
                                        </p>
                                        <p className={`text-[12px] ${MUTED}`}>Actual pension</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-10">
                                <div className={`rounded-sm border ${HAIRLINE} bg-white p-8`}>
                                    {activeLoans && (
                                        <ScheduleTable
                                            title="Loan Account List"
                                            columns={["Account #", "Install", "Balance"]}
                                            rows={activeLoans.map((item: ActiveLoanCollection) => [
                                                `${item.accountNumber}`,
                                                `₱${formatNumber(item.installment)}`,
                                                `₱${formatNumber(item.remainingBalance)}`,
                                            ])}
                                            emptyMessage="Loan schedule will appear here."
                                        />
                                    )}
                                </div>
                            </div>

                            <div className="space-y-10">
                                <div className={`rounded-sm border ${HAIRLINE} bg-white p-8`}>

                                    <ScheduleTable
                                        title="Supplimentary Loan Account Balance"
                                        columns={["Account #", "Install", "Balance"]}
                                        rows={[
                                            [
                                                `${activeLoan?.accountNumber ?? ''}`,
                                                `₱${formatNumber(activeLoan?.installment ?? 0)}`,
                                                `₱${formatNumber(activeLoan?.supplementaryBalance ?? 0)}`,
                                            ],
                                        ]}
                                        emptyMessage="Loan schedule will appear here."
                                    />

                                </div>
                            </div>
                        </>
                    )}
                    {transactionType === TRANSACTION_TYPES.renew &&
                        eligibility &&
                        !eligibility.eligible && (
                            <div className="space-y-10">
                                <div
                                    className={`flex items-start gap-3 rounded-sm border ${HAIRLINE} bg-white p-4`}
                                >
                                    <NotebookIcon className="mt-0.5 h-5 w-5 shrink-0 text-red-900" />

                                    <p className="text-sm text-red-900">
                                        {eligibility.reason}
                                    </p>
                                </div>
                            </div>
                        )}

                    {selectedPensioner && (
                        <form id="computation-slip-form" onSubmit={handleSubmit(submit)} className="space-y-8">
                            <div className={`rounded-sm border ${HAIRLINE} bg-[#FAFAF9] p-4`}>
                                <section className="space-y-4">
                                    <SectionTitle>Pensioner</SectionTitle>

                                    <div className="grid grid-cols-2 gap-5">
                                        {/* Name */}
                                        <div className="col-span-2">
                                            <Label className={labelClass}>Pensioner name</Label>

                                            <div className={readOnlyFieldClass}>
                                                {selectedPensioner.lastName},{" "}
                                                {selectedPensioner.firstName}{" "}
                                                {selectedPensioner.middleName}
                                            </div>
                                        </div>

                                        {/* Birth date */}
                                        <div>
                                            <Label className={labelClass}>Birth date</Label>

                                            <div className={readOnlyFieldClass}>
                                                {formatDateForInput(selectedPensioner.birthDate)}
                                            </div>
                                        </div>

                                        {/* Age */}
                                        <div>
                                            <Label className={labelClass}>Age</Label>

                                            <div className={readOnlyFieldClass}>
                                                {age ?? "-"} years old
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                <section className="space-y-4">
                                    <SectionTitle>Loan details</SectionTitle>

                                    <div className="grid grid-cols-2 gap-5">

                                        {/* Bank - readonly */}
                                        <div>
                                            <Label className={labelClass}>Bank</Label>

                                            <div className={readOnlyFieldClass}>
                                                {selectedPensioner.bankName ?? "—"}
                                            </div>
                                        </div>

                                        {/* Transaction date - editable */}
                                        <div>
                                            <Label className={labelClass}>Transaction date</Label>

                                            <Input
                                                type="date"
                                                {...register("transactionDate")}
                                                className={inputFieldClass}
                                            />
                                        </div>

                                        {/* Transaction type */}
                                        <div className="col-span-2">
                                            <Label className={labelClass}>Loan type</Label>

                                            <select
                                                {...register("transactionType")}
                                                className={selectFieldClass}
                                            >
                                                <option value={TRANSACTION_TYPES.new}>
                                                    New account
                                                </option>

                                                <option value={TRANSACTION_TYPES.renew}>
                                                    Closed | Renew
                                                </option>

                                                <option value={TRANSACTION_TYPES.transfer}>
                                                    Transfer
                                                </option>

                                                <option value={TRANSACTION_TYPES.change}>
                                                    Change | 13th month
                                                </option>

                                                <option value={TRANSACTION_TYPES.returnee}>
                                                    Returnee
                                                </option>

                                                <option value={TRANSACTION_TYPES.additional}>
                                                    Additional
                                                </option>
                                            </select>
                                        </div>

                                        {/* Existing loan */}
                                        {transactionType === TRANSACTION_TYPES.renew && (
                                            <div className="col-span-2">
                                                <Label className={labelClass}>
                                                    Existing loan account
                                                </Label>

                                                <select
                                                    value={selectedAccountNumber}
                                                    onChange={(event) =>
                                                        handleAccountChange(
                                                            event.target.value
                                                        )
                                                    }
                                                    className={selectFieldClass}
                                                >
                                                    <option value="" disabled>
                                                        Select loan account
                                                    </option>

                                                    {activeLoans.map((loan) => (
                                                        <option
                                                            key={loan.computationSlipId}
                                                            value={loan.accountNumber}
                                                        >
                                                            {loan.accountNumber}
                                                        </option>
                                                    ))}
                                                </select>

                                                {activeLoans.length === 0 && (
                                                    <p className="mt-1.5 text-xs text-gray-500">
                                                        No active loan accounts found.
                                                    </p>
                                                )}
                                            </div>
                                        )}

                                        {/* Installment */}
                                        <div>
                                            <Label className={labelClass}>Installment</Label>

                                            <Input
                                                type="number"
                                                step="0.01"
                                                {...register("installment", {
                                                    valueAsNumber: true,
                                                })}
                                                readOnly={
                                                    transactionType === TRANSACTION_TYPES.renew
                                                }
                                                className={
                                                    transactionType === TRANSACTION_TYPES.renew
                                                        ? readOnlyInputClass
                                                        : inputFieldClass
                                                }
                                            />
                                        </div>

                                        {/* Terms */}
                                        <div>
                                            <Label className={labelClass}>Terms</Label>

                                            <Input
                                                type="number"
                                                {...register("terms", {
                                                    valueAsNumber: true,
                                                })}
                                                className={inputFieldClass}
                                            />
                                        </div>

                                        {/* Allowable SL terms */}
                                        <div>
                                            <Label className={labelClass}>
                                                Allowable SL terms
                                            </Label>

                                            <div className={calculatedFieldClass}>
                                                {getMaximumSLTerm({
                                                    transactionType,
                                                    birthDate: selectedPensioner.birthDate ?? null,
                                                })}{" "}
                                                months
                                            </div>
                                        </div>

                                        {/* Supplementary */}
                                        <div>
                                            <Label className={labelClass}>
                                                Supplementary loan
                                            </Label>

                                            <Input
                                                type="number"
                                                step="0.01"
                                                {...register("supplementary", {
                                                    valueAsNumber: true,
                                                })}
                                                className={inputFieldClass}
                                            />
                                        </div>

                                        {transactionType === TRANSACTION_TYPES.renew && (
                                            <div className="col-span-2 flex items-center justify-between rounded-md border border-gray-200 bg-white p-4">
                                                <div>
                                                    <Label className={labelClass}>
                                                        Pay supplementary charge
                                                    </Label>

                                                    <p className="mt-1 text-xs text-gray-500">
                                                        Include the selected supplementary charge in this transaction.
                                                    </p>
                                                </div>

                                                <input
                                                    type="checkbox"
                                                    {...register(
                                                        "applySupplementaryCharge"
                                                    )}
                                                    className="h-4 w-4"
                                                />
                                            </div>
                                        )}

                                        {transactionType === TRANSACTION_TYPES.renew && applySupplementaryCharge && (
                                            <>

                                                {/* Months to pay */}
                                                < div >
                                                    <Label className={labelClass}>Months to pay</Label>

                                                    <Input
                                                        type="number"
                                                        {...register("supplementaryChargeMonthsToPay", {
                                                            valueAsNumber: true,
                                                        })}

                                                        className={inputFieldClass}
                                                    />
                                                </div>

                                                {/* Supplementary Charge */}
                                                <div>
                                                    <Label className={labelClass}>
                                                        Supplementary Charge
                                                    </Label>

                                                    <div className={calculatedFieldClass}>
                                                        ₱ {formatNumber(
                                                            currentSupplementaryCharge
                                                        )}
                                                    </div>

                                                    {transactionType ===
                                                        TRANSACTION_TYPES.renew &&
                                                        supplementaryChargeAvailableMonths > 0 && (
                                                            <p className="mt-1 text-xs text-gray-500">
                                                                ₱
                                                                {formatNumber(
                                                                    supplementaryChargeToPay
                                                                )}
                                                                {" per month · "}
                                                                {supplementaryChargeRemainingMonths}
                                                                {" month(s) remaining"}
                                                            </p>
                                                        )}
                                                </div>
                                            </>
                                        )}

                                    </div>
                                </section>

                            </div>
                            <div className={`rounded-sm border ${HAIRLINE} bg-[#FAFAF9] p-4`}>
                                <section className="space-y-4 rounded p-2">
                                    {/* Computation — receipt-style read-only figures */}
                                    <div className="space-y-1">
                                        <SectionTitle>Computation</SectionTitle>

                                        <div className="pt-1">

                                            <SlipLine
                                                label="Control number"
                                                value={
                                                    isControlNumberLoading
                                                        ? "Loading..."
                                                        : controlNumberPreview?.controlNumber ?? "—"
                                                }
                                            />

                                            <SlipLine
                                                label="Effectivity"
                                                value={
                                                    effectivityDate
                                                        ? formatMonthYear(effectivityDate)
                                                        : "—"
                                                }
                                            />
                                            <SlipLine
                                                label="Principal"
                                                value={`₱ ${formatNumber(principalAmount)}`}
                                            />
                                            <SlipLine label="UDI" value={`₱ ${formatNumber(udi)}`} />

                                            <SlipLine
                                                label="Gross cash out"
                                                value={`₱ ${formatNumber(CashOut.grossCashout)}`}
                                                emphasis
                                            />

                                            <br></br>

                                            <SlipLine
                                                label="Processing fee"
                                                value={`₱ ${formatNumber(processingFee)}`}
                                            />
                                            <SlipLine
                                                label="Collection fee"
                                                value={`₱ ${formatNumber(collectionFee)}`}
                                            />
                                            <SlipLine
                                                label="Loan protection fee"
                                                value={`₱ ${formatNumber(loanProtectionFee)}`}
                                            />
                                            <SlipLine label="ICOD" value={`₱ ${formatNumber(icod)}`} />
                                            <SlipLine
                                                label="Net cash out"
                                                value={`₱ ${formatNumber(CashOut.netCashOut)}`}
                                                emphasis
                                            />
                                            <SlipLine
                                                label="Supplemantary Loan"
                                                value={`₱ ${formatNumber(supplementary)}`}
                                                emphasis
                                            />

                                            <SlipLine
                                                label="Active Loan Balance"
                                                value={`₱ ${transactionType === TRANSACTION_TYPES.renew ? formatNumber(activeLoanBalance) : formatNumber(0)}`}
                                                emphasis
                                            />

                                            <SlipLine
                                                label="UDI Rebate"
                                                value={`₱ ${formatNumber(udiRebate ?? 0)}`}
                                                emphasis
                                            />

                                            <SlipLine
                                                label="Previous unpaid SL charges"
                                                value={`₱ ${formatNumber(
                                                    carriedSupplementaryCharge
                                                )}`}
                                            />

                                            <SlipLine
                                                label="Current SL charges"
                                                value={`₱ ${formatNumber(
                                                    currentSupplementaryCharge
                                                )}`}
                                            />

                                            <SlipLine
                                                label="SL charge to deduct"
                                                value={`₱ ${formatNumber(
                                                    supplementaryChargeToPay
                                                )}`}
                                                emphasis
                                            />
                                            <SlipLine
                                                label="SL charge months available"
                                                value={`${supplementaryChargeAvailableMonths}`}
                                            />

                                            <SlipLine
                                                label="SL charge months selected"
                                                value={`${supplementaryChargeMonthsToPay}`}
                                            />

                                            <SlipLine
                                                label="SL charge remaining months"
                                                value={`${supplementaryChargeRemainingMonths}`}
                                            />

                                            <SlipLine
                                                label="SL carried supplementary charge"
                                                value={`${carriedSupplementaryCharge}`}
                                            />

                                            <SlipLine
                                                label="SL charge to pay"
                                                value={`₱ ${formatNumber(
                                                    supplementaryChargeToPay
                                                )}`}
                                                emphasis
                                            />

                                        </div>

                                        {/* Grand total — double rule for weight */}
                                        <div className={`mt-2 border-t-2 ${HAIRLINE} pt-4`}>
                                            <div className="flex items-baseline justify-between">
                                                <span className={`font-serif text-[17px] ${INK}`}>
                                                    Total cash out
                                                </span>
                                                <span className={`font-mono text-2xl font-semibold ${ACCENT}`}>
                                                    ₱{formatNumber(CashOut.totalCashOut)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            </div>
                        </form>
                    )}
                </div>
            </div >

            {carriedSupplementaryChargeBreakdown.length > 0 && (
                <div className="rounded-md border border-gray-200 bg-white p-4">
                    <p className="mb-3 text-sm font-semibold text-gray-900">
                        Previous unpaid supplementary charges
                    </p>

                    <div className="space-y-2">
                        {carriedSupplementaryChargeBreakdown.map(
                            (item) => (
                                <div
                                    key={item.id}
                                    className="flex items-center justify-between text-sm"
                                >
                                    <span className="text-gray-600">
                                        {formatMonthYear(
                                            item.chargeMonth
                                        )}
                                    </span>

                                    <span className="font-medium text-gray-900">
                                        ₱
                                        {formatNumber(
                                            item.outstandingAmount
                                        )}
                                    </span>
                                </div>
                            )
                        )}
                    </div>

                    <div className="mt-3 border-t border-gray-200 pt-3">
                        <div className="flex justify-between text-sm font-semibold">
                            <span>Carried charge</span>

                            <span>
                                ₱
                                {formatNumber(
                                    carriedSupplementaryCharge
                                )}
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {supplementaryChargeBreakdown.length > 0 && (
                <div className="rounded-md border border-gray-200 bg-white p-4">
                    <p className="mb-3 text-sm font-semibold text-gray-900">
                        Current loan supplementary charges
                    </p>

                    <div className="space-y-2">
                        {supplementaryChargeBreakdown.map(
                            (item) => (
                                <div
                                    key={item.id}
                                    className="flex items-center justify-between text-sm"
                                >
                                    <div>
                                        <p className="text-gray-700">
                                            {formatMonthYear(
                                                item.chargeMonth
                                            )}
                                        </p>

                                        <p className="text-xs text-gray-500">
                                            Basis: ₱
                                            {formatNumber(
                                                item.principalBasis
                                            )}
                                        </p>
                                    </div>

                                    <span className="font-medium text-gray-900">
                                        ₱
                                        {formatNumber(
                                            item.outstandingAmount
                                        )}
                                    </span>
                                </div>
                            )
                        )}
                    </div>

                    <div className="mt-3 border-t border-gray-200 pt-3">
                        <div className="flex justify-between text-sm">
                            <span>
                                Selected {supplementaryChargeMonthsSelected} of{" "}
                                {supplementaryChargeAvailableMonths} month(s)
                            </span>

                            <span className="font-semibold">
                                ₱
                                {formatNumber(
                                    currentSupplementaryCharge
                                )}
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {/* Schedules */}
            {
                selectedPensioner && (
                    <div className="space-y-10">
                        <div className={`rounded-sm border ${HAIRLINE} bg-white p-8`}>
                            <ScheduleTable
                                title="UDI schedule spread"
                                columns={["#", "Date", "Unearned", "Earned"]}
                                rows={udiSchedule.map((item, index) => [
                                    index + 1,
                                    formatMonthYear(item.date),
                                    `₱${formatNumber(item.udiAmount)}`,
                                    `₱${formatNumber(item.udiEarnedAmount)}`,
                                ])}
                                emptyMessage="Loan schedule will appear here."
                            />
                        </div>

                        <div className={`rounded-sm border ${HAIRLINE} bg-white p-8`}>
                            <ScheduleTable
                                title="Loan schedule spread"
                                columns={["#", "Date", "beginning", "Amount", "Balance"]}
                                rows={loanSchedule.map((item, index) => [
                                    index + 1,
                                    formatMonthYear(item.date),
                                    `₱${formatNumber(item.beginning)}`,
                                    `₱${formatNumber(item.amount)}`,
                                    `₱${formatNumber(item.balance)}`,
                                ])}
                                emptyMessage="Loan schedule will appear here."
                            />
                        </div>

                        <div className={`rounded-sm border ${HAIRLINE} bg-white p-8`}>
                            <ScheduleTable
                                title="Supplementary loan schedule spread"
                                subtitle={
                                    supplementary > 0
                                        ? `SL ₱${formatNumber(supplementary)} | Total charge ₱${formatNumber(totalSupplementaryCharge)}`
                                        : undefined
                                }
                                columns={[
                                    "#",
                                    "Date",
                                    "Beginning balance",
                                    "Supplementary charge",
                                    "Payment",
                                    "Balance",
                                ]}
                                rows={slSchedule.map((item, index) => [
                                    index + 1,
                                    formatMonthYear(item.date),
                                    `₱${formatNumber(item.beginningBalance)}`,
                                    `₱${formatNumber(item.supplementaryCharge)}`,
                                    `₱${formatNumber(item.paymentAmount)}`,
                                    `₱${formatNumber(item.balance)}`,
                                ])}
                                emptyMessage="Supplementary loan schedule will appear here."
                            />
                        </div>
                    </div>
                )
            }
        </div >
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