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

export const toInputDate = (value: string | Date) => {
  const parsedDate = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return '';
  }

  const month = `${parsedDate.getUTCMonth() + 1}`.padStart(2, '0');
  const day = `${parsedDate.getUTCDate()}`.padStart(2, '0');
  return `${parsedDate.getUTCFullYear()}-${month}-${day}`;
};
