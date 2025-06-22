import { useEditCTF } from '@/hooks/useQueries';
import { Events } from '@/types/domain/Events';
import { ModalBaseProps } from '@/types';
import Form from 'antd/es/form';
import Modal from 'antd/es/modal';
import { useForm } from 'antd/es/form/Form';
import { FC } from 'react';
import { AntdClose } from '@/shared/ui/Close/AntdClose';

interface Props extends ModalBaseProps {
  record: Omit<Events, 'token' | 'joined'>;
}

export const EditCTFModal: FC<Props> = ({ open, onClose, record }) => {
  const [form] = useForm<Events>();
  const { mutate, isLoading } = useEditCTF();

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      mutate({ id: record.uuid, data: values });
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  return (
    <Modal
      title="Редактировать событие"
      open={open}
      onOk={handleSubmit}
      onCancel={onClose}
      confirmLoading={isLoading}
      afterClose={() => form.resetFields()}
      closeIcon={<AntdClose />}
      destroyOnHidden
    >
      <Form form={form} layout="vertical" initialValues={record} preserve={false}>
        {/* Повторяем те же поля, что и в CreateEventModal */}
      </Form>
    </Modal>
  );
};
