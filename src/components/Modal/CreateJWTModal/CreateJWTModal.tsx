import React from 'react';
import { AntdModal } from '@/shared/ui/Modal';
import { AntdInput } from '@/shared/ui/Input';
import { AntdButton } from '@/shared/ui/Button';
import { AntdCloseButton } from '@/shared/ui/CloseButton';
import message from 'antd/es/message';
import copy from 'copy-to-clipboard';

interface Props {
  open: boolean;
  onCancel: () => void;
  JWT: string;
  isLoading: boolean;
}

export const CreateJWTModal: React.FC<Props> = ({ open, onCancel, JWT, isLoading }) => {
  const tokenValue = JWT || '';
  const [messageApi, contextHolder] = message.useMessage();

  const success = () => messageApi.open({ type: 'success', content: 'Скопировано' });

  const handleCopy = async () => {
    if (!tokenValue) {
      messageApi.open({ type: 'warning', content: 'Токен отсутствует' });
      return;
    }

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(tokenValue);
        success();
        return;
      }

      const ok = copy(tokenValue);
      if (ok) {
        success();
      } else {
        throw new Error('copy-to-clipboard failed');
      }
    } catch (err) {
      console.error('Copy failed', err);
      messageApi.open({ type: 'error', content: 'Не удалось скопировать токен' });
    }
  };

  return (
    <>
      {contextHolder}
      <AntdModal
        open={open}
        onCancel={onCancel}
        titleText="JWT сгенерирован"
        footer={
          <>
            <AntdCloseButton onClick={onCancel} text="Закрыть" />
            <AntdButton
              onClick={handleCopy}
              disabled={!tokenValue || isLoading}
              text="Копировать"
            />
          </>
        }
      >
        <AntdInput.TextArea value={tokenValue} disabled />
      </AntdModal>
    </>
  );
};
