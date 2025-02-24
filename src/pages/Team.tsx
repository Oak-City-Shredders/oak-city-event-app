import React from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import './Team.css'; // Import the CSS file for styling

import teamMembers from '../data/teamMembers.json';

const Team: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Meet the Directors</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div className="team-grid">
          {teamMembers.map((member, index) => (
            <div key={index} className="team-member">
              <img src={member?.imgSrc} alt={member?.name} />
              <h3 className="small-margin">{member?.name}</h3>
              <h5 className="small-margin">{member?.nickname}</h5>{' '}
              <p className="small-margin">{member?.role}</p>
            </div>
          ))}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Team;
