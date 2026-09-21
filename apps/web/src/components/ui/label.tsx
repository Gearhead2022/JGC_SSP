import * as React from "react";
import { cn } from "@/utils/cn";

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
    children: React.ReactNode;
}

const labelCls =
    "mb-1.5 block text-[11px] font-semibold uppercase tracking-widest text-[#6b7da0]";

function Label({ children, className, ...props }: LabelProps) {
    return (
        <label
            className={cn(labelCls, className)}
            {...props}
        >
            {children}
        </label>
    );
}

export { Label };