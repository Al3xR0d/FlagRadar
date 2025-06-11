import React from 'react';
import { AntdInput } from '@/shared/ui/Input';
import { AntdModal } from '@/shared/ui/Modal';
import { AntdCloseButton } from '@/shared/ui/CloseButton';
import { AntdButton } from '@/shared/ui/Button';

interface Props {
  open: boolean;
  onClose: () => void;
}

export const JoinCTFModal: React.FC<Props> = ({ open, onClose }) => {
  return (
    <AntdModal
      titleText="Введите токен"
      open={open}
      onCancel={onClose}
      top={false}
      centered={true}
      showTitleDivider={false}
      footer={
        <>
          <AntdCloseButton key="cancel" onClick={onClose} text="Отмена" />
          <AntdButton key="confirm" onClick={() => {}} text="Присоедениться" />
        </>
      }
    >
      <AntdInput placeholder="Токен CTF" />
    </AntdModal>
  );
};
