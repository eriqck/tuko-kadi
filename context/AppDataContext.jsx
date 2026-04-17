import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { DEFAULT_CENTRES, DEFAULT_GROUPS } from "../lib/content";
import {
  formatCompactNumber,
  getDistanceKm,
  slugify,
} from "../lib/app-utils";

const STORAGE_KEYS = {
  groups: "tuko-kadi.groups.v1",
  joinedGroupIds: "tuko-kadi.joined-group-ids.v1",
};

const AppDataContext = createContext(null);

function readStorage(key, fallbackValue) {
  if (typeof window === "undefined") {
    return fallbackValue;
  }

  try {
    const storedValue = window.localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : fallbackValue;
  } catch {
    return fallbackValue;
  }
}

function getMemberCount(value) {
  if (typeof value === "number") {
    return value;
  }

  if (typeof value === "string") {
    const match = value.match(/\d+/);
    return match ? Number(match[0]) : 0;
  }

  return 0;
}

function normaliseGroup(group) {
  return {
    id: group.id || `group-${slugify(group.name || "untitled")}`,
    name: group.name || "Untitled group",
    area: group.area || group.place || "",
    meetingPoint: group.meetingPoint || group.meeting || "",
    departureTime: group.departureTime || group.time || "",
    memberCount: getMemberCount(group.memberCount ?? group.members),
    centerId: group.centerId || "",
    createdAt: group.createdAt || null,
  };
}

function sortGroupsByDeparture(firstGroup, secondGroup) {
  const firstTime = new Date(firstGroup.departureTime).getTime();
  const secondTime = new Date(secondGroup.departureTime).getTime();

  if (Number.isNaN(firstTime) && Number.isNaN(secondTime)) {
    return firstGroup.name.localeCompare(secondGroup.name);
  }

  if (Number.isNaN(firstTime)) {
    return 1;
  }

  if (Number.isNaN(secondTime)) {
    return -1;
  }

  return firstTime - secondTime;
}

function getLocationErrorMessage(error) {
  if (error?.code === 1) {
    return "Location permission was denied. Allow it to sort centres near you.";
  }

  if (error?.code === 2) {
    return "Your location could not be detected. Try again in a stronger signal area.";
  }

  if (error?.code === 3) {
    return "Location request timed out. Try again in a moment.";
  }

  return "We could not read your location right now.";
}

