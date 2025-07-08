import React, { FC } from 'react';
import { AntdModal } from '@/shared/ui/Modal';
import { AntdCloseButton } from '@/shared/ui/CloseButton';
import { AntdButton } from '@/shared/ui/Button';
import { UploadOutlined } from '@ant-design/icons';
import { AntdInput } from '@/shared/ui/Input';
import message from 'antd/es/message';
import { ResultsListResponse } from '@/types/domain/Results';
import { AntdLink } from '@/shared/ui/Link';
import { CustomSpin } from '@/shared/ui/Spin';

interface Props {
  open: boolean;
  onClose: () => void;
  results?: ResultsListResponse;
  isLoading: boolean;
  isError: boolean;
}

export const ResultsModal: FC<Props> = ({ open, onClose, results, isLoading, isError }) => {
  console.log('results:', results);
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
          {/* <AntdButton key="confirm" onClick={() => {}} text="Сохранить" /> */}
        </>
      }
    >
      {isLoading ? (
        <CustomSpin />
      ) : isError ? (
        <p>Не удалось загрузить результаты</p>
      ) : !results || !results.data ? (
        <p>Результаты не загружены</p>
      ) : results.data.links.length === 0 ||
        (results.data.links.length === 1 && results.data.links[0] === '') ? (
        <p>Ссылки на разбор отсутствуют</p>
      ) : (
        <>
          <p>Ссылки на разбор</p>
          <ul>
            {results.data.links.map((link, index) => (
              <li key={index}>
                <AntdLink href={link} target="_blank">
                  {link}
                </AntdLink>
              </li>
            ))}
          </ul>
        </>
      )}
      {/* <AntdInput.TextArea placeholder="Ссылка на разбор" /> */}
    </AntdModal>
  );
};
