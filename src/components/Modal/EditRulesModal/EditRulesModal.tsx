import { useState, useEffect } from 'react';
import { AntdCloseButton } from '@/shared/ui/CloseButton';
import { AntdButton } from '@/shared/ui/Button';
import Form from 'antd/es/form';
import { AntdInput } from '@/shared/ui/Input';
import Checkbox from 'antd/es/checkbox/Checkbox';
import { AntdModal } from '@/shared/ui/Modal';
import message from 'antd/es/message';
import { useEditRules } from '@/hooks/useQueries';
import { useUserStore } from '@/store/userStore';

interface Props {
  open: boolean;
  onClose: () => void;
  text: string;
}

export const EditRulesModal: React.FC<Props> = ({ open, onClose, text }) => {
  const [newText, setNewText] = useState(text);
  const [reaccept, setReaccept] = useState(false);
  const editRulesMutation = useEditRules();
  const setRules = useUserStore((store) => store.setRules);

  useEffect(() => {
    if (open) {
      setNewText(text);
      setReaccept(false);
    }
  }, [open, text]);

  const handleSave = () => {
    editRulesMutation.mutate(
      { text: newText, reaccept },
      {
        onSuccess: () => {
          message.success('Правила обновлены');
          setRules(newText);
          onClose();
        },
        onError: () => {
          message.error('Ошибка при обновлении правил');
        },
      },
    );
  };

  return (
    <>
      <AntdModal
        titleText="Правила платформы FlagRadar"
        open={open}
        onCancel={onClose}
        top={20}
        width={800}
        showTitleDivider={false}
        footer={
          <>
            <AntdCloseButton key="cancel" onClick={onClose} text="Отмена" />
            <AntdButton key="create" onClick={handleSave} text="Сохранить" />,
          </>
        }
      >
        <Form.Item>
          <AntdInput.TextArea
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            style={{ minHeight: '500px' }}
          />
        </Form.Item>
        <Checkbox checked={reaccept} onChange={(e) => setReaccept(e.target.checked)}>
          <span style={{ color: '#e0e0ff' }}>Требуется заново принять правила</span>
        </Checkbox>
      </AntdModal>
    </>
  );
};
