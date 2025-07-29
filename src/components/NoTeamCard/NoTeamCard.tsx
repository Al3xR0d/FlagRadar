import styled from 'styled-components';
import Flex from 'antd/es/flex';
import { FC } from 'react';
import { AntdButton } from '@/shared/ui/Button';
import { Icon } from '@/shared/ui/Icon';
import { StyledCard } from '@/shared/ui/StyledCard';

const Wrapper = styled.span`
  color: #eef3ff;
`;

interface Props {
  onCreateTeam: () => void;
  onJoinTeam: () => void;
}

export const NoTeamCard: FC<Props> = ({ onCreateTeam, onJoinTeam }) => {
  return (
    <StyledCard>
      <Icon className="fas fa-users" marginBottom="12" fontSize="20" />
      <Wrapper>
        <p>У вас еще нет команды</p>
      </Wrapper>
      <Flex vertical={true} gap={'middle'} align="flex-start">
        <AntdButton
          onClick={onCreateTeam}
          icon={<Icon className="fa-solid fa-plus" color="#0e0e14" fontSize="15" marginRight="8" />}
          text={'Создать команду'}
        />
        <AntdButton
          onClick={onJoinTeam}
          icon={<Icon className="fas fa-users" color="#0e0e14" fontSize="15" marginRight="8" />}
          text={'Присоединиться'}
        />
      </Flex>
    </StyledCard>
  );
};
