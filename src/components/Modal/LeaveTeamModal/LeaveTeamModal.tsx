import { FC } from 'react';
import { AntdModal } from '@/shared/ui/Modal';
import { AntdCloseButton } from '@/shared/ui/CloseButton';
import { AntdCancelButton } from '@/shared/ui/CancelButton';
import { useLeaveTeam } from '@/hooks/useQueries';
import notification from 'antd/es/notification';
import { useUserStore } from '@/store/userStore';
import { useQueryClient } from 'react-query';

interface Props {
  open: boolean;
  onClose: () => void;
}

export const LeaveTeamModal: FC<Props> = ({ open, onClose }) => {
  const mutation = useLeaveTeam();
  const teamId = useUserStore((state) => state.teamId);
  const setTeamId = useUserStore((state) => state.setTeamId);
  const queryClient = useQueryClient();

  const handleDelete = () => {
    if (teamId) {
      mutation.mutate(teamId, {
        onSuccess: () => {
          setTeamId;
          notification.success({ message: 'Вы успешно покинули команду' });
          queryClient.invalidateQueries(['team']);
          onClose();
        },
        onError: () => notification.error({ message: 'Ошибка' }),
      });
    }
  };

  return (
    <AntdModal
      titleText="Покинуть команду"
      iconClassName="fas fa-door-open"
      open={open}
      onCancel={onClose}
      showTitleDivider={false}
      top={false}
      centered={true}
      footer={
        <>
          <AntdCloseButton key="cancel" onClick={onClose} text="Отмена" />
          <AntdCancelButton key="confirm" onClick={handleDelete} text="Покинуть" />
        </>
      }
    />
  );
};
