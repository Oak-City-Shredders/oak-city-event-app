import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import About from '../pages/About';
import DripSchedule from '../pages/DripSchedule';
import EmergencyServices from '../pages/EmergencyServices';
import FoodTrucks from '../pages/FoodTrucks';
import Home from '../pages/Home';
import Login from '../pages/Login';
import MapPage from '../pages/MapPage';
import Notifications from '../pages/Notifications';
import QuestsPage from '../pages/Quests';
import Raceing from '../pages/Racing';
import RacerProfile from '../pages/RacerProfile';
import Raffles from '../pages/Raffles';
import ScavengerHunt from '../pages/ScavengerHunt';
import SchedulePage from '../pages/SchedulePage';
import TrickCompPage from '../pages/TrickComp';
import Team from '../pages/Team';
import Sponsors from '../pages/Sponsors';
import FireBaseAppCheckPage from '../pages/FireBaseAppCheckPage';
import TicketsPage from '../pages/TicketsPage';

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
