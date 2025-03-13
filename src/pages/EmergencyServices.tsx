import React from 'react';
import {
  IonCard,
  IonCardContent,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonImg,
  IonLabel,
  IonPage,
  IonText,
} from '@ionic/react';
import PageHeader from '../components/PageHeader';
import './EmergencyServices.css';

const EmergencyServices: React.FC = () => {
  return (
    <IonPage>
      <PageHeader title="Emergency Services" />
      <IonContent>
        <IonCard>
          <IonImg
            src="/images/emergency-services-small.webp"
            alt="Scavenger Hunt"
            className="emergency-image"
          />
          <IonCardContent>
            <IonCardTitle>Get Help!</IonCardTitle>
            <div className="help-section">
              <div className="info-row">
                <IonText className="help-subtitles">Location:</IonText>
                <IonText>Stoke Park</IonText>
              </div>
              {/*              <div className="info-row">
                <IonText className="help-subtitles">Phone Number:</IonText>
                <IonText>(919-555-555)</IonText>
              </div>
              */}
              <IonText className="emergency-text">
                For emergencies, call 911.
              </IonText>
            </div>

            <div className="content-section">
              <IonCardSubtitle>Arise Event Services</IonCardSubtitle>
              <p>
                Hi Shredders! We are ARISE EVENT SERVICES LLC providing you with
                your First-Aid and Emergency services! So stoked for Shred Fest
                2025! We are grateful to be back again to watch this community
                grow and flourish.
              </p>
              <p>
                We have experienced Staff that are dedicated to excellence,
                ensuring that your Shred Fest experience is safe and you can
                relax and just have fun! Anyone with a radio can reach us or
                catch us at the First-Aid booth.
              </p>
              <p>
                NOTE: We especially love to see all of you wearing your helmets,
                pads and safety gear!! We also have a hydration station to keep
                you at peak performance.
              </p>
              <IonCardSubtitle className="about-us-subtitle">
                About Us
              </IonCardSubtitle>
              <p>
                ARISE’s distinctive approach, characterized by compassion and
                versatility in addressing conflicts and emergencies, underscores
                our commitment to harm reduction. Moreover, our comprehensive
                supply inventory, hydration station and triage area are designed
                to effectively address both minor and major incidents. We take
                pride in our extensive experience in this field, with many team
                members who are not only well-acquainted with, but also actively
                part of the communities we serve. This deep connection is
                paramount to our substantial investment in our communities.
              </p>
              <p>
                Our unique approach to medical care sets us apart from most as
                we have Nurses or higher on staff who can assess and manage
                on-site situations, providing a higher level of patient
                assessment and care than traditional EMTs or paramedics.
              </p>
              <p>
                We have an unwavering dedication to quality, which, combined
                with our aspiration to foster enduring relationships, compels us
                to maintain the highest standards of performance. We are
                resolute in holding ourselves accountable and delivering
                services of the utmost quality.
              </p>
              <p>
                Our team of fully licensed medical professionals is equipped to
                deliver comprehensive care. We provide triage areas for you to
                cool out or have some privacy and get 100% for your next ride!
                All medical supplies are provided free of charge thanks to your
                producers! We have life saving medications and machines on site
                for worst case scenarios or just minor meds for comfort. We are
                also on-site all weekend to facilitate transport to higher
                medical care with great expediency, should you need that. We
                prioritize safety and are familiar with emergency procedures to
                ensure a smooth and secure experience for all Shredders.
              </p>
              <p className="closing-text">
                KEEP THE STOKE HIGH AND KNOW THAT WE GOT YOU!! SHRED ON!!!
              </p>
            </div>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default EmergencyServices;
