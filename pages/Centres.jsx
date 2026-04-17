import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import SiteHeader from "../components/SiteHeader";
import { useAppData } from "../context/AppDataContext";
import {
  buildAbsoluteUrl,
  buildWhatsAppUrl,
  formatDistanceKm,
  getDirectionsUrl,
} from "../lib/app-utils";

export default function Centres() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const {
    areas,
    centres,
    locationError,
    locationStatus,
    requestLocation,
    userCoords,
  } = useAppData();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");
  const [selectedArea, setSelectedArea] = useState(
    searchParams.get("area") || "all",
  );
  const querySearchTerm = searchParams.get("q") || "";
  const queryArea = searchParams.get("area") || "all";

  const highlightedCentreId = searchParams.get("centre") || "";

  useEffect(() => {
    setSearchTerm(querySearchTerm);
    setSelectedArea(queryArea);
  }, [queryArea, querySearchTerm]);

  const filteredCentres = useMemo(() => {
    const normalisedSearch = searchTerm.trim().toLowerCase();

    return centres.filter((centre) => {
      const matchesSearch =
        !normalisedSearch ||
        centre.name.toLowerCase().includes(normalisedSearch) ||
        centre.place.toLowerCase().includes(normalisedSearch) ||
        centre.county.toLowerCase().includes(normalisedSearch) ||
        centre.landmark.toLowerCase().includes(normalisedSearch);

      const matchesArea =
        selectedArea === "all" || centre.place === selectedArea;

      return matchesSearch && matchesArea;
    });
  }, [centres, searchTerm, selectedArea]);

  const openWhatsApp = (message) => {
    window.open(
      buildWhatsAppUrl(message),
      "_blank",
      "noopener,noreferrer",
    );
  };

  const handleShareCentre = (centre) => {
    openWhatsApp(
      `Found a registration centre: ${centre.name} in ${centre.place}. Open it here: ${buildAbsoluteUrl(
        `/centres?centre=${centre.id}`,
      )}`,
    );
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <SiteHeader primaryAction={{ label: "Create Group", to: "/groups" }} />

      <main className="mx-auto max-w-7xl px-6 py-8 lg:px-8 lg:py-12">
        <div className="mb-10">
          <h2 className="mb-2 text-4xl font-black uppercase text-red-600">
            Find a Registration Centre
          </h2>
          <p className="text-white/70">
            Search by town, narrow the list, or use your current location to
            see the closest centres first.
          </p>
        </div>

        <div className="mb-8 grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6">
            <label
              htmlFor="centre-search"
              className="block text-sm font-semibold text-white/70"
            >
              Search by town, estate, county, or centre name
            </label>
            <input
              id="centre-search"
              type="search"
              placeholder="Thika, Juja, Ruiru..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="mt-3 w-full rounded-full border border-white/20 bg-white/10 px-6 py-4 text-white placeholder:text-white/50 focus:outline-none focus:border-red-500/50 focus:bg-white/15"
            />

            <div className="mt-4">
              <label
                htmlFor="centre-area"
                className="block text-sm font-semibold text-white/70"
              >
                Filter by area
              </label>
              <select
                id="centre-area"
                value={selectedArea}
                onChange={(event) => setSelectedArea(event.target.value)}
                className="mt-3 w-full rounded-full border border-white/20 bg-black px-6 py-4 text-white focus:outline-none focus:border-red-500/50"
              >
                <option value="all">All areas</option>
                {areas.map((area) => (
                  <option key={area} value={area}>
                    {area}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="rounded-[2rem] border border-red-500/30 bg-red-600 p-6">
            <p className="text-sm uppercase tracking-[0.28em] text-white/70">
              Live location
            </p>
            <h3 className="mt-3 text-2xl font-black uppercase">
              Sort by what is nearest to you
            </h3>
            <p className="mt-3 text-white/85">
              Use your phone location to calculate real distances for the
              centres below.
            </p>

            <button
              type="button"
              onClick={requestLocation}
              className="mt-6 w-full rounded-full bg-white/10 px-6 py-4 text-sm font-bold uppercase tracking-[0.18em] text-white transition hover:bg-white/20"
            >
              {locationStatus === "loading" ? "Locating..." : "Use my location"}
            </button>

            <p className="mt-4 text-sm text-white/80">
              {locationStatus === "ready"
                ? "Distances are now based on your current position."
                : "You can still search manually without sharing location."}
            </p>

            {locationError ? (
              <p className="mt-3 text-sm text-white">{locationError}</p>
            ) : null}
          </div>
        </div>

        <div className="grid gap-4 md:gap-6">
          {filteredCentres.length > 0 ? (
            filteredCentres.map((centre) => {
              const isHighlighted = centre.id === highlightedCentreId;

              return (
                <div
                  key={centre.id}
                  className={`rounded-2xl border bg-white/[0.03] p-6 transition ${
                    isHighlighted
                      ? "border-red-500 shadow-lg shadow-red-900/20"
                      : "border-white/10 hover:border-red-500/30"
                  }`}
                >
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div>
                        <h4 className="text-xl font-bold">{centre.name}</h4>
                        <p className="mt-1 text-sm text-white/55">
                          {centre.place}, {centre.county}
                        </p>
                        <p className="mt-2 text-sm text-white/45">
                          {centre.landmark}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2 text-xs uppercase tracking-[0.18em]">
                        <span className="rounded-full border border-white/10 px-3 py-2 text-white/60">
                          {centre.status}
                        </span>
                        <span className="rounded-full border border-red-500/30 bg-red-500/10 px-3 py-2 text-red-400">
                          {formatDistanceKm(centre.distanceKm)}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
                      <a
                        href={getDirectionsUrl(centre, userCoords)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 rounded-full bg-red-600 px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-red-500"
                      >
                        View directions
                      </a>
                      <button
                        type="button"
                        onClick={() => handleShareCentre(centre)}
                        className="flex-1 rounded-full border border-white/20 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/40"
                      >
                        Share on WhatsApp
                      </button>
                      <button
                        type="button"
                        onClick={() => navigate(`/groups?centre=${centre.id}`)}
                        className="flex-1 rounded-full border border-red-500/30 bg-red-500/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-500/20"
                      >
                        Create group for this centre
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] py-12 text-center">
              <p className="text-white/60">
                No centres match that search yet. Try a nearby town or clear
                the area filter.
              </p>
            </div>
          )}
        </div>

        <div className="mt-12">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="w-full rounded-full border border-white/20 bg-white/5 px-8 py-4 text-sm font-semibold text-white transition hover:border-white/40 sm:w-auto"
          >
            Back to Home
          </button>
        </div>
      </main>
    </div>
  );
}
