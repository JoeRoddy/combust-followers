import firebase from "firebase";

class FollowersService {
  followUser(influencerId, uid) {
    this.setFollowed(influencerId, uid, true);
  }

  unfollowUser(influencerId, uid) {
    this.setFollowed(influencerId, uid, false);
  }

  setFollowed(friendId, uid, isFollowed) {
    firebase
      .database()
      .ref("followerIdsByUser/" + friendId)
      .child(uid)
      .set(isFollowed ? true : null);
    firebase
      .database()
      .ref("followedIdsByUser/" + uid)
      .child(friendId)
      .set(isFollowed ? true : null);
  }

  listenToFollowers(userId, callback) {
    this.listenToFollowerIds(userId, (err, friendId) => {
      this.listenToUser(friendId, callback);
    });
  }

  listenToFollowed(userId, callback) {
    this.listenToFollowedIds(userId, (err, friendId) => {
      this.listenToUser(friendId, callback);
    });
  }

  listenToFollowerIds(userId, callback) {
    firebase
      .database()
      .ref("followerIdsByUser")
      .child(userId)
      .on("child_added", snap => {
        callback(null, snap.key);
      });
  }

  listenToFollowedIds(userId, callback) {
    firebase
      .database()
      .ref("followedIdsByUser")
      .child(userId)
      .on("child_added", snap => {
        callback(null, snap.key);
      });
  }

  listenToUser(userId, callback) {
    firebase
      .database()
      .ref("users/publicInfo/" + userId)
      .on("value", snapshot => {
        let user = snapshot.val();
        if (!user) {
          return callback("no userdata found for follower w/id: " + userId);
        }
        user.id = userId;
        callback(null, user);
      });
  }
}

const followersService = new FollowersService();

export default followersService;
