"use client"

import { Pensioner } from "@repo/shared";
import { WalletCards } from "lucide-react"
import { useState } from "react";
import { useActiveLoanCollection } from "../../loan-collection/hooks/useLoanCollection";

export default function SupplemantaryCollectionView() {

    const [selectedPensioner, setSelectedPensioner] = useState<Pensioner | null>(null);
    const [selectedAccountNumber, setSelectedAccountNumber,] = useState<string>("");

    const { data: activeLoansList, isLoading: isActiveLoansLoading } = useActiveLoanCollection(selectedPensioner?.id);
    const activeLoans = activeLoansList?.data ?? [];


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
        </div>

    )
}