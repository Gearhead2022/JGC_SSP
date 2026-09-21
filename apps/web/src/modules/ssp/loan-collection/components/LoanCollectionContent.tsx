"use client";

import { useForm } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { formatDateApi } from "@repo/shared";

import type {
    CreateLoanCollectionPayload,
} from "@repo/shared";

type LoanCollectionFormValues = {
    amount: number;
    remarks: string;
};

type LoanCollectionFormProps = {
    computationSlipId: string;
    pensionerId: string;

    pensionerName: string;

    collectionDate: string;

    installment: number;
    remainingBalance: number;

    onCreate?: (
        data: CreateLoanCollectionPayload
    ) => void;
};

const INK = "text-[#1B2430]";
const MUTED = "text-[#767F79]";
const HAIRLINE = "border-[#E2E4E1]";
const DASHED = "border-[#D3D7D4]";
const ACCENT = "text-[#1F4B3F]";

const fieldClass =
    "border-0 border-b border-[#D3D7D4] rounded-none bg-transparent px-0 py-1.5 " +
    "font-mono text-[15px] text-[#1B2430] shadow-none " +
    "focus-visible:ring-0 focus-visible:border-[#1F4B3F] focus-visible:outline-none";

const labelClass =
    `font-serif text-[13px] ${MUTED}`;

function SectionTitle({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <h3
            className={`border-b ${HAIRLINE} pb-2 font-serif text-[15px] ${INK}`}
        >
            {children}
        </h3>
    );
}

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
            <span
                className={
                    emphasis
                        ? `font-serif text-[15px] ${INK}`
                        : labelClass
                }
            >
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

export default function LoanCollectionForm({
    computationSlipId,
    pensionerId,
    pensionerName,
    collectionDate,
    installment,
    remainingBalance,
    onCreate,
}: LoanCollectionFormProps) {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<LoanCollectionFormValues>({
        defaultValues: {
            amount: Math.min(
                installment,
                remainingBalance
            ),
            remarks: "",
        },
    });

    const amount =
        Number(watch("amount")) || 0;

    const projectedBalance =
        Math.max(
            0,
            remainingBalance - amount
        );

    async function submit(
        data: LoanCollectionFormValues
    ) {
        const payload: CreateLoanCollectionPayload = {
            computationSlipId,
            pensionerId,
            collectionDate:
                formatDateApi(collectionDate),
            amount: data.amount,
            remarks:
                data.remarks || undefined,
        };

        onCreate?.(payload);
    }

    return (
        <div className="space-y-10 py-8">
            <div>
                <h1 className={`font-serif text-2xl ${INK}`}>
                    Loan collection
                </h1>

                <p
                    className={`mt-1 font-serif text-sm ${MUTED}`}
                >
                    Post the scheduled monthly collection
                    for this loan.
                </p>
            </div>

            <div
                className={`rounded-sm border ${HAIRLINE} bg-white p-8`}
            >
                <form
                    id="loan-collection-form"
                    onSubmit={handleSubmit(submit)}
                    className="space-y-10"
                >
                    {/* Loan Information */}
                    <div className="space-y-5">
                        <SectionTitle>
                            Loan information
                        </SectionTitle>

                        <div className="grid grid-cols-2 gap-x-6 gap-y-5">
                            <div className="col-span-2">
                                <Label className={labelClass}>
                                    Pensioner
                                </Label>

                                <Input
                                    type="text"
                                    value={pensionerName}
                                    readOnly
                                    className={fieldClass}
                                />
                            </div>

                            <div>
                                <Label className={labelClass}>
                                    Collection month
                                </Label>

                                <Input
                                    type="month"
                                    value={formatDateApi(
                                        collectionDate
                                    ).slice(0, 7)}
                                    readOnly
                                    className={fieldClass}
                                />
                            </div>

                            <div>
                                <Label className={labelClass}>
                                    Regular installment
                                </Label>

                                <Input
                                    type="number"
                                    value={installment}
                                    readOnly
                                    className={fieldClass}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Collection Input */}
                    <div className="space-y-5">
                        <SectionTitle>
                            Collection
                        </SectionTitle>

                        <div className="grid grid-cols-2 gap-x-6 gap-y-5">
                            <div>
                                <Label className={labelClass}>
                                    Collection amount
                                </Label>

                                <Input
                                    type="number"
                                    step="0.01"
                                    {...register(
                                        "amount",
                                        {
                                            valueAsNumber: true,
                                            required:
                                                "Collection amount is required",
                                            min: {
                                                value: 0.01,
                                                message:
                                                    "Amount must be greater than 0",
                                            },
                                            max: {
                                                value: remainingBalance,
                                                message:
                                                    "Amount cannot exceed remaining balance",
                                            },
                                        }
                                    )}
                                    className={fieldClass}
                                />

                                {errors.amount && (
                                    <p className="mt-1 text-xs text-red-500">
                                        {errors.amount.message}
                                    </p>
                                )}
                            </div>

                            <div>
                                <Label className={labelClass}>
                                    Remarks
                                </Label>

                                <Input
                                    type="text"
                                    {...register("remarks")}
                                    className={fieldClass}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Collection Summary */}
                    <div className="space-y-1">
                        <SectionTitle>
                            Collection summary
                        </SectionTitle>

                        <div className="pt-1">
                            <SlipLine
                                label="Beginning balance"
                                value={`₱${formatNumber(
                                    remainingBalance
                                )}`}
                            />

                            <SlipLine
                                label="Collection amount"
                                value={`₱${formatNumber(
                                    amount
                                )}`}
                            />

                            <SlipLine
                                label="Remaining balance"
                                value={`₱${formatNumber(
                                    projectedBalance
                                )}`}
                                emphasis
                            />
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

function formatNumber(
    value: number
): string {
    return new Intl.NumberFormat(
        "en-PH",
        {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }
    ).format(value);
}