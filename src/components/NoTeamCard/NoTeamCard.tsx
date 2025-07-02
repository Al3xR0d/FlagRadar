import Card from 'antd/es/card';
import Flex from 'antd/es/flex';
import { FC } from 'react';
import { AntdButton } from '../../shared/ui/Button';

interface Props {
  onCreateTeam: () => void;
  onJoinTeam: () => void;
}

export const NoTeamCard: FC<Props> = ({ onCreateTeam, onJoinTeam }) => {
  return (
    <Card style={{ background: '#1a1a24', border: '1px solid #25253a' }}>
      <i className="fas fa-users" style={{ marginBottom: 12, fontSize: 18, color: '#00FF9D' }} />
      <span style={{ color: '#e0e0ff' }}>
        <p>У вас еще нет команды</p>
      </span>
      <Flex vertical={true} gap={'middle'}>
        <AntdButton
          onClick={onCreateTeam}
          icon={<i className="fa-solid fa-plus" style={{ marginRight: 8 }} />}
          text={'Создать команду'}
        />
        <AntdButton
          onClick={onJoinTeam}
          icon={<i className="fas fa-users" style={{ marginRight: 8 }} />}
          text={'Присоединиться'}
        />
      </Flex>
    </Card>
  );
};
