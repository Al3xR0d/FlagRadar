import { AntdCancelButton } from '@/shared/ui/CancelButton';
import { AntdCloseButton } from '@/shared/ui/CloseButton';
import { AntdModal } from '@/shared/ui/Modal';

interface Props {
  open: boolean;
  onClose: () => void;
  onClick: () => void;
}

export const DeleteCTFModal: React.FC<Props> = ({ open, onClose, onClick }) => {
  return (
    <AntdModal
      titleText="Удалить команду"
      iconClassName="fas fa-trash-alt"
      open={open}
      onCancel={onClose}
      showTitleDivider={false}
      top={false}
      centered={true}
      footer={
        <>
          <AntdCloseButton key="cancel" onClick={onClose} text="Отмена" />
          <AntdCancelButton key="confirm" onClick={onClick} text="Удалить" />
        </>
      }
    />
  );
};
