import { useCreateCTF } from '@/hooks/useQueries';
import { ModalBaseProps } from '@/types';
import { useForm } from 'antd/es/form/Form';
import Form, { Rule } from 'antd/es/form';
import { AntdInput } from '@/shared/ui/Input';
import { AntdSelect } from '@/shared/ui/Select';
import { AntdButton } from '@/shared/ui/Button';
import { AntdCloseButton } from '@/shared/ui/CloseButton';
import { ComponentType } from 'react';
import Checkbox from 'antd/es/checkbox';
import { useState } from 'react';
import { useQueryClient } from 'react-query';
import { AntdModal } from '@/shared/ui/Modal';
import notification from 'antd/es/notification';

interface Props extends ModalBaseProps {}

const ctfOptions = [
  {
    value: 'ad',
    label: 'Attack-Defense',
  },
  {
    value: 'jeopardy',
    label: 'Jeopardy (Task based)',
  },
];

const participationOptions = [
  {
    value: 'individual',
    label: 'Индивидуальный',
  },
  {
    value: 'team',
    label: 'Командный',
  },
];

const FIELDS: string[] = [
  'name',
  'description',
  'date',
  'date_end',
  'event_format',
  'part_format',
  'place',
  'ref_rules',
  'team_limit',
  'member_limit',
  'reg_start',
  'reg_end',
  'is_private',
];

const FIELDS_META: Record<
  string,
  {
    label: string;
    requiredMessage: string;
    rules?: Rule[];
    Component: ComponentType<any>;
    props?: Record<string, any>;
    formItemProps?: Record<string, any>;
    customRender?: (form: any) => React.ReactNode;
  }
> = {
  name: {
    label: 'Название',
    requiredMessage: 'Введите название',
    Component: AntdInput,
  },
  description: {
    label: 'Описание',
    requiredMessage: 'Введите описание',
    Component: AntdInput,
  },
  date: {
    label: 'Дата начала',
    requiredMessage: 'Укажите дату и время начала',
    rules: [
      {
        required: true,
        message: 'Укажите дату и время начала',
      },
      ({ getFieldValue }) => ({
        validator(_, value) {
          const regEnd = getFieldValue('reg_end');
          if (value <= regEnd) {
            return Promise.reject(
              'Дата начала соревнования должна быть позже даты окончания регистрации',
            );
          }
          return Promise.resolve();
        },
      }),
    ],
    Component: AntdInput,
    props: {
      type: 'datetime-local',
    },
  },
  date_end: {
    label: 'Дата окончания',
    requiredMessage: 'Укажите дату и время окончания',
    rules: [
      { required: true, message: 'Укажите дату и время окончания' },
      ({ getFieldValue }) => ({
        validator(_, value) {
          if (!value || getFieldValue('date') < value) {
            return Promise.resolve();
          }
          return Promise.reject(new Error('Дата окончания должна быть позже даты начала'));
        },
      }),
    ],
    Component: AntdInput,
    props: {
      type: 'datetime-local',
    },
  },
  event_format: {
    label: 'Формат CTF',
    requiredMessage: 'Выберите формат CTF',
    rules: [{ required: true, message: 'Выберите формат CTF' }],
    Component: AntdSelect,
    props: {
      options: ctfOptions,
    },
  },
  part_format: {
    label: 'Формат участия',
    requiredMessage: 'Выберите формат участия',
    rules: [{ required: true, message: 'Выберите формат участия' }],
    Component: AntdSelect,
    props: {
      options: participationOptions,
    },
  },
  place: {
    label: 'Место проведения',
    requiredMessage: 'Введите место проведения',
    rules: [{ required: true, message: 'Введите место проведения' }],
    Component: AntdInput,
  },
  ref_rules: {
    label: 'Правила CTF',
    requiredMessage: 'Введите ссылку на правила',
    rules: [
      { required: true, message: 'Введите ссылку на правила' },
      {
        validator: (_, value) => {
          if (!value) return Promise.resolve();
          const trimmedValue = value.trim();

          const urlWithProtocol =
            trimmedValue.startsWith('http://') || trimmedValue.startsWith('https://')
              ? trimmedValue
              : `https://${trimmedValue}`;

          try {
            new URL(urlWithProtocol);

            if (!urlWithProtocol.includes('.')) {
              return Promise.reject('Введите корректный домен (например: ctf-rules.ru)');
            }

            return Promise.resolve();
          } catch (e) {
            return Promise.reject('Введите корректную ссылку (например: https://ctf-rules.ru)');
          }
        },
      },
    ],
    Component: AntdInput,
  },
  team_limit: {
    label: 'Количество команд',
    requiredMessage: 'Введите количество команд',
    rules: [{ required: true, message: 'Введите количество команд' }],
    Component: AntdInput,
    props: {
      type: 'number',
      min: 2,
    },
  },
  member_limit: {
    label: 'Количество участников в команде',
    requiredMessage: 'Введите количество участников в команде',
    rules: [{ required: true, message: 'Введите количество участников в команде' }],
    Component: AntdInput,
    props: {
      type: 'number',
      min: 1,
    },
  },
  reg_start: {
    label: 'Дата начала регистрации',
    requiredMessage: 'Укажите дату и время начала регистрации',
    rules: [
      {
        required: true,
        message: 'Укажите дату и время начала регистрации',
      },
    ],
    Component: AntdInput,
    props: {
      type: 'datetime-local',
    },
  },
  reg_end: {
    label: 'Дата окончания регистрации',
    requiredMessage: 'Укажите дату окончания регистрации',
    rules: [
      { required: true, message: 'Укажите дату окончания регистрации' },
      ({ getFieldValue }) => ({
        validator(_, value) {
          const start = getFieldValue('date');
          const regStart = getFieldValue('reg_start');

          if (value <= regStart) {
            return Promise.reject(
              new Error('Дата окончания регистрации должна быть раньше даты начала соревнования'),
            );
          }

          if (start && value >= start) {
            return Promise.reject(
              new Error('Дата окончания регистрации должна быть раньше даты начала соревнования'),
            );
          }

          return Promise.resolve();
        },
      }),
    ],
    Component: AntdInput,
    props: {
      type: 'datetime-local',
    },
  },
  is_private: {
    label: 'Приватный CTF',
    requiredMessage: '',
    Component: Checkbox,
    customRender: (form) => {
      const [checked, setChecked] = useState(false);

      return (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
          }}
          onClick={() => {
            const newValue = !checked;
            setChecked(newValue);
            form.setFieldsValue({ is_private: newValue });
          }}
        >
          <Form.Item name="is_private" valuePropName="checked" noStyle>
            <Checkbox checked={checked} />
          </Form.Item>
          <span style={{ color: '#e0e0ff', marginLeft: 8 }}>Приватный CTF</span>
        </div>
      );
    },
  },
};

// const FIELD_LABELS: Record<string, string> = {
//   eventName: 'Название',
//   eventDescription: 'Описание',
//   date: 'Дата начала',
//   date_end: 'Дата окончания',
//   eventFormat: 'Формат CTF',
//   partFormat: 'Формат участия',
//   eventPlace: 'Место проведения',
//   eventRules: 'Правила CTF',
//   teamLimit: 'Количество команд',
//   memberLimit: 'Количество участников в команде',
//   reg_start: 'Дата начала регистрации',
//   reg_end: 'Дата окончания регистрации',
//   isPrivate: 'Приватный CTF',
// };

// const FIELD_REQUIRED_MESSAGES: Record<string, string> = {
//   eventName: 'Введите название',
//   eventDescription: '',
//   date: '',
//   date_end: '',
//   eventFormat: '',
//   partFormat: '',
//   eventPlace: '',
//   eventRules: '',
//   teamLimit: '',
//   memberLimit: '',
//   reg_start: '',
//   reg_end: '',
//   isPrivate: '',
// };

// const FIELD_RULES: Record<string, Rule[]> = {
//   date: [
//     {
//       required: true,
//       message: FIELD_REQUIRED_MESSAGES['date'],
//     },
//     ({ getFieldValue }) => ({
//       validator(_, value) {
//         const regEnd = getFieldValue('reg_end');

//         if (value <= regEnd) {
//           return Promise.reject(
//             'Дата начала соревнования должна быть позже даты окончания регистрации',
//           );
//         }
//         return Promise.resolve();
//       },
//     }),
//   ],
//   date_end: [
//     { required: true, message: FIELD_REQUIRED_MESSAGES['date_end'] },
//     ({ getFieldValue }) => ({
//       validator(_, value) {
//         if (!value || getFieldValue('date') < value) {
//           return Promise.resolve();
//         }
//         return Promise.reject(new Error('Дата окончания должна быть позже даты начала'));
//       },
//     }),
//   ],
//   reg_end: [
//     { required: true, message: FIELD_REQUIRED_MESSAGES['reg_end'] },
//     ({ getFieldValue }) => ({
//       validator(_, value) {
//         const start = getFieldValue('date');
//         const regStart = getFieldValue('reg_start');

//         if (value <= regStart) {
//           return Promise.reject(
//             new Error('Дата окончания регистрации должна быть позже даты начала регистрации'),
//           );
//         }

