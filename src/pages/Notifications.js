import React from "react";
import Container from "@mui/material/Container";
import Breadcrumb from "../components/Breadcrumb";

const NotificationsPage = ({ notifications  }) => {

  return (
    <Container>
      <Breadcrumb name={"Notifications"} />
      <div>
      <h1>Notifications</h1>
      {notifications.length > 0 ? notifications.map((notification) => (
        <div key={notification.id}>
          <strong>{notification.title}</strong>
        </div>
      )) : <p>No notifications</p>}
    </div>
    </Container>
  );
};

export default NotificationsPage;
