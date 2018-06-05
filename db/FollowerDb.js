import firebase from "firebase";

import notificationDb from "./NotificationDb";

class FollowerDb {
  followUser(influencerId, uid) {
    this.setFollowed(influencerId, uid, true);
  }

  unfollowUser(influencerId, uid) {
    this.setFollowed(influencerId, uid, false);
  }

  setFollowed(friendId, uid, isFollowed) {
    firebase
      .database()
      .ref("followers/followerIdsByUser/" + friendId)
      .child(uid)
      .set(isFollowed ? true : null);
    firebase
      .database()
      .ref("followers/followedIdsByUser/" + uid)
      .child(friendId)
      .set(isFollowed ? true : null);
    if (isFollowed) {
      _createNewFollowerNotif(friendId, uid, "You have a new follower!");
    }
  }

  listenToFollowerIds(userId, callback) {
    firebase
      .database()
      .ref("followers/followerIdsByUser")
      .child(userId)
      .on("child_added", snap => {
        callback(null, snap.key);
      });
  }

  listenToFollowedIds(userId, callback) {
    firebase
      .database()
      .ref("followers/followedIdsByUser")
      .child(userId)
      .on("child_added", snap => {
        callback(null, snap.key);
      });
  }
}

const followerDb = new FollowerDb();

export default followerDb;

const _createNewFollowerNotif = function(receiverId, userId, notifBody) {
  notificationDb.createNotification(
    {
      type: "new_follower",
      body: notifBody,
      link: "/profile/" + userId
    },
    receiverId,
    userId
  );
};
