import { FC } from 'react';
import styled, { css } from 'styled-components';
import Input from 'antd/es/input';
import AutoComplete from 'antd/es/auto-complete';
import { InputProps } from 'antd';
import { AutoCompleteProps } from 'antd/es/auto-complete';
import { ChangeEvent } from 'react';
import { TextAreaProps } from 'antd/es/input';

const baseInputStyles = css`
  background: #121218;
  color: #eef3ff;
  border: 1px solid #25253a;
  transition: all 0.3s;
  border-radius: 8px;

  &:hover {
    border-color: #00ff9d;
  }

  &:focus,
  &.ant-input-focused {
    border-color: #00ff9d;
    box-shadow: none;
  }

  &:not(:disabled):not(.ant-input-disabled) {
    background: #121218;
  }

  &::placeholder {
    color: #eef3ff;
    opacity: 0.6;
  }
`;

const commonStyles = css`
  &&& {
    ${baseInputStyles}
  }
`;

const dropdownStyles = css`
  .ant-select-dropdown {
    background: #121218;
    border: 1px solid #25253a;
    border-radius: 8px;
    overflow: hidden;

    .ant-select-item {
      color: #eef3ff;

      &:hover {
        background-color: #1a1a24;
      }

      &-option-selected {
        background-color: #25253a;
      }

      &-option-active {
        background-color: #1c1c28;
      }
    }
  }
`;

interface Props extends Omit<InputProps, 'type'> {
  type?: string;
  min?: number;
  max?: number;
  value?: string | number | readonly string[];
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  defaultValue?: string;
  disabled?: boolean;
}

interface TextAreaPropsExtended extends TextAreaProps {
  defaultValue?: string;
}

interface AutoCompletePropsExtended extends AutoCompleteProps {
  $dropdownStyle?: React.CSSProperties;
}

const StyledInput = styled(Input)`
  ${commonStyles}

  &[type='datetime-local'] {
    &::-webkit-calendar-picker-indicator {
      filter: invert(1);
      cursor: pointer;
    }

    &::-moz-calendar-picker-indicator {
      filter: invert(1);
      cursor: pointer;
    }
  }
`;

const StyledTextArea = styled(Input.TextArea)`
  ${commonStyles}
  min-height: 100px;
  resize: vertical;
`;

const StyledAutoComplete = styled(AutoComplete)<AutoCompletePropsExtended>`
  ${dropdownStyles}
  width: 100%;

  &&.ant-select {
    .ant-select-selector {
      ${baseInputStyles}
      background: #121218;
      height: auto;
      padding: 4px 11px;
      border-radius: 8px;
      color: #eef3ff;
    }

    &.ant-select-focused:not(.ant-select-disabled):not(.ant-select-customize-input) {
      .ant-select-selector {
        border-color: #00ff9d;
        box-shadow: none;
      }
    }

    &:not(.ant-select-disabled):hover {
      .ant-select-selector {
        border-color: #00ff9d;
      }
    }

    .ant-select-selection-placeholder {
      color: #eef3ff;
      opacity: 0.6;
    }

    .ant-select-arrow {
      color: #eef3ff;
    }
  }
`;

const AntdTextArea: FC<TextAreaPropsExtended> = (props) => {
  return <StyledTextArea {...props} />;
};

const AntdAutoComplete: FC<AutoCompletePropsExtended> = (props) => {
  return <StyledAutoComplete {...props} />;
};

export const AntdInput: FC<Props> & {
  TextArea: typeof AntdTextArea;
  AutoComplete: typeof AntdAutoComplete;
} = (props) => {
  return <StyledInput {...props} />;
};

AntdInput.TextArea = AntdTextArea;
AntdInput.AutoComplete = AntdAutoComplete;
