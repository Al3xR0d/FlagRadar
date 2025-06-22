import React from 'react';
import styled from 'styled-components';
import Table, { TableProps } from 'antd/es/table';

interface Props<T> extends TableProps<T> {}

export function AntdTable<T extends object = any>(props: Props<T>): React.ReactElement {
  return (
    <StyledTableWrapper>
      <Table<T> {...props} />
    </StyledTableWrapper>
  );
}

const StyledTableWrapper = styled.div`
  .ant-table {
    background-color: #151522;
    border: 1px solid #25253a;
    border-radius: 8px;
    overflow: hidden;

    .ant-table-thead > tr > th {
      background-color: #0c0e14;
      color: #8a8aa8;
      border-bottom: 1px solid #25253a;
      font-weight: 500;
    }

    .ant-table-tbody > tr > td {
      border-bottom: 1px solid #25253a;
      background-color: #151522;
      color: #ffffff;
      transition: background-color 0.2s ease;
    }

    .ant-table-tbody > tr:not(.ant-table-expanded-row):hover > td {
      background-color: #1e1e2d;
    }

    .ant-table-title {
      color: #e0e0ff;
      border-bottom: 1px solid #25253a;
      padding: 12px 16px;
    }

    .ant-empty-description {
      color: #e0e0ff;
    }

    .ant-pagination-item,
    .ant-pagination-item-link {
      background-color: #25253a;
      border-color: #25253a;
      a {
        color: #8a8aa8;
      }
    }

    .ant-pagination-item-active {
      background-color: #00ff9d;
      border-color: #00ff9d;
      a {
        color: #151522;
      }
    }
  }
`;
