import React, { useState, useMemo, useCallback } from 'react';
import { AntdModal } from '@/shared/ui/Modal';
import { useUserStore } from '@/store/userStore';
import { AntdInput } from '@/shared/ui/Input';
import { AntdCloseButton } from '@/shared/ui/CloseButton';
import { AntdCancelButton } from '@/shared/ui/CancelButton';
import { useQueryClient } from 'react-query';
import { CustomSpin } from '@/shared/ui/Spin';
import { useDemoteMember } from '@/hooks/useQueries';

interface Props {
  open: boolean;
  onCancel: () => void;
  members: string[];
}

export const DemoteMemberModal: React.FC<Props> = ({ open, onCancel, members }) => {
  const currentUserNickname = useUserStore((store) => store.currentUser?.nickname);
  const currentTeamId = useUserStore((store) => store.teamId);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedNickname, setSelectedNickname] = useState<string | null>(null);

  const availableMembers = useMemo(() => {
    return members
      .filter(Boolean)
      .map((nickname) => nickname.trim())
      .filter((nickname) => nickname.length > 0 && nickname !== currentUserNickname);
  }, [members, currentUserNickname]);

  const optionsList = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const filtered = query
      ? availableMembers.filter((nickname) => nickname.toLowerCase().includes(query))
      : availableMembers;

    return filtered.map((nickname) => ({ value: nickname }));
  }, [availableMembers, searchQuery]);

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
    setSelectedNickname(null);
  }, []);

  const handleOptionSelect = useCallback((value: string) => {
    setSearchQuery(value);
    setSelectedNickname(value);
  }, []);

  const handleClear = useCallback(() => {
    setSearchQuery('');
    setSelectedNickname(null);
  }, []);

  const queryClient = useQueryClient();
  const { mutate, isLoading } = useDemoteMember();

  const handleConfirm = useCallback(() => {
    if (!currentTeamId || !selectedNickname) {
      return;
    }

    const payload = {
      nickname: selectedNickname,
    };

    mutate(
      { teamId: currentTeamId, data: payload },
      {
        onSuccess: () => {
          queryClient.invalidateQueries(['team']);
          queryClient.invalidateQueries(['teamParticipants']);
          onCancel();
        },
      },
    );
  }, [selectedNickname, onCancel, currentTeamId]);

  if (isLoading) {
    return <CustomSpin />;
  }

  return (
    <>
      <AntdModal
        open={open}
        onCancel={onCancel}
        titleText="Передача прав капитана"
        top={false}
        centered={true}
        footer={
          <>
            <AntdCloseButton key="cancel" onClick={onCancel} text="Отмена" />
            <AntdCancelButton
              key="confirm"
              onClick={handleConfirm}
              text="Разжаловать"
              disabled={!selectedNickname}
            />
          </>
        }
      >
        <AntdInput.AutoComplete
          placeholder="Выберите, кого разжаловать"
          allowClear
          options={optionsList}
          value={searchQuery}
          onChange={handleSearchChange}
          onSearch={handleSearchChange}
          onSelect={handleOptionSelect}
          onClear={handleClear}
        />
      </AntdModal>
    </>
  );
};
