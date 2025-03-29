import { Text, View, Button } from "react-native"; // Add Button import
import { useEffect } from "react";
import * as Notifications from "expo-notifications";

// Request notification permissions
async function requestPermissions() {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== "granted") {
    alert("Permission for notifications was denied");
  }
}

// Function to send a local notification
const sendNotification = async () => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Hello! 📢",
      body: "This is a local notification.",
      sound: true,
    },
    trigger: null, // Triggers immediately
  });
};

export default function Index() {
  // Set notification handler
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });

  useEffect(() => {
    requestPermissions();
  }, []);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* ✅ Removed extra "return" */}
      <Button title="Send Notification" onPress={sendNotification} />
    </View>
  );
}
