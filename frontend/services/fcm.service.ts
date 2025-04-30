import messaging from "@react-native-firebase/messaging";
import { PermissionsAndroid } from "react-native";
import { showLocalNotification } from "./notification.service";
import { store } from "../redux/store";

class FCMService {
  currentToken: null | string;
  constructor() {
    this.currentToken = null;
  }

  async init(userId: Number) {
    await this._requestPermission();
    await this._registerToken();
    this._setupListener();
    this._setupTokenRefreshListener();
  }

  async _requestPermission() {
    try {
      PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
      );
    } catch (error) {
      console.error("Lỗi quyền xin thông báo:", error);
    }
  }

  async _registerToken() {
    try {
      const state = store.getState();
      const userId = state.user?.user_id;
      if (!userId) {
        console.log("No User ID");
        return;
      }
      await messaging().registerDeviceForRemoteMessages();
      const token = await messaging().getToken();
      if (token !== this.currentToken) {
        this.currentToken = token;
        await this._sendTokenToBackend(token, userId);
      }
    } catch (error) {
      console.error("Lỗi đăng ký FCM Token:", error);
    }
  }

  _setupTokenRefreshListener() {
    messaging().onTokenRefresh(async (newToken) => {
      try {
        const state = store.getState();
        const userId = state.user?.user_id;
        if (newToken !== this.currentToken && userId) {
          console.log("Found new token:", newToken);
          this.currentToken = newToken;
          await this._sendTokenToBackend(newToken, userId);
        }
      } catch (error) {
        console.error("Lỗi xử lý refresh token:", error);
      }
    });
  }

  _setupListener() {
    messaging().onMessage(async (remoteMessage) => {
      await showLocalNotification(remoteMessage);
    });

    messaging().onNotificationOpenedApp((remoteMessage) => {
      this._handleNotificationClick(remoteMessage);
    });

    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage) this._handleNotificationClick(remoteMessage);
      });
  }

  _handleNotificationClick = (remoteMessage: any) => {
    console.log("Notification Clicked:", remoteMessage);
    if (remoteMessage.data.deviceId) {
      console.log(remoteMessage);
    }
  };

  _sendTokenToBackend = async (token: string, userId: Number | null) => {
    if (!userId) return;
    try {
      const response = await fetch(
        process.env.EXPO_PUBLIC_BACKEND_URL + "/notification/token/" + userId,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: token,
            userId: userId,
          }),
        }
      );

      if (response.ok) {
        console.log("Đã cập nhật thành công");
      }
    } catch (error) {
      console.error("Lỗi gửi token:", error);
    }
  };
}

export default new FCMService();
