import React, { useEffect } from 'react';
import { AntdCloseButton } from '@/shared/ui/CloseButton';
import { AntdButton } from '@/shared/ui/Button';
import Form from 'antd/es/form';
import { AntdInput } from '@/shared/ui/Input';
import { useEditUser } from '@/hooks/useQueries';
import { useForm } from 'antd/es/form/Form';
import { useQueryClient } from 'react-query';
import { AntdModal } from '@/shared/ui/Modal';
import { CustomSpin } from '@/shared/ui/Spin';
import { FormLabel } from '@/shared/ui/FormLabel';

interface Props {
  visible: boolean;
  onClose: () => void;
  nickname?: string;
  email?: string;
  description?: string;
}

export const EditUserModal: React.FC<Props> = ({
  visible,
  onClose,
  nickname,
  email,
  description,
}) => {
  const [form] = useForm<any>();
  const { mutate, isLoading } = useEditUser();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (visible) {
      form.setFieldsValue({
        nickname: nickname || '',
        email: email || '',
        description: description || '',
      });
    }
  }, [visible, nickname, email, description, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      mutate(values, {
        onSuccess: () => {
          queryClient.invalidateQueries(['currentUser']);
          onClose();
        },
      });
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  if (isLoading) {
    return <CustomSpin />;
  }

  return (
    <AntdModal
      titleText="Редактировать данные"
      open={visible}
      onCancel={onClose}
      destroyOnHidden={true}
      showTitleDivider={false}
      footer={
        <>
          <AntdCloseButton key="cancel" onClick={onClose} text="Отмена" />
          <AntdButton key="create" onClick={handleSubmit} text="Сохранить" />
        </>
      }
    >
      <Form form={form}>
        <Form.Item name="nickname" label={<FormLabel>Никнейм</FormLabel>}>
          <AntdInput />
        </Form.Item>
        <Form.Item
          name="email"
          label={<FormLabel>Личный email</FormLabel>}
          rules={[{ type: 'email' }]}
        >
          <AntdInput />
        </Form.Item>
        <Form.Item name="description" label={<FormLabel>О себе</FormLabel>}>
          <AntdInput.TextArea />
        </Form.Item>
      </Form>
    </AntdModal>
  );
};
