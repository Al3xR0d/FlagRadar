import React from 'react';
import { AntdModal } from '@/shared/ui/Modal';
import { AntdCloseButton } from '@/shared/ui/CloseButton';
import { AntdCancelButton } from '@/shared/ui/CancelButton';
import { useDeleteResults } from '@/hooks/useQueries';

interface Props {
  open: boolean;
  onClose: () => void;
  eventId?: string;
}

export const DeleteResultsModal: React.FC<Props> = ({ open, onClose, eventId }) => {
  const { mutate: deleteResults, isLoading } = useDeleteResults();

  const handleDelete = () => {
    if (eventId) {
      deleteResults(eventId, {
        onSuccess: () => {
          onClose();
        },
      });
    }
  };

  return (
    <AntdModal
      open={open}
      onCancel={onClose}
      titleText="Удалить результаты CTF"
      top={false}
      centered={true}
      showTitleDivider={false}
      footer={
        <>
          <AntdCloseButton key="cancel" onClick={onClose} text="Отмена" />
          <AntdCancelButton
            key="confirm"
            onClick={handleDelete}
            text="Удалить"
            disabled={isLoading}
            loading={isLoading}
          />
        </>
      }
    >
      {' '}
    </AntdModal>
  );
};
