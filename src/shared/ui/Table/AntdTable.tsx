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
  max-width: 1300px;
  margin: 0 auto;
  width: 100%;

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
      color: #eef3ff;
      transition: background-color 0.2s ease, opacity 0.2s ease;
    }

    .ant-table-tbody > tr:not(.ant-table-expanded-row):hover > td {
      background-color: #1e1e2d;
    }

    .ant-table-tbody > tr.ant-table-row-selected > td {
      color: #eef3ff;
      background-color: #1e1e2d !important;
      opacity: 0.3;
    }

    && .ant-table-tbody > tr.ant-table-row-selected:hover > td {
      opacity: 0.3;
    }

    .ant-table-tbody > tr:has(.ant-tooltip-open) > td {
      background-color: #151522;
    }

    .ant-table-footer {
      background: rgb(18, 18, 24);
    }

    .ant-table-title {
      color: #eef3ff;
      border-bottom: 1px solid #25253a;
      padding: 12px 16px;
      font-size: 24px;
    }

    .ant-empty-description {
      color: #eef3ff;
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

  .ant-pagination {
    display: flex;
    justify-content: center;
    padding: 16px 0;
  }

  .ant-pagination-item,
  .ant-pagination-prev,
  .ant-pagination-next {
    background: transparent;
    border: none;
    a,
    .anticon {
      color: #00ff9d;
    }
  }

  .ant-pagination-item-active {
    background: #00ff9d;
    border: none;

    a {
      color: #151522;
    }
  }

  .ant-pagination-item:hover,
  .ant-pagination-prev:hover,
  .ant-pagination-next:hover {
    border: none;
    background: rgba(0, 255, 157, 0.2);

    a,
    .anticon {
      color: #00ff9d;
    }
  }

  .ant-pagination-disabled > .ant-pagination-item-link .anticon {
    color: #555;
  }
`;
