import React from 'react';
import { IonCard, IonCardContent, IonText, IonIcon } from '@ionic/react';
import { warningOutline } from 'ionicons/icons';
import styles from './OutdatedVersionNotice.module.css';

interface OutdatedVersionNoticeProps {
  currentVersion: string;
  minVersion: string;
  loading: boolean;
  error?: string;
}

const isVersionOutdated = (current: string, minimum: string): boolean => {
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
  loading,
  error,
}) => {
  if (loading || error || currentVersion === '0.0.0' || minVersion === '0.0.0')
    return null;

  const outdated = isVersionOutdated(currentVersion, minVersion);

  return outdated ? (
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
  ) : null;
};

export default OutdatedVersionNotice;
