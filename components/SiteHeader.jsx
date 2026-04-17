import { useLocation, useNavigate } from "react-router-dom";
import posterImage from "../assets/poster.jpg";

function scrollToSection(sectionId) {
  if (sectionId === "top") {
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }

  const targetElement = document.getElementById(sectionId);
  targetElement?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function SiteHeader({ primaryAction }) {
  const location = useLocation();
  const navigate = useNavigate();

  const goHome = () => {
    if (location.pathname === "/") {
      scrollToSection("top");
      return;
    }

    navigate("/");
  };

  const goToSection = (sectionId) => {
    if (location.pathname === "/") {
      scrollToSection(sectionId);
      return;
    }

    navigate(`/#${sectionId}`);
  };

  const handlePrimaryAction = () => {
    if (!primaryAction) {
      return;
    }

    if (primaryAction.onClick) {
      primaryAction.onClick();
      return;
    }

    if (primaryAction.section) {
      goToSection(primaryAction.section);
      return;
    }

    if (primaryAction.to) {
      navigate(primaryAction.to);
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/40 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <button
          type="button"
          onClick={goHome}
          className="flex min-w-0 items-center gap-3 text-left hover:opacity-80"
          aria-label="Go to Tuko Kadi home"
        >
          <img
            src={posterImage}
            alt="Tuko Kadi"
            className="h-14 w-14 shrink-0 rounded-xl object-cover"
          />
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-[0.28em] text-white/45">
              Register Na Mbogi
            </p>
            <h1 className="text-lg font-black uppercase tracking-wide leading-none">
              Tuko Kadi
            </h1>
          </div>
        </button>

        <div className="hidden items-center gap-8 text-sm text-white/70 md:flex">
          <button
            type="button"
            onClick={() => goToSection("features")}
            className="hover:text-white"
          >
            What you can do
          </button>
          <button
            type="button"
            onClick={() => goToSection("centres")}
            className="hover:text-white"
          >
            Centres
          </button>
          <button
            type="button"
            onClick={() => goToSection("groups")}
            className="hover:text-white"
          >
            Groups
          </button>
        </div>

        {primaryAction ? (
          <button
            type="button"
            onClick={handlePrimaryAction}
            className="rounded-full bg-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-red-900/30 transition hover:scale-[1.02] hover:bg-red-500"
          >
            {primaryAction.label}
          </button>
        ) : null}
      </div>
    </header>
  );
}
