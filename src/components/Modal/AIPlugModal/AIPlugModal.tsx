import React from 'react';
import { AntdModal } from '@/shared/ui/Modal';
import { AntdButton } from '@/shared/ui/Button';

interface Props {
  open: boolean;
  onCancel: () => void;
}

export const AIPlugModal: React.FC<Props> = ({ open, onCancel }) => {
  return (
    <>
      <AntdModal
        open={open}
        onCancel={onCancel}
        titleText="Внимание!"
        top={false}
        centered
        closable={false}
        footer={
          <>
            <AntdButton key="create" onClick={onCancel} text="Ок" />
          </>
        }
      >
        Данный функционал временно недоступен
      </AntdModal>
    </>
  );
};
