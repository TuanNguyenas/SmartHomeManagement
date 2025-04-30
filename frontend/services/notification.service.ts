import notifee from "@notifee/react-native";

export const showLocalNotification = async (remoteMessage: any) => {
  const channelId = await notifee.createChannel({
    id: "default",
    name: "Default Channel",
  });

  await notifee.displayNotification({
    title: remoteMessage.notification?.title || "Thông báo mới",
    body: remoteMessage.notification?.body || "Cập nhật trạng thái thiết bị",
    android: {
      channelId,
      // smallIcon: "ic_notification",
      pressAction: {
        id: "default",
      },
    },
    data: remoteMessage.data,
  });
};
