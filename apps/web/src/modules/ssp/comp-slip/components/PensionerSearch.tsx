"use client";

import { Search } from "lucide-react";
import { useState } from "react";

import { usePensionerSearch } from "../hooks/usePensionerSearch";
import type { Pensioner } from "@repo/shared";
import { useDebounce } from "@/hooks/useDebounce";

type PensionerSearchProps = {
    onSelect?: (pensioner: Pensioner) => void;
};

export default function PensionerSearch({
    onSelect,
}: PensionerSearchProps) {
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 500);

    const {
        data,
        isLoading,
        isError,
    } = usePensionerSearch({ search: debouncedSearch });

    const pensioners = data?.data ?? [];

    return (
        <div className="rounded-lg border border-gray-200 bg-white p-5">
            <div className="mb-4">
                <h2 className="text-base font-semibold text-gray-900">
                    Search Pensioner
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                    Find a pensioner to start a new computation.
                </p>
            </div>

            <div className="max-w-2xl">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

                    <input
                        type="text"
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Search by pensioner name..."
                        className="h-10 w-full rounded-md border border-gray-300 bg-white pl-9 pr-3 text-sm text-black outline-none transition placeholder:text-gray-400 focus:border-gray-500"
                    />
                </div>

                {search.trim().length >= 2 && (
                    <div className="mt-2 overflow-hidden rounded-md border border-gray-200">
                        {isLoading && (
                            <div className="px-4 py-3 text-sm text-gray-500">
                                Searching pensioners...
                            </div>
                        )}

                        {isError && (
                            <div className="px-4 py-3 text-sm text-red-500">
                                Failed to load pensioners.
                            </div>
                        )}

                        {!isLoading &&
                            !isError &&
                            pensioners.length === 0 && (
                                <div className="px-4 py-3 text-sm text-gray-500">
                                    No pensioner found.
                                </div>
                            )}

                        {pensioners.map((pensioner: Pensioner) => (
                            <button
                                key={pensioner.id}
                                type="button"
                                onClick={() => onSelect?.(pensioner)}
                                className="flex w-full items-center justify-between border-b border-gray-100 px-4 py-3 text-left last:border-b-0 hover:bg-gray-50"
                            >
                                <div>
                                    <p className="text-sm font-medium text-gray-900">
                                        {pensioner.lastName},{" "}
                                        {pensioner.firstName}{" "}
                                        {pensioner.middleName}
                                    </p>

                                    <p className="mt-1 text-xs text-gray-500">
                                        Pensioner ID: {pensioner.id}
                                    </p>
                                </div>

                                <div className="text-right">
                                    <p className="text-sm font-medium text-gray-900">
                                        ₱
                                        {Number(
                                            pensioner.actualPension
                                        ).toLocaleString("en-PH", {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        })}
                                    </p>

                                    <p className="text-xs text-gray-500">
                                        Actual Pension
                                    </p>
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}