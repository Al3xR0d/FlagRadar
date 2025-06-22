import { FC } from 'react';
import loading from '../../../Images/loading.gif';

export const CustomSpin: FC = () => {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <img
        src={loading}
        alt="Загрузка..."
        style={{
          width: '100px',
        }}
      />
    </div>
  );
};
