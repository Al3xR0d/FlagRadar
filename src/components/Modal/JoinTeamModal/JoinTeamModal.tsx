import React, { useState } from 'react';
import notification from 'antd/es/notification';
import { useJoinTeam, useCurrentUser } from '@/hooks/useQueries';
import { AntdInput } from '@/shared/ui/Input';
import { AntdButton } from '@/shared/ui/Button';
import { AntdCloseButton } from '@/shared/ui/CloseButton';
import { AntdModal } from '@/shared/ui/Modal';

interface Props {
  visible: boolean;
  onClose: () => void;
}

export const JoinTeamModal: React.FC<Props> = ({ visible, onClose }) => {
  const [token, setToken] = useState('');
  const mutation = useJoinTeam();
  const currentUserQuery = useCurrentUser();

  const handleOk = () => {
    mutation.mutate(token, {
      onSuccess: async () => {
        await currentUserQuery.refetch();
        notification.success({ message: 'Вы присоединились к команде' });
        onClose();
      },
      onError: () => notification.error({ message: 'Ошибка присоединения к команде' }),
    });
  };

  return (
    <AntdModal
      titleText="Присоединиться к команде"
      open={visible}
      iconClassName="fas fa-sign-in-alt"
      onCancel={onClose}
      showTitleDivider={false}
      top={false}
      centered
      footer={
        <>
          <AntdCloseButton key="cancel" onClick={onClose} text="Отмена" />
          <AntdButton key="confirm" onClick={handleOk} text="Присоедениться" />
        </>
      }
    >
      <AntdInput
        value={token}
        onChange={(e) => setToken(e.target.value)}
        placeholder="Токен команды"
      />
    </AntdModal>
  );
};
