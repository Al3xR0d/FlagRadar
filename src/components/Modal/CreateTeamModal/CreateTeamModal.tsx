import React, { useState } from 'react';
import notification from 'antd/es/notification';
import { useCreateTeam, useCurrentUser } from '@/hooks/useQueries';
import { AntdInput } from '@/shared/ui/Input';
import { AntdButton } from '@/shared/ui/Button';
import { AntdCloseButton } from '@/shared/ui/CloseButton';
import { AntdModal } from '@/shared/ui/Modal';

interface Props {
  visible: boolean;
  onClose: () => void;
}

export const CreateTeamModal: React.FC<Props> = ({ visible, onClose }) => {
  const [name, setName] = useState('');
  const mutation = useCreateTeam();
  const currentUserQuery = useCurrentUser();

  const handleOk = () => {
    mutation.mutate(
      { name },
      {
        onSuccess: async () => {
          await currentUserQuery.refetch();
          notification.success({ message: 'Команда создана' });
          onClose();
        },
        onError: () => notification.error({ message: 'Ошибка создания команды' }),
      },
    );
  };

  return (
    <AntdModal
      open={visible}
      titleText="Создать команду"
      iconClassName="fas fa-users"
      onCancel={onClose}
      showTitleDivider={false}
      top={false}
      centered
      footer={
        <>
          <AntdCloseButton key="cancel" onClick={onClose} text="Отмена" />
          <AntdButton key="confirm" onClick={handleOk} text="Создать" />
        </>
      }
    >
      <AntdInput
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Название команды"
      />
    </AntdModal>
  );
};
