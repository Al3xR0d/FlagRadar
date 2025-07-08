import React, { FC } from 'react';
import styled, { css } from 'styled-components';
import { EventsStatus } from '@/types/domain/Events';

interface HackTagProps {
  $status: EventsStatus;
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
    background-color: #001f0f;
    color: #00ff9d;
    border: 1px solid #00ff9d;
    font-weight: 700;
  `,
  finished: css`
    background-color: #001f0f;
    color: #00ff9d;
    border: 1px solid #00ff9d;
    font-weight: 400;
  `,
  cancelled: css`
    background-color: #001f0f;
    color: #00ff9d;
    border: 1px solid #00ff9d;
    font-weight: 700;
  `,
  registration: css`
    background-color: #001f0f;
    color: #00ff9d;
    border: 1px solid #00ff9d;
    font-weight: 700;
  `,
};

const Tag = styled.span<{ $status: EventsStatus }>`
  display: inline-block;
  padding: 4px 12px;
  border-radius: 60px;
  letter-spacing: 1.5px;
  font-size: 0.7rem;
  user-select: none;
  ${(props) => statusStyles[props.$status]}
  transition: box-shadow 0.3s ease;

  &:hover {
    box-shadow: 0 0 8px
      ${(props) => {
        switch (props.$status) {
          case 'active':
            return '#00ff9d';
          case 'pending':
            return '#00ff9d';
          case 'finished':
            return '#00ff9d';
          case 'cancelled':
            return '#00ff9d';
          case 'registration':
            return '#00ff9d';
          default:
            return 'transparent';
        }
      }};
  }
`;

const STATUS_TEXT_MAP: Record<EventsStatus, string> = {
  active: 'Активно',
  pending: 'Подготовка',
  finished: 'Завершен',
  registration: 'Регистрация',
  cancelled: 'Отменён',
};

export const Tags: FC<HackTagProps> = ({ $status }) => {
  return <Tag $status={$status}>{STATUS_TEXT_MAP[$status]}</Tag>;
};
