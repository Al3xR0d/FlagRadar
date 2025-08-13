import React from 'react';
import { useForm } from 'antd/es/form/Form';
import Form, { Rule } from 'antd/es/form';
import { AntdInput } from '@/shared/ui/Input';
import { AntdButton } from '@/shared/ui/Button';
import { AntdCloseButton } from '@/shared/ui/CloseButton';
import { AntdModal } from '@/shared/ui/Modal';
import { useAddTeam } from '@/hooks/useQueries'; // <- используем useAddTeam
import { useQueryClient } from 'react-query';
import { FormLabel } from '@/shared/ui/FormLabel';

interface Props {
  open: boolean;
  onCancel: () => void;
  eventId: string;
  onSuccess?: () => void;
}

interface FormValues {
  name: string;
  member_limit: number | undefined;
}

export const AddTeamModal: React.FC<Props> = ({ open, onCancel, eventId, onSuccess }) => {
  const [form] = useForm<FormValues>();
  const queryClient = useQueryClient();

  const { mutate, isLoading } = useAddTeam();

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      const payload = {
        name: String(values.name).trim(),
        member_counts: Number(values.member_limit),
        event_uuid: eventId || '',
      };

      mutate(payload, {
        onSuccess: () => {
          queryClient.invalidateQueries(['ctfs']);
          if (eventId) {
            queryClient.invalidateQueries(['ctf', eventId]);
          }

          form.resetFields();
          onCancel();
          if (onSuccess) onSuccess();
        },
      });
    } catch (errorInfo: any) {
      const firstErrorField = errorInfo?.errorFields?.[0]?.name?.[0];
      if (firstErrorField) {
        form.scrollToField(firstErrorField);
      }
    }
  };

  return (
    <AntdModal
      titleText="Добавить команду"
      iconClassName="fas fa-users"
      open={open}
      onCancel={onCancel}
      confirmLoading={isLoading}
      afterClose={() => form.resetFields()}
      top={false}
      centered
      footer={
        <>
          <AntdCloseButton key="cancel" onClick={onCancel} text="Отмена" />
          <AntdButton key="create" onClick={handleSubmit} text="Создать" />
        </>
      }
    >
      <Form form={form} layout="vertical" preserve={false}>
        <Form.Item
          name="name"
          label={<FormLabel>Название команды</FormLabel>}
          required={false}
          rules={[{ required: true, message: 'Введите название команды' }]}
        >
          <AntdInput aria-required="true" />
        </Form.Item>

        <Form.Item
          name="member_limit"
          label={<FormLabel>Количество участников в команде</FormLabel>}
          required={false}
          rules={[
            { required: true, message: 'Укажите количество участников' },
            {
              validator: (_, value) => {
                if (value == null || value === '')
                  return Promise.reject(new Error('Введите число'));
                const n = Number(value);
                if (!Number.isFinite(n) || n < 1)
                  return Promise.reject(new Error('Должно быть число >= 1'));
                return Promise.resolve();
              },
            } as Rule,
          ]}
        >
          <AntdInput type="number" min={1} aria-required="true" />
        </Form.Item>
      </Form>
    </AntdModal>
  );
};

export default AddTeamModal;
