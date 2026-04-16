import posterImage from "./assets/poster.jpg";

const BASE_URL = "https://tuko-kadi-pi.vercel.app";

export default function TukoKadiLanding() {
  const goTo = (section) => {
    window.location.href = `${BASE_URL}/#${section}`;
  };

  const stats = [
    { label: "People already moving", value: "128K+" },
    { label: "Counties active", value: "34" },
    { label: "Groups formed", value: "210" },
    { label: "Daily momentum", value: "Growing" },
  ];

  const features = [
    {
      title: "Find where to register",
      text: "Quickly see the nearest place you can go today and what you need before you leave.",
    },
    {
      title: "Go with your people",
      text: "Create a group, invite friends, and move together instead of figuring it out alone.",
    },
    {
      title: "See who's showing up",
      text: "Feel the movement around you through counties, campuses, and active groups.",
    },
    {
      title: "Know what to carry",
      text: "Get simple guidance so your trip is clear and stress-free.",
    },
  ];

  const steps = [
    "Choose your area",
    "Find a nearby registration spot",
    "Go with friends",
    "Register and share",
  ];

  const centers = [
    { name: "Thika Stadium Grounds", place: "Thika", time: "Open today", distance: "1.8 km" },
    { name: "Juja Town Hall", place: "Juja", time: "Opens 8:00 AM", distance: "3.1 km" },
    { name: "Ruiru Social Hall", place: "Ruiru", time: "Open today", distance: "5.4 km" },
  ];

  const groups = [
    { name: "Thika Mbogi", members: "18 joined", time: "Leaving Sunday 10:00 AM" },
    { name: "Juja Campus Wave", members: "26 joined", time: "Leaving Saturday 9:00 AM" },
    { name: "Ruiru Youth Squad", members: "12 joined", time: "Leaving Sunday 8:30 AM" },
  ];

  const shareOnWhatsApp = (message) => {
    const text =
      message ||
      `I'm registering! Let's go together 🚀

Join me: ${BASE_URL}`;

    const whatsappLink = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(whatsappLink, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/40 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <div className="flex items-center gap-3">
            <img
              src={posterImage}
              alt="Tuko Kadi"
              className="h-14 w-14 rounded-xl object-cover"
            />
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-white/45">
                Register Na Mbogi
              </p>
              <h1 className="text-lg font-black uppercase tracking-wide">
                Tuko Kadi
              </h1>
            </div>
          </div>

          <div className="hidden items-center gap-8 text-sm text-white/70 md:flex">
            <a href="#features" className="hover:text-white">
              What you can do
            </a>
            <button
              type="button"
              onClick={() => goTo("centres")}
              className="cursor-pointer hover:text-white"
            >
              Centres
            </button>
            <button
              type="button"
              onClick={() => goTo("groups")}
              className="cursor-pointer hover:text-white"
            >
              Groups
            </button>
          </div>

          <button
            type="button"
            onClick={() => goTo("centres")}
            className="rounded-full bg-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-red-900/30 transition hover:scale-[1.02] hover:bg-red-500"
          >
            Get Started
          </button>
        </div>
      </header>

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
                <span className="block text-red-600">Jiandikishe Leo</span>
              </h2>

              <p className="mt-6 max-w-2xl text-base leading-7 text-white/80 md:text-lg">
                Don't get left out. Find where to go, move with your people, and
                make the whole thing feel easy, social, and real.
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
                  <div
                    key={stat.label}
                    className="rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur"
                  >
                    <div className="text-2xl font-black">{stat.value}</div>
                    <div className="mt-1 text-xs text-white/60">
                      {stat.label}
                    </div>
                  </div>
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
              The site should feel less like a government process and more like
              a movement that helps you act fast.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="cursor-pointer rounded-[1.8rem] border border-white/10 bg-white/[0.03] p-6 transition hover:-translate-y-1 hover:border-red-500/30"
              >
                <h4 className="text-xl font-bold">{feature.title}</h4>
                <p className="mt-3 text-sm leading-7 text-white/60">
                  {feature.text}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <button
              type="button"
              onClick={() => shareOnWhatsApp()}
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
                No confusion. No long searching. Just clear options, distance,
                and timing.
              </p>
              <div className="mt-8 rounded-3xl bg-black/15 p-4">
                <p className="text-sm text-white/70">
                  Search by town, estate, campus, or county
                </p>
                <div className="mt-3 rounded-full bg-white px-4 py-3 text-sm font-medium text-black">
                  Thika, Kiambu County
                </div>
              </div>
              <button
                type="button"
                onClick={() => goTo("centres")}
                className="mt-6 w-full rounded-full bg-white px-6 py-3 text-sm font-bold text-black transition hover:bg-white/90"
              >
                Explore All Centres →
              </button>
            </div>

            <div className="grid gap-4">
              {centers.map((center) => (
                <div
                  key={center.name}
                  className="rounded-[1.8rem] border border-white/10 bg-white/[0.03] p-6"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <h4 className="text-xl font-bold">{center.name}</h4>
                      <p className="mt-1 text-sm text-white/55">
                        {center.place}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2 text-xs uppercase tracking-[0.18em] text-white/60">
                      <span className="rounded-full border border-white/10 px-3 py-2">
                        {center.time}
                      </span>
                      <span className="rounded-full border border-red-500/30 bg-red-500/10 px-3 py-2 text-red-400">
                        {center.distance}
                      </span>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                    <a
                      href={`https://www.google.com/maps/search/${encodeURIComponent(
                        center.name
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 rounded-full bg-white px-5 py-3 text-center text-sm font-semibold text-black transition hover:bg-white/90"
                    >
                      View directions
                    </a>
                    <button
                      type="button"
                      onClick={() =>
                        shareOnWhatsApp(
                          `Let's register together at ${center.name} in ${center.place} 🚀

Join here: ${BASE_URL}/#centres`
                        )
                      }
                      className="flex-1 rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                    >
                      Share on WhatsApp
                    </button>
                  </div>
                </div>
              ))}
            </div>
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

          <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="grid gap-4">
              {groups.map((group) => (
                <div
                  key={group.name}
                  className="rounded-[1.8rem] border border-white/10 bg-white/[0.03] p-6"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <h4 className="text-xl font-bold">{group.name}</h4>
                      <p className="mt-2 text-sm text-white/60">
                        {group.members}
                      </p>
                    </div>
                    <div className="rounded-full border border-white/10 px-4 py-2 text-xs uppercase tracking-[0.18em] text-white/60">
                      {group.time}
                    </div>
                  </div>

                  <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                    <button
                      type="button"
                      onClick={() => goTo("groups")}
                      className="flex-1 rounded-full bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-500"
                    >
                      Join group
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        shareOnWhatsApp(
                          `Join our group: ${group.name} - ${group.time} 🚀

Join here: ${BASE_URL}/#groups`
                        )
                      }
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
                friend circle and turn the trip into a shared plan.
              </p>

              <div className="mt-8 space-y-3">
                <div className="rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white/70">
                  Group name: Thika Sunday Mbogi
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white/70">
                  Meeting point: Thika stage
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white/70">
                  Time: 10:00 AM
                </div>
              </div>

              <button
                type="button"
                onClick={() => goTo("groups")}
                className="mt-6 w-full rounded-full bg-white px-6 py-4 text-sm font-bold uppercase tracking-[0.18em] text-black transition hover:bg-white/90"
              >
                Create your group
              </button>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 pb-16 lg:px-8 lg:pb-24">
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
              {steps.map((step, index) => (
                <div
                  key={step}
                  className="rounded-[1.8rem] border border-white/10 bg-white/[0.03] p-6"
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