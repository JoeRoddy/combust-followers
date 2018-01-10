import React from "react";
import { observer } from "mobx-react";

import followersStore from "../../stores/FollowersStore";
import UserList from "../users/UserList";
import chatStore from "../../stores/ChatStore";

followersStore.onFollowerClicked(user => {
  chatStore.openConversationWithUser(user.id);
});

const FollowersList = observer(({ displayFollowers, displayFollowing }) => {
  const users = displayFollowing
    ? followersStore.usersBeingFollowed
    : followersStore.followers;

  return (
    <UserList
      title="Friends"
      users={users}
      onUserClicked={followersStore.handleFollowerClick}
    />
  );
});

export default FollowersList;
