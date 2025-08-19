import React, { useState } from 'react';
import { PageContainer } from '@/shared/ui/PageContainer';
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
import { AntdTabs } from '@/shared/ui/Tabs';
import { Role, AnswerListResponse } from '@/types';
import { ChatBox } from '@/shared/ui/ChatBox';
import { useUserStore } from '@/store/userStore';
import { useFetchAI } from '@/hooks/useQueries';

interface ChatMessage {
  id: string;
  role: Role;
  content: string;
  isLoading?: boolean;
}

const AIPage: React.FC = () => {
  const [activeKey, setActiveKey] = useState<'1' | '2'>('1');
  const [chats, setChats] = useState<Record<'1' | '2', ChatMessage[]>>({ '1': [], '2': [] });
  const [plugModalOpen, setPlugModalOpen] = useState(true);

  const roleByTab: Record<'1' | '2', Role> = { '1': 'blue', '2': 'red' };
  const { mutate } = useFetchAI();
  const currentUser = useUserStore((store) => store.currentUser);

  const updateMessage = (tab: '1' | '2', messageId: string, content: string, isLoading = false) => {
    setChats((prev) => {
      const updated = [...prev[tab]];
      const idx = updated.findIndex((m) => m.id === messageId);
      if (idx !== -1) updated[idx] = { ...updated[idx], content, isLoading };
      return { ...prev, [tab]: updated };
    });
  };

  const handleSend = async (tab: '1' | '2', text: string): Promise<void> => {
    const userRole = roleByTab[tab];
    const aiRole = userRole === 'blue' ? 'red' : 'blue';

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: userRole,
      content: text,
    };
    const aiTempMessage: ChatMessage = {
      id: `ai-${Date.now()}`,
      role: aiRole,
      content: '',
      isLoading: true,
    };

    setChats((prev) => ({
      ...prev,
      [tab]: [...prev[tab], userMessage, aiTempMessage],
    }));

    const sessionId = currentUser?.nickname;
    if (!sessionId) {
      updateMessage(tab, aiTempMessage.id, 'Ошибка: пользователь не авторизован');
      return;
    }

    mutate(
      { role: userRole, session_id: sessionId, content: text },
      {
        onSuccess: (data: AnswerListResponse) =>
          updateMessage(tab, aiTempMessage.id, data.data.content),
        onError: () => updateMessage(tab, aiTempMessage.id, 'Ошибка: не удалось получить ответ'),
      },
    );
  };

  const tabItems = [
    {
      key: '1',
      label: 'Защитник',
      children: (
        <ChatBox
          messages={chats['1']}
          onSend={(text) => handleSend('1', text)}
          userRole={roleByTab['1']}
        />
      ),
    },
    {
      key: '2',
      label: 'Атакующий',
      children: (
        <ChatBox
          messages={chats['2']}
          onSend={(text) => handleSend('2', text)}
          userRole={roleByTab['2']}
        />
      ),
    },
  ];

  return (
    <>
      <PageContainer vertical>
        <Header title="AI Помощник" />
        <span style={{ color: '#EEF3FF' }}>
          В рамках экспериментальной функции AI помощника доступно 6 одновременных пользователей
        </span>
        <AntdTabs
          activeKey={activeKey}
          onChange={(key: string) => setActiveKey(key as '1' | '2')}
          items={tabItems}
        />
        <Footer />
      </PageContainer>
    </>
  );
};

export default AIPage;
