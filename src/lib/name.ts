export type NameType = 'ad' | 'jeopardy';

export const editNameFormat = (name: NameType): string => {
  const nameValues = {
    ad: 'Attack-Defense',
    jeopardy: 'Jeopardy (Task based)',
  };

  return nameValues[name];
};
