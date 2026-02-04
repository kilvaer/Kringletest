// countdowns.js
// Viser bursdager og julaften i stigende rekkefølge etter antall dager igjen.
// Henrik: du kan endre navn/datoer i ARRAYS under. Alle datoer er dag-måned (DD-MM).

/* --- KONFIG --- */
const EVENTS = [
  { name: "Eva bursdag",   day: 14, month: 3  },  // 14. mars
  { name: "Nora bursdag",  day: 30, month: 5  },  // 30. mai
  { name: "Pappa bursdag", day: 5,  month: 8  },  // 5. aug
  { name: "Mamma bursdag", day: 19, month: 8  },  // 19. aug
  { name: "Julaften",      day: 24, month: 12 }   // 24. des
];

// Tekstformat på norsk
const MONTHS_NO = [
  "januar","februar","mars","april","mai","juni",
  "juli","august","september","oktober","november","desember"
];

/* --- HJELPERE --- */

// Returnerer et Date-objekt for neste forekomst (i år eller neste år) av en (day, month)
function nextOccurrence(day, month, now = new Date()) {
  const y = now.getFullYear();
  const occThisYear = new Date(y, month - 1, day, 23, 59, 59, 999);
  if (occThisYear >= stripTime(now)) return occThisYear;
  return new Date(y + 1, month - 1, day, 23, 59, 59, 999);
}

// Fjerner tid (behandler "i dag" riktig)
function stripTime(d) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

// Antall hele dager fra "now" til "futureDate"
function diffDays(futureDate, now = new Date()) {
  const ms = stripTime(futureDate) - stripTime(now);
  return Math.round(ms / (1000 * 60 * 60 * 24));
}

// Lager en visningstekst som inkluderer både absolutt dato og "om X dager"
function formatLine({ name, day, month }, now = new Date()) {
  const next = nextOccurrence(day, month, now);
  const days = diffDays(next, now);

  // Tekst for "om X min" / "i dag" (her: dager)
  let daysText = "";
  if (days === 0) daysText = "i dag";
  else if (days === 1) daysText = "om 1 dag";
  else daysText = `om ${days} dager`;

  const datoText = `${day}. ${MONTHS_NO[month - 1]}`;
  return { html: `<strong>${name}</strong> – ${datoText} <span class="small">(${daysText})</span>`, days };
}

/* --- RENDER --- */
function renderCountdowns() {
  const listEl = document.getElementById("countdowns-list");
  if (!listEl) return;

  const now = new Date();
  // Map + sorter på antall dager
  const rows = EVENTS
    .map(evt => formatLine(evt, now))
    .sort((a, b) => a.days - b.days);

  // Tøm og fyll
  listEl.innerHTML = "";
  for (const row of rows) {
    const li = document.createElement("li");
    li.style.padding = "6px 0";
    li.style.borderBottom = "1px dashed #243044";
    li.innerHTML = row.html;
    listEl.appendChild(li);
  }
}

// Kjør ved innlasting (og ev. oppdater ved midnatt)
renderCountdowns();

// (Valgfritt) Oppdater automatisk ved midnatt uten reload:
// Beregn ms til neste midnatt og sett timeout
(function scheduleMidnightRefresh() {
  const now = new Date();
  const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  const msToMidnight = midnight - now;
  setTimeout(() => {
    renderCountdowns();
    // Deretter hver 24. time
    setInterval(renderCountdowns, 24 * 60 * 60 * 1000);
  }, msToMidnight);
})();
