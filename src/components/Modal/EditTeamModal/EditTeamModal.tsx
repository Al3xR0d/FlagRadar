import Modal from 'antd/es/modal';
import { AntdCloseButton } from '@/shared/ui/CloseButton';
import { AntdButton } from '@/shared/ui/Button';
import { AntdClose } from '@/shared/ui/Close';
import Form from 'antd/es/form';
import { AntdInput } from '@/shared/ui/Input';

interface EditTeamModalProps {
  visible: boolean;
  onClose: () => void;
  name?: string;
}

export const EditTeamModal: React.FC<EditTeamModalProps> = ({ visible, onClose, name }) => {
  return (
    <Modal
      title={<span style={{ color: '#e0e0ff' }}>Редактировать</span>}
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
        <Form.Item name="username" label={<span style={{ color: '#e0e0ff' }}>Название</span>}>
          <AntdInput defaultValue={name} />
        </Form.Item>
      </Form>
    </Modal>
  );
};
