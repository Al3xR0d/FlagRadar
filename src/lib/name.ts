export type NameType = 'Attack-Defense' | 'jeopardy';

export const editNameFormat = (name: NameType): string => {
  const nameValues = {
    'Attack-Defense': 'Attack-Defense',
    jeopardy: 'Jeopardy (Task based)',
  };

  return nameValues[name];
};
