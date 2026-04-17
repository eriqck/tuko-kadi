import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import posterImage from "./assets/poster.jpg";
import SiteHeader from "./components/SiteHeader";
import { useAppData } from "./context/AppDataContext";
import { REGISTRATION_CHECKLIST } from "./lib/content";
import {
  buildAbsoluteUrl,
  buildWhatsAppUrl,
  formatDepartureTime,
  formatDistanceKm,
  formatGroupMembers,
  getDirectionsUrl,
} from "./lib/app-utils";

const STEPS = [
  "Choose your town or use your live location",
  "Pick the nearest centre with open hours",
  "Join a mbogi or create your own trip",
  "Register and share the link with more people",
];

function AnimatedStat({ value, label }) {
  const [display, setDisplay] = useState("0");
  const rafRef = useRef(null);

  useEffect(() => {
    const match = String(value).match(/^([0-9,.]+)\s*([A-Za-z+%]*)$/);

    if (!match) {
      setDisplay(value);
      return;
    }

    const numberValue = parseFloat(match[1].replace(/,/g, ""));
    const suffix = match[2] || "";
    const duration = 1200;
    const start = performance.now();

    const step = (time) => {
      const progress = Math.min(1, (time - start) / duration);
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.round(numberValue * easedProgress);
      setDisplay(`${currentValue}${suffix}`);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step);
      }
    };

    rafRef.current = requestAnimationFrame(step);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [value]);

  return (
    <div className="rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur">
      <div className="text-2xl font-black">{display}</div>
      <div className="mt-1 text-xs text-white/60">{label}</div>
    </div>
  );
}

