import LoginForm from "../components/LoginForm";

export default function LoginView() {
    return (
        <main className="flex min-h-screen bg-[#FAF8F3]">
            {/* ── Brand panel ─────────────────────────────────────────── */}
            <div className="relative hidden w-[42%] flex-col justify-between overflow-hidden bg-gradient-to-b from-[#0F3D3E] to-[#0A2E2E] px-12 py-14 text-white lg:flex">
                {/* quiet decorative arcs — subject-appropriate, not a generic gradient blob */}
                <svg
                    className="pointer-events-none absolute -right-24 -top-24 h-[520px] w-[520px] opacity-[0.12]"
                    viewBox="0 0 400 400"
                    fill="none"
                >
                    <circle cx="200" cy="200" r="199" stroke="#EFE6D3" strokeWidth="1" />
                    <circle cx="200" cy="200" r="150" stroke="#EFE6D3" strokeWidth="1" />
                    <circle cx="200" cy="200" r="100" stroke="#EFE6D3" strokeWidth="1" />
                </svg>
 
                <div className="relative">
                    <div className="mb-1 h-px w-8 bg-[#B08D57]" />
                    <h1 className="font-serif text-3xl tracking-tight text-white">
                        LMCS
                    </h1>
                    <p className="font-thin">Loan Management & Collection System</p>
                </div>
 
                <div className="relative max-w-xs">
                    <p className="font-serif text-2xl leading-snug text-white/95">
                        Manage every loan from application to payoff, all in one place.
                    </p>
                    <p className="mt-4 text-sm leading-relaxed text-white/50">
                     Underwriting, documents, and servicing tasks — all unified to keep your pipeline moving fast.
                    </p>
                </div>
            </div>
 
            {/* ── Form panel ──────────────────────────────────────────── */}
            <div className="flex w-full flex-1 items-center justify-center px-6 py-16 lg:w-[58%]">
                <div className="w-full max-w-sm">
                    <div className="mb-10 lg:hidden">
                        <div className="mb-1 h-px w-8 bg-[#B08D57]" />
                        <h1 className="font-serif text-2xl text-[#0F3D3E]">WorkSpace</h1>
                    </div>
 
                    <h2 className="font-serif text-2xl text-[#1F2937]">Welcome back</h2>
                    <p className="mt-1.5 text-sm text-[#6B7280]">
                        Sign in to continue to your workspace.
                    </p>
 
                    <div className="mt-8">
                        <LoginForm />
                    </div>
 
                    <p className="mt-8 text-sm text-[#6B7280]">
                        Need help?{" "}
                        <a href="/contact-admin" className="font-medium text-[#0F3D3E] hover:text-[#0A2E2E]">
                            Contact your workspace admin
                        </a>
                    </p>
                </div>
            </div>
        </main>
    
    );
}