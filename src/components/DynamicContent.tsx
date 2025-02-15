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
import dayjs from 'dayjs';

export interface DynamicContentProps {
  imageLink: string;
  title: string;
  subtitle: string;
  datePosted: string;
  shortDescription: string;
  detailedImageLink: string;
  detailedDescription: string;
  buttonName: string;
  buttonLink: string;
}

const DynamicContent: React.FC<DynamicContentProps> = ({ imageLink, title, subtitle, datePosted, shortDescription, detailedImageLink, detailedDescription, buttonName, buttonLink }) => {
  const [isExtraContentVisible, setIsListVisible] = useState(false);


  const onToggleView = () => {
    setIsListVisible((prev) => !prev);
  };

  return (
    <IonCard>
      {imageLink && <IonImg src={imageLink} />}
      <IonCardHeader onClick={onToggleView} >
        {title && <IonCardTitle>{title}</IonCardTitle>}
        {subtitle && <IonCardSubtitle>{subtitle}</IonCardSubtitle>}

      </IonCardHeader>
      <IonCardContent>
        {shortDescription && <IonText onClick={onToggleView}>
          {datePosted && `${dayjs().to(datePosted)} - `}{shortDescription}
        </IonText>}
        <IonIcon onClick={onToggleView} slot="end" icon={isExtraContentVisible ? chevronDown : chevronForward} />
        {isExtraContentVisible && (
          <>
            {detailedImageLink && <IonImg src={detailedImageLink} />}
            {detailedDescription && <IonText>
              {detailedDescription}
            </IonText>}
          </>
        )}
      </IonCardContent>
      {buttonName && buttonLink && <IonButton fill="clear" href={buttonLink}>
        {buttonName}
      </IonButton>}
    </IonCard>
  );
}

export default DynamicContent;