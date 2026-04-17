import { readFile, writeFile } from "node:fs/promises";
import { PDFParse } from "pdf-parse";

const PDF_PATH = new URL("../data/iebc_constituency_offices.pdf", import.meta.url);
const VERIFIED_OFFICES_PATH = new URL(
  "../data/verified_constituency_offices.json",
  import.meta.url,
);
const OUTPUT_PATH = new URL("../lib/open-centres.generated.js", import.meta.url);

const PAGE_COUNTIES = {
  1: ["Mombasa", "Kwale"],
  2: ["Kilifi", "Tana River", "Lamu"],
  3: ["Taita Taveta", "Garissa"],
  4: ["Wajir", "Mandera", "Marsabit"],
  5: ["Isiolo", "Tharaka-Nithi", "Meru"],
  6: ["Embu", "Kitui"],
  7: ["Machakos", "Makueni"],
  8: ["Nyandarua", "Nyeri"],
  9: ["Kirinyaga", "Murang'a"],
  10: ["Kiambu", "Turkana"],
  11: ["West Pokot", "Samburu", "Trans Nzoia"],
  12: ["Uasin Gishu", "Elgeyo-Marakwet", "Nandi"],
  13: ["Baringo", "Laikipia"],
  14: ["Nakuru", "Narok"],
  15: ["Kajiado", "Kericho"],
  16: ["Bomet", "Kakamega"],
  17: ["Vihiga", "Bungoma"],
  18: ["Busia", "Siaya"],
  19: ["Kisumu", "Homa Bay"],
  20: ["Migori", "Kisii"],
  21: ["Nyamira", "Nairobi"],
};

const CLOSED_CONSTITUENCIES = [
  "Emurua Dikirr",
  "Malava",
  "Mbeere North",
  "Ol Kalou",
];

const MANUAL_MATCHES = {
  "kirinyaga::county office": {
    officeLocation: "Professional Plaza 3rd Floor",
  },
  "murang'a::county office": {
    officeLocation: "Murang'a - Mukuyu",
  },
  "laikipia::laikipia county": {
    officeLocation: "Laikipia County Commissioners Compound Nanyuki",
  },
  "kiambu::githunguri": {
    officeLocation: "IEBC GITHUNGURI",
  },
  "nairobi::embakasi east": {
    officeLocation: "East Africa School of Aviation",
  },
  "nairobi::dagoretti north": {
    officeLocation: "Maliposa Appartments - Ngong Road",
  },
  "kisii::nyaribari masaba": {
    officeLocation: "Masimba",
  },
};

const ANNIVERSARY_TOWERS = {
  id: "nairobi-anniversary-towers-customer-experience-centre",
  name: "Anniversary Towers Customer Experience Centre",
  place: "Nairobi CBD",
  county: "Nairobi",
  constituency: "Customer Experience Centre",
  officeLocation: "Anniversary Towers, University Way",
  landmark: "Anniversary Towers",
  officialDistance: "University Way, Nairobi",
  status: "Open weekdays, 8:00 AM - 5:00 PM",
  latitude: -1.281675,
  longitude: 36.816506,
  sourceType: "Customer Experience Centre",
  isOpen: true,
};

function titleCase(value) {
  return value
    .toLowerCase()
    .replace(/\b\w/g, (match) => match.toUpperCase())
    .replace(/\bDcc\b/g, "DCC")
    .replace(/\bIebc\b/g, "IEBC")
    .replace(/\bAck\b/g, "ACK")
    .replace(/\bAp\b/g, "AP")
    .replace(/\bNcpb\b/g, "NCPB")
    .replace(/\bHuduma\b/g, "Huduma")
    .replace(/\bCdf\b/g, "CDF")
    .replace(/\bGk\b/g, "GK");
}

function normalise(value) {
  return String(value ?? "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, " and ")
    .replace(/['’`"]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .trim()
    .toLowerCase();
}

function slugify(value) {
  return normalise(value).replace(/\s+/g, "-");
}

function cleanCell(value) {
  return String(value ?? "")
    .replace(/â€™/g, "'")
    .replace(/â€˜/g, "'")
    .replace(/â€œ|â€/g, '"')
    .replace(/â€“|â€”/g, "-")
    .replace(/_/g, " - ")
    .replace(/\s+/g, " ")
    .replace(/\s*,\s*/g, ", ")
    .trim();
}

function buildKey(county, name) {
  return `${normalise(county)}::${normalise(name)}`;
}

function scoreMatch(officialRow, candidate) {
  const officialName = normalise(officialRow.constituency);
  const officialOffice = normalise(officialRow.officeLocation);
  const officialLandmark = normalise(officialRow.landmark);
  const candidateName = normalise(candidate.constituency_name);
  const candidateOffice = normalise(candidate.office_location);
  const candidateLandmark = normalise(candidate.landmark);

  let score = 0;

  if (officialName && candidateName === officialName) {
    score += 80;
  }

  if (
    officialOffice &&
    candidateOffice &&
    (candidateOffice === officialOffice ||
      candidateOffice.includes(officialOffice) ||
      officialOffice.includes(candidateOffice))
  ) {
    score += 120;
  }

  if (
    officialLandmark &&
    candidateLandmark &&
    (candidateLandmark === officialLandmark ||
      candidateLandmark.includes(officialLandmark) ||
      officialLandmark.includes(candidateLandmark))
  ) {
    score += 40;
  }

  if (
    officialName &&
    candidateOffice &&
    (candidateOffice.includes(officialName) ||
      officialName.includes(candidateOffice))
  ) {
    score += 20;
  }

  if (candidate.confidence_score != null) {
    score += Number(candidate.confidence_score) / 20;
  }

  if (candidate.accuracy_meters != null) {
    score += Math.max(0, 25 - Number(candidate.accuracy_meters) / 50);
  }

  return score;
}

function pickBestMatch(officialRow, verifiedRows) {
  const countyRows = verifiedRows.filter(
    (candidate) => normalise(candidate.county) === normalise(officialRow.county),
  );
  const manualMatch = MANUAL_MATCHES[buildKey(officialRow.county, officialRow.constituency)];

  if (manualMatch?.officeLocation) {
    const manualCandidate = countyRows.find(
      (candidate) =>
        normalise(candidate.office_location) ===
        normalise(manualMatch.officeLocation),
    );

    if (manualCandidate) {
      return manualCandidate;
    }
  }

  const scoredCandidates = countyRows
    .map((candidate) => ({
      candidate,
      score: scoreMatch(officialRow, candidate),
    }))
    .filter((entry) => entry.score > 0)
    .sort((firstEntry, secondEntry) => secondEntry.score - firstEntry.score);

  return scoredCandidates[0]?.candidate ?? null;
}

function getSourceType(constituency) {
  if (/county office/i.test(constituency) || /county$/i.test(constituency)) {
    return "County Office";
  }

  return "Constituency Office";
}

function buildName(row) {
  if (row.sourceType === "County Office") {
    const cleanCounty = titleCase(row.county);
    return /county$/i.test(row.constituency)
      ? `${cleanCounty} County Office`
      : `${cleanCounty} County Office`;
  }

  return `${titleCase(row.constituency)} Constituency Office`;
}

async function loadOfficialRows() {
  const pdfBuffer = await readFile(PDF_PATH);
  const parser = new PDFParse({ data: pdfBuffer });
  const tableData = await parser.getTable();
  await parser.destroy();

  return tableData.pages.flatMap((page) => {
    const countyNames = PAGE_COUNTIES[page.num] ?? [];

    return page.tables.flatMap((table, tableIndex) => {
      const county = countyNames[tableIndex];

      if (!county) {
        throw new Error(
          `Missing county mapping for page ${page.num}, table ${tableIndex + 1}.`,
        );
      }

      return table.slice(1).map((row) => ({
        page: page.num,
        county,
        constituency: cleanCell(row[0]),
        officeLocation: cleanCell(row[1]),
        landmark: cleanCell(row[2]),
        officialDistance: cleanCell(row[3]),
      }));
    });
  });
}

async function loadVerifiedRows() {
  const fileContents = await readFile(VERIFIED_OFFICES_PATH, "utf8");
  return JSON.parse(fileContents);
}

async function main() {
  const officialRows = await loadOfficialRows();
  const verifiedRows = await loadVerifiedRows();

  const openCentres = officialRows
    .filter(
      (row) =>
        !CLOSED_CONSTITUENCIES.some(
          (name) => normalise(name) === normalise(row.constituency),
        ),
    )
    .map((row) => {
      const sourceType = getSourceType(row.constituency);
      const matchedOffice = pickBestMatch(row, verifiedRows);
      const place =
        sourceType === "County Office" ? titleCase(row.county) : titleCase(row.constituency);

      return {
        id: `${slugify(row.county)}-${slugify(row.constituency)}`,
        name: buildName({ ...row, sourceType }),
        place,
        county: titleCase(row.county),
        constituency:
          sourceType === "County Office" ? titleCase(row.constituency) : titleCase(row.constituency),
        officeLocation: row.officeLocation,
        landmark: row.landmark,
        officialDistance: row.officialDistance,
        status: "Open weekdays, 8:00 AM - 5:00 PM",
        latitude: matchedOffice?.latitude ?? null,
        longitude: matchedOffice?.longitude ?? null,
        sourceType,
        isOpen: true,
      };
    })
    .concat(ANNIVERSARY_TOWERS)
    .sort((firstCentre, secondCentre) => {
      return (
        firstCentre.county.localeCompare(secondCentre.county) ||
        firstCentre.place.localeCompare(secondCentre.place) ||
        firstCentre.name.localeCompare(secondCentre.name)
      );
    });

  const fileContents = `export const CLOSED_CONSTITUENCIES = ${JSON.stringify(
    CLOSED_CONSTITUENCIES,
    null,
    2,
  )};\n\nexport const OPEN_CENTRES = ${JSON.stringify(openCentres, null, 2)};\n`;

  await writeFile(OUTPUT_PATH, fileContents);
  console.log(`Generated ${openCentres.length} open centres.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
