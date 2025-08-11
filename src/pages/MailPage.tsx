import React, { useState, useMemo, useCallback } from 'react';
import { PageContainer } from '@/shared/ui/PageContainer';
import { Header } from '@/components/Layout/Header';
import { AntdInput } from '@/shared/ui/Input';
import Checkbox, { CheckboxChangeEvent } from 'antd/es/checkbox/Checkbox';
import Flex from 'antd/es/flex';
import styled from 'styled-components';
import { useUsersQuery, useCtfQuery, useSendMail } from '@/hooks/useQueries';
import { AntdButton } from '@/shared/ui/Button';
import { Mail } from '@/types';

const StyledCheckbox = styled(Checkbox)`
  color: #eef3ff;
  margin: 0;
`;

type RecipientType = 'none' | 'allUsers' | 'captains' | 'user';
type Recipient = { type: RecipientType; value?: string };

export const MailPage: React.FC = () => {
  const [recipient, setRecipient] = useState<Recipient>({ type: 'none' });
  const [theme, setTheme] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [currentCTFName, setCurrentCTFName] = useState<string>('');
  const [currentCTFId, setCurrentCTFId] = useState<string>('');

  const allUsers = useUsersQuery();
  const events = useCtfQuery();

  const usersNicknames: string[] = useMemo(
    () =>
      allUsers.data?.data
        .map((user) => user.nickname)
        .filter((nickname): nickname is string => typeof nickname === 'string') ?? [],
    [allUsers.data],
  );

  const ctfs = useMemo(
    () =>
      events.data?.data.map(({ uuid, name }: { uuid: string; name: string }) => ({ uuid, name })) ||
      [],
    [events.data],
  );

  const nameToUuid = useMemo(
    () => Object.fromEntries(ctfs.map((ctf) => [ctf.name, ctf.uuid])),
    [ctfs],
  );
  const filteredNicknameOptions = useMemo(() => {
    const nickname = recipient.type === 'user' ? recipient.value || '' : '';
    if (!nickname) return usersNicknames;
    return usersNicknames.filter((nick) => nick?.toLowerCase().includes(nickname.toLowerCase()));
  }, [recipient, usersNicknames]);

  const filteredCTFOptions = useMemo(() => {
    if (!currentCTFName) return ctfs;
    return ctfs.filter((ctf) => ctf.name.toLowerCase().includes(currentCTFName.toLowerCase()));
  }, [currentCTFName, ctfs]);

  const mutation = useSendMail();

  const handleCheckboxChange = useCallback(
    (type: RecipientType) => (e: CheckboxChangeEvent) => {
      if (!e.target.checked) return;
      if (type === 'user') {
        setRecipient({ type: 'user', value: '' });
      } else {
        setRecipient({ type, value: undefined });
      }
    },
    [],
  );

  const handleCtfSelect = useCallback(
    (value: string) => {
      setCurrentCTFName(value);
      setCurrentCTFId(nameToUuid[value] ?? '');
    },
    [nameToUuid],
  );

  const handleCtfChange = useCallback(
    (value: string) => {
      setCurrentCTFName(value);
      if (!nameToUuid[value]) setCurrentCTFId('');
      else setCurrentCTFId(nameToUuid[value]);
    },
    [nameToUuid],
  );

  const handleNicknameSelect = useCallback((value: string) => {
    setRecipient({ type: 'user', value });
  }, []);

  const handleNicknameChange = useCallback((value: string) => {
    setRecipient({ type: 'user', value });
  }, []);

  const handleSubmit = useCallback(() => {
    const group =
      recipient.type === 'user'
        ? recipient.value || ''
        : recipient.type === 'none'
        ? ''
        : recipient.type;

    const payload: Mail = {
      subject: theme,
      body: message,
      group,
    };

    mutation.mutate({ eventId: currentCTFId, data: payload });
  }, [currentCTFId, recipient, theme, message, mutation]);

  return (
    <PageContainer vertical>
      <Header title="Сообщения" />
      <Flex gap="small" vertical>
        <span style={{ color: '#EEF3FF' }}>Выберите адресат сообщения</span>

        <StyledCheckbox
          name="allUsers"
          checked={recipient.type === 'allUsers'}
          onChange={handleCheckboxChange('allUsers')}
        >
          Все пользователи
        </StyledCheckbox>

        <StyledCheckbox
          name="captains"
          checked={recipient.type === 'captains'}
          onChange={handleCheckboxChange('captains')}
        >
          Капитаны
        </StyledCheckbox>

        <StyledCheckbox
          name="specificUser"
          checked={recipient.type === 'user'}
          onChange={handleCheckboxChange('user')}
        >
          Конкретный пользователь
        </StyledCheckbox>

        <AntdInput.AutoComplete
          options={filteredCTFOptions.map((ctf) => ({ value: ctf.name }))}
          value={currentCTFName}
          onSelect={handleCtfSelect}
          onChange={handleCtfChange}
          placeholder="Выберите CTF (по имени)"
          allowClear
        />

        {recipient.type === 'user' && (
          <AntdInput.AutoComplete
            options={filteredNicknameOptions.map((nickname) => ({ value: nickname }))}
            value={recipient.value ?? ''}
            onSelect={handleNicknameSelect}
            onChange={handleNicknameChange}
            placeholder="Введите адресат сообщения (никнейм)"
            allowClear
          />
        )}

        <AntdInput
          placeholder="Введите тему письма"
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
        />

        <AntdInput.TextArea
          placeholder="Введите текст письма"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          style={{ minHeight: '500px' }}
        />

        <Flex justify="end">
          <AntdButton onClick={handleSubmit} text="Отправить" />
        </Flex>
      </Flex>
    </PageContainer>
  );
};

export default MailPage;