export default function TukoKadiLanding() {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    centres,
    groups,
    joinGroup,
    leaveGroup,
    locationError,
    locationStatus,
    requestLocation,
    stats,
    userCoords,
  } = useAppData();
  const [centreQuery, setCentreQuery] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("");

  const previewCentres = centres.slice(0, 3);
  const previewGroups = groups.slice(0, 3);

  useEffect(() => {
    if (!location.hash) {
      return;
    }

    const sectionId = location.hash.replace("#", "");
    const timerId = window.setTimeout(() => {
      document
        .getElementById(sectionId)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 60);

    return () => window.clearTimeout(timerId);
  }, [location.hash]);

  useEffect(() => {
    if (!feedbackMessage) {
      return undefined;
    }

    const timerId = window.setTimeout(() => setFeedbackMessage(""), 3000);
    return () => window.clearTimeout(timerId);
  }, [feedbackMessage]);

  const goTo = (sectionId) => {
    document
      .getElementById(sectionId)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const openWhatsApp = (message) => {
    window.open(
      buildWhatsAppUrl(message),
      "_blank",
      "noopener,noreferrer",
    );
  };

  const handleShareMovement = () => {
    openWhatsApp(
      `I am registering with Tuko Kadi. Join me here: ${buildAbsoluteUrl("/")}`,
    );
  };

  const handleFindCentres = (event) => {
    event.preventDefault();

    const trimmedQuery = centreQuery.trim();
    const search = trimmedQuery
      ? `?q=${encodeURIComponent(trimmedQuery)}`
      : "";

    navigate(`/centres${search}`);
  };

  const handleShareCentre = (centre) => {
    openWhatsApp(
      `Let us register at ${centre.name} in ${centre.place}. Get directions here: ${buildAbsoluteUrl(
        `/centres?centre=${centre.id}`,
      )}`,
    );
  };

  const handleShareGroup = (group) => {
    openWhatsApp(
      `Join ${group.name}. Meet at ${group.meetingPoint}. ${formatDepartureTime(
        group.departureTime,
      )}. Group link: ${buildAbsoluteUrl(`/groups?group=${group.id}`)}`,
    );
  };

  const handleGroupAction = (group) => {
    const actionWorked = group.isJoined
      ? leaveGroup(group.id)
      : joinGroup(group.id);

    if (!actionWorked) {
      return;
    }

    setFeedbackMessage(
      group.isJoined
        ? `You left ${group.name}.`
        : `You joined ${group.name}.`,
    );
  };

  const featureCards = [
    {
      title: "Find where to register",
      text: "Use search or your current location to sort centres by what is closest right now.",
      onClick: () => navigate("/centres"),
    },
    {
      title: "Go with your people",
      text: "Join an active mbogi or create one and keep the trip together in one place.",
      onClick: () => navigate("/groups"),
    },
    {
      title: "See who is showing up",
      text: "Live counts update from the groups people are actually joining in this browser.",
      onClick: () => goTo("groups"),
    },
    {
      title: "Know what to carry",
      text: "Check the essentials before you leave so the trip stays smooth from start to finish.",
      onClick: () => goTo("requirements"),
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <SiteHeader primaryAction={{ label: "Get Started", section: "centres" }} />

      <main>
        <section className="relative isolate overflow-hidden">
          <img
            src={posterImage}
            alt="Tuko Kadi Movement"
            className="absolute inset-0 h-full w-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-black/60" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(239,68,68,0.18),transparent_30%)]" />

          <div className="relative mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-28">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white/70">
                <span className="h-2 w-2 rounded-full bg-red-500" />
                Mass Voter Registration
              </div>

              <h2 className="mt-6 text-5xl font-black uppercase leading-[0.92] md:text-7xl">
                Niko kadi je wewe?
                <span className="block text-red-600">Jiandikishe leo</span>
              </h2>

              <p className="mt-6 max-w-2xl text-base leading-7 text-white/80 md:text-lg">
                Find the nearest centre, join a group, and move with people who
                are already planning the trip.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4">
                <button
                  type="button"
                  onClick={() => goTo("centres")}
                  className="w-full rounded-full bg-red-600 px-7 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-white shadow-xl shadow-red-900/25 transition hover:bg-red-500"
                >
                  Find where to go
                </button>
                <button
                  type="button"
                  onClick={() => goTo("groups")}
                  className="w-full rounded-full border border-white/20 bg-white/5 px-7 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-white/10"
                >
                  Go with friends
                </button>
              </div>

              <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4">
                {stats.map((stat) => (
                  <AnimatedStat
                    key={stat.label}
                    value={stat.value}
                    label={stat.label}
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center justify-center">
              <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-3 shadow-2xl shadow-black/40 backdrop-blur">
                <img
                  src={posterImage}
                  alt="Movement poster"
                  className="h-[600px] w-full rounded-[1.5rem] object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        <section
          id="features"
          className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16"
        >
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-red-500">
                What you can do
              </p>
              <h3 className="mt-3 text-3xl font-black uppercase md:text-5xl">
                Everything starts with you
              </h3>
            </div>
            <p className="max-w-xl text-white/60">
              Move fast with clear next steps, nearby centres, and people
              already planning the trip.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {featureCards.map((feature) => (
              <button
                key={feature.title}
                type="button"
                onClick={feature.onClick}
                className="rounded-[1.8rem] border border-red-600 bg-gray-800 p-6 text-left text-white shadow-sm shadow-black/10 transition hover:-translate-y-1 hover:border-red-500 hover:shadow-xl"
              >
                <h4 className="text-xl font-bold">{feature.title}</h4>
                <p className="mt-3 text-sm leading-7 text-white/60">
                  {feature.text}
                </p>
              </button>
            ))}
          </div>

          <div className="mt-8 text-center">
            <button
              type="button"
              onClick={handleShareMovement}
              className="inline-flex items-center gap-2 rounded-full bg-green-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-green-500"
            >
              Share on WhatsApp
            </button>
          </div>
        </section>

        <section
          id="centres"
          className="mx-auto max-w-7xl px-6 py-8 lg:px-8 lg:py-12"
        >
          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-[2rem] border border-white/10 bg-red-600 p-8 text-white">
              <p className="text-sm uppercase tracking-[0.28em] text-white/70">
                Near you
              </p>
              <h3 className="mt-3 text-3xl font-black uppercase md:text-5xl">
                Find a place you can actually go today
              </h3>
              <p className="mt-4 text-white/85">
                Search by town, or let your phone sort centres by distance.
              </p>

              <form onSubmit={handleFindCentres} className="mt-8">
                <label
                  htmlFor="home-centre-search"
                  className="text-sm text-white/70"
                >
                  Search by town, estate, campus, or county
                </label>
                <input
                  id="home-centre-search"
                  type="search"
                  value={centreQuery}
                  onChange={(event) => setCentreQuery(event.target.value)}
                  placeholder="Thika, Juja, Ruiru..."
                  className="mt-3 w-full rounded-full bg-white/10 px-4 py-3 text-sm font-medium text-white placeholder:text-white/55 focus:outline-none focus:ring-2 focus:ring-white/30"
                />

                <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                  <button
                    type="submit"
                    className="w-full rounded-full bg-white/10 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/20"
                  >
                    Explore all centres
                  </button>
                  <button
                    type="button"
                    onClick={requestLocation}
                    className="w-full rounded-full border border-white/20 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/10"
                  >
                    {locationStatus === "loading"
                      ? "Locating..."
                      : "Use my location"}
                  </button>
                </div>
              </form>

              <p className="mt-4 text-sm text-white/80">
                {locationStatus === "ready"
                  ? "Centres below are now sorted by your current location."
                  : "Search any town now, then refine with your live location."}
              </p>

              {locationError ? (
                <p className="mt-3 text-sm text-white">{locationError}</p>
              ) : null}
            </div>

            <div className="grid gap-4">
              {previewCentres.map((centre) => (
                <div
                  key={centre.id}
                  className="rounded-[1.8rem] border border-red-600 bg-gray-800 p-6 text-white shadow-sm shadow-black/10 transition-shadow hover:shadow-lg"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <h4 className="text-xl font-bold">{centre.name}</h4>
                      <p className="mt-1 text-sm text-white/55">
                        {centre.place}, {centre.county}
                      </p>
                      <p className="mt-2 text-xs text-white/45">
                        {centre.landmark}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2 text-xs uppercase tracking-[0.18em] text-white/60">
                      <span className="rounded-full border border-white/10 px-3 py-2">
                        {centre.status}
                      </span>
                      <span className="rounded-full border border-red-500/30 bg-red-500/10 px-3 py-2 text-red-400">
                        {formatDistanceKm(centre.distanceKm)}
                      </span>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                    <a
                      href={getDirectionsUrl(centre, userCoords)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 rounded-full bg-white/10 px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-white/20"
                    >
                      View directions
                    </a>

                    <button
                      type="button"
                      onClick={() => handleShareCentre(centre)}
                      className="flex-1 rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                    >
                      Share on WhatsApp
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <button
              type="button"
              onClick={() => navigate("/groups")}
              className="w-full rounded-full bg-white/10 px-6 py-4 text-sm font-bold uppercase tracking-[0.18em] text-white transition hover:bg-white/20"
            >
              Create your group
            </button>
          </div>
        </section>

        <section
          id="groups"
          className="mx-auto max-w-7xl px-6 py-10 lg:px-8 lg:py-16"
        >
          <div className="mb-8">
            <p className="text-sm uppercase tracking-[0.28em] text-red-500">
              Go together
            </p>
            <h3 className="mt-3 text-3xl font-black uppercase md:text-5xl">
              Join a mbogi instead of going solo
            </h3>
          </div>

          {feedbackMessage ? (
            <div className="mb-6 rounded-2xl border border-green-500/30 bg-green-500/10 px-5 py-4 text-sm text-green-100">
              {feedbackMessage}
            </div>
          ) : null}

          <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="grid gap-4">
              {previewGroups.map((group) => (
                <div
                  key={group.id}
                  className="rounded-[1.8rem] border border-red-600 bg-gray-800 p-6 text-white shadow-sm shadow-black/10 transition-shadow hover:shadow-lg"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <h4 className="text-xl font-bold">{group.name}</h4>
                      <p className="mt-2 text-sm text-white/60">
                        {formatGroupMembers(group.memberCount)}
                      </p>
                      <p className="mt-2 text-sm text-white/45">
                        Meet at {group.meetingPoint}
                      </p>
                      {group.centre ? (
                        <p className="mt-1 text-sm text-white/45">
                          Heading to {group.centre.name}
                        </p>
                      ) : null}
                    </div>

                    <div className="rounded-full border border-white/10 px-4 py-2 text-xs uppercase tracking-[0.18em] text-white/60">
                      {formatDepartureTime(group.departureTime)}
                    </div>
                  </div>

                  <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                    <button
                      type="button"
                      onClick={() => handleGroupAction(group)}
                      className="flex-1 rounded-full bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-500"
                    >
                      {group.isJoined ? "Leave group" : "Join group"}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleShareGroup(group)}
                      className="flex-1 rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                    >
                      Share invite
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/[0.07] to-white/[0.02] p-8">
              <p className="text-sm uppercase tracking-[0.28em] text-white/45">
                Start your own
              </p>
              <h3 className="mt-3 text-3xl font-black uppercase">
                Bring your friends and make it happen
              </h3>
              <p className="mt-4 text-white/65">
                Create a group for your estate, church, school, campus, or
                friend circle and take everyone to the same centre together.
              </p>

              <div className="mt-8 space-y-3">
                <div className="rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white/70">
                  Pick a centre
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white/70">
                  Add your meeting point
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white/70">
                  Share the invite link on WhatsApp
                </div>
              </div>

              <button
                type="button"
                onClick={() => navigate("/groups")}
                className="mt-6 w-full rounded-full bg-white px-6 py-4 text-sm font-bold uppercase tracking-[0.18em] text-black transition hover:bg-white/90"
              >
                Create your group
              </button>
            </div>
          </div>
        </section>

        <section
          id="requirements"
          className="mx-auto max-w-7xl px-6 pb-8 lg:px-8"
        >
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-8">
            <p className="text-sm uppercase tracking-[0.28em] text-white/45">
              Know what to carry
            </p>
            <h3 className="mt-3 text-3xl font-black uppercase md:text-4xl">
              Leave home ready
            </h3>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {REGISTRATION_CHECKLIST.map((item) => (
                <div
                  key={item}
                  className="rounded-[1.8rem] border border-red-600 bg-gray-800 p-6 text-white shadow-sm shadow-black/10"
                >
                  <p className="text-lg font-semibold">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 pb-16 pt-8 lg:px-8 lg:pb-24">
          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-8">
              <p className="text-sm uppercase tracking-[0.28em] text-white/45">
                How it works for you
              </p>
              <h3 className="mt-3 text-3xl font-black uppercase md:text-4xl">
                Simple from start to finish
              </h3>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {STEPS.map((step, index) => (
                <div
                  key={step}
                  className="rounded-[1.8rem] border border-red-600 bg-gray-800 p-6 text-white shadow-sm shadow-black/10 transition-shadow hover:shadow-lg"
                >
                  <p className="text-sm text-white/40">Step {index + 1}</p>
                  <h4 className="mt-2 text-xl font-bold">{step}</h4>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