export function AppDataProvider({ children }) {
  const [groups, setGroups] = useState(() => {
    const storedGroups = readStorage(STORAGE_KEYS.groups, DEFAULT_GROUPS);
    const safeGroups = Array.isArray(storedGroups)
      ? storedGroups
      : DEFAULT_GROUPS;
    return safeGroups.map(normaliseGroup);
  });
  const [joinedGroupIds, setJoinedGroupIds] = useState(() => {
    const storedIds = readStorage(STORAGE_KEYS.joinedGroupIds, []);
    return Array.isArray(storedIds) ? storedIds : [];
  });
  const [userCoords, setUserCoords] = useState(null);
  const [locationStatus, setLocationStatus] = useState("idle");
  const [locationError, setLocationError] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(STORAGE_KEYS.groups, JSON.stringify(groups));
  }, [groups]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(
      STORAGE_KEYS.joinedGroupIds,
      JSON.stringify(joinedGroupIds),
    );
  }, [joinedGroupIds]);

  const centres = useMemo(() => {
    const sortedCentres = DEFAULT_CENTRES.map((centre) => ({
      ...centre,
      distanceKm: userCoords ? getDistanceKm(userCoords, centre) : null,
    }));

    return sortedCentres.sort((firstCentre, secondCentre) => {
      if (
        firstCentre.distanceKm != null &&
        secondCentre.distanceKm != null
      ) {
        return firstCentre.distanceKm - secondCentre.distanceKm;
      }

      if (firstCentre.distanceKm != null) {
        return -1;
      }

      if (secondCentre.distanceKm != null) {
        return 1;
      }

      return (
        firstCentre.place.localeCompare(secondCentre.place) ||
        firstCentre.name.localeCompare(secondCentre.name)
      );
    });
  }, [userCoords]);

  const centresById = useMemo(
    () =>
      Object.fromEntries(
        DEFAULT_CENTRES.map((centre) => [centre.id, centre]),
      ),
    [],
  );

  const groupsWithMeta = useMemo(
    () =>
      [...groups]
        .sort(sortGroupsByDeparture)
        .map((group) => ({
          ...group,
          centre: group.centerId ? centresById[group.centerId] : null,
          isJoined: joinedGroupIds.includes(group.id),
        })),
    [centresById, groups, joinedGroupIds],
  );

  const stats = useMemo(() => {
    const peopleMoving = groups.reduce(
      (total, group) => total + Number(group.memberCount || 0),
      0,
    );
    const countiesActive = new Set(
      DEFAULT_CENTRES.map((centre) => centre.county),
    ).size;
    const centresOpen = DEFAULT_CENTRES.filter((centre) =>
      centre.status.toLowerCase().includes("open"),
    ).length;

    return [
      {
        label: "People already moving",
        value: formatCompactNumber(peopleMoving),
      },
      { label: "Counties active", value: `${countiesActive}` },
      { label: "Groups formed", value: `${groups.length}` },
      { label: "Centres open today", value: `${centresOpen}` },
    ];
  }, [groups]);

  const requestLocation = () => {
    if (
      typeof navigator === "undefined" ||
      !navigator.geolocation
    ) {
      setLocationStatus("error");
      setLocationError("Location is not available in this browser.");
      return Promise.resolve(false);
    }

    setLocationStatus("loading");
    setLocationError("");

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserCoords({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setLocationStatus("ready");
          resolve(true);
        },
        (error) => {
          setLocationStatus("error");
          setLocationError(getLocationErrorMessage(error));
          resolve(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 12000,
          maximumAge: 300000,
        },
      );
    });
  };

  const joinGroup = (groupId) => {
    if (joinedGroupIds.includes(groupId)) {
      return false;
    }

    setJoinedGroupIds((currentIds) =>
      currentIds.includes(groupId)
        ? currentIds
        : [...currentIds, groupId],
    );
    setGroups((currentGroups) =>
      currentGroups.map((group) =>
        group.id === groupId
          ? {
              ...group,
              memberCount: group.memberCount + 1,
            }
          : group,
      ),
    );
    return true;
  };

  const leaveGroup = (groupId) => {
    if (!joinedGroupIds.includes(groupId)) {
      return false;
    }

    setJoinedGroupIds((currentIds) =>
      currentIds.filter((currentId) => currentId !== groupId),
    );
    setGroups((currentGroups) =>
      currentGroups.map((group) =>
        group.id === groupId
          ? {
              ...group,
              memberCount: Math.max(0, group.memberCount - 1),
            }
          : group,
      ),
    );
    return true;
  };

  const createGroup = ({
    name,
    area,
    meetingPoint,
    departureTime,
    centerId,
  }) => {
    const selectedCentre = centerId ? centresById[centerId] : null;
    const cleanName = name.trim();
    const cleanMeetingPoint = meetingPoint.trim();

    const newGroup = {
      id: `group-${Date.now()}-${slugify(cleanName)}`,
      name: cleanName,
      area: area.trim() || selectedCentre?.place || "",
      meetingPoint: cleanMeetingPoint,
      departureTime,
      memberCount: 1,
      centerId,
      createdAt: new Date().toISOString(),
    };

    setGroups((currentGroups) => [newGroup, ...currentGroups]);
    setJoinedGroupIds((currentIds) =>
      currentIds.includes(newGroup.id)
        ? currentIds
        : [...currentIds, newGroup.id],
    );
    return newGroup;
  };

  const areas = useMemo(
    () =>
      [...new Set(DEFAULT_CENTRES.map((centre) => centre.place))].sort(),
    [],
  );

  const value = {
    areas,
    centres,
    createGroup,
    groups: groupsWithMeta,
    joinedGroupIds,
    joinGroup,
    leaveGroup,
    locationError,
    locationStatus,
    requestLocation,
    stats,
    userCoords,
  };

  return (
    <AppDataContext.Provider value={value}>
      {children}
    </AppDataContext.Provider>
  );
}

export function useAppData() {
  const context = useContext(AppDataContext);

  if (!context) {
    throw new Error("useAppData must be used inside AppDataProvider.");
  }

  return context;
}
