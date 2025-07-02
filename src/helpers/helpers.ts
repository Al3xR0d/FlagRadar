export const formatTime = (utcDateString: string) => {
  const date = new Date(utcDateString);

  const day = date.getUTCDate().toString().padStart(2, '0');
  const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
  const year = date.getUTCFullYear();
  const hours = date.getUTCHours().toString().padStart(2, '0');
  const minutes = date.getUTCMinutes().toString().padStart(2, '0');
  const seconds = date.getUTCSeconds().toString().padStart(2, '0');

  return `${day}.${month}.${year}, ${hours}:${minutes}:${seconds} (МСК)`;
};

export type nameType = 'ad' | 'jeopardy';

export const editNameFormat = (name: nameType): string => {
  const nameValues = {
    ad: 'Attack-Defense',
    jeopardy: 'Jeopardy (Task based)',
  };

  return nameValues[name];
};
