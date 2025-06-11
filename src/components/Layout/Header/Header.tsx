import Typography from 'antd/es/typography';
import Flex from 'antd/es/flex';
import { FC, ReactNode } from 'react';

interface Props {
  title: string;
  button?: ReactNode;
}

export const Header: FC<Props> = ({ title, button }) => {
  return (
    <header>
      <Flex justify="space-between" align="center">
        <Typography.Title
          style={{
            fontSize: 28,
            background: 'linear-gradient(90deg, #00FF9D 0%, #00FFEA 50%)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
          }}
        >
          {title}
        </Typography.Title>
        {button}
      </Flex>
    </header>
  );
};
