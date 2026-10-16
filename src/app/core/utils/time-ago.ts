export function timeAgo(iso: string): string {
  const diffSeconds = (new Date(iso).getTime() - Date.now()) / 1000;
  const rtf = new Intl.RelativeTimeFormat('es', { numeric: 'auto' });
  const units: [Intl.RelativeTimeFormatUnit, number][] = [
    ['day', 86400],
    ['hour', 3600],
    ['minute', 60],
  ];

  for (const [unit, seconds] of units) {
    if (Math.abs(diffSeconds) >= seconds) {
      return rtf.format(Math.round(diffSeconds / seconds), unit);
    }
  }
  return 'recién';
}