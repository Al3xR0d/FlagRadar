import React from 'react';
import { AntdModal } from '@/shared/ui/Modal';
import { AntdCloseButton } from '@/shared/ui/CloseButton';
import { AntdCancelButton } from '@/shared/ui/CancelButton';
import { useDeleteTeam } from '@/hooks/useQueries';
import { useUserStore } from '@/store/userStore';

interface Props {
  open: boolean;
  onCancel: () => void;
}

export const DeleteTeamModal: React.FC<Props> = ({ open, onCancel }) => {
  const deleteMut = useDeleteTeam();
  const toDeleteId = useUserStore((store) => store.teamId);

  const handleConfirm = () => {
    if (toDeleteId) {
      deleteMut.mutate(toDeleteId, {
        onSuccess: () => {
          onCancel();
        },
      });
    }
  };

  return (
    <>
      <AntdModal
        open={open}
        onCancel={onCancel}
        titleText="Команда будет перемещена в архив"
        top={false}
        centered={true}
        showTitleDivider={false}
        footer={
          <>
            <AntdCloseButton key="cancel" onClick={onCancel} text="Отмена" />
            <AntdCancelButton key="confirm" onClick={handleConfirm} text="Расформировать команду" />
          </>
        }
      />
    </>
  );
};
