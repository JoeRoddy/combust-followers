import React, { Component, Fragment } from "react";
import { observer } from "mobx-react";
import { Text, View } from "react-native";

import nav from "../../helpers/NavigatorHelper";
import followerStore from "../../stores/FollowerStore";
import { colors } from "../../assets/styles/AppStyles";
import { Button, Header } from "../reusable";
import UserList from "../users/UserList";

@observer
export default class FollowersList extends Component {
  state = {
    displayFollowing: false //toggle to show followers/following
  };

  toggleMode = () =>
    this.setState({
      displayFollowing: !this.state.displayFollowing
    });

  render() {
    const { displayFollowing } = this.state;

    const users = displayFollowing
      ? followerStore.usersBeingFollowed
      : followerStore.followers;
    const userCount = Object.keys(users).length;
    const noUsers = userCount === 0;

    return (
      <View style={{ flex: 1 }}>
        <Header
          title={`${displayFollowing ? "Following" : "Followers"}${
            !noUsers ? ` (${userCount})` : ""
          }`}
          rightComponent={
            <Button
              backgroundColor="white"
              textStyle={{ color: colors.primary }}
              title={displayFollowing ? "Followers" : "Following"}
              onPress={this.toggleMode}
            />
          }
        />
        {noUsers ? (
          <FindFollowers displayFollowing={displayFollowing} />
        ) : (
          <UserList
            users={users}
            onUserPressed={user => nav.navigate("Profile", { id: user.id })}
          />
        )}
      </View>
    );
  }
}

const FindFollowers = ({ displayFollowing }) => (
  <Fragment>
    <Text style={{ margin: 10 }}>
      {displayFollowing
        ? "You're not following anyone yet"
        : "You don't have any followers yet"}
    </Text>
    {displayFollowing && (
      <Button
        title="Follow Someone"
        onPress={() => nav.navigate("UserSearch")}
      />
    )}
  </Fragment>
);
