/* ========================= 
  Format Date from: aaaa-mm-dd to dd de mmmm de aaaa
 ===========================*/
export const formatDate = (value: string | Date) => {
  const parsedDate = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return String(value);
  }

  return parsedDate.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC'
  });
};

/* ========================= 
  Format Date from: 'aaaa-mm-dd' to dd/mmm/aaaa 
 ===========================*/
export const formatShortDate = (d: string | null) => {
  if (!d) return '—';
  const dt = new Date(d + 'T00:00:00');
  return dt.toLocaleDateString('es-EC', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC'
  });
};

export const toInputDate = (value: string | Date) => {
  const parsedDate = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return '';
  }

  const month = `${parsedDate.getUTCMonth() + 1}`.padStart(2, '0');
  const day = `${parsedDate.getUTCDate()}`.padStart(2, '0');
  return `${parsedDate.getUTCFullYear()}-${month}-${day}`;
};

/* ========================= 
  Calculate difference between two times in hours and minutes
  @input: endTime (string), startTime (string) - both in format "HH:mm"
  @output: string - difference in format "HH:mm"
 ===========================*/
export const calcTimeDifference = (startTime: string, end: string): string => {
  const [strHours, strMinutes] = startTime.split(':').map(Number);
  const [endHours, endMinutes] = end.split(':').map(Number);

  const strTotalMinutes = strHours * 60 + strMinutes;
  const endTotalMinutes = endHours * 60 + endMinutes;

  const diffMinutes = endTotalMinutes - strTotalMinutes;

  if (diffMinutes <= 0) return '-';

  const hours = Math.floor(diffMinutes / 60);
  const minutes = diffMinutes % 60;

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
};
