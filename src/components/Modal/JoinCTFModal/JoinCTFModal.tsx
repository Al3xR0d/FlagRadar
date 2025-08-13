import React, { useState } from 'react';
import { AntdInput } from '@/shared/ui/Input';
import { AntdModal } from '@/shared/ui/Modal';
import { AntdCloseButton } from '@/shared/ui/CloseButton';
import { AntdButton } from '@/shared/ui/Button';
import { useJoinCTF, useCurrentUser } from '@/hooks/useQueries';
import notification from 'antd/es/notification';
import Flex from 'antd/es/flex';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import Typography from 'antd/es/typography';

export interface ApiResponse {
  result: 'Ok' | 'Err';
  msg: string;
  data: unknown | null;
}

interface Props {
  open: boolean;
  onClose: () => void;
  eventId?: string;
  privateCtf?: boolean;
}

export const JoinCTFModal: React.FC<Props> = ({ open, onClose, eventId, privateCtf }) => {
  const [token, setToken] = useState<string>('');
  const mutation = useJoinCTF();
  const currentUserQuery = useCurrentUser();

  const handleOk = () => {
    if (!eventId) return;

    mutation.mutate(
      { eventId, token: !privateCtf ? '' : token },
      {
        onSuccess: async (response: ApiResponse) => {
          if (response.result === 'Ok') {
            await currentUserQuery.refetch();
            notification.success({ message: 'Вы присоединились к CTF' });
            onClose();
            setToken('');
          } else {
            notification.error({ message: response.msg || 'Ошибка присоединения к CTF' });
          }
        },
        onError: () => {
          notification.error({ message: 'Сетевая ошибка при присоединении к CTF' });
        },
      },
    );
  };

  return (
    <AntdModal
      titleText={!privateCtf ? 'Подтверждение участия' : 'Введите токен'}
      open={open}
      onCancel={onClose}
      top={false}
      centered={true}
      showTitleDivider={false}
      footer={
        <>
          <AntdCloseButton key="cancel" onClick={onClose} text="Отмена" />
          <AntdButton
            key="confirm"
            onClick={handleOk}
            text="Присоединиться"
            disabled={(privateCtf && !token) || !eventId}
          />
        </>
      }
    >
      <Flex vertical gap="small">
        {privateCtf && (
          <AntdInput
            value={token}
            onChange={(e) => {
              setToken(e.target.value);
            }}
            placeholder="Токен CTF"
          />
        )}
        <Typography.Text type="danger">
          <ExclamationCircleOutlined />
          После вступления <strong>изменение команды</strong> будет недоступно
        </Typography.Text>
      </Flex>
    </AntdModal>
  );
};
