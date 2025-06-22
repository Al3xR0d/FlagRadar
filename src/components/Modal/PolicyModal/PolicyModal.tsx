import { FC } from 'react';
import Modal from 'antd/es/modal/Modal';
import { AntdClose } from '@/shared/ui/Close';
import { AntdCloseButton } from '@/shared/ui/CloseButton';
import { AntdButton } from '@/shared/ui/Button';
import { POLICY_TEXT } from '@/text/policyText';

interface PolicyModalProps {
  open: boolean;
  onClose: () => void;
}

export const PolicyModal: FC<PolicyModalProps> = ({ open, onClose }) => {
  return (
    <>
      <Modal
        open={open}
        title={<span style={{ color: '#e0e0ff' }}>Политика, правила и тд...</span>}
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
            <AntdButton key="create" onClick={onClose} text="Принять" />,
          </>,
        ]}
      >
        <div style={{ whiteSpace: 'pre-line' }}>{POLICY_TEXT}</div>
      </Modal>
    </>
  );
};
