import React, { Suspense, lazy } from 'react';
import { Redirect, Route } from 'react-router-dom';
import { IonLoading, IonRouterOutlet } from '@ionic/react';
import FullPageLoader from './FullPageLoader';

// Lazy-loaded pages
const About = lazy(() => import('../pages/About'));
const DripSchedule = lazy(() => import('../pages/DripSchedule'));
const EmergencyServices = lazy(() => import('../pages/EmergencyServices'));
const FoodTrucks = lazy(() => import('../pages/FoodTrucks'));
const Home = lazy(() => import('../pages/Home'));
const Login = lazy(() => import('../pages/Login'));
const MapPage = lazy(() => import('../pages/MapPage'));
const Notifications = lazy(() => import('../pages/Notifications'));
const QuestsPage = lazy(() => import('../pages/Quests'));
const Raceing = lazy(() => import('../pages/Racing'));
const RacerProfile = lazy(() => import('../pages/RacerProfile'));
const Raffles = lazy(() => import('../pages/Raffles'));
const ScavengerHunt = lazy(() => import('../pages/ScavengerHunt'));
const SchedulePage = lazy(() => import('../pages/SchedulePage'));
const TrickCompPage = lazy(() => import('../pages/TrickComp'));
const Team = lazy(() => import('../pages/Team'));
const Sponsors = lazy(() => import('../pages/Sponsors'));
const FireBaseAppCheckPage = lazy(
  () => import('../pages/FireBaseAppCheckPage')
);
const TicketsPage = lazy(() => import('../pages/TicketsPage'));

interface AppRoutesProps {
  notifications?: any[];
  removeNotification?: (notification: any) => void;
}

const AppRoutes: React.FC<AppRoutesProps> = ({
  notifications = [],
  removeNotification = () => {},
}) => {
  return (
    <>
      <Route path="/racer-profile/:racerId">
        <RacerProfile />
      </Route>
      <Route path="/about">
        <About />
      </Route>
      <Route path="/drip-schedule">
        <DripSchedule />
      </Route>
      <Route path="/app-check">
        <FireBaseAppCheckPage />
      </Route>
      <Route path="/emergency-services">
        <EmergencyServices />
      </Route>
      <Route path="/food-trucks">
        <FoodTrucks />
      </Route>
      <Route exact path="/home">
        <Home
          notifications={notifications}
          removeNotification={removeNotification}
        />
      </Route>
      <Route exact path="/login" component={Login} />
      <Route exact path="/map/:locationName?">
        <MapPage />
      </Route>
      <Route path="/notifications">
        <Notifications notifications={notifications} />
      </Route>
      <Route path="/quests/:questId">
        <QuestsPage />
      </Route>
      <Route path="/quests">
        <QuestsPage />
      </Route>
      <Route path="/tickets">
        <TicketsPage />
      </Route>
      <Route path="/race-information">
        <Raceing />
      </Route>
      <Route path="/raffles-giveaways">
        <Raffles />
      </Route>
      <Route path="/schedule">
        <SchedulePage />
      </Route>
      <Route path="/scavenger-hunt">
        <ScavengerHunt />
      </Route>
      <Route path="/trick-comp">
        <TrickCompPage />
      </Route>
      <Route path="/team">
        <Team />
      </Route>
      <Route path="/sponsors">
        <Sponsors />
      </Route>
      <Route exact path="/">
        <Redirect to="/home" />
      </Route>
    </>
  );
};

export default AppRoutes;
