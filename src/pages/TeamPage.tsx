import React, { useState } from 'react';
import List from 'antd/es/list';
import { CreateTeamModal } from '@/components/Modal/CreateTeamModal';
import { NoTeamCard } from '@/components/NoTeamCard';
import { Header } from '@/components/Layout/Header';
import { User } from '@/types';
import { JoinTeamModal } from '@/components/Modal/JoinTeamModal';
import { Footer } from '@/components/Layout/Footer';
import { useTeamByCurrentUser } from '@/hooks/useQueries';
import { TeamCard } from '@/components/TeamCard';
import { CustomSpin } from '@/shared/ui/Spin';
import { PageContainer } from '@/shared/ui/PageContainer';

const TeamPage: React.FC = () => {
  const { data: teamData, isLoading: isLoadingTeam } = useTeamByCurrentUser();
  const data: User[] = [];
  const isLoading = false;
  const [isCreateVisible, setCreateVisible] = useState(false);
  const [isJoinVisible, setJoinVisible] = useState(false);

  if (isLoadingTeam) return <CustomSpin />;
  return (
    <PageContainer vertical>
      {teamData ? (
        <>
          <Header title="Моя команда" />
          <TeamCard
            name={teamData.name}
            scoreBB={teamData.score_bb}
            scoreCTF={teamData.score_ctf}
            token={teamData.token}
            members={teamData.members}
          />
        </>
      ) : (
        <PageContainer vertical>
          <Header title="Моя команда" />

          {(data?.length || 0) > 0 && isLoading ? (
            <List<User>
              loading={isLoading}
              header={<div>Участники команды</div>}
              bordered
              dataSource={data ?? []}
              renderItem={(item) => <List.Item>{item.login}</List.Item>}
            />
          ) : (
            <>
              <NoTeamCard
                onCreateTeam={() => setCreateVisible(true)}
                onJoinTeam={() => setJoinVisible(true)}
              />
              {isCreateVisible && (
                <CreateTeamModal
                  visible={isCreateVisible}
                  onClose={() => setCreateVisible(false)}
                />
              )}
              {isJoinVisible && (
                <JoinTeamModal visible={isJoinVisible} onClose={() => setJoinVisible(false)} />
              )}
            </>
          )}
        </PageContainer>
      )}
      <Footer />
    </PageContainer>
  );
};

export default TeamPage;
