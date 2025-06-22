import Modal from 'antd/es/modal/Modal';
import { AntdClose } from '@/shared/ui/Close';
import { AntdCloseButton } from '@/shared/ui/CloseButton';
import { AntdButton } from '@/shared/ui/Button';
import Form from 'antd/es/form';
import { AntdInput } from '@/shared/ui/Input';

interface EditUserModalProps {
  visible: boolean;
  onClose: () => void;
  nickname?: string;
  email?: string;
  description?: string;
}

export const EditUserModal: React.FC<EditUserModalProps> = ({
  visible,
  onClose,
  nickname,
  email,
  description,
}) => {
  return (
    <Modal
      title={<span style={{ color: '#e0e0ff' }}>Редактировать данные</span>}
      open={visible}
      onCancel={onClose}
      closeIcon={<AntdClose />}
      destroyOnHidden
      maskClosable={false}
      styles={{
        header: {
          background: '#151522',
          color: '#e0e0ff',
        },
        body: {
          background: '#151522',
          color: '#e0e0ff',
        },
        content: {
          background: '#151522',
        },
        mask: { backdropFilter: 'blur(5px)' },
      }}
      footer={[
        <>
          <AntdCloseButton key="cancel" onClick={onClose} text="Отмена" />
          <AntdButton key="create" onClick={onClose} text="Сохранить" />,
        </>,
      ]}
    >
      <Form>
        <Form.Item name="username" label={<span style={{ color: '#e0e0ff' }}>Никнейм</span>}>
          <AntdInput defaultValue={nickname} />
        </Form.Item>
        <Form.Item
          name="email"
          label={<span style={{ color: '#e0e0ff' }}>Личный email</span>}
          rules={[{ type: 'email' }]}
        >
          <AntdInput defaultValue={email} />
        </Form.Item>
        <Form.Item name="bio" label={<span style={{ color: '#e0e0ff' }}>О себе</span>}>
          <AntdInput.TextArea defaultValue={description} />
        </Form.Item>
      </Form>
    </Modal>
  );
};
