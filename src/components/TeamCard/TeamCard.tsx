import { FC, useState } from 'react';
import styled from 'styled-components';
import { AntdButton } from '@/shared/ui/Button';
import { EditTeamModal } from '@/components/Modal/EditTeamModal';
import { AntdCancelButton } from '@/shared/ui/CancelButton';
import Flex from 'antd/es/flex';
import { LeaveTeamModal } from '@/components/Modal/LeaveTeamModal';
import { useUserStore } from '@/store/userStore';
import { Icon } from '@/shared/ui/Icon';
import { StyledCard } from '@/shared/ui/StyledCard';

const Wrapper = styled.span`
  color: #e0e0ff;
  font-size: 18px;
`;

interface Props {
  name: string;
  scoreBB: number;
  scoreCTF: number;
  token: string;
  members: string[];
}

export const TeamCard: FC<Props> = ({ name, scoreBB, scoreCTF, token, members }) => {
  const [isCreateVisibleButton, setCreateVisibleButton] = useState<boolean>(false);
  const [isCreateVisibleCancelButton, setCreateVisibleCancelButton] = useState<boolean>(false);

  const curentUser = useUserStore((store) => store.currentUser);
  const isCaptain = curentUser?.properties === 'captain';

  return (
    <>
      <StyledCard>
        <Icon className="fas fa-users" fontSize="20" marginBottom="12" />
        <Wrapper>
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
        </Wrapper>
        <Flex gap="large">
          {(isCaptain && members.length === 1) || !isCaptain ? (
            <AntdCancelButton
              onClick={() => setCreateVisibleCancelButton(true)}
              icon={
                <Icon className="fas fa-door-open" color="#ffffff" marginRight="8" fontSize="15" />
              }
              text="Покинуть команду"
            />
          ) : (
            <></>
          )}
          {isCaptain ? (
            <AntdButton
              onClick={() => setCreateVisibleButton(true)}
              icon={<Icon className="fas fa-edit" color="#0e0e14" marginRight="8" fontSize="15" />}
              text="Редактировать"
            />
          ) : (
            <></>
          )}
        </Flex>
      </StyledCard>
      <EditTeamModal
        open={isCreateVisibleButton}
        onClose={() => setCreateVisibleButton(false)}
        name={name}
      />
      <LeaveTeamModal
        open={isCreateVisibleCancelButton}
        onClose={() => setCreateVisibleCancelButton(false)}
      />
    </>
  );
};
