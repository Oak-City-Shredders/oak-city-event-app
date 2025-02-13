import { useState } from 'react';
import { loginUser, registerUser, resetPassword, logoutUser } from '../auth';
import {
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButton,
  IonInput,
  IonItem,
  IonLabel,
  IonPage,
  IonContent,
  IonText,
} from '@ionic/react';
import { useAuth } from '../context/AuthContext';
import PageHeader from '../components/PageHeader';

const Login: React.FC = () => {
  const { user, loading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string>('');

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
    setError(''); // Clear previous errors
    try {
      const user = await registerUser(email, password);
      console.log('Created user:', user);
    } catch (error: any) {
      console.error('Create User failed', error);
      setError(error.code || 'Account creation failed.');
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

  return (
    <IonPage>
      <PageHeader title={user ? 'Your Profile' : 'Sign In'} />
      <IonContent className="ion-padding">
        {user ? (
          <>
            <IonLabel position="floating">{user.email}</IonLabel>
            <IonButton expand="full" onClick={handleSignOut}>
              Sign Out
            </IonButton>
          </>
        ) : (
          <>
            <IonItem>
              <IonInput
                placeholder="Email"
                type="email"
                value={email}
                onIonInput={(e: any) => setEmail(e.target.value)}
              />
            </IonItem>
            <IonItem>
              <IonInput
                type="password"
                value={password}
                placeholder="Password"
                onIonInput={(e: any) => setPassword(e.target.value)}
              />
            </IonItem>

            {error && (
              <IonText color="danger">
                <p>{error}</p>
              </IonText>
            )}

            <IonButton expand="full" onClick={handleLogin}>
              Login
            </IonButton>
            <IonButton expand="full" onClick={handleCreate}>
              Create User
            </IonButton>
            <IonButton expand="full" onClick={handleForgotPassword}>
              Forgot Password
            </IonButton>
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Login;
