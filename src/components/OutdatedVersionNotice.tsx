import React from 'react';
import { IonCard, IonCardContent, IonText, IonIcon } from '@ionic/react';
import { warningOutline } from 'ionicons/icons';
import styles from './OutdatedVersionNotice.module.css';

interface OutdatedVersionNoticeProps {
  currentVersion: string;
  minVersion: string;
}

export const isVersionOutdated = (
  current: string,
  minimum: string
): boolean => {
  if (current === '0.0.0' || minimum === '0.0.0') return false;
  const normalize = (v: string) => v.split('.').map(Number);
  const [cMajor, cMinor, cPatch] = normalize(current);
  const [mMajor, mMinor, mPatch] = normalize(minimum);

  if (cMajor < mMajor) return true;
  if (cMajor === mMajor && cMinor < mMinor) return true;
  if (cMajor === mMajor && cMinor === mMinor && cPatch < mPatch) return true;
  return false;
};

const OutdatedVersionNotice: React.FC<OutdatedVersionNoticeProps> = ({
  currentVersion,
  minVersion,
}) => {
  return (
    <IonCard color="warning" className="ion-margin">
      <IonCardContent className={styles.warningContent}>
        <IonIcon icon={warningOutline} className={styles.icon} />
        <IonText className={styles.warningText}>
          <h2>
            <b>Your app version {currentVersion} is outdated.</b>
          </h2>
          <p>Please update to at least {minVersion} for the best experience.</p>
        </IonText>
      </IonCardContent>
    </IonCard>
  );
};

export default OutdatedVersionNotice;
