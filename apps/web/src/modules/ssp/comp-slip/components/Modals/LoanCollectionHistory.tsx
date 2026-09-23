"use client";

import Modal from "@/components/common/ModalHeader";
import { Button } from "@/components/ui/button";

import LoanCollectionHistory from "../../../loan-collection/components/LoanCollectionHistory";
import { useLoanCollectionHistory } from "../../../loan-collection/hooks/useLoanCollection";
import { useDisclosure } from "@/hooks/useDisclosure";
import { CompslipListItem, Pensioner } from "@repo/shared";

import LoanCollectionScheduleSpreadModal from "./LoanCollectionScheduleSpreadModal";
import UDIRebateScheduleSpreadModal from "./UDIScheduleSpreadModal";
import SupplementaryLoanScheduleSpreadModal from "./SupplementaryLoanScheduleSpreadModal";

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
    const udirebateSchedulesModal = useDisclosure();
    const supplementaryLoanSchedulesModal = useDisclosure();

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
                            <div className="space-y-3 text-right mt-[-30] space-x-2">
                                <Button
                                    type="button"
                                    className="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-50"
                                    onClick={collectionSchedulesModal.open}
                                >
                                    View Loan Schedule
                                </Button>
                                <Button
                                    type="button"
                                    className="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-50"
                                    onClick={udirebateSchedulesModal.open}
                                >
                                    View UDI Rebate Schedule
                                </Button>
                                <Button
                                    type="button"
                                    className="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-50"
                                    onClick={supplementaryLoanSchedulesModal.open}
                                >
                                    View SL LOan Schedule
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

            {/* UDI Rrebate Schedule Modal */}
            <Modal
                isOpen={udirebateSchedulesModal.isOpen}
                onClose={udirebateSchedulesModal.close}
                title=""
                size="xl"
                footer={
                    <>
                        <Button
                            type="button"
                            onClick={udirebateSchedulesModal.close}
                        >
                            Cancel
                        </Button>
                    </>
                }
            >
                {/* Collection Schedule Spread */}
                <UDIRebateScheduleSpreadModal
                    isOpen={
                        udirebateSchedulesModal.isOpen
                    }
                    onClose={
                        udirebateSchedulesModal.close
                    }

                    selectedLoan={selectedLoan}
                />
            </Modal>

            {/* Supplementary Loan Schedule Modal */}
            <Modal
                isOpen={supplementaryLoanSchedulesModal.isOpen}
                onClose={supplementaryLoanSchedulesModal.close}
                title=""
                size="xl"
                footer={
                    <>
                        <Button
                            type="button"
                            onClick={supplementaryLoanSchedulesModal.close}
                        >
                            Cancel
                        </Button>
                    </>
                }
            >
                {/* Collection Schedule Spread */}
                <SupplementaryLoanScheduleSpreadModal
                    isOpen={supplementaryLoanSchedulesModal.isOpen}
                    onClose={supplementaryLoanSchedulesModal.close}
                    selectedLoan={selectedLoan}
                />
            </Modal>
        </>
    );
}