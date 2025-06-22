import React, { useState } from 'react';
import notification from 'antd/es/notification';
import Modal from 'antd/es/modal';
import { useCreateTeam } from '@/hooks/useQueries';
import { AntdClose } from '@/shared/ui/Close/AntdClose';
import { AntdInput } from '@/shared/ui/Input';
import { AntdButton } from '@/shared/ui/Button';
import { AntdCloseButton } from '@/shared/ui/CloseButton';

interface CreateTeamModalProps {
  visible: boolean;
  onClose: () => void;
}

export const CreateTeamModal: React.FC<CreateTeamModalProps> = ({ visible, onClose }) => {
  const [name, setName] = useState('');
  const mutation = useCreateTeam();

  const handleOk = () => {
    mutation.mutate(
      { name },
      {
        onSuccess: () => {
          notification.success({ message: 'Команда создана' });
          onClose();
        },
        onError: () => notification.error({ message: 'Ошибка создания команды' }),
      },
    );
  };

  return (
    <Modal
      title={
        <span style={{ color: '#e0e0ff' }}>
          <i className="fas fa-users" style={{ marginRight: 8 }} />
          Создать команду
        </span>
      }
      styles={{
        header: {
          background: '#1a1a24',
          color: '#e0e0ff',
        },
        body: {
          background: '#1a1a24',
          color: '#e0e0ff',
        },
        content: {
          background: '#1a1a24',
        },
        mask: { backdropFilter: 'blur(5px)' },
      }}
      open={visible}
      closeIcon={<AntdClose />}
      onCancel={onClose}
      maskClosable={false}
      footer={[
        <>
          <AntdCloseButton key="cancel" onClick={onClose} text="Отмена" />
          <AntdButton key="create" onClick={handleOk} text="Создать" />,
        </>,
      ]}
    >
      <AntdInput
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Название команды"
      />
    </Modal>
  );
};
