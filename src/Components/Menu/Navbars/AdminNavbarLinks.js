import React from "react";
import NotificationList from "./NotificationList";
import ProfileButton from "./ProfileButton";

export default function AdminNavbarLinks({ logout, openProfilePageClick }) {


  const storageUser = showLocalStorage("user");
  let user = storageUser.userLogin;


  return (
    <>
      {user?.Id != null &&
        <div>
          <NotificationList />
          <ProfileButton logout={logout}
            openProfilePageClick={openProfilePageClick} />
        </div>
      }
    </>
  );
}
