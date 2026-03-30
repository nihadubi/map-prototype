const BAKU_TIMEZONE = 'Asia/Baku';
const DAWN_START_HOUR = 5;
const DAY_START_HOUR = 7;
const DUSK_START_HOUR = 18;
const NIGHT_START_HOUR = 20;

export function getBakuHour(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: BAKU_TIMEZONE,
    hour: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date);

  const hourPart = parts.find((part) => part.type === 'hour');
  return Number(hourPart?.value ?? 0);
}

export function getBakuThemeMode(date = new Date()) {
  const hour = getBakuHour(date);

  if (hour >= DAWN_START_HOUR && hour < DAY_START_HOUR) {
    return 'dawn';
  }

  if (hour >= DAY_START_HOUR && hour < DUSK_START_HOUR) {
    return 'day';
  }

  if (hour >= DUSK_START_HOUR && hour < NIGHT_START_HOUR) {
    return 'dusk';
  }

  return 'night';
}

export function getBakuThemeLabel(date = new Date()) {
  const theme = getBakuThemeMode(date);
  const labels = {
    dawn: 'Baku dawn mode',
    day: 'Baku daytime mode',
    dusk: 'Baku dusk mode',
    night: 'Baku night mode',
  };

  return labels[theme];
}
