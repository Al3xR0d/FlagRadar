import React, { FC } from 'react';
import { AntdModal } from '@/shared/ui/Modal';
import { AntdCloseButton } from '@/shared/ui/CloseButton';
import { ResultsListResponse } from '@/types/domain/Results';
import { AntdLink } from '@/shared/ui/Link';
import { CustomSpin } from '@/shared/ui/Spin';
import Empty from 'antd/es/empty';
import styled from 'styled-components';
import { FrownOutlined, LinkOutlined } from '@ant-design/icons';

interface Props {
  open: boolean;
  onClose: () => void;
  results?: ResultsListResponse;
  isLoading: boolean;
  isError: boolean;
}

export const StyledEmpty = styled(Empty)`
  .ant-empty-image {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100px;
    width: 100px;
    margin: 0 auto;

    svg {
      width: 100px;
      height: 90px;
      font-size: 100px;
    }
  }

  .ant-empty-description {
    color: #eef3ff;
    text-align: center;
  }
`;

const editLink = (link: string) => {
  if (!link.startsWith('http')) {
    return `https://${link}`;
  }
  return link;
};

export const ResultsModal: FC<Props> = ({ open, onClose, results, isLoading, isError }) => {
  return (
    <AntdModal
      titleText="Результаты"
      iconClassName="fas fa-edit"
      open={open}
      onCancel={onClose}
      top={false}
      centered
      footer={
        <>
          <AntdCloseButton key="close" onClick={onClose} text="Отмена" />
        </>
      }
    >
      {isLoading ? (
        <CustomSpin />
      ) : isError ? (
        <p>Не удалось загрузить результаты</p>
      ) : !results || !results.data ? (
        <StyledEmpty
          image={<FrownOutlined />}
          description="Для этого CTF результаты ещё не загружены"
        />
      ) : results.data.links.length === 0 ||
        (results.data.links.length === 1 && results.data.links[0] === '') ? (
        <StyledEmpty
          image={<LinkOutlined />}
          description="В загруженном файле ссылки на разбор отсутствуют"
        />
      ) : (
        <>
          <p>Ссылки на разбор</p>
          <ul>
            {results.data.links.map((link, index) => (
              <li key={index}>
                <AntdLink href={editLink(link)} target="_blank">
                  {editLink(link)}
                </AntdLink>
              </li>
            ))}
          </ul>
        </>
      )}
    </AntdModal>
  );
};
