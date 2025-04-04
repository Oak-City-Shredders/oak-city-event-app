import { useEffect, useState } from 'react';
import {
  loginUser,
  registerUser,
  resetPassword,
  logoutUser,
  sendEmailVerification,
  deleteUser,
} from '../auth';
import {
  IonButton,
  IonInput,
  IonItem,
  IonLabel,
  IonPage,
  IonContent,
  IonText,
  IonCard,
  IonCardContent,
  IonIcon,
  IonSegment,
  IonSegmentButton,
  SegmentValue,
  IonRefresher,
  IonRefresherContent,
  IonCardSubtitle,
  IonCardHeader,
} from '@ionic/react';
import { useAuth } from '../context/AuthContext';
import PageHeader from '../components/PageHeader';
import PreferencesCard from '../components/PreferencesCard';
import styles from './Login.module.css';
import {
  logInOutline,
  logOutOutline,
  mailOutline,
  personAddOutline,
  trashBin,
} from 'ionicons/icons';
import { useRefreshHandler } from '../hooks/useRefreshHandler';
import { checkVibrate } from '../utils/vibrate';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { App } from '@capacitor/app';

const Login: React.FC = () => {
  const { user, loading, error: authError, refreshAuth } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string>('');
  const [isAdvancedVisible, setIsAdvancedVisible] = useState(false);

  useEffect(() => {
    // Fetch delivered notifications when app is resumed
    let appResumedListener: { remove: () => void }; // Type for the listener handle
    (async () => {
      const appResumed = async () => {
        try {
          refreshAuth(); // Refresh auth state when app resumes
          //const permissionStatus = await PushNotifications.checkPermissions();
          //setNotificationPermission(permissionStatus.receive);
        } catch (error) {
          console.error('Error refreshing auth:', error);
        }
      };
      appResumedListener = await App.addListener('resume', appResumed);
    })();

    return () => {
      if (appResumedListener) {
        appResumedListener.remove();
      }
      console.log('login cleanup - all listeners removed');
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      if (activeTab === 'signup') {
        await handleCreate();
      } else {
        await handleLogin();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleLogin = async () => {
    setError(''); // Clear previous errors
    try {
      const user = await loginUser(email, password);
      console.log('Logged in user:', user);
    } catch (error: any) {
      console.error('Login failed', error);
      setError(error.code || 'Login failed. Please try again.');
    }
  };

  const handleCreate = async () => {
    setError('');

    try {
      const user = await registerUser(email, password);
      console.log('Created user:', user);

      try {
        await sendEmailVerification();
        console.log('Verification email sent successfully');
      } catch (emailError: any) {
        console.warn('Failed to send verification email', emailError);
        setError(emailError.code || 'Verification email could not be sent');
        // Note: User was still created successfully, so we don't return here
      }
    } catch (registrationError: any) {
      console.error('User creation failed', registrationError);
      setError(registrationError.code || 'Account creation failed');
      return;
    }
  };

  const handleForgotPassword = async () => {
    setError(''); // Clear previous errors
    try {
      await resetPassword(email);
      setError(
        'Check your email and Spam folder for message with a link to reset your password.'
      );
      console.log('Reset Password for user:');
    } catch (error: any) {
      console.error('Reset Password failed', error);
      setError(error.code || 'Password reset failed.');
    }
  };

  const handleSignOut = async () => {
    setError(''); // Clear previous errors
    try {
      await logoutUser();
      console.log('Logging out');
    } catch (error: any) {
      console.error('Failed to log out', error);
      setError(error.code || 'Logout failed.');
    }
  };

  const handleSendVerification = async () => {
    setError(''); // Clear previous errors
    try {
      await sendEmailVerification();
      setError('Verification email sent! Check your inbox.');
    } catch (error: any) {
      console.error('Failed to resend verification email', error);
      setError(
        (error.code === 'auth/too-many-requests'
          ? 'Verification email already sent.  Wait a bit and try again if your email does not arrive in a few minutes'
          : error.code) || 'Resend verification failed.'
      );
    }
  };

  const handleSegmentChange = async (value: SegmentValue) => {
    setError(''); // Clear previous errors
    try {
      setActiveTab(value?.toString() || 'signup');
    } catch (error: any) {
      console.error('Failed to resend verification email', error);
      setError(error.code || 'Resend verification failed.');
    }
  };

  const handleDeleteAccount = async () => {
    setError(''); // Clear previous errors
    try {
      await deleteUser();
      console.log('Deleted user');
      setError('Your account has been deleted successfully.');
    } catch (error: any) {
      console.error('Delete User failed', error);
      setError(
        (error.code === 'auth/requires-recent-login'
          ? 'It has been too long since your last sign in to delete your account.  You must sign out and sign in again to delete your account'
          : error.code) || 'User Account deletion failed.'
      );
    }
  };

  const onToggleAdvanced = async () => {
    checkVibrate(
      async () => await Haptics.impact({ style: ImpactStyle.Medium })
    );
    setIsAdvancedVisible((prev) => !prev);
  };

  const handleRefresh = useRefreshHandler(refreshAuth);

  if (user) {
    return (
      <IonPage>
        <PageHeader title={user ? 'Your Profile' : 'Sign In'} />
        <IonContent className="ion-padding">
          <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
            <IonRefresherContent />
          </IonRefresher>
          <div className={styles.container}>
            <div className={styles.wrapper}>
              <div className={styles.header}>
                {user.displayName && (
                  <h2 className={styles.title}>Welcome, {user.displayName}!</h2>
                )}
              </div>

              <div className={styles.content}>
                <IonCard>
                  <IonCardContent>
                    <div className={styles.userInfo}>
                      <p className={styles.userInfoText}>
                        <strong>Email:</strong> {user.email}
                      </p>
                      <p className={styles.userInfoText}>
                        <strong>Status:</strong>{' '}
                        {user.emailVerified ? (
                          <span className={styles.verifiedStatus}>
                            Verified
                          </span>
                        ) : (
                          <span className={styles.pendingStatus}>
                            Pending Verification
                          </span>
                        )}
                      </p>
                    </div>

                    {!user.emailVerified && (
                      <div>
                        <p className={styles.verificationText}>
                          Click the button below to receive a verification link
                          via email.
                        </p>
                        {error && (
                          <IonText color="danger" className={styles.error}>
                            {error}
                          </IonText>
                        )}
                        <IonButton
                          expand="block"
                          onClick={handleSendVerification}
                          disabled={loading}
                        >
                          <IonIcon className={styles.icon} icon={mailOutline} />
                          Send Verification Email
                        </IonButton>
                      </div>
                    )}

                    <IonButton
                      expand="block"
                      color="medium"
                      onClick={handleSignOut}
                      className={styles.submitButton}
                    >
                      <IonIcon className={styles.icon} icon={logOutOutline} />
                      Sign Out
                    </IonButton>
                  </IonCardContent>
                </IonCard>
                <PreferencesCard />
                <IonCard>
                  <IonCardHeader onClick={() => onToggleAdvanced()}>
                    <IonCardSubtitle>Advanced</IonCardSubtitle>
                  </IonCardHeader>
                  <IonCardContent>
                    <IonButton
                      expand="block"
                      onClick={onToggleAdvanced}
                      color={isAdvancedVisible ? 'primary' : 'medium'}
                      className={styles.toggleButton}
                    >
                      {isAdvancedVisible
                        ? 'Hide Advanced Options'
                        : 'Show Advanced Options'}
                    </IonButton>
                    {isAdvancedVisible && (
                      <IonButton
                        expand="block"
                        onClick={handleDeleteAccount}
                        color="danger"
                        disabled={loading}
                      >
                        <IonIcon className={styles.icon} icon={trashBin} />
                        Delete My Account
                      </IonButton>
                    )}
                  </IonCardContent>
                </IonCard>
              </div>
            </div>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <PageHeader title={user ? 'Your Profile' : 'Sign In'} />
      <IonContent className="ion-padding">
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent />
        </IonRefresher>
        <div className={styles.container}>
          <div className={styles.wrapper}>
            <div className={styles.header}>
              <div className={styles.iconWrapper}>
                {activeTab === 'signup' ? (
                  <IonIcon icon={personAddOutline} />
                ) : (
                  <IonIcon icon={logInOutline} />
                )}
              </div>
              <h2 className={styles.title}>
                {activeTab === 'signup'
                  ? 'Create your account'
                  : 'Welcome back'}
              </h2>
              <p className={styles.subtitle}>
                {activeTab === 'signup'
                  ? 'Join today'
                  : 'Sign in to access your account'}
              </p>
            </div>

            <div className={styles.content}>
              <IonSegment
                value={activeTab}
                onIonChange={(e) => handleSegmentChange(e.detail.value!)}
                className={styles.segment}
              >
                <IonSegmentButton value="signup">
                  <IonLabel>Sign Up</IonLabel>
                </IonSegmentButton>
                <IonSegmentButton value="login">
                  <IonLabel>Login</IonLabel>
                </IonSegmentButton>
              </IonSegment>

              <IonCard>
                <IonCardContent>
                  {(error || authError) && (
                    <IonText color="danger" className={styles.error}>
                      {error || authError}
                    </IonText>
                  )}

                  <IonItem>
                    <IonInput
                      label="Email address"
                      labelPlacement="floating"
                      type="email"
                      value={email}
                      onIonInput={(e) =>
                        setEmail(e.target.value?.toString() || '')
                      }
                      disabled={loading}
                    />
                  </IonItem>

                  <IonItem>
                    <IonInput
                      label="Password"
                      labelPlacement="floating"
                      type="password"
                      value={password}
                      onIonInput={(e) =>
                        setPassword(e.target.value?.toString() || '')
                      }
                      disabled={loading}
                    />
                  </IonItem>

                  <div>
                    <IonButton
                      expand="block"
                      onClick={(e) => handleSubmit(e)}
                      className={styles.submitButton}
                      disabled={loading}
                    >
                      {loading
                        ? 'Please wait...'
                        : activeTab === 'signup'
                        ? 'Create Account'
                        : 'Sign in'}
                    </IonButton>
                  </div>

                  {activeTab === 'login' && (
                    <div className={styles.forgotPassword}>
                      <a
                        onClick={handleForgotPassword}
                        className={styles.forgotPasswordLink}
                      >
                        Forgot your password?
                      </a>
                    </div>
                  )}
                </IonCardContent>
              </IonCard>
              <PreferencesCard />
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Login;
