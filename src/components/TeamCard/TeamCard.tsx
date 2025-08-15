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
import { TransferCaptainModal } from '@/components/Modal/TransferCaptainModal';
import { DemoteMemberModal } from '@/components/Modal/DemoteMemberModal';
import { DeleteTeamModal } from '@/components/Modal/DeleteTeamModal';

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
  const [isTransferCaptainModalOpen, setTransferCaptainModalOpen] = useState<boolean>(false);
  const [isDemoteMemberModalOpen, setDemoteMemberModalOpen] = useState<boolean>(false);
  const [isDeleteTeamModalOpen, setDeleteTeamModalOpen] = useState<boolean>(false);

  const curentUser = useUserStore((store) => store.currentUser);
  const isCaptain = curentUser?.properties === 'captain';

  return (
    <>
      <StyledCard>
        <Icon className="fas fa-users" $fontSize="20px" $marginBottom="12px" />
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
          {!isCaptain ? (
            <AntdCancelButton
              onClick={() => setCreateVisibleCancelButton(true)}
              icon={
                <Icon
                  className="fas fa-door-open"
                  color="#ffffff"
                  $marginRight="8px"
                  $fontSize="15px"
                />
              }
              text="Покинуть команду"
            />
          ) : (
            <></>
          )}
          {isCaptain ? (
            <AntdButton
              onClick={() => setCreateVisibleButton(true)}
              icon={
                <Icon className="fas fa-edit" color="#0e0e14" $marginRight="8px" $fontSize="15px" />
              }
              text="Редактировать"
            />
          ) : (
            <></>
          )}
          {isCaptain && members.length > 1 ? (
            <AntdButton
              onClick={() => setTransferCaptainModalOpen(true)}
              icon={
                <Icon
                  className="fa fa-exchange"
                  color="#0e0e14"
                  $marginRight="8px"
                  $fontSize="15px"
                />
              }
              text="Передать права капитана"
            />
          ) : (
            <></>
          )}
          {isCaptain && members.length > 1 ? (
            <AntdCancelButton
              onClick={() => setDemoteMemberModalOpen(true)}
              icon={
                <Icon
                  className="fa fa-sign-out"
                  color="#eef3ff"
                  $marginRight="8px"
                  $fontSize="15px"
                />
              }
              text="Разжаловать участника"
            />
          ) : (
            <></>
          )}
          {isCaptain ? (
            <AntdCancelButton
              onClick={() => setDeleteTeamModalOpen(true)}
              icon={
                <Icon className="fa fa-trash" color="#eef3ff" $marginRight="8px" $fontSize="15px" />
              }
              text="Расформировать команду"
            />
          ) : (
            <></>
          )}
        </Flex>
      </StyledCard>
      {isCreateVisibleButton && (
        <EditTeamModal
          open={isCreateVisibleButton}
          onClose={() => setCreateVisibleButton(false)}
          name={name}
        />
      )}
      {isCreateVisibleCancelButton && (
        <LeaveTeamModal
          open={isCreateVisibleCancelButton}
          onClose={() => setCreateVisibleCancelButton(false)}
        />
      )}
      {isTransferCaptainModalOpen && (
        <TransferCaptainModal
          open={isTransferCaptainModalOpen}
          onCancel={() => setTransferCaptainModalOpen(false)}
          members={members}
        />
      )}
      {isDemoteMemberModalOpen && (
        <DemoteMemberModal
          open={isDemoteMemberModalOpen}
          onCancel={() => setDemoteMemberModalOpen(false)}
          members={members}
        />
      )}
      {isDeleteTeamModalOpen && (
        <DeleteTeamModal
          open={isDeleteTeamModalOpen}
          onCancel={() => setDeleteTeamModalOpen(false)}
        />
      )}
    </>
  );
};
