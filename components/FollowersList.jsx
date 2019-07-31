import React from "react";
import { observer } from "mobx-react";

import followerStore from "../../stores/followerStore";
import UserList from "../users/UserList";

const FollowersList = observer(({ displayFollowing, history }) => {
  const users = displayFollowing
    ? followerStore.usersBeingFollowed
    : followerStore.followers;

  return (
    <UserList
      title="Friends"
      users={users}
      onUserClicked={user => history.push("/profile/" + user.id)}
    />
  );
});

export default FollowersList;
