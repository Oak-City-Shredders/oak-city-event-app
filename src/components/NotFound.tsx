import { IonContent, IonPage, IonButton } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import ErrorMessage from './ErrorMessage';

const NotFound: React.FC = () => {
  const history = useHistory();

  return (
    <IonPage>
      <IonContent fullscreen>
        <ErrorMessage message="Page Not Found" />
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'baseline',
            height: '100%',
            marginTop: '16px',
          }}
        >
          <IonButton onClick={() => history.push('/home')}>Go Home</IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default NotFound;
