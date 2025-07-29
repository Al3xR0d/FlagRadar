import React, { useState } from 'react';
import { PageContainer } from '@/shared/ui/PageContainer';
import { Header } from '@/components/Layout/Header';
import { Footer } from '@/components/Layout/Footer';
import { AntdTabs } from '@/shared/ui/Tabs';
import { Role, Question, AnswerListResponse } from '@/types';
import { ChatBox } from '@/shared/ui/ChatBox';
import { useUserStore } from '@/store/userStore';
import { useFetchAI } from '@/hooks/useQueries';
import { SubmitAIModal } from '@/components/Modal/SubmitAIModal';

interface ChatMessage {
  id: string;
  role: Role;
  content: string;
  isLoading?: boolean;
}

const AIPage: React.FC = () => {
  const [activeKey, setActiveKey] = useState<string>('1');
  const [pendingKey, setPendingKey] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [chats, setChats] = useState<Record<string, ChatMessage[]>>({ '1': [], '2': [] });

  const userRoleByTab: Record<string, Role> = { '1': 'blue', '2': 'red' };
  const { mutate, error } = useFetchAI();
  const currentUser = useUserStore((store) => store.currentUser);

  const onTabClick = (key: string) => {
    if (key === activeKey) return;
    setPendingKey(key);
    setIsModalOpen(true);
  };

  const handleConfirm = () => {
    if (pendingKey) {
      setActiveKey(pendingKey);
    }
    setIsModalOpen(false);
    setPendingKey(null);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setPendingKey(null);
  };

  const handleSend = async (tabKey: string, text: string) => {
    const currentUserRole = userRoleByTab[tabKey];
    const aiRole = currentUserRole === 'blue' ? 'red' : 'blue';

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: currentUserRole,
      content: text,
    };
    const aiTempMessage: ChatMessage = {
      id: `ai-${Date.now()}`,
      role: aiRole,
      content: '',
      isLoading: true,
    };

    setChats((prev) => ({ ...prev, [tabKey]: [...prev[tabKey], userMessage, aiTempMessage] }));

    const session_id = currentUser?.nickname;
    if (!session_id) {
      setChats((prev) => {
        const updated = [...prev[tabKey]];
        const idx = updated.findIndex((m) => m.id === aiTempMessage.id);
        if (idx !== -1) {
          updated[idx] = {
            ...aiTempMessage,
            content: 'Ошибка: пользователь не авторизован',
            isLoading: false,
          };
        }
        return { ...prev, [tabKey]: updated };
      });
      return;
    }

    const message: Question = { content: text };
    mutate(
      { role: currentUserRole, session_id, message },
      {
        onSuccess: (data: AnswerListResponse) => {
          setChats((prev) => {
            const updated = [...prev[tabKey]];
            const idx = updated.findIndex((m) => m.id === aiTempMessage.id);
            if (idx !== -1) {
              updated[idx] = { ...aiTempMessage, content: data.data.content, isLoading: false };
            }
            return { ...prev, [tabKey]: updated };
          });
        },
        onError: () => {
          setChats((prev) => {
            const updated = [...prev[tabKey]];
            const idx = updated.findIndex((m) => m.id === aiTempMessage.id);
            if (idx !== -1) {
              updated[idx] = {
                ...aiTempMessage,
                content: 'Ошибка: не удалось получить ответ',
                isLoading: false,
              };
            }
            return { ...prev, [tabKey]: updated };
          });
        },
      },
    );
  };

  const currentTab = chats[activeKey];

  return (
    <>
      <PageContainer vertical>
        <Header title="AI Помощник" />
        <AntdTabs activeKey={activeKey} onTabClick={onTabClick}>
          <AntdTabs.TabPane tab="Защитник" key="1">
            <ChatBox
              messages={currentTab}
              onSend={(text) => handleSend('1', text)}
              userRole={userRoleByTab['1']}
            />
          </AntdTabs.TabPane>
          <AntdTabs.TabPane tab="Атакующий" key="2">
            <ChatBox
              messages={currentTab}
              onSend={(text) => handleSend('2', text)}
              userRole={userRoleByTab['2']}
            />
          </AntdTabs.TabPane>
        </AntdTabs>
        <Footer />
      </PageContainer>
      <SubmitAIModal
        open={isModalOpen}
        onCancel={handleCancel}
        handleSubmit={handleConfirm}
        confirmLoading={false}
      />
    </>
  );
};

export default AIPage;
