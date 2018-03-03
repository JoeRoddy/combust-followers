import firebase from "firebase";

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
