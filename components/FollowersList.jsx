import React from "react";
import { observer } from "mobx-react";

import followerStore from "../../stores/FollowerStore";
import userStore from "../../stores/UserStore";
import UserList from "../users/UserList";

const FollowersList = observer(
  ({ displayFollowers, displayFollowing, history }) => {
    const users = displayFollowing
      ? followerStore.usersBeingFollowed
      : followerStore.followers;

    return (
      <UserList
        title="Friends"
        users={users}
        onUserClicked={() => history.push("/profile/" + userStore.userId)}
      />
    );
  }
);

export default FollowersList;
