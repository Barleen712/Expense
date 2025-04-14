// import notifee, { AndroidImportance } from "@notifee/react-native";

// export const onDisplayNotification = async ({ title, body }: { title: string; body: string }) => {
//   try {
//     const channelId = await notifee.createChannel({
//       id: "default",
//       name: "Default Channel",
//       importance: AndroidImportance.MAX,
//     });

//     await notifee.displayNotification({
//       title: title,
//       body: body,
//       android: {
//         channelId,
//         smallIcon: "ic_launcher",
//         pressAction: {
//           id: "default",
//         },
//         importance: AndroidImportance.MAX,
//         sound: "default",
//       },
//     });
//   } catch (error) {
//     console.log("Notification error:", error);
//   }
// };
