import React from 'react';
import { AntdModal } from '@/shared/ui/Modal';
import { AntdCancelButton } from '@/shared/ui/CancelButton';
import { AntdCloseButton } from '@/shared/ui/CloseButton';
import notification from 'antd/es/notification';
import { useLeaveCTF, useCurrentUser } from '@/hooks/useQueries';

interface Props {
  open: boolean;
  onClose: () => void;
  eventId?: string;
}

export const LeaveCTFModal: React.FC<Props> = ({ open, onClose, eventId }) => {
  const mutation = useLeaveCTF();
  const currentUserQuery = useCurrentUser();

  const handleDelete = () => {
    if (!eventId) return;

    mutation.mutate(eventId, {
      onSuccess: async () => {
        await currentUserQuery.refetch();
        notification.success({ message: 'Вы покинули CTF' });
        onClose();
      },
      onError: () => {
        notification.error({ message: 'Ошибка' });
      },
    });
  };

  return (
    <AntdModal
      titleText="Покинуть CTF"
      open={open}
      onCancel={onClose}
      top={false}
      centered={true}
      showTitleDivider={false}
      footer={
        <>
          <AntdCloseButton key="cancel" onClick={onClose} text="Отмена" />
          <AntdCancelButton key="confirm" onClick={handleDelete} text="Покинуть CTF" />
        </>
      }
    ></AntdModal>
  );
};
