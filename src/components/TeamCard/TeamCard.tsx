import { FC, useState } from 'react';
import Card from 'antd/es/card';
import { AntdButton } from '@/shared/ui/Button';
import { EditTeamModal } from '../Modal/EditTeamModal';
import { AntdCancelButton } from '@/shared/ui/CancelButton/AntdCancelButton';
import Flex from 'antd/es/flex';

interface Props {
  name: string;
  scoreBB: number;
  scoreCTF: number;
  token: string;
  members: string[];
}

export const TeamCard: FC<Props> = ({ name, scoreBB, scoreCTF, token, members }) => {
  const [isCreateVisibleButton, setCreateVisibleButton] = useState(false);
  const [isCreateVisibleCancelButton, setCreateVisibleCancelButton] = useState(false);

  return (
    <>
      <Card style={{ background: '#1a1a24', border: '1px solid #25253a' }}>
        <i className="fas fa-users" style={{ marginBottom: 12, fontSize: 18, color: '#00FF9D' }} />
        <span style={{ color: '#e0e0ff' }}>
          <p>{name}</p>
          <p>{`BB: ${scoreBB}`}</p>
          <p>{`CTF: ${scoreCTF}`}</p>
          <p>{`Токен: ${token}`}</p>
          <p>{`Members: ${members.length}`}</p>
          <ul>
            {members.map((member, index) => (
              <li key={index}>{member}</li>
            ))}
          </ul>
        </span>
        <Flex gap="large">
          <AntdCancelButton
            onClick={() => setCreateVisibleCancelButton(true)}
            icon={<i className="fas fa-door-open" />}
            text="Покинуть команду"
          />
          <AntdButton
            onClick={() => setCreateVisibleButton(true)}
            icon={<i className="fas fa-edit" />}
            text="Редактировать"
          />
        </Flex>
      </Card>
      <EditTeamModal
        visible={isCreateVisibleButton}
        onClose={() => setCreateVisibleButton(false)}
        name={name}
      />
    </>
  );
};
