import { CLOSED_CONSTITUENCIES, OPEN_CENTRES } from "./open-centres.generated";

export const DEFAULT_CENTRES = OPEN_CENTRES;

export const CLOSED_REGISTRATION_AREAS = CLOSED_CONSTITUENCIES;

export const DEFAULT_GROUPS = [
  {
    id: "thika-mbogi",
    name: "Thika Mbogi",
    area: "Thika Town",
    meetingPoint: "Blue Post roundabout",
    departureTime: "2026-04-19T10:00",
    memberCount: 18,
    centerId: "kiambu-thika-town",
  },
  {
    id: "juja-campus-wave",
    name: "Juja Campus Wave",
    area: "Juja",
    meetingPoint: "Campus main gate",
    departureTime: "2026-04-18T09:00",
    memberCount: 26,
    centerId: "kiambu-juja",
  },
  {
    id: "ruiru-youth-squad",
    name: "Ruiru Youth Squad",
    area: "Ruiru",
    meetingPoint: "Ruiru stage",
    departureTime: "2026-04-19T08:30",
    memberCount: 12,
    centerId: "kiambu-ruiru",
  },
  {
    id: "kiambu-town-linkup",
    name: "Kiambu Town Linkup",
    area: "Kiambu",
    meetingPoint: "Kiambu main stage",
    departureTime: "2026-04-20T08:15",
    memberCount: 9,
    centerId: "kiambu-kiambu",
  },
];

export const REGISTRATION_CHECKLIST = [
  "Original national ID or waiting card",
  "Your phone so you can confirm the group and directions",
  "Fare for the round trip",
  "Someone in your group who can keep everybody updated on WhatsApp",
];
