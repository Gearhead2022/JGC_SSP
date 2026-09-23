"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";

type ModalSize = "sm" | "md" | "lg" | "xl";

type ModalProps = {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: ReactNode;
    size?: ModalSize;
    footer?: ReactNode;
};

const sizeClasses: Record<ModalSize, string> = {
    sm: "max-w-sm",
    md: "max-w-lg",
    lg: "max-w-3xl",
    xl: "max-w-5xl",
};

export default function Modal({
    isOpen,
    onClose,
    title,
    children,
    size = "md",
    footer,
}: ModalProps) {
    useEffect(() => {
        if (!isOpen) return;

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        document.body.style.overflow = "hidden";
        window.addEventListener("keydown", handleEscape);

        return () => {
            document.body.style.overflow = "";
            window.removeEventListener(
                "keydown",
                handleEscape
            );
        };
    }, [isOpen, onClose]);


    if (!isOpen) {
        return null;
    }

    return (
        <div
            className="
                fixed
                inset-0
                z-50
                flex
                items-center
                justify-center
                bg-black/50
                p-4
            "
            onMouseDown={onClose}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby={
                    title ? "modal-title" : undefined
                }
                onMouseDown={(event) =>
                    event.stopPropagation()
                }
                className={`
                    flex
                    max-h-[90vh]
                    w-full
                    flex-col
                    overflow-hidden
                    rounded-xl
                    bg-white
                    shadow-2xl
                    animate-in
                    fade-in
                    zoom-in-95
                    ${sizeClasses[size]}
                `}
            >
                {title && (
                    <div className="
                        flex
                        items-center
                        justify-between
                        border-b
                        px-6
                        py-4
                    ">
                        <h2
                            id="modal-title"
                            className="text-lg font-semibold text-slate-700 uppercase"
                        >
                            {title}
                        </h2>

                        <button
                            type="button"
                            onClick={onClose}
                            aria-label="Close modal"
                            className="
                                rounded-md
                                p-2
                                text-red-500
                                transition
                                hover:bg-gray-100
                                hover:text-gray-900
                            "
                        >
                            ✕
                        </button>
                    </div>
                )}

                <div className="flex-1 overflow-y-auto p-6">
                    {children}
                </div>

                {footer && (
                    <div className="
                        flex
                        justify-end
                        gap-3
                        border-t
                        px-6
                        py-4
                    ">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
}