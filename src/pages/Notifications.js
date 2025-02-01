import React from "react";
import Container from "@mui/material/Container";
import Breadcrumb from "../components/Breadcrumb";
import useDeliveredNotifications from "../hooks/useDeliveredNotifications"; 


const NotificationsPage = ({ notifications }) => {

  const { deliveredNotifications } = useDeliveredNotifications(); 
  
  return (
    <Container>
      <Breadcrumb name={"Notifications"} />
      <div>
      <h1>Delivered Notifications</h1>
      {deliveredNotifications.length > 0 ? deliveredNotifications.map((notification) => (
        <div key={notification.id}>
          <strong>{notification.title}</strong>: {notification.body}
        </div>
      )) : <p>No notifications</p>}
    </div>
      <div>
      <h1>Notifications</h1>
      {notifications.length > 0 ? notifications.map((notification) => (
        <div key={notification.id}>
          <strong>{notification.title}</strong>: {JSON.stringify(notification)}
        </div>
      )) : <p>No notifications</p>}
    </div>
    </Container>
  );
};



export default NotificationsPage;
