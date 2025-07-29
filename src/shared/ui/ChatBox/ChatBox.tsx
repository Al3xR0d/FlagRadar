import React, { useState, useEffect, useRef } from 'react';
import message from 'antd/es/message';
import { AntdInput } from '@/shared/ui/Input';
import { AntdButton } from '@/shared/ui/Button';
import { CustomSpin } from '@/shared/ui/Spin';
import { SendOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { Role } from '@/types';

export interface ChatMessage {
  id: string;
  role: Role;
  content: string;
  isLoading?: boolean;
}

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 16px;
  background-color: #151522;
  border: 1px solid #25253a;
  border-radius: 8px;
`;

const MessagesWrapper = styled.div`
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column-reverse;
  padding: 16px;
  margin-bottom: 16px;
  background-color: #151522;
  border-radius: 8px;
  box-shadow: inset 0 0 4px rgba(0, 0, 0, 0.05);
`;

const MessageBubble = styled.div<{ $isUser: boolean }>`
  max-width: 75%;
  padding: 12px 16px;
  margin-bottom: 12px;
  border-radius: 18px;
  align-self: ${({ $isUser }) => ($isUser ? 'flex-end' : 'flex-start')};
  background: ${({ $isUser }) => ($isUser ? '#00ff9d' : '#EEF3FF')};
  color: ${({ $isUser }) => ($isUser ? '#151522' : '#151522')};
  word-break: break-word;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const InputContainer = styled.div`
  display: flex;
  gap: 8px;
`;

export const ChatBox: React.FC<{
  messages: ChatMessage[];
  onSend: (text: string) => Promise<void>;
  userRole: Role;
}> = ({ messages, onSend, userRole }) => {
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputContainerRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isSending) return;

    try {
      setIsSending(true);
      await onSend(input);
      setInput('');
    } catch (error) {
      message.error('Ошибка отправки сообщения');
    } finally {
      setIsSending(false);

      setTimeout(() => {
        inputContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }, 100);
    }
  };

  return (
    <>
      <ChatContainer>
        <MessagesWrapper>
          {[...messages].reverse().map((msg) => (
            <MessageBubble key={msg.id} $isUser={msg.role === userRole}>
              {msg.isLoading ? <CustomSpin /> : msg.content}
            </MessageBubble>
          ))}
          <div ref={messagesEndRef} />
        </MessagesWrapper>

        <form onSubmit={handleSubmit}>
          <InputContainer ref={inputContainerRef}>
            <AntdInput
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Введите сообщение..."
              disabled={isSending}
            />
            <AntdButton
              type="primary"
              icon={<SendOutlined />}
              onClick={handleSubmit}
              loading={isSending}
              disabled={!input.trim()}
            />
          </InputContainer>
        </form>
      </ChatContainer>
    </>
  );
};
