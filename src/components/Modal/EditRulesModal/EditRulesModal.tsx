import Modal from 'antd/es/modal/Modal';
import { AntdClose } from '@/shared/ui/Close';
import { AntdCloseButton } from '@/shared/ui/CloseButton';
import { AntdButton } from '@/shared/ui/Button';
import Form from 'antd/es/form';
import { AntdInput } from '@/shared/ui/Input';
import Checkbox from 'antd/es/checkbox/Checkbox';
import { POLICY_TEXT } from '@/text/policyText';

interface EditRulesModalProps {
  open: boolean;
  onClose: () => void;
}

export const EditRulesModal: React.FC<EditRulesModalProps> = ({ open, onClose }) => {
  return (
    <>
      <Modal
        title={
          <span style={{ color: '#e0e0ff' }}>
            <i className="fas fa-flag" style={{ marginRight: 8 }} />
            Правила платформы FlagRadar
          </span>
        }
        open={open}
        onCancel={onClose}
        closeIcon={<AntdClose />}
        destroyOnHidden
        maskClosable={false}
        style={{
          top: 20,
        }}
        width={800}
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
        <Form.Item>
          <AntdInput.TextArea defaultValue={POLICY_TEXT} style={{ minHeight: '500px' }} />
        </Form.Item>
        <Checkbox>
          <span style={{ color: '#e0e0ff' }}>Требуется заново принять правила</span>
        </Checkbox>
      </Modal>
    </>
  );
};
