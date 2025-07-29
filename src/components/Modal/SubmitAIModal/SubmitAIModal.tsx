import React from 'react';
import { AntdModal } from '@/shared/ui/Modal';
import { AntdButton } from '@/shared/ui/Button';
import { AntdCloseButton } from '@/shared/ui/CloseButton';

interface Props {
  open: boolean;
  onCancel: () => void;
  handleSubmit: () => void;
  confirmLoading: boolean;
}

export const SubmitAIModal: React.FC<Props> = ({
  open,
  onCancel,
  handleSubmit,
  confirmLoading,
}) => {
  return (
    <>
      <AntdModal
        open={open}
        titleText="Внимание"
        onCancel={onCancel}
        handleSubmit={handleSubmit}
        confirmLoading={confirmLoading}
        footer={
          <>
            <AntdCloseButton onClick={onCancel} text="Отмена" />
            <AntdButton onClick={handleSubmit} text="Да" />
          </>
        }
      >
        Контекст AI помощника будет потерян. Продолжить?
      </AntdModal>
    </>
  );
};
