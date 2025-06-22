import { FC } from 'react';
import styled from 'styled-components';
import Input from 'antd/es/input';
import { InputProps } from 'antd';
import { ChangeEvent } from 'react';
import { TextAreaProps } from 'antd/es/input';

interface Props extends Omit<InputProps, 'type'> {
  type?: string;
  min?: number;
  max?: number;
  value?: string | number | readonly string[];
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  defaultValue?: string;
}

interface TextAreaPropsExtended extends TextAreaProps {
  defaultValue?: string;
}

const commonStyles = `
  &&& {
    background: #121218;
    color: #e0e0ff;
    border: 1px solid #25253a;
    transition: all 0.3s;

    &:hover {
      border-color: #00ff9d;
      background: #121218;
    }

    &:focus,
    &:focus-within,
    &.ant-input-focused {
      border-color: #00ff9d;
      background: #121218;
      box-shadow: none;
    }

    &:not(:disabled):not(.ant-input-disabled) {
      background: #121218;
    }

    &::placeholder {
      color: #e0e0ff;
      opacity: 0.6;
    }
  }
`;

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

const AntdTextArea: FC<TextAreaPropsExtended> = (props) => {
  return <StyledTextArea {...props} />;
};

export const AntdInput: FC<Props> & { TextArea: typeof AntdTextArea } = (props) => {
  return <StyledInput {...props} />;
};

AntdInput.TextArea = AntdTextArea;
