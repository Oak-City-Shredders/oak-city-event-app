import React, { useState, useEffect } from 'react';
import {
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton,
  IonBadge,
  IonSkeletonText,
  IonIcon,
  IonLabel,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonCardSubtitle,
  IonList,
  IonItem,
} from '@ionic/react';
import { calendar, person, ticket, ticketOutline } from 'ionicons/icons';
import { useAuth } from '../context/AuthContext';
import styles from './TicketsPage.module.css';
import useFireStoreDB from '../hooks/useFireStoreDB';
import PageHeader from '../components/PageHeader';
import { useRefreshHandler } from '../hooks/useRefreshHandler';

interface FireDBTickets {
  id: string;
  ['Customer Email']: string;
  ['Product Name']: string;
  ['Quantity']: string;
  ['Display Name']: string;
  ['Order Number']: string;
  ['Created On']: string;
  ['Name']: string;
}

interface Ticket {
  id: string;
  type: 'general' | 'vip' | 'pit-pass';
  orderId: string;
  userId: string;
  purchaseDate: string;
  quantity: number;
  ticketName: string;
  title: string;
}

const TicketsPage: React.FC = () => {
  const { user } = useAuth();
  const {
    data: ticketData,
    loading,
    error,
    refetch,
  } = useFireStoreDB<FireDBTickets>(
    'Tickets-alpha3',
    undefined,
    [{ field: 'Customer Email', operator: '==', value: user?.email }],
    [!!user]
  );
  const handleRefresh = useRefreshHandler(refetch);

  const tickets = ticketData
    ? (ticketData.map((ticket) => ({
        id: ticket.id,
        title: ticket['Product Name'],
        type: ticket['Product Name'].toLocaleLowerCase().includes('vip')
          ? 'vip'
          : 'general',
        orderId: ticket['Order Number'],
        userId: user?.uid || '',
        purchaseDate: ticket['Created On'],
        quantity: Number(ticket['Quantity']) || 0,
        ticketName: ticket['Display Name']
          ? ticket['Display Name']
          : ticket['Name'],
      })) as Ticket[])
    : [];

  return (
    <IonPage>
      <PageHeader title="Tickets" />

      <IonContent className="ion-padding">
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent />
        </IonRefresher>
        {loading ? (
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>
                <IonSkeletonText animated style={{ width: '60%' }} />
              </IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonSkeletonText
                animated
                style={{ width: '100%', height: '100px' }}
              />
            </IonCardContent>
          </IonCard>
        ) : error ? (
          <IonCard>
            <IonCardHeader>
              <IonCardTitle color={'danger'} className={styles.title}>
                <IonIcon icon={ticket} className={styles.iconGray} />
                <p>Error loading tickets</p>
              </IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <p className={styles.message}>{error.message}</p>
            </IonCardContent>
          </IonCard>
        ) : !user ? (
          <IonCard>
            <IonCardHeader>
              <IonCardTitle className={styles.title}>
                <IonIcon icon={ticket} className={styles.iconGray} />
                Sign In Required
              </IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <p className={styles.message}>
                Please sign in to view your tickets.
              </p>
              <IonButton expand="block" routerLink="/login">
                Sign In
              </IonButton>
            </IonCardContent>
          </IonCard>
        ) : !user.emailVerified ? (
          <IonCard>
            <IonCardHeader>
              <IonCardTitle className={styles.title}>
                <IonIcon icon={ticket} className={styles.iconWarning} />
                Verify Email to View Tickets
              </IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <p className={styles.message}>
                You may have tickets associated with your account. Please verify
                your email to view the details.
              </p>
              <IonButton expand="block" color="warning" routerLink="/login">
                Verify Email to Continue
              </IonButton>
            </IonCardContent>
          </IonCard>
        ) : tickets.length === 0 ? (
          <IonCard>
            <IonCardHeader>
              <IonCardTitle className={styles.title}>
                <IonIcon icon={ticket} className={styles.iconGray} />
                No Tickets Found
              </IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <p className={styles.message}>
                You don't have any tickets associated with your account.
              </p>
              <IonButton
                expand="block"
                href="https://www.oakcityshredfest.com/"
              >
                Get Your Tickets
              </IonButton>
            </IonCardContent>
          </IonCard>
        ) : (
          <div className={styles.ticketList}>
            <IonCard className="ion-padding">
              <IonCardSubtitle>Your tickets are below</IonCardSubtitle>
              <IonList lines={'none'}>
                <IonItem>
                  <IonIcon
                    aria-hidden="true"
                    icon={ticketOutline}
                    slot="start"
                  />
                  <IonLabel>Showing tickets linked to {user.email}</IonLabel>
                </IonItem>
              </IonList>
            </IonCard>
            {tickets.map((ticket) => {
              return (
                <IonCard key={ticket.id} className={styles.ticket}>
                  <IonCardContent>
                    <div className={styles.ticketHeader}>
                      <h3 className={styles.ticketTitle}>{ticket.title}</h3>
                      {ticket.type === 'vip' && (
                        <IonBadge color={'warning'} className={styles.badge}>
                          {ticket.type}
                        </IonBadge>
                      )}
                    </div>
                    <div className={styles.ticketInfo}>
                      <div className={styles.infoRow}>
                        <IonIcon
                          slot="start"
                          icon={calendar}
                          className={styles.infoIcon}
                        />
                        <IonLabel>Purchase Date: </IonLabel>
                        {new Date(ticket.purchaseDate).toLocaleDateString()}
                      </div>
                      <div className={styles.infoRow}>
                        <IonIcon icon={person} className={styles.infoIcon} />
                        {ticket.ticketName}
                      </div>
                      <div className={styles.infoRow}>
                        <IonIcon
                          icon={ticketOutline}
                          className={styles.infoIcon}
                        />
                        {ticket.orderId}
                      </div>
                    </div>
                    {ticket.quantity > 1 && (
                      <div className={styles.price}>Qty {ticket.quantity}</div>
                    )}
                  </IonCardContent>
                </IonCard>
              );
            })}
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default TicketsPage;
