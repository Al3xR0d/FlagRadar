import { FC, useState, useRef, useMemo } from 'react';
import { AntdTable } from '@/shared/ui/Table';
import { AntdSelect } from '@/shared/ui/Select';
import { Icon } from '@/shared/ui/Icon';
import { CustomSpin } from '@/shared/ui/Spin';
import Empty from 'antd/es/empty';
import { ColumnsType } from 'antd/es/table';
import { AntdTabs } from '@/shared/ui/Tabs';
import { useTeamsRaiting } from '@/hooks/useQueries';

interface TeamRating {
  place: number;
  teamName: string;
  score: number;
  participation: number;
}

interface PersonalRating {
  place: number;
  name: string;
  score: number;
  participation: number;
}

interface Option {
  value: string;
  label: string;
}

interface Props {
  onChange?: (pagination: any, filters: any, sorter: any, extra: any) => void;
}

export const RaitingTable: FC<Props> = ({ onChange }) => {
  console.count('RaitingTable render');
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());
  const [teamPage, setTeamPage] = useState(1);
  const [userPage, setUserPage] = useState(1);

  const teamTableRef = useRef<HTMLDivElement>(null);
  const userTableRef = useRef<HTMLDivElement>(null);

  const pageSize = 10;

  const { data: teamsData, isLoading: isTeamsLoading } = useTeamsRaiting({
    year: parseInt(selectedYear),
    page: teamPage,
  });

  const years: Option[] = [
    { value: new Date().getFullYear().toString(), label: new Date().getFullYear().toString() },
    { value: '2023', label: '2023' },
    { value: '2022', label: '2022' },
    { value: '2021', label: '2021' },
  ];

  const teamsColumns: ColumnsType<TeamRating> = [
    {
      title: 'Место',
      dataIndex: 'place',
      key: 'place',
      align: 'center',
    },
    {
      title: 'Команда',
      dataIndex: 'teamName',
      key: 'teamName',
      align: 'center',
    },
    {
      title: 'Баллы',
      dataIndex: 'score',
      key: 'score',
      align: 'center',
    },
    {
      title: 'Участий в CTF',
      dataIndex: 'participation',
      key: 'participation',
      align: 'center',
    },
  ];

  const usersColumns: ColumnsType<PersonalRating> = [
    {
      title: 'Место',
      dataIndex: 'place',
      key: 'place',
      align: 'center',
    },
    {
      title: 'Пользователь',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
    },
    {
      title: 'Баллы',
      dataIndex: 'score',
      key: 'score',
      align: 'center',
    },
    {
      title: 'Участий в CTF',
      dataIndex: 'participation',
      key: 'participation',
      align: 'center',
    },
  ];

  const teamTableData = useMemo(() => {
    return (
      teamsData?.data?.map((team, index) => ({
        place: (teamPage - 1) * pageSize + index + 1,
        teamName: team.teamname,
        score: team.ctf_score,
        participation: team.num_ctf,
      })) || []
    );
  }, [teamsData, teamPage]);

  const userTableData = useMemo(
    () =>
      teamsData?.data
        ?.flatMap((team) =>
          team.members.map((member, memberIndex) => ({
            place: (userPage - 1) * pageSize + memberIndex + 1,
            name: member.nickname,
            score: team.ctf_score,
            participation: team.num_ctf,
          })),
        )
        .slice((userPage - 1) * pageSize, userPage * pageSize) || [],
    [teamsData, userPage],
  );

  const totalTeams = teamsData?.data?.length || 0;
  const totalUsers = teamsData?.data?.reduce((acc, team) => acc + team.members.length, 0) || 0;

  const handleTeamTableChange = (pagination: any) => {
    setTeamPage(pagination.current);
    if (teamTableRef.current) {
      teamTableRef.current.scrollIntoView({ behavior: 'smooth' });
    }
    if (onChange) {
      onChange(pagination, {}, {}, {});
    }
  };

  const handleUserTableChange = (pagination: any) => {
    setUserPage(pagination.current);
    if (userTableRef.current) {
      userTableRef.current.scrollIntoView({ behavior: 'smooth' });
    }
    if (onChange) {
      onChange(pagination, {}, {}, {});
    }
  };

  return (
    <>
      <AntdSelect
        options={years}
        value={selectedYear}
        onChange={(value) => {
          setSelectedYear(value);
          setTeamPage(1);
          setUserPage(1);
        }}
        style={{ width: 120, marginBottom: 16 }}
        placeholder="Выберите год"
      />
      <AntdTabs>
        <AntdTabs.TabPane tab="Команды" key="1">
          <AntdTable
            loading={{
              spinning: isTeamsLoading,
              indicator: <CustomSpin />,
            }}
            dataSource={teamTableData}
            columns={teamsColumns}
            rowKey="place"
            title={() => <Icon className="fas fa-ranking-star" />}
            pagination={{
              current: teamPage,
              pageSize,
              showSizeChanger: false,
              disabled: isTeamsLoading || teamTableData.length === 0,
              total: totalTeams,
            }}
            locale={{
              emptyText: (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description="Результаты за указанный год отсутствуют"
                />
              ),
            }}
            onChange={handleTeamTableChange}
          />
        </AntdTabs.TabPane>
        <AntdTabs.TabPane tab="Пользователи" key="2">
          <AntdTable
            loading={{
              spinning: isTeamsLoading,
              indicator: <CustomSpin />,
            }}
            dataSource={userTableData}
            columns={usersColumns}
            rowKey="name"
            title={() => <Icon className="fas fa-ranking-star" />}
            pagination={{
              current: userPage,
              pageSize,
              showSizeChanger: false,
              disabled: isTeamsLoading || userTableData.length === 0,
              total: totalUsers,
            }}
            locale={{
              emptyText: (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description="Результаты за указанный год отсутствуют"
                />
              ),
            }}
            onChange={handleUserTableChange}
          />
        </AntdTabs.TabPane>
      </AntdTabs>
    </>
  );
};
