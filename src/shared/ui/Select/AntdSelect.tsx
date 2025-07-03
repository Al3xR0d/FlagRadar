import { FC } from 'react';
import styled from 'styled-components';
import Select from 'antd/es/select';

interface Props {
  options: Options[];
}

interface Options {
  value: string;
  label: string;
}

export const AntdSelect: FC<Props> = (children) => {
  return <StyledSelect {...children} />;
};

const StyledSelect = styled(Select)`
  &&& {
    .ant-select-selector {
      background: #121218;
      color: #e0e0ff;
      border: 1px solid #25253a;
      transition: all 0.3s;
    }

    &:not(.ant-select-disabled):hover .ant-select-selector {
      border-color: #00ff9d;
    }

    &.ant-select-focused:not(.ant-select-disabled) .ant-select-selector {
      border-color: #00ff9d;
      box-shadow: 0 0 0 2px rgba(0, 255, 157, 0.2);
    }
  }

  && .ant-select-arrow {
    color: #e0e0ff;
  }

  && .ant-select-selection-item,
  && .ant-select-selection-placeholder {
    color: #e0e0ff;
  }

  && .ant-select-dropdown {
    background: #121218;
    border: 1px solid #25253a;
    border-radius: 4px;
    box-shadow: 0 3px 6px -4px rgba(0, 0, 0, 0.48), 0 6px 16px 0 rgba(0, 0, 0, 0.32),
      0 9px 28px 8px rgba(0, 0, 0, 0.2);
  }

  && .ant-select-item {
    color: #e0e0ff;
    background: #121218;

    &:hover:not(.ant-select-item-option-disabled) {
      background: #25253a;
    }
  }

  && .ant-select-item-option-selected:not(.ant-select-item-option-disabled) {
    background: #25253a;
    color: #e0e0ff;
  }

  && .ant-select-item-option-active:not(.ant-select-item-option-disabled) {
    background: #25253a;
  }

  && .ant-select-dropdown .ant-select-dropdown-search .ant-input {
    background: #121218;
    color: #e0e0ff;
    border-color: #25253a;

    &:hover {
      border-color: #00ff9d;
    }
  }
`;
