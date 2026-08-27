const form = document.getElementById('age-form');
const birthDateInput = document.getElementById('birth-date');
const errorMessage = document.getElementById('age-error');
const results = document.getElementById('age-results');

const MS_PER_DAY = 86_400_000;

function localToday() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

function inputDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function parseDate(value) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;
  const [, year, month, day] = match.map(Number);
  const date = new Date(year, month - 1, day);
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return null;
  return date;
}

function daysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function dateForYear(date, year) {
  return new Date(year, date.getMonth(), Math.min(date.getDate(), daysInMonth(year, date.getMonth())));
}

function addMonths(date, amount) {
  const monthStart = new Date(date.getFullYear(), date.getMonth() + amount, 1);
  monthStart.setDate(Math.min(date.getDate(), daysInMonth(monthStart.getFullYear(), monthStart.getMonth())));
  return monthStart;
}

function dayNumber(date) {
  return Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / MS_PER_DAY;
}

function calculateAge(birthDate, today) {
  let years = today.getFullYear() - birthDate.getFullYear();
  let cursor = dateForYear(birthDate, birthDate.getFullYear() + years);
  if (cursor > today) {
    years -= 1;
    cursor = dateForYear(birthDate, birthDate.getFullYear() + years);
  }

  let months = 0;
  while (months < 11 && addMonths(cursor, months + 1) <= today) months += 1;
  cursor = addMonths(cursor, months);

  const days = dayNumber(today) - dayNumber(cursor);
  const totalDays = dayNumber(today) - dayNumber(birthDate);
  let nextBirthday = dateForYear(birthDate, today.getFullYear());
  if (nextBirthday < today) nextBirthday = dateForYear(birthDate, today.getFullYear() + 1);

  return {
    years,
    months,
    days,
    totalDays,
    daysUntilBirthday: dayNumber(nextBirthday) - dayNumber(today),
    nextBirthday,
  };
}

birthDateInput.max = inputDate(localToday());

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const today = localToday();
  const birthDate = parseDate(birthDateInput.value);

  if (!birthDate || birthDate > today) {
    errorMessage.textContent = 'Choose a valid birth date that is not in the future.';
    errorMessage.hidden = false;
    results.hidden = true;
    return;
  }

  const age = calculateAge(birthDate, today);
  document.getElementById('age-years').textContent = age.years.toLocaleString();
  document.getElementById('age-months').textContent = age.months.toLocaleString();
  document.getElementById('age-days').textContent = age.days.toLocaleString();
  document.getElementById('age-total-days').textContent = age.totalDays.toLocaleString();
  document.getElementById('age-next-birthday').textContent = age.daysUntilBirthday === 0
    ? 'Today — happy birthday!'
    : `${age.nextBirthday.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })} (${age.daysUntilBirthday.toLocaleString()} days)`;
  errorMessage.hidden = true;
  results.hidden = false;
});
