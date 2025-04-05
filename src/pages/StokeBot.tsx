import React, { useState } from 'react';
import {
  IonPage,
  IonContent,
  IonFooter,
  IonInput,
  IonButton,
  IonIcon,
  IonSpinner,
} from '@ionic/react';
import { send } from 'ionicons/icons';
import styles from './StokeBot.module.css'; // Import your CSS module

import PageHeader from '../components/PageHeader';

interface Message {
  text: string;
  isUser: boolean;
}

const StokeBot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "Hello Squirrel! I'm StokeBot. How can I help build your stoke today?  I know a lot about the Oak City Shredders community, and I'm here to help you find events, activities, and resources to keep your stoke high!",
      isUser: false,
    },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [threadId, setThreadId] = useState<string | null>(null);

  const sendMessage = async () => {
    if (newMessage.trim()) {
      setIsLoading(true);
      // Add user message
      const userMessage: Message = { text: newMessage, isUser: true };
      setMessages((prev) => [...prev, userMessage]);

      try {
        const response = await fetch(
          `https://us-central1-project3-449305.cloudfunctions.net/handleAssistantRequest`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-api-key': import.meta.env.VITE_REACT_APP_OAK_CITY_APP_KEY,
            },
            body: JSON.stringify({
              message: newMessage,
              threadId: threadId,
            }),
          }
        );

        const data = await response.json();

        // Save the threadId for future messages
        if (data.threadId) {
          setThreadId(data.threadId);
        }

        const botResponse: Message = {
          text: data.reply,
          isUser: false,
        };

        setMessages((prev) => [...prev, botResponse]);
      } catch (error) {
        const errorMessage: Message = {
          text: "Sorry, I couldn't process your message. Please try again.",
          isUser: false,
        };
        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
      }

      setNewMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <IonPage className={styles.container}>
      <PageHeader title="StokeBot" />

      <IonContent>
        <div className={styles.messageList}>
          {messages.map((message, index) => (
            <div
              key={index}
              className={`${styles.message} ${
                message.isUser ? styles.userMessage : styles.botMessage
              }`}
            >
              {message.text}
            </div>
          ))}
          {isLoading && (
            <div className={styles.loading}>
              <IonSpinner name="dots" />
            </div>
          )}
        </div>
      </IonContent>

      <IonFooter>
        <div className={styles.inputArea}>
          <IonInput
            value={newMessage}
            placeholder="Type a message..."
            onIonInput={(e) => setNewMessage(e.detail.value || '')}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
          />
          <IonButton
            expand="block"
            onClick={sendMessage}
            disabled={!newMessage.trim() || isLoading}
          >
            <IonIcon icon={send} slot="end" />
            Send
          </IonButton>
        </div>
      </IonFooter>
    </IonPage>
  );
};

export default StokeBot;
