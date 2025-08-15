import { FC, useState, useRef, useMemo, useCallback } from 'react';
import { AntdTable } from '@/shared/ui/Table';
import { AntdSelect } from '@/shared/ui/Select';
import { Icon } from '@/shared/ui/Icon';
import { CustomSpin } from '@/shared/ui/Spin';
import Empty from 'antd/es/empty';
import { ColumnsType } from 'antd/es/table';
import { AntdTabs } from '@/shared/ui/Tabs';
import { useTeamsRaiting } from '@/hooks/useQueries';

interface RatingBase {
  place: number;
  score: number;
  participation: number;
}

interface TeamRating extends RatingBase {
  teamName: string;
}

interface PersonalRating extends RatingBase {
  name: string;
}

interface Props {
  onChange?: (pagination: any, filters: any, sorter: any, extra: any) => void;
}

export const RaitingTable: FC<Props> = ({ onChange }) => {
  const [selectedYear, setSelectedYear] = useState(() => new Date().getFullYear().toString());
  const [teamPage, setTeamPage] = useState(1);
  const [userPage, setUserPage] = useState(1);

  const teamTableRef = useRef<HTMLDivElement | null>(null);
  const userTableRef = useRef<HTMLDivElement | null>(null);

  const pageSize = 10;

  const { data: teamsData, isLoading } = useTeamsRaiting({
    year: parseInt(selectedYear, 10),
    page: teamPage,
  });

  const years = useMemo(
    () =>
      Array.from({ length: 5 }, (_, i) => {
        const year = (new Date().getFullYear() - i).toString();
        return { value: year, label: year };
      }),
    [],
  );

  const assignPlaces = useCallback(
    <T extends { score: number }>(data: T[]): (T & { place: number })[] => {
      let lastScore: number | null = null;
      let currentPlace = 0;
      return [...data]
        .sort((a, b) => b.score - a.score)
        .map((item, index) => {
          if (item.score !== lastScore) {
            currentPlace = index + 1;
            lastScore = item.score;
          }
          return { ...item, place: currentPlace };
        });
    },
    [],
  );

  const getColumns = useCallback(
    (nameKey: keyof TeamRating | keyof PersonalRating, nameLabel: string): ColumnsType<any> => [
      { title: 'Место', dataIndex: 'place', key: 'place', align: 'center' },
      { title: nameLabel, dataIndex: nameKey, key: String(nameKey), align: 'center' },
      { title: 'Баллы', dataIndex: 'score', key: 'score', align: 'center' },
      { title: 'Участий в CTF', dataIndex: 'participation', key: 'participation', align: 'center' },
    ],
    [],
  );

  const prepareTableData = useCallback(
    <T extends { score: number }>(data: T[], page: number) =>
      assignPlaces(data).slice((page - 1) * pageSize, page * pageSize),
    [assignPlaces],
  );

  const teamTableData = useMemo(() => {
    const teams =
      teamsData?.data?.map((team) => ({
        teamName: team.teamname,
        score: team.ctf_score,
        participation: team.num_ctf,
      })) ?? [];
    return prepareTableData(teams, teamPage);
  }, [teamsData, teamPage, prepareTableData]);

  const userTableData = useMemo(() => {
    const users =
      teamsData?.data?.flatMap((team) =>
        team.members.map((member) => ({
          name: member.nickname,
          score: team.ctf_score,
          participation: team.num_ctf,
        })),
      ) ?? [];
    return prepareTableData(users, userPage);
  }, [teamsData, userPage, prepareTableData]);

  const totalTeams = teamsData?.data?.length ?? 0;
  const totalUsers = teamsData?.data?.reduce((acc, t) => acc + t.members.length, 0) ?? 0;

  const handleTableChange = useCallback(
    (setPage: (page: number) => void, ref: React.RefObject<HTMLDivElement | null>) =>
      (pagination: any) => {
        setPage(pagination.current);
        ref.current?.scrollIntoView({ behavior: 'smooth' });
        onChange?.(pagination, {}, {}, {});
      },
    [onChange],
  );

  const commonTableProps = {
    loading: { spinning: isLoading, indicator: <CustomSpin /> },
    locale: {
      emptyText: (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description="Результаты за указанный год отсутствуют"
        />
      ),
    },
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

      <AntdTabs
        items={[
          {
            key: 'teams',
            label: 'Команды',
            children: (
              <AntdTable
                {...commonTableProps}
                dataSource={teamTableData}
                columns={getColumns('teamName', 'Команда')}
                rowKey="place"
                title={() => (
                  <>
                    <Icon className="fas fa-line-chart" $marginRight="8px" />
                    Команды
                  </>
                )}
                pagination={{
                  current: teamPage,
                  pageSize,
                  showSizeChanger: false,
                  disabled: isLoading || !teamTableData.length,
                  total: totalTeams,
                }}
                onChange={handleTableChange(setTeamPage, teamTableRef)}
              />
            ),
          },
          {
            key: 'users',
            label: 'Пользователи',
            children: (
              <AntdTable
                {...commonTableProps}
                dataSource={userTableData}
                columns={getColumns('name', 'Пользователь')}
                rowKey="name"
                title={() => (
                  <>
                    <Icon className="fas fa-line-chart" $marginRight="8px" />
                    Пользователи
                  </>
                )}
                pagination={{
                  current: userPage,
                  pageSize,
                  showSizeChanger: false,
                  disabled: isLoading || !userTableData.length,
                  total: totalUsers,
                }}
                onChange={handleTableChange(setUserPage, userTableRef)}
              />
            ),
          },
        ]}
      />
    </>
  );
};
