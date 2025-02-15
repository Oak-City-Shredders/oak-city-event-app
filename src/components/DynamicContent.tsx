import {
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonIcon,
  IonButton,
  IonCard,
  IonText,
  IonImg,
} from '@ionic/react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { chevronDown, chevronUp, chevronForward } from "ionicons/icons";

export interface DynamicContentProps {
  title: string;
  subtitle: string;
  shortDescription: string;
  imageLink: string;
  detailedDescription: string;
  buttonName: string;
  buttonLink: string;
}

const DynamicContent: React.FC<DynamicContentProps> = ({ title, subtitle, shortDescription, imageLink, detailedDescription, buttonName, buttonLink }) => {
  const [isExtraContentVisible, setIsListVisible] = useState(false);


  const onToggleView = () => {
    setIsListVisible((prev) => !prev);
  };

  return (
    <IonCard>
      <IonCardHeader onClick={onToggleView} >
        <IonCardTitle>{title}</IonCardTitle>
        <IonCardSubtitle>{subtitle}</IonCardSubtitle>

      </IonCardHeader>
      <IonCardContent>
        <IonText onClick={onToggleView}>
          {shortDescription}
        </IonText>
        <IonIcon onClick={onToggleView} slot="end" icon={isExtraContentVisible ? chevronDown : chevronForward} />
        {isExtraContentVisible && (
          <>
            <IonImg src={imageLink} />
            <IonText>
              {detailedDescription}
            </IonText>
          </>
        )}
      </IonCardContent>
      <IonButton fill="clear" href={buttonLink}>
        {buttonName}
      </IonButton>
    </IonCard>
  );
}

export default DynamicContent;