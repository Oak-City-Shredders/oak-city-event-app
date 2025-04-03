import { IonSpinner } from '@ionic/react';
import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '80vh',
      }}
    >
      <IonSpinner />
    </div>
  );
};

export default LoadingSpinner;
