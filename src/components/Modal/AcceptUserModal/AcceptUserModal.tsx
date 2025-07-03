import React, { useState } from 'react';
import styled from 'styled-components';
import { AntdModal } from '@/shared/ui/Modal';
import { AntdInput } from '@/shared/ui/Input';
import Checkbox from 'antd/es/checkbox';
import message from 'antd/es/message';
import { useUserStore } from '@/store/userStore';
import { useAcceptUser } from '@/hooks/useQueries';
import { CustomSpin } from '@/shared/ui/Spin';
import { AntdButton } from '@/shared/ui/Button';
import Form from 'antd/es/form';
import Flex from 'antd/es/flex';
import Link from 'antd/es/typography/Link';
import { TextWrapper } from '@/shared/ui/TextWrapper';

interface Props {
  open: boolean;
  onClose: () => void;
}

const StyledCheckbox = styled(Checkbox)`
  color: #e0e0ff;
  margin: 0;
`;

const StyledFormItem = styled(Form.Item)`
  color: #e0e0ff;
`;

export const AcceptUserModal: React.FC<Props> = ({ open, onClose }) => {
  const [nickname, setNickname] = useState('');
  const [accepted, setAccepted] = useState(false);

  const rulesText = useUserStore((store) => store.rules);
  const mutation = useAcceptUser();
  const handleSubmit = async () => {
    if (accepted && nickname === '') {
      message.error('Введите никнейм');
      return;
    }

    if (accepted && nickname.trim().length === 0) {
      message.error('Введите валидный никнейм');
      return;
    }

    if (!accepted) {
      message.error('Вы должны принять правила и политику обработки персональных данных');
      return;
    }

    mutation.mutate(
      { nickname },
      {
        onSuccess: () => {
          message.success('Добро пожаловать!');
          onClose();
        },
        onError: () => {
          message.error('Ошибка при регистрации');
        },
      },
    );
  };

  return (
    <AntdModal
      titleText="Добро пожаловать!"
      open={open}
      width={800}
      onCancel={onClose}
      closable={false}
      top={20}
      footer={
        <Flex justify="space-between" align="center">
          <StyledCheckbox checked={accepted} onChange={(e) => setAccepted(e.target.checked)}>
            Я принимаю правила платформы{' '}
            <Link href="https://www.sberbank.ru/privacy/policy#pdn" target="_blank">
              и политику обработки персональных данных
            </Link>
          </StyledCheckbox>
          <AntdButton onClick={handleSubmit} text="Принять" />
        </Flex>
      }
    >
      <Form layout="vertical" preserve={false}>
        <StyledFormItem>
          <p>Прежде чем начать, ознакомьтесь с правилами платформы:</p>
        </StyledFormItem>
        <StyledFormItem>
          {' '}
          <TextWrapper>{rulesText || <CustomSpin />}</TextWrapper>
        </StyledFormItem>
        <Form.Item>
          <AntdInput
            placeholder="Введите никнейм"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
        </Form.Item>
      </Form>
    </AntdModal>
  );
};
