import React from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import './Team.css'; // Import the CSS file for styling

const teamMembers = [
  {
    name: 'Josh Christensen',
    nickname: '"Supremo"',
    role: 'Festival & Marketing',
    imgSrc: '/images/team/supremo.webp',
  },
  {
    name: 'Mark Gryzb',
    nickname: '"Gryz"',
    role: 'Hospitality',
    imgSrc: '/images/team/gryz.webp',
  },
  {
    name: 'Jon Brown',
    nickname: '"Jon Brown"',
    role: 'Racing',
    imgSrc: '/images/team/jon-brown.webp',
  },
  {
    name: 'Jared Farago',
    nickname: '"Mad Scientist"',
    role: 'Scavenger Hunt & App',
    imgSrc: '/images/team/mad-scientist.webp',
  },
  {
    name: 'Dave Wolf',
    nickname: '"White Wolf"',
    role: 'Treasurer & App',
    imgSrc: '/images/team/dave-wolf.webp',
  },
  {
    name: 'Kay Love',
    nickname: '',
    role: 'Volunteers ',
    imgSrc: '/images/team/kay.webp',
  },
  {
    name: 'Kenzi',
    nickname: '',
    role: 'EUC',
    imgSrc: '/images/team/kenzi.webp',
  },
  {
    name: 'Ryan Lerch',
    nickname: '',
    role: 'Float Track',
    imgSrc: '/images/team/lerch.webp',
  },
  {
    name: 'Snir',
    nickname: '',
    role: 'Stargate',
    imgSrc: '/images/team/snir.webp',
  },
  {
    name: 'Aaron Saunders',
    nickname: '"A A Ron"',
    role: 'Float Track & Trail Capt.',
    imgSrc: '/images/team/aaron.webp',
  },
  {
    name: 'Chris Pinky',
    nickname: '"Pinky"',
    role: 'Race Captain',
    imgSrc: '/images/team/pinky.webp',
  },
  {
    name: 'Mike',
    nickname: '"D Dom"',
    role: 'Disc Golf',
    imgSrc: '/images/team/placeholder.webp',
  },
  {
    name: 'Evan Hoke',
    nickname: '"Oak City Outlaw"',
    role: 'Tech',
    imgSrc: '/images/team/evan.webp',
  },
  {
    name: 'Eric Nichols',
    nickname: '"Oak City Carpenter"',
    role: 'Carpentar',
    imgSrc: '/images/team/eric.webp',
  },
  {
    name: 'Joe Rana',
    nickname: '"Papa Joe"',
    role: 'Stoke Spreader',
    imgSrc: '/images/team/joe.webp',
  },
  ,
  {
    name: 'Danielle Diaz-Silveira',
    nickname: '"Danielle2Daddy"',
    role: 'Swag',
    imgSrc: '/images/team/danielle.webp',
  },
  ,
  {
    name: 'Josh Johnson',
    nickname: '"Terminator"',
    role: 'Underground Races',
    imgSrc: '/images/team/terminator.webp',
  },
  {
    name: 'Alex Mononen',
    nickname: '"Sparky"',
    role: 'Networking',
    imgSrc: '/images/team/alex.webp',
  },
  {
    name: 'Zach Case',
    nickname: '',
    role: 'Super Volunteer',
    imgSrc: '/images/team/placeholder.webp',
  },
  {
    name: 'Kaity',
    nickname: '',
    role: 'Music',
    imgSrc: '/images/team/kaity.webp',
  },
  {
    name: 'Noah Via',
    nickname: '',
    role: 'Trick Comp',
    imgSrc: '/images/team/noah.webp',
  },
  {
    name: 'Josue Olea',
    nickname: '"Sway"',
    role: 'Signage',
    imgSrc: '/images/team/sway.webp',
  },
  {
    name: 'Greg Ackerman',
    nickname: '',
    role: 'Stoke Spreader',
    imgSrc: '/images/team/greg.webp',
  },
];

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
