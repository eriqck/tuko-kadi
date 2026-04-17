import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import SiteHeader from "../components/SiteHeader";
import { useAppData } from "../context/AppDataContext";
import {
  buildAbsoluteUrl,
  buildWhatsAppUrl,
  formatDepartureTime,
  formatGroupMembers,
} from "../lib/app-utils";

const EMPTY_FORM = {
  name: "",
  meetingPoint: "",
  departureTime: "",
  area: "",
  centerId: "",
};

export default function Groups() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { areas, centres, createGroup, groups, joinGroup, leaveGroup } =
    useAppData();
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [feedbackMessage, setFeedbackMessage] = useState("");

  const highlightedGroupId = searchParams.get("group") || "";
  const prefilledCentreId = searchParams.get("centre") || "";

  const selectedCentre = useMemo(
    () => centres.find((centre) => centre.id === formData.centerId) || null,
    [centres, formData.centerId],
  );

  useEffect(() => {
    if (!prefilledCentreId) {
      return;
    }

    const centre = centres.find((entry) => entry.id === prefilledCentreId);

    if (!centre) {
      return;
    }

    setFormData((currentFormData) => ({
      ...currentFormData,
      centerId: centre.id,
      area: currentFormData.area || centre.place,
    }));
  }, [centres, prefilledCentreId]);

  useEffect(() => {
    if (!feedbackMessage) {
      return undefined;
    }

    const timerId = window.setTimeout(() => setFeedbackMessage(""), 3500);
    return () => window.clearTimeout(timerId);
  }, [feedbackMessage]);

  const openWhatsApp = (message) => {
    window.open(
      buildWhatsAppUrl(message),
      "_blank",
      "noopener,noreferrer",
    );
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    if (name === "centerId") {
      const centre = centres.find((entry) => entry.id === value);

      setFormData((currentFormData) => ({
        ...currentFormData,
        centerId: value,
        area: centre ? centre.place : currentFormData.area,
      }));
      return;
    }

    setFormData((currentFormData) => ({
      ...currentFormData,
      [name]: value,
    }));
  };

  const handleCreateGroup = (event) => {
    event.preventDefault();

    const cleanName = formData.name.trim();
    const cleanMeetingPoint = formData.meetingPoint.trim();

    if (!cleanName || !cleanMeetingPoint || !formData.departureTime) {
      setFeedbackMessage("Add a name, meeting point, and departure time.");
      return;
    }

    if (!formData.centerId) {
      setFeedbackMessage("Choose the centre your group is going to.");
      return;
    }

    const newGroup = createGroup({
      name: cleanName,
      area: formData.area,
      meetingPoint: cleanMeetingPoint,
      departureTime: formData.departureTime,
      centerId: formData.centerId,
    });

    setFormData({
      ...EMPTY_FORM,
      area: formData.area,
      centerId: formData.centerId,
    });
    setFeedbackMessage(`${newGroup.name} is live. Share it now.`);
    navigate(`/groups?group=${newGroup.id}`, { replace: true });
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

  const shareGroupOnWhatsApp = (group) => {
    openWhatsApp(
      `Join ${group.name}. Meet at ${group.meetingPoint}. ${formatDepartureTime(
        group.departureTime,
      )}. Group link: ${buildAbsoluteUrl(`/groups?group=${group.id}`)}`,
    );
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <SiteHeader primaryAction={{ label: "Find Centre", to: "/centres" }} />

      <main className="mx-auto max-w-7xl px-6 py-8 lg:px-8 lg:py-12">
        <div className="mb-12">
          <h2 className="mb-2 text-4xl font-black uppercase text-red-600">
            Join or Create a Mbogi
          </h2>
          <p className="text-white/70">
            Pick an active group, or create your own trip and send the invite
            link to everyone you want on the same plan.
          </p>
        </div>

        {feedbackMessage ? (
          <div className="mb-8 rounded-2xl border border-green-500/30 bg-green-500/10 px-5 py-4 text-sm text-green-100">
            {feedbackMessage}
          </div>
        ) : null}

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <h3 className="mb-6 text-xl font-bold">Available Groups</h3>
            <div className="grid gap-4">
              {groups.map((group) => {
                const isHighlighted = group.id === highlightedGroupId;

                return (
                  <div
                    key={group.id}
                    className={`rounded-2xl border bg-white/[0.03] p-6 transition ${
                      isHighlighted
                        ? "border-red-500 shadow-lg shadow-red-900/20"
                        : "border-white/10 hover:border-red-500/30"
                    }`}
                  >
                    <div className="flex flex-col gap-4">
                      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                          <h4 className="text-lg font-bold">{group.name}</h4>
                          <p className="mt-1 text-sm text-white/60">
                            {formatGroupMembers(group.memberCount)}
                          </p>
                          <p className="mt-2 text-sm text-white/50">
                            Meet at {group.meetingPoint}
                          </p>
                          {group.centre ? (
                            <p className="mt-1 text-sm text-white/50">
                              Heading to {group.centre.name}
                            </p>
                          ) : null}
                        </div>

                        <div className="rounded-full border border-white/10 px-4 py-2 text-xs uppercase tracking-[0.18em] text-white/60">
                          {formatDepartureTime(group.departureTime)}
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 sm:flex-row">
                        <button
                          type="button"
                          onClick={() => handleGroupAction(group)}
                          className="flex-1 rounded-full bg-green-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-green-500"
                        >
                          {group.isJoined ? "Leave group" : "Join group"}
                        </button>
                        <button
                          type="button"
                          onClick={() => shareGroupOnWhatsApp(group)}
                          className="flex-1 rounded-full border border-white/20 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:border-white/40"
                        >
                          Share invite
                        </button>
                        {group.centre ? (
                          <button
                            type="button"
                            onClick={() =>
                              navigate(`/centres?centre=${group.centre.id}`)
                            }
                            className="flex-1 rounded-full border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-500/20"
                          >
                            View centre
                          </button>
                        ) : null}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <h3 className="mb-6 text-xl font-bold">Start Your Own</h3>
            <div className="sticky top-24 rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.07] to-white/[0.02] p-8">
              <form onSubmit={handleCreateGroup} className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-white/70">
                    Group Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Thika Sunday Mbogi"
                    className="w-full rounded-lg border border-white/10 bg-black/25 px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-red-500/50"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-white/70">
                    Meeting Point
                  </label>
                  <input
                    type="text"
                    name="meetingPoint"
                    value={formData.meetingPoint}
                    onChange={handleInputChange}
                    placeholder="Thika stage"
                    className="w-full rounded-lg border border-white/10 bg-black/25 px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-red-500/50"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-white/70">
                    Departure Time
                  </label>
                  <input
                    type="datetime-local"
                    name="departureTime"
                    value={formData.departureTime}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-white/10 bg-black/25 px-4 py-3 text-sm text-white focus:outline-none focus:border-red-500/50"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-white/70">
                    Area
                  </label>
                  <select
                    name="area"
                    value={formData.area}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-white/10 bg-black px-4 py-3 text-sm text-white focus:outline-none focus:border-red-500/50"
                  >
                    <option value="">Choose area</option>
                    {areas.map((area) => (
                      <option key={area} value={area}>
                        {area}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-white/70">
                    Destination Centre
                  </label>
                  <select
                    name="centerId"
                    value={formData.centerId}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-white/10 bg-black px-4 py-3 text-sm text-white focus:outline-none focus:border-red-500/50"
                    required
                  >
                    <option value="">Choose centre</option>
                    {centres.map((centre) => (
                      <option key={centre.id} value={centre.id}>
                        {centre.name} - {centre.place}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedCentre ? (
                  <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-4 text-sm text-white/80">
                    {selectedCentre.name} in {selectedCentre.place}.{" "}
                    {selectedCentre.status}.
                  </div>
                ) : null}

                <button
                  type="submit"
                  className="mt-6 w-full rounded-lg bg-red-600 px-6 py-4 text-sm font-bold uppercase tracking-[0.18em] text-white transition hover:bg-red-500"
                >
                  Create Group
                </button>
              </form>

              <p className="mt-6 text-center text-xs text-white/50">
                Your new group is saved here and ready to share immediately.
              </p>
            </div>
          </div>
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
