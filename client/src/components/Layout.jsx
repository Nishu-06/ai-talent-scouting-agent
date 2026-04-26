import { NavLink } from "react-router-dom";

const navItems = [
  { label: "Home", to: "/" },
  { label: "Candidates", to: "/candidates" },
  { label: "Chat", to: "/chat" },
  { label: "Dashboard", to: "/dashboard" },
];

function Layout({ children }) {
  return (
    <div className="min-h-screen bg-grid bg-[size:26px_26px]">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <header className="section-shell shine-edge animate-enter mb-6 overflow-hidden">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl animate-enter animate-enter-delay-1">
              <p className="float-gentle mb-3 inline-flex rounded-full border border-brand/20 bg-brand/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-brand">
                AI Recruitment Copilot
              </p>
              <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Talent scouting with explainable matching and interest scoring
              </h1>
              <p className="mt-3 text-sm leading-6 text-slate-300 sm:text-base">
                Paste a job description, discover strong candidates, simulate outreach, and leave with a recruiter-ready shortlist.
              </p>
            </div>

            <div className="animate-enter animate-enter-delay-2 flex flex-col items-start justify-start gap-5 self-start lg:items-end">
              <p className="inline-flex rounded-full border border-brand/20 bg-brand/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-brand">
                Deccan AI Catalyst Hackathon Submission
              </p>
              <nav className="flex flex-wrap gap-3">
                {navItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      `button-lift rounded-full px-4 py-2 text-sm font-medium transition ${
                        isActive
                          ? "bg-white text-slate-900"
                          : "border border-white/10 bg-white/5 text-slate-200 hover:border-brand/30 hover:bg-brand/10"
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                ))}
              </nav>
            </div>
          </div>
        </header>

        <main className="animate-enter animate-enter-delay-2 flex-1">{children}</main>
      </div>
    </div>
  );
}

export default Layout;
