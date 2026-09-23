type ApplySupplementaryPaymentParams = {
    paymentAmount: number;

    supplementaryBalance: number;

    supplementaryChargeAmount: number;

    applyCharge: boolean;
};

type SupplementaryPaymentResult = {
    paymentAmount: number;

    chargeDue: number;
    chargePaid: number;
    remainingCharge: number;

    principalPaid: number;

    beginningBalance: number;
    endingBalance: number;

    unappliedAmount: number;
};

export function applySupplementaryPayment({
    paymentAmount,
    supplementaryBalance,
    supplementaryChargeAmount,
    applyCharge,
}: ApplySupplementaryPaymentParams): SupplementaryPaymentResult {
    const beginningBalance =
        Math.max(0, supplementaryBalance);

    let remainingPayment =
        Math.max(0, paymentAmount);

    let chargePaid = 0;

    /**
     * Charge first, when selected.
     */
    if (
        applyCharge &&
        supplementaryChargeAmount > 0
    ) {
        chargePaid =
            Math.min(
                remainingPayment,
                supplementaryChargeAmount
            );

        remainingPayment -=
            chargePaid;
    }

    /**
     * Any remaining payment goes
     * to supplementary principal.
     */
    const principalPaid =
        Math.min(
            remainingPayment,
            beginningBalance
        );

    remainingPayment -=
        principalPaid;

    const endingBalance =
        Math.max(
            0,
            beginningBalance -
            principalPaid
        );

    const remainingCharge =
        applyCharge
            ? Math.max(
                0,
                supplementaryChargeAmount -
                chargePaid
            )
            : supplementaryChargeAmount;

    return {
        paymentAmount:
            roundMoney(paymentAmount),

        chargeDue:
            roundMoney(
                supplementaryChargeAmount
            ),

        chargePaid:
            roundMoney(chargePaid),

        remainingCharge:
            roundMoney(
                remainingCharge
            ),

        principalPaid:
            roundMoney(
                principalPaid
            ),

        beginningBalance:
            roundMoney(
                beginningBalance
            ),

        endingBalance:
            roundMoney(
                endingBalance
            ),

        unappliedAmount:
            roundMoney(
                remainingPayment
            ),
    };
}

function roundMoney(
    value: number
): number {
    return Math.round(value * 100) / 100;
}