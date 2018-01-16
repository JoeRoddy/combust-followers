import React from "react";
import { observer } from "mobx-react";

import followerStore from "../../stores/FollowerStore";
import UserList from "../users/UserList";
import chatStore from "../../stores/ChatStore";

followerStore.onFollowerClicked(user => {
  chatStore.openConversationWithUser(user.id);
});

const FollowersList = observer(({ displayFollowers, displayFollowing }) => {
  const users = displayFollowing
    ? followerStore.usersBeingFollowed
    : followerStore.followers;

  return (
    <UserList
      title="Friends"
      users={users}
      onUserClicked={followerStore.handleFollowerClick}
    />
  );
});

export default FollowersList;
