"use client";

import Modal from "@/components/common/ModalHeader";
import { Button } from "@/components/ui/button";

import LoanCollectionHistory from "../../../loan-collection/components/LoanCollectionHistory";
import { useLoanCollectionHistory } from "../../../loan-collection/hooks/useLoanCollection";
import { useDisclosure } from "@/hooks/useDisclosure";
import LoanCollectionScheduleSpreadModal from "./LoanCollectionScheduleSpreadModal";
import { CompslipListItem, Pensioner } from "@repo/shared";

type LoanCollectionDetailsModalProps = {
    isOpen: boolean;
    onClose: () => void;
    computationSlipId: string | null;
    accountNumber?: string;
    selectedPensioner: Pensioner | null;
    selectedLoan: CompslipListItem | null;
};

export default function LoanCollectionDetailsModal({
    isOpen,
    onClose,
    computationSlipId,
    accountNumber,
    selectedPensioner,
    selectedLoan
}: LoanCollectionDetailsModalProps) {

    const { data: collectionHistory = [], isLoading, isError } = useLoanCollectionHistory(computationSlipId ?? undefined);

    const collectionSchedulesModal = useDisclosure();

    return (
        <>
            <Modal
                isOpen={isOpen}
                onClose={onClose}
                title={
                    accountNumber
                        ? `Collection Details - ${accountNumber}`
                        : "Collection Details"
                }
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
                <div className="space-y-5 ">
                    {isError ? (
                        <div className="rounded-md border border-gray-200 bg-gray-50 p-5">
                            <p className="text-sm font-medium text-gray-900">
                                Failed to load collection history.
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="space-y-3 text-right mt-[-30]">
                                <Button
                                    type="button"
                                    className="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-50"
                                    onClick={collectionSchedulesModal.open}
                                >
                                    View Schedule
                                </Button>
                            </div>
                            <LoanCollectionHistory
                                collections={collectionHistory}
                                isLoading={isLoading}
                            />
                        </>
                    )}
                </div>
            </Modal>

            {/* Computation Slip Modal */}
            <Modal
                isOpen={collectionSchedulesModal.isOpen}
                onClose={collectionSchedulesModal.close}
                title="New Computation Slip"
                size="xl"
                footer={
                    <>
                        <Button
                            type="button"
                            onClick={collectionSchedulesModal.close}
                        >
                            Cancel
                        </Button>
                    </>
                }
            >
                {/* Collection Schedule Spread */}
                <LoanCollectionScheduleSpreadModal
                    isOpen={
                        collectionSchedulesModal.isOpen
                    }
                    onClose={
                        collectionSchedulesModal.close
                    }
                    accountNumber={accountNumber}
                    selectedLoan={selectedLoan}
                />
            </Modal>
        </>
    );
}