import { FC, useState } from 'react';
import { AntdTable } from '@/shared/ui/Table';
import { AntdSelect } from '@/shared/ui/Select';
import { Icon } from '@/shared/ui/Icon';
import { CustomSpin } from '@/shared/ui/Spin';
import Empty from 'antd/es/empty';
import { ColumnsType } from 'antd/es/table';
import { AntdTabs } from '@/shared/ui/Tabs';

interface TeamRating {
  place: number;
  teamName: string;
  score: number;
  participation: number;
}

interface Props {
  isLoading: boolean;
  data?: any;
  onChange?: (pagination: any, filters: any, sorter: any, extra: any) => void;
}

interface Option {
  value: string;
  label: string;
}

export const RaitingTable: FC<Props> = ({ isLoading }) => {
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());
  //   const [data, setData] = useState<TeamRating[]>([]);
  //   const [years, setYears] = useState<Option[]>([]);
  const [data] = useState<TeamRating[]>([
    { place: 1, teamName: 'Команда 1', score: 100, participation: 3 },
    { place: 2, teamName: 'Команда 2', score: 90, participation: 2 },
    { place: 3, teamName: 'Команда 3', score: 80, participation: 1 },
  ]);
  const [years] = useState<Option[]>([
    { value: new Date().getFullYear().toString(), label: new Date().getFullYear().toString() },
    { value: '2023', label: '2023' },
    { value: '2022', label: '2022' },
    { value: '2021', label: '2021' },
  ]);

  // Загрузка списка годов при монтировании компонента
  // useEffect(() => {
  //   fetch('/api/years') // Предполагаемый эндпоинт для списка годов
  //     .then((response) => response.json())
  //     .then((data: number[]) =>
  //       setYears(data.map((year) => ({ value: year.toString(), label: year.toString() })))
  //     .catch((error) => console.error('Ошибка загрузки годов:', error));
  // }, []);

  // Загрузка данных рейтинга при смене года
  // useEffect(() => {
  //   fetch(`/api/rating?year=${selectedYear}`) // Предполагаемый эндпоинт для рейтинга
  //     .then((response) => response.json())
  //     .then((data) => setData(data))
  //     .catch((error) => console.error('Ошибка загрузки рейтинга:', error));
  // }, [selectedYear]);

  const teamsColumns: ColumnsType = [
    ////// необхидимо добавить типы, наподобии ColumnsType<Teams>
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

  const usersColumns: ColumnsType = [
    ////// необхидимо добавить типы, наподобии ColumnsType<Teams>
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

  return (
    <>
      <AntdSelect
        options={years}
        value={selectedYear}
        onChange={(value) => setSelectedYear(value)}
        style={{ width: 120, marginBottom: 16 }}
      />
      {/* <Tabs
        defaultActiveKey="1"
        items={[
          {
            label: 'Команды',
            key: '1',
            children: (
              <AntdTable
                loading={{
                  spinning: isLoading,
                  indicator: <CustomSpin />,
                }}
                dataSource={data}
                columns={columns}
                rowKey="place"
                title={() => <Icon className="fas fa-ranking-star" />}
                pagination={{ pageSize: 10 }}
                locale={{
                  emptyText: (
                    <Empty
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                      description="Результаты за указанный год отсутствуют"
                    />
                  ),
                }}
              />
            ),
          },
          {
            label: 'Пользователи',
            key: '2',
            children: 'Tab 2',
          },
        ]}
      ></Tabs> */}
      <AntdTabs>
        <AntdTabs.TabPane tab="Команды" key="1">
          <AntdTable
            loading={{
              spinning: isLoading,
              indicator: <CustomSpin />,
            }}
            dataSource={data}
            columns={teamsColumns}
            rowKey="place"
            title={() => <Icon className="fas fa-ranking-star" />}
            pagination={{ pageSize: 10 }}
            locale={{
              emptyText: (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description="Результаты за указанный год отсутствуют"
                />
              ),
            }}
          />
        </AntdTabs.TabPane>
        <AntdTabs.TabPane tab="Пользователи" key="2">
          <AntdTable
            loading={{
              spinning: isLoading,
              indicator: <CustomSpin />,
            }}
            dataSource={data}
            columns={usersColumns}
            rowKey="place"
            title={() => <Icon className="fas fa-ranking-star" />}
            pagination={{ pageSize: 10 }}
            locale={{
              emptyText: (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description="Результаты за указанный год отсутствуют"
                />
              ),
            }}
          />
        </AntdTabs.TabPane>
      </AntdTabs>
    </>
  );
};
