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
import { useState } from 'react';
import { chevronDown, chevronForward } from 'ionicons/icons';
import dayjs from 'dayjs';
import { h } from 'ionicons/dist/types/stencil-public-runtime';

export interface DynamicContentProps {
  id: string;
  contentType: string;
  enabled: boolean;
  imageLink: string;
  title: string;
  subtitle: string;
  datePosted: Date;
  shortDescription: string;
  detailedImageLink: string;
  detailedDescription: string;
  buttonName: string;
  buttonLink: string;
}

const DynamicContent: React.FC<DynamicContentProps> = ({
  enabled,
  imageLink,
  title,
  subtitle,
  datePosted,
  shortDescription,
  detailedImageLink,
  detailedDescription,
  buttonName,
  buttonLink,
}) => {
  const [isExtraContentVisible, setIsListVisible] = useState(false);

  const onToggleView = () => {
    setIsListVisible((prev) => !prev);
  };

  return (
    <IonCard style={{ marginTop: '0', marginBottom: '0px', height: '100%' }}>
      {imageLink && <IonImg src={imageLink} onClick={onToggleView} />}
      <IonCardHeader onClick={onToggleView}>
        {title && <IonCardTitle>{title}</IonCardTitle>}
        {subtitle && <IonCardSubtitle>{subtitle}</IonCardSubtitle>}
      </IonCardHeader>
      <IonCardContent
        style={{
          paddingBottom: buttonName ? '0px' : '16px',
        }}
      >
        {shortDescription && (
          <IonText onClick={onToggleView}>
            {datePosted && `${dayjs().to(datePosted)} - `}
            {shortDescription}
          </IonText>
        )}
        {(detailedImageLink || detailedDescription) && (
          <IonIcon
            onClick={onToggleView}
            slot="end"
            icon={isExtraContentVisible ? chevronDown : chevronForward}
          />
        )}
        {isExtraContentVisible && (
          <>
            {detailedImageLink && <IonImg src={detailedImageLink} />}
            {detailedDescription && (
              <IonText>
                <br />
                {detailedDescription}
              </IonText>
            )}
          </>
        )}
      </IonCardContent>
      {buttonName && buttonLink && (
        <IonButton fill="clear" href={buttonLink}>
          {buttonName}
        </IonButton>
      )}
    </IonCard>
  );
};

export default DynamicContent;
