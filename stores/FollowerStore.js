import { observable, computed } from "mobx";

import followerDb from "../db/FollowerDb";
import userStore from "./UserStore";

class FollowerStore {
  init() {
    userStore.onLogin(this.performInitialLoad.bind(this));
    userStore.onLogout(this.onUserLogout.bind(this));
  }

  @observable followedIdsMap = new Map();
  @observable followerIdsMap = new Map();

  isInitialLoadComplete = false;
  performInitialLoad(user) {
    if (this.isInitialLoadComplete) {
      return;
    }
    followerDb.listenToFollowerIds(user.id, (err, followerId) => {
      err ? console.log(err) : this.storeFollower(followerId);
    });
    followerDb.listenToFollowedIds(user.id, (err, influencerId) => {
      err ? console.log(err) : this.storeFollowed(influencerId);
    });
    this.isInitialLoadComplete = true;
  }

  storeFollower(userId) {
    userStore.getUserById(userId); //apply listener
    this.followerIdsMap.set(userId, true);
  }

  storeFollowed(userId) {
    userStore.getUserById(userId); //apply listener
    this.followedIdsMap.set(userId, true);
  }

  isFollower(userId) {
    return this.followerIdsMap.has(userId);
  }

  isFollowing(userId) {
    return this.followedIdsMap.has(userId);
  }

  followUser(influencerId) {
    followerDb.followUser(influencerId, userStore.userId);
  }

  unfollowUser(influencerId) {
    followerDb.unfollowUser(influencerId, userStore.userId);
  }

  @computed
  get followers() {
    let followers = {};
    Array.from(this.followerIdsMap.keys()).forEach(uid => {
      followers[uid] = userStore.getUserById(uid);
    });
    return followers;
  }

  @computed
  get usersBeingFollowed() {
    let usersBeingFollowed = {};
    Array.from(this.followedIdsMap.keys()).forEach(uid => {
      usersBeingFollowed[uid] = userStore.getUserById(uid);
    });
    return usersBeingFollowed;
  }

  onFollowerClickedTriggers = [];
  onFollowerClicked = func => {
    this.onFollowerClickedTriggers.push(func);
  };

  handleFollowerClick = follower => {
    this.onFollowerClickedTriggers.length > 0
      ? this.onFollowerClickedTriggers.forEach(event => {
          event(follower);
        })
      : alert(
          "follower clicked, add the chat module or create your own handler.\n\nie: \nfollowerStore.onfollowerClicked(follower =>{\n\talert('do stuff'))\n}"
        );
  };

  onUserLogout(user) {
    this.followedIdsMap.clear();
    this.followerIdsMap.clear();
    this.isInitialLoadComplete = false;
  }
}

const followerStore = new FollowerStore();
export default followerStore;
