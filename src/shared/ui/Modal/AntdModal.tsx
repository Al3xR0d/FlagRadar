import { FC, ReactNode } from 'react';
import styled from 'styled-components';
import Modal from 'antd/es/modal';
import { AntdClose } from '@/shared/ui/Close';

interface Props {
  open: boolean;
  titleText?: string;
  titleContent?: ReactNode;
  iconClassName?: string | null;
  showTitleDivider?: boolean;
  children?: ReactNode;
  onCancel: () => void;
  handleSubmit?: () => void;
  confirmLoading?: boolean;
  maskClosable?: boolean;
  afterClose?: () => void;
  destroyOnHidden?: boolean;
  footer?: ReactNode;
  top?: number | false;
  centered?: boolean;
  width?: number;
  closable?: boolean;
}

export const AntdModal: FC<Props> = ({
  open,
  titleText,
  iconClassName,
  children,
  onCancel,
  handleSubmit,
  confirmLoading = false,
  maskClosable = false,
  afterClose,
  destroyOnHidden = false,
  footer,
  showTitleDivider = true,
  top,
  centered,
  width,
  titleContent,
  closable = true,
}) => {
  return (
    <StyledModal
      title={
        titleContent ?? (
          <>
            <span style={{ color: '#e0e0ff' }}>
              {iconClassName && (
                <i className={iconClassName} aria-hidden="true" style={{ marginRight: 8 }} />
              )}
              {titleText}
            </span>
            {showTitleDivider && (
              <div style={{ borderBottom: '1px solid #25253a', margin: '16px -24px 0' }} />
            )}
          </>
        )
      }
      style={top !== false ? { top } : undefined}
      centered={top === false ? centered : undefined}
      width={width}
      styles={{
        header: { background: '#1a1a24', color: '#e0e0ff' },
        body: { background: '#1a1a24', color: '#e0e0ff' },
        content: { background: '#1a1a24' },
        mask: { backdropFilter: 'blur(5px)' },
      }}
      closeIcon={closable ? <AntdClose /> : null}
      open={open}
      onCancel={onCancel}
      confirmLoading={confirmLoading}
      maskClosable={maskClosable}
      afterClose={afterClose}
      destroyOnHidden={destroyOnHidden}
      footer={footer ?? null}
    >
      {children}
    </StyledModal>
  );
};

const StyledModal = styled(Modal)`
  .ant-modal-content {
    border-radius: 12px;
    overflow: hidden;
  }

  .ant-modal-header {
    border-bottom: none;
  }
`;