//         if (start && value >= start) {
//           return Promise.reject(
//             new Error('Дата окончания регистрации должна быть раньше даты начала соревнования'),
//           );
//         }

//         return Promise.resolve();
//       },
//     }),
//   ],
//   isPrivate: [],
// };

// const FIELD_COMPONENT = {
//   eventName: AntdInput,
//   eventDescription: AntdInput,
//   date: AntdInput,
//   date_end: AntdInput,
//   eventFormat: '',
//   partFormat: '',
//   eventPlace: AntdInput,
//   eventRules: AntdInput,
//   teamLimit: '',
//   memberLimit: '',
//   reg_start: '',
//   reg_end: '',
//   isPrivate: '',
// };

// const FIELD_COMPONENT_PROPS = {
//   date: {
//     type: 'datetime-local',
//   },
// };

export const CreateCTFModal: React.FC<Props> = ({ open, onClose }) => {
  // const [form] = useForm<Omit<Events, 'id'>>();
  const [form] = useForm<any>();
  const { mutate, isLoading } = useCreateCTF();
  const queryClient = useQueryClient();

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (values.ref_rules) {
        values.ref_rules = values.ref_rules.trim();
        if (!values.ref_rules.startsWith('http')) {
          values.ref_rules = `https://${values.ref_rules}`;
        }
      }
      const formatedValues = {
        ...values,
        date: `${values.date}:00Z`,
        date_end: `${values.date_end}:00Z`,
        reg_start: `${values.reg_start}:00Z`,
        reg_end: `${values.reg_end}:00Z`,
        member_limit: Number(values.member_limit),
        team_limit: Number(values.team_limit),
      };
      mutate(formatedValues, {
        onSuccess: () => {
          queryClient.invalidateQueries(['ctfs']);
          onClose();
        },
      });
    } catch (error) {
      console.error('Validation failed:', error);
      notification.error({
        message: 'Ошибка при сохранении',
        description: 'Пожалуйста, проверьте форму и заполните обязательные поля.',
        placement: 'topRight',
      });
    }
  };

  return (
    // <Modal
    //   title={
    //     <>
    //       <span style={{ color: '#e0e0ff' }}>
    //         <i className="fas fa-flag" aria-hidden="true" style={{ marginRight: 8 }} />
    //         Создать CTF
    //       </span>
    //       <div style={{ borderBottom: '1px solid #25253a', margin: '16px -24px 0' }}></div>
    //     </>
    //   }
    //   style={{
    //     top: 20,
    //   }}
    //   styles={{
    //     header: {
    //       background: '#1a1a24',
    //       color: '#e0e0ff',
    //     },
    //     body: { background: '#1a1a24', color: '#e0e0ff' },
    //     content: { background: '#1a1a24' },
    //     mask: { backdropFilter: 'blur(5px)' },
    //   }}
    //   closeIcon={<AntdClose />}
    //   open={open}
    //   onCancel={onClose}
    //   confirmLoading={isLoading}
    //   maskClosable={false}
    //   afterClose={() => form.resetFields()}
    //   destroyOnHidden
    //   footer={[
    //     <>
    //       <AntdCloseButton key="cancel" onClick={onClose} text="Отмена" />
    //       <AntdButton key="create" onClick={handleSubmit} text="Создать" />,
    //     </>,
    //   ]}
    // >
    <AntdModal
      titleText="Создать CTF"
      iconClassName="fas fa-flag"
      open={open}
      onCancel={onClose}
      confirmLoading={isLoading}
      afterClose={() => form.resetFields()}
      top={20}
      footer={
        <>
          <AntdCloseButton key="cancel" onClick={onClose} text="Отмена" />
          <AntdButton key="create" onClick={handleSubmit} text="Создать" />,
        </>
      }
    >
      <Form form={form} layout="vertical" preserve={false}>
        {FIELDS.map((field) => {
          const { customRender, ...fieldMeta } = FIELDS_META[field];
          const { label, requiredMessage, rules, Component, props, formItemProps } = fieldMeta;

          if (!Component) return null;

          if (customRender) {
            return (
              <Form.Item {...formItemProps} key={field}>
                {customRender(form)}
              </Form.Item>
            );
          }

          return (
            <Form.Item
              name={field}
              label={<span style={{ color: '#e0e0ff' }}>{label}</span>}
              required={false}
              rules={rules || [{ required: true, message: requiredMessage }]}
              {...formItemProps}
              key={field}
            >
              <Component {...props} />
            </Form.Item>
          );
        })}

        {/* <Form.Item
          name="eventName"
          label={<span style={{ color: '#e0e0ff' }}>Название</span>}
          required={false}
          rules={[{ required: true, message: 'Введите название' }]}
        >
          <AntdInput />
        </Form.Item>
        <Form.Item
          name="eventDescription"
          label={<span style={{ color: '#e0e0ff' }}>Описание</span>}
          required={false}
          rules={[{ required: true, message: 'Введите описание' }]}
        >
          <AntdInput />
        </Form.Item>
        <Form.Item
          name="date"
          label={<span style={{ color: '#e0e0ff' }}>Дата начала</span>}
          required={false}
          rules={[
            {
              required: true,
              message: 'Укажите дату и время начала',
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                const regEnd = getFieldValue('reg_end');

                if (value <= regEnd) {
                  return Promise.reject(
                    'Дата начала соревнования должна быть позже даты окончания регистрации',
                  );
                }
                return Promise.resolve();
              },
            }),
          ]}
        >
          <AntdInput type="datetime-local" />
        </Form.Item>
        <Form.Item
          name="date_end"
          label={<span style={{ color: '#e0e0ff' }}>Дата окончания</span>}
          required={false}
          rules={[
            { required: true, message: 'Укажите дату и время окончания' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('date') < value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Дата окончания должна быть позже даты начала'));
              },
            }),
          ]}
        >
          <AntdInput type="datetime-local" />
        </Form.Item>
        <Form.Item
          name="eventFormat"
          label={<span style={{ color: '#e0e0ff' }}>Формат CTF</span>}
          required={false}
          rules={[{ required: true, message: 'Выберите формат CTF' }]}
        >
          <AntdSelect options={ctfOptions} />
        </Form.Item>
        <Form.Item
          name="partFormat"
          label={<span style={{ color: '#e0e0ff' }}>Формат участия</span>}
          required={false}
          rules={[{ required: true, message: 'Выберите формат участия' }]}
        >
          <AntdSelect options={participationOptions} />
        </Form.Item>
        <Form.Item
          name="eventPlace"
          label={<span style={{ color: '#e0e0ff' }}>Место проведения</span>}
          required={false}
          rules={[{ required: true, message: 'Введите место проведения' }]}
        >
          <AntdInput />
        </Form.Item>
        <Form.Item
          name="eventRules"
          label={<span style={{ color: '#e0e0ff' }}>Правила CTF</span>}
          required={false}
          rules={[{ required: true, message: 'Введите правила CTF' }]}
        >
          <AntdInput />
        </Form.Item>
        <Form.Item
          name="teamLimit"
          label={<span style={{ color: '#e0e0ff' }}>Количество команд</span>}
          required={false}
          rules={[{ required: true, message: 'Введите количество команд' }]}
        >
          <AntdInput type="number" min={2} max={Infinity} />
          // <InputNumber />
        </Form.Item>
        <Form.Item
          name="memberLimit"
          label={<span style={{ color: '#e0e0ff' }}>Количество участников в команде</span>}
          required={false}
          rules={[{ required: true, message: 'Введите количество участников в команде' }]}
        >
          <AntdInput type="number" min={1} max={Infinity} />
          // <InputNumber />
        </Form.Item>
        <Form.Item
          name="reg_start"
          label={<span style={{ color: '#e0e0ff' }}>Дата начала регистрации</span>}
          required={false}
          rules={[
            {
              required: true,
              message: 'Укажите дату и время начала регистрации',
            },
          ]}
        >
          <AntdInput type="datetime-local" />
        </Form.Item>
        <Form.Item
          name="reg_end"
          label={<span style={{ color: '#e0e0ff' }}>Дата окончания регистрации</span>}
          required={false}
          rules={[
            { required: true, message: 'Укажите дату окончания регистрации' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                const start = getFieldValue('date');
                const regStart = getFieldValue('reg_start');

                if (value <= regStart) {
                  return Promise.reject(
                    new Error(
                      'Дата окончания регистрации должна быть позже даты начала регистрации',
                    ),
                  );
                }

                if (start && value >= start) {
                  return Promise.reject(
                    new Error(
                      'Дата окончания регистрации должна быть раньше даты начала соревнования',
                    ),
                  );
                }

                return Promise.resolve();
              },
            }),
          ]}
        >
          <AntdInput type="datetime-local" />
        </Form.Item>
        <Form.Item name="isPrivate" valuePropName="checked">
          <Checkbox>
            <span style={{ color: '#e0e0ff' }}>Приватный CTF</span>
          </Checkbox>
        </Form.Item> */}
      </Form>
    </AntdModal>
    // </Modal>
  );
};
