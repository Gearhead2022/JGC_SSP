"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { loginSchema, type LoginSchema } from "@repo/shared";
import { useLogin } from "../hooks/useLogin";
import SweetAlert from "@/lib/alerts/alert";

export default function LoginForm() {
    const {
        mutateAsync: login,
        isPending,
    } = useLogin();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginSchema>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            username: "",
            password: "",
        },
    });

    async function onSubmit(data: LoginSchema) {

        try {
            await login(data);
            SweetAlert.successAlert(
                "Success",
                "Login successful"
            );
        } catch (error) {
            SweetAlert.errorAlert(
                "Error",
                "Invalid credentials"
            );
        }
    }

    return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
            <div className="space-y-1.5">
                <label htmlFor="username" className="text-sm font-medium text-[#1F2937]">
                    Username
                </label>
                <input
                    id="username"
                    type="text"
                    autoComplete="username"
                    disabled={isPending}
                    {...register("username")}
                    placeholder="you@company.com"
                    className="
                        h-11 w-full rounded-md border border-[#E4DFD3] bg-white
                        px-3.5 text-sm text-[#1F2937] placeholder:text-[#9CA3AF]
                        outline-none transition
                        focus:border-[#0F3D3E] focus:shadow-[0_1px_0_0_#B08D57]
                        disabled:cursor-not-allowed disabled:opacity-60
                    "
                />
                {errors.username && (
                    <p className="text-sm text-red-600">{errors.username.message}</p>
                )}
            </div>
 
            <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                    <label htmlFor="password" className="text-sm font-medium text-[#1F2937]">
                        Password
                    </label>
                    <a href="/forgot-password" className="text-xs font-medium text-[#0F3D3E]/70 hover:text-[#0F3D3E]">
                        Forgot?
                    </a>
                </div>
                <input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    disabled={isPending}
                    {...register("password")}
                    placeholder="••••••••"
                    className="
                        h-11 w-full rounded-md border border-[#E4DFD3] bg-white
                        px-3.5 text-sm text-[#1F2937] placeholder:text-[#9CA3AF]
                        outline-none transition
                        focus:border-[#0F3D3E] focus:shadow-[0_1px_0_0_#B08D57]
                        disabled:cursor-not-allowed disabled:opacity-60
                    "
                />
                {errors.password && (
                    <p className="text-sm text-red-600">{errors.password.message}</p>
                )}
            </div>
 
            <button
                type="submit"
                disabled={isPending}
                className="
                    mt-2 h-11 w-full rounded-md bg-[#0F3D3E] text-sm font-medium
                    text-white transition
                    hover:bg-[#0A2E2E]
                    disabled:cursor-not-allowed disabled:opacity-60
                "
            >
                {isPending ? "Signing in…" : "Sign in"}
            </button>
        </form>
    );
}