import React, { FC } from 'react';
import styled, { css } from 'styled-components';
import { EventsStatus } from '@/types/domain/Events';

interface HackTagProps {
  status: EventsStatus;
  children?: React.ReactNode;
}

const statusStyles = {
  active: css`
    background-color: #001f0f;
    color: #00ff9d;
    border: 1px solid #00ff9d;
    font-weight: 700;
  `,
  pending: css`
    background-color: #1a1a00;
    color: #ffcc00;
    border: 1px solid #ffcc00;
    font-weight: 700;
  `,
  finished: css`
    background-color: #2f2f2f;
    color: #999999;
    border: 1px solid #666666;
    font-weight: 400;
  `,
  cancelled: css`
    background-color: #3a0000;
    color: #ff4c4c;
    border: 1px solid #ff4c4c;
    font-weight: 700;
  `,
};

const Tag = styled.span<{ status: EventsStatus }>`
  display: inline-block;
  padding: 4px 12px;
  border-radius: 60px;
  letter-spacing: 1.5px;
  font-size: 0.7rem;
  user-select: none;
  ${(props) => statusStyles[props.status]}
  transition: box-shadow 0.3s ease;

  &:hover {
    box-shadow: 0 0 8px
      ${(props) => {
        switch (props.status) {
          case 'active':
            return '#00ff9d';
          case 'pending':
            return '#ffcc00';
          case 'finished':
            return '#999999';
          case 'cancelled':
            return '#ff4c4c';
          default:
            return 'transparent';
        }
      }};
  }
`;

const STATUS_TEXT_MAP: Record<EventsStatus, string> = {
  active: 'Активно',
  pending: 'Ожидает',
  finished: 'Завершен',
  cancelled: 'Отменён',
};

export const Tags: FC<HackTagProps> = ({ status }) => {
  return <Tag status={status}>{STATUS_TEXT_MAP[status]}</Tag>;
};
