import React, { useState } from 'react';
import { AntdInput } from '@/shared/ui/Input';
import { AntdModal } from '@/shared/ui/Modal';
import { AntdCloseButton } from '@/shared/ui/CloseButton';
import { AntdButton } from '@/shared/ui/Button';
import { useJoinCTF, useCurrentUser } from '@/hooks/useQueries';
import notification from 'antd/es/notification';

interface ApiResponse {
  result: 'Ok' | 'Err';
  msg: string;
  data: unknown | null;
}

interface Props {
  open: boolean;
  onClose: () => void;
  eventId?: string;
}

export const JoinCTFModal: React.FC<Props> = ({ open, onClose, eventId }) => {
  const [token, setToken] = useState<string>('');
  const mutation = useJoinCTF();
  const currentUserQuery = useCurrentUser();

  const handleOk = () => {
    if (!eventId) return;

    mutation.mutate(
      { eventId, token },
      {
        onSuccess: async (response: ApiResponse) => {
          if (response.result === 'Ok') {
            await currentUserQuery.refetch();
            notification.success({ message: 'Вы присоединились к CTF' });
            onClose();
            setToken('');
          } else {
            notification.error({ message: response.msg || 'Ошибка присоединения к CTF' });
          }
        },
        onError: () => {
          notification.error({ message: 'Сетевая ошибка при присоединении к CTF' });
        },
      },
    );
  };

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
          <AntdButton
            key="confirm"
            onClick={handleOk}
            text="Присоединиться"
            disabled={!token || !eventId}
          />
        </>
      }
    >
      <AntdInput
        value={token}
        onChange={(e) => {
          setToken(e.target.value);
        }}
        placeholder="Токен CTF"
      />
    </AntdModal>
  );
};
