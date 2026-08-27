import axios from "axios";
import type { ApiErrorResponse } from "@repo/shared";

export function getApiErrorMessage(
    error: unknown,
    fallback = "Something went wrong."
): string {
    if (axios.isAxiosError<ApiErrorResponse>(error)) {
        return error.response?.data?.message ?? fallback;
    }

    return fallback;
}