import React from 'react';
import { IonImg, IonText } from '@ionic/react';

interface ErrorMessageProps {
  message: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  return (
    <>
      <IonImg src="/images/falling-squirrel-error.webp" />
      <IonText
        style={{
          fontSize: '1.5em',
          fontWeight: 'bold',
          textAlign: 'center',
          display: 'block',
          marginTop: '16px',
        }}
      >
        {message}
      </IonText>
    </>
  );
};

export default ErrorMessage;
