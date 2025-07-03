import React, { useEffect } from 'react';
import { AntdCloseButton } from '@/shared/ui/CloseButton';
import { AntdButton } from '@/shared/ui/Button';
import Form from 'antd/es/form';
import { AntdInput } from '@/shared/ui/Input';
import { useForm } from 'antd/es/form/Form';
import { useQueryClient } from 'react-query';
import { useEditTeam } from '@/hooks/useQueries';
import { useUserStore } from '@/store/userStore';
import { AntdModal } from '@/shared/ui/Modal';
import { CustomSpin } from '@/shared/ui/Spin';
import { FormLabel } from '@/shared/ui/FormLabel';

interface Props {
  open: boolean;
  onClose: () => void;
  name?: string;
}

export const EditTeamModal: React.FC<Props> = ({ open, onClose, name }) => {
  const [form] = useForm<any>();
  const { mutate, isLoading } = useEditTeam();
  const queryClient = useQueryClient();
  const teamId = useUserStore((state) => state.teamId);

  useEffect(() => {
    if (open) {
      form.setFieldsValue({
        name: name || '',
      });
    }
  }, [name, form, open]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (!teamId) {
        console.warn('teamId отсутствует');
        return;
      }
      mutate(
        { teamId, data: values },
        {
          onSuccess: () => {
            queryClient.invalidateQueries(['team']);
            queryClient.invalidateQueries(['teamParticipants']);
            onClose();
          },
        },
      );
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  if (isLoading) {
    return <CustomSpin />;
  }

  return (
    <AntdModal
      titleText="Редактировать"
      open={open}
      onCancel={onClose}
      showTitleDivider={false}
      top={false}
      centered={true}
      footer={
        <>
          <AntdCloseButton key="cancel" onClick={onClose} text="Отмена" />
          <AntdButton key="create" onClick={handleSubmit} text="Сохранить" />,
        </>
      }
    >
      <Form form={form}>
        <Form.Item name="name" label={<FormLabel>Название</FormLabel>}>
          <AntdInput />
        </Form.Item>
      </Form>
    </AntdModal>
  );
};
