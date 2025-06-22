import React, { useState } from 'react';
import notification from 'antd/es/notification';
import Modal from 'antd/es/modal';
import { useJoinTeam } from '@/hooks/useQueries';
import { AntdClose } from '@/shared/ui/Close/AntdClose';
import { AntdInput } from '@/shared/ui/Input';
import { AntdButton } from '@/shared/ui/Button';
import { AntdCloseButton } from '@/shared/ui/CloseButton';

interface Props {
  visible: boolean;
  onClose: () => void;
}

export const JoinTeamModal: React.FC<Props> = ({ visible, onClose }) => {
  const [token, setToken] = useState('');
  const mutation = useJoinTeam();

  const handleOk = () => {
    mutation.mutate(token, {
      onSuccess: () => {
        notification.success({ message: 'Присоединились к команде' });
        onClose();
      },
      onError: () => notification.error({ message: 'Ошибка присоединения к команде' }),
    });
  };

  return (
    <Modal
      title={
        <span style={{ color: '#e0e0ff' }}>
          <i className="fas fa-sign-in-alt" style={{ marginRight: 8 }}></i>
          Присоединиться к команде
        </span>
      }
      styles={{
        header: {
          background: '#151522',
          color: '#e0e0ff',
        },
        body: { background: '#151522', color: '#e0e0ff' },
        content: { background: '#151522' },
        mask: { backdropFilter: 'blur(5px)' },
      }}
      open={visible}
      onCancel={onClose}
      closeIcon={<AntdClose />}
      maskClosable={false}
      footer={[
        <>
          <AntdCloseButton key="cancel" onClick={onClose} text="Отмена" />
          <AntdButton key="create" onClick={handleOk} text="Создать" />,
        </>,
      ]}
    >
      <AntdInput
        value={token}
        onChange={(e) => setToken(e.target.value)}
        placeholder="Токен команды"
      />
    </Modal>
  );
};
