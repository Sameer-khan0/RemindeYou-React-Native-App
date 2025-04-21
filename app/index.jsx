import { View, Text, Button, StyleSheet } from "react-native";
import React, { useEffect } from "react";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";

export default function index() {
  const blinkColor = useSharedValue(0.5);
  const mouth = useSharedValue(200);
  const offset = useSharedValue(1);
  const offset1 = useSharedValue(1);

  const animation = useAnimatedStyle(() => {
    return {
      transform: [{ scale: offset.value }]
    };
  });

  const FaceAnimation = useAnimatedStyle(()=>{
    return{
      borderRadius: mouth.value,
    }
  })

  const EyeBlink = useAnimatedStyle(()=>{
    return{
      borderWidth: blinkColor.value
    }
  })

  const animation1 = useAnimatedStyle(()=>{
    return {
      transform: [{scale: offset1.value}]
    }
  })

  useEffect(() => {
    offset.value = withSpring(19);
    offset1.value = withSpring(3, {}, () => {
      blinkColor.value = withSpring(1);
      mouth.value = withSpring(1)
    });
  }, []);

  const moveBox = () => {
    offset.value = withSpring(offset.value === 1 ? 10 : 1); // move right or reset
  };

  return (
    <View style={styles.container}>
      <Text>index</Text>
      <Animated.View style={[styles.box, animation]} />
      <Animated.View style={[styles.face, animation1]}>
        {/* Eyes */}
        <Animated.View style={[styles.eye, { left: 25 }, EyeBlink]} />
        <Animated.View style={[styles.eye, { right: 25 }, EyeBlink]} />

        {/* Smile */}
        <Animated.View style={[styles.smile, FaceAnimation]} >
          {/* <Animated.View style={{width:15,height:20, backgroundColor:"red", left:0}} /> */}
        </Animated.View>
      </Animated.View>
    </View>
  );

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    position: "relative",
    alignItems: "center",
  },
  box: {
    width: 100,
    height: 100,
    backgroundColor: "green",
    position:"absolute",
    borderRadius: "100%",
    marginBottom: 30,
  },
  face: {
    width: 100,
    height: 100,
    backgroundColor: 'yellow',
    borderRadius: 100,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'black',
    borderWidth: 0,
  },
  eye: {
    width: 15,
    height: 15,
    borderRadius: 100,
    borderWidth: 2,
    backgroundColor: "white",
    borderColor: 'black',
    position: 'absolute',
    top: 30,
  },
  smile: {
    width: 50,
    height: 20,
    borderWidth: 1,
    borderColor: 'black',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    position: 'absolute',
    bottom: 20,
    backgroundColor: 'white',
  },
});

// import { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   Platform,
//   useColorScheme,
//   FlatList,
//   Modal,
//   TextInput,
//   Alert,
//   StatusBar,
//   Button,
// } from "react-native";
// import DateTimePicker from "@react-native-community/datetimepicker";
// import * as Notifications from "expo-notifications";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { LinearGradient } from "expo-linear-gradient";
// import Icon from "react-native-vector-icons/Ionicons";
// import { useRouter } from "expo-router";

// async function setupNotificationChannel() {
//   if (Platform.OS === "android") {
//     await Notifications.setNotificationChannelAsync("reminders", {
//       name: "Reminders",
//       importance: Notifications.AndroidImportance.HIGH,
//       sound: "default",
//       vibrationPattern: [0, 250, 250, 250],
//       enableVibrate: true,
//     });
//   }
// }

// async function requestPermissions() {
//   const { status } = await Notifications.requestPermissionsAsync();
//   if (status !== "granted") {
//     alert("Notification permissions are required for reminders");
//     return false;
//   }
//   return true;
// }

// Notifications.setNotificationHandler({
//   handleNotification: async () => ({
//     shouldShowAlert: true,
//     shouldPlaySound: true,
//     shouldSetBadge: true,
//   }),
// });

// const listScheduledNotifications = async () => {
//   const scheduledNotifications =
//     await Notifications.getAllScheduledNotificationsAsync();
//   console.log("Scheduled Notifications:", scheduledNotifications);
// };

// export default function ReminderApp() {
//   const router = useRouter()
//   const [reminders, setReminders] = useState([]);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [date, setDate] = useState(new Date());
//   const [tempDate, setTempDate] = useState(new Date());
//   const [reminderText, setReminderText] = useState("");
//   const [showDatePicker, setShowDatePicker] = useState(false);
//   const [showTimePicker, setShowTimePicker] = useState(false);
//   const colorScheme = useColorScheme();
//   const isDarkMode = colorScheme === "dark";

//   const removeExpiredReminders = async () => {
//     const now = new Date().getTime();
//     const scheduledNotifications =
//       await Notifications.getAllScheduledNotificationsAsync();

//     for (let notification of scheduledNotifications) {
//       if (notification.trigger.value < now) {
//         await Notifications.cancelScheduledNotificationAsync(
//           notification.identifier
//         );
//       }
//     }

//     // Reload reminders after cleaning up
//     await loadReminders();
//   };

//   // Call this inside `useEffect`
//   useEffect(() => {
//     removeExpiredReminders();
//   }, []);

//   useEffect(() => {
//     let notificationSubscription;
//     let responseSubscription;

//     const initialize = async () => {
//       await requestPermissions();
//       await setupNotificationChannel();

//       // Reset reminders based on scheduled notifications
//       await loadReminders();

//       // Listen for foreground notifications
//       notificationSubscription = Notifications.addNotificationReceivedListener(
//         (notification) => {
//           removeTriggeredReminder(notification.request.identifier);
//         }
//       );

//       // Listen for user interaction with notification
//       responseSubscription =
//         Notifications.addNotificationResponseReceivedListener((response) => {
//           removeTriggeredReminder(response.notification.request.identifier);
//         });
//     };

//     initialize();

//     return () => {
//       if (notificationSubscription) notificationSubscription.remove();
//       if (responseSubscription) responseSubscription.remove();
//     };
//   }, []);

//   const saveReminders = async (reminders) => {
//     await AsyncStorage.setItem("reminders", JSON.stringify(reminders));
//   };

//   const loadReminders = async () => {
//     try {
//       const scheduledNotifications =
//         await Notifications.getAllScheduledNotificationsAsync();

//       const remindersWithDates = scheduledNotifications.map((notification) => ({
//         id: notification.identifier,
//         text: notification.content.body,
//         time: new Date(notification.trigger.value), // Convert timestamp to Date object
//         dateString: new Date(notification.trigger.value).toLocaleDateString(),
//         timeString: new Date(notification.trigger.value).toLocaleTimeString(
//           [],
//           { hour: "2-digit", minute: "2-digit" }
//         ),
//       }));

//       setReminders(remindersWithDates);
//     } catch (error) {
//       console.log("Error loading reminders:", error);
//     }
//   };

//   const removeTriggeredReminder = async (id) => {
//     try {
//       // Cancel the notification
//       await Notifications.cancelScheduledNotificationAsync(id);

//       // Remove from local state
//       setReminders((prev) => prev.filter((reminder) => reminder.id !== id));

//       // Remove from AsyncStorage
//       const storedReminders = await AsyncStorage.getItem("reminders");
//       if (storedReminders) {
//         const parsedReminders = JSON.parse(storedReminders);
//         const updatedReminders = parsedReminders.filter(
//           (reminder) => reminder.id !== id
//         );
//         await AsyncStorage.setItem(
//           "reminders",
//           JSON.stringify(updatedReminders)
//         );
//       }
//     } catch (error) {
//       console.log("Error removing triggered reminder:", error);
//     }
//   };

//   const handleDateChange = (event, selectedDate) => {
//     setShowDatePicker(false);
//     if (selectedDate) {
//       setTempDate(selectedDate);
//       setShowTimePicker(true);
//     }
//   };

//   const handleTimeChange = (event, selectedTime) => {
//     setShowTimePicker(false);
//     if (selectedTime) {
//       const finalDate = new Date(tempDate);
//       finalDate.setHours(selectedTime.getHours());
//       finalDate.setMinutes(selectedTime.getMinutes());
//       finalDate.setSeconds(0);
//       setDate(finalDate);
//     }
//   };

//   const scheduleNotification = async () => {
//     if (!reminderText.trim()) {
//       alert("Please enter a reminder");
//       return;
//     }
//     const now = new Date();
//     if (date <= now) {
//       alert("Please select a future time");
//       return;
//     }

//     try {
//       const notificationId = Date.now().toString();

//       await Notifications.scheduleNotificationAsync({
//         content: {
//           title: reminderText+" ⏰",
//           body: "remimber about"+reminderText,
//           sound: "default",
//           data: { id: notificationId },
//         },
//         trigger: date,
//       });

//       const newReminder = {
//         id: notificationId,
//         text: reminderText,
//         time: date,
//         dateString: date.toLocaleDateString(),
//         timeString: date.toLocaleTimeString([], {
//           hour: "2-digit",
//           minute: "2-digit",
//         }),
//       };

//       // Add to both state and storage
//       setReminders((prev) => [...prev, newReminder]);
//       const storedReminders = await AsyncStorage.getItem("reminders");
//       const parsedReminders = storedReminders
//         ? JSON.parse(storedReminders)
//         : [];
//       await AsyncStorage.setItem(
//         "reminders",
//         JSON.stringify([...parsedReminders, newReminder])
//       );

//       setModalVisible(false);
//       setReminderText("");
//     } catch (error) {
//       alert("Failed to set reminder: " + error.message);
//     }
//   };

//   // Update your useEffect for initialization:
//   useEffect(() => {
//     let notificationSubscription;
//     let responseSubscription;

//     const initialize = async () => {
//       await requestPermissions();
//       await setupNotificationChannel();
//       await loadReminders();

//       notificationSubscription = Notifications.addNotificationReceivedListener(
//         (notification) => {
//           const triggeredId =
//             notification.request.content.data.id ||
//             notification.request.identifier;
//           removeTriggeredReminder(triggeredId);
//         }
//       );

//       responseSubscription =
//         Notifications.addNotificationResponseReceivedListener((response) => {
//           const triggeredId =
//             response.notification.request.content.data.id ||
//             response.notification.request.identifier;
//           removeTriggeredReminder(triggeredId);
//         });
//     };

//     initialize();

//     return () => {
//       if (notificationSubscription) notificationSubscription.remove();
//       if (responseSubscription) responseSubscription.remove();
//     };
//   }, []);

//   // Update your useEffect for initialization:
//   useEffect(() => {
//     let notificationSubscription;
//     let responseSubscription;

//     const initialize = async () => {
//       await requestPermissions();
//       await setupNotificationChannel();
//       await loadReminders();

//       notificationSubscription = Notifications.addNotificationReceivedListener(
//         (notification) => {
//           const triggeredId =
//             notification.request.content.data.id ||
//             notification.request.identifier;
//           removeTriggeredReminder(triggeredId);
//         }
//       );

//       responseSubscription =
//         Notifications.addNotificationResponseReceivedListener((response) => {
//           const triggeredId =
//             response.notification.request.content.data.id ||
//             response.notification.request.identifier;
//           removeTriggeredReminder(triggeredId);
//         });
//     };

//     initialize();

//     return () => {
//       if (notificationSubscription) notificationSubscription.remove();
//       if (responseSubscription) responseSubscription.remove();
//     };
//   }, []);

//   const deleteReminder = async (id) => {
//     Alert.alert(
//       "Delete Reminder",
//       "Are you sure you want to delete this reminder?",
//       [
//         { text: "Cancel", style: "cancel" },
//         {
//           text: "Delete",
//           onPress: async () => {
//             try {
//               // Cancel the notification first
//               await Notifications.cancelScheduledNotificationAsync(id);

//               // Then remove from local state and storage
//               const newReminders = reminders.filter(
//                 (reminder) => reminder.id !== id
//               );
//               setReminders(newReminders);
//               await saveReminders(newReminders);
//             } catch (error) {
//               alert("Failed to delete reminder: " + error.message);
//             }
//           },
//         },
//       ]
//     );
//   };

//   const formatDate = (date) => {
//     return (
//       date.toLocaleDateString() +
//       " " +
//       date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
//     );
//   };

//   return (
//     <LinearGradient
//       colors={isDarkMode ? ["#000000", "#333333"] : ["#ffffff", "#cccccc"]}
//       style={styles.container}
//     >
//       <StatusBar backgroundColor={isDarkMode ? "black" : "white"} />
//       <View style={styles.headerContainer}>
//       <Button title="Go to Sql page" onPress={() => router.push('/Sql')} />
//         <Text style={[styles.header, { color: isDarkMode ? "#fff" : "#000" }]}>
//           Your Reminders
//         </Text>
//         <Text
//           style={[styles.subHeader, { color: isDarkMode ? "#aaa" : "#666" }]}
//         >
//           {reminders.length} {reminders.length === 1 ? "reminder" : "reminders"}
//         </Text>
//       </View>

//       {reminders.length === 0 ? (
//         <View style={styles.emptyState}>
//           <Icon
//             name="time-outline"
//             size={60}
//             color={isDarkMode ? "#555" : "#ccc"}
//           />
//           <Text
//             style={[
//               styles.noRemindersText,
//               { color: isDarkMode ? "#aaa" : "#666" },
//             ]}
//           >
//             No reminders set yet
//           </Text>
//           <Text
//             style={[
//               styles.noRemindersSubText,
//               { color: isDarkMode ? "#666" : "#999" },
//             ]}
//           >
//             Tap the + button to add a new reminder
//           </Text>
//         </View>
//       ) : (
//         <FlatList
//           data={reminders.sort((a, b) => a.time - b.time)}
//           keyExtractor={(item) => item.id}
//           contentContainerStyle={styles.listContainer}
//           renderItem={({ item }) => (
//             <View
//               style={[
//                 styles.reminderItem,
//                 { backgroundColor: isDarkMode ? "#252525" : "#fff" },
//               ]}
//             >
//               <View style={{ display: "flex", flexDirection: "row" }}>
//                 <View style={styles.reminderIcon}>
//                   <Icon
//                     name="notifications-outline"
//                     size={24}
//                     color={isDarkMode ? "white" : "black"}
//                   />
//                 </View>
//                 <View style={styles.reminderContent}>
//                   <Text
//                     style={[
//                       styles.reminderText,
//                       { color: isDarkMode ? "#fff" : "#333" },
//                     ]}
//                   >
//                     {item.text}
//                   </Text>
//                   <Text
//                     style={[
//                       styles.reminderTime,
//                       { color: isDarkMode ? "#aaa" : "#666" },
//                     ]}
//                   >
//                     {formatDate(item.time)}
//                   </Text>
//                 </View>
//               </View>
//               <TouchableOpacity
//                 style={styles.deleteButton}
//                 onPress={() => deleteReminder(item.id)}
//               >
//                 <Icon
//                   name="trash-outline"
//                   size={20}
//                   color={isDarkMode ? "white" : "black"}
//                 />
//               </TouchableOpacity>
//             </View>
//           )}
//         />
//       )}

//       <TouchableOpacity
//         style={[
//           styles.fab,
//           { backgroundColor: isDarkMode ? "white" : "black" },
//         ]}
//         onPress={() => setModalVisible(true)}
//       >
//         <Icon name="add" size={30} color={isDarkMode ? "#333" : "white" } />
//       </TouchableOpacity>

//       <Modal visible={modalVisible} transparent animationType="slide">
//         <View style={styles.modalContainer}>
//           <View
//             style={[
//               styles.modalContent,
//               { backgroundColor: isDarkMode ? "#252525" : "#fff" },
//             ]}
//           >
//             <Text
//               style={[
//                 styles.modalTitle,
//                 { color: isDarkMode ? "#fff" : "#000" },
//               ]}
//             >
//               Set New Reminder
//             </Text>

//             <TextInput
//               style={[
//                 styles.input,
//                 {
//                   backgroundColor: isDarkMode ? "#333" : "#f5f5f5",
//                   color: isDarkMode ? "#fff" : "#000",
//                 },
//               ]}
//               placeholder="Reminder for..."
//               placeholderTextColor={isDarkMode ? "#aaa" : "#888"}
//               value={reminderText}
//               onChangeText={setReminderText}
//             />

//             <View style={styles.datetimeContainer}>
//               <TouchableOpacity
//                 style={[
//                   styles.modalButton,
//                   { backgroundColor: isDarkMode ? "#444" : "#e5e5e5" },
//                 ]}
//                 onPress={() => setShowDatePicker(true)}
//               >
//                 <Icon
//                   name="calendar-outline"
//                   size={20}
//                   color={isDarkMode ? "white" : "black"}
//                   style={styles.buttonIcon}
//                 />
//                 <Text
//                   style={[
//                     styles.modalButtonText,
//                     { color: isDarkMode ? "#fff" : "#333" },
//                   ]}
//                 >
//                   {date ? date.toLocaleTimeString() : "Pick Date"}
//                 </Text>
//               </TouchableOpacity>

//               {showDatePicker && (
//                 <DateTimePicker
//                   value={tempDate}
//                   mode="date"
//                   onChange={handleDateChange}
//                   themeVariant={isDarkMode ? "dark" : "light"}
//                 />
//               )}

//               {showTimePicker && (
//                 <DateTimePicker
//                   value={tempDate}
//                   mode="time"
//                   onChange={handleTimeChange}
//                   themeVariant={isDarkMode ? "dark" : "light"}
//                 />
//               )}
//             </View>

//             <View style={styles.modalActions}>
//               <TouchableOpacity
//                 style={[
//                   styles.modalActionButton,
//                   { backgroundColor: isDarkMode ? "#333" : "#f5f5f5" },
//                 ]}
//                 onPress={() => setModalVisible(false)}
//               >
//                 <Text
//                   style={[
//                     styles.modalActionButtonText,
//                     { color: isDarkMode ? "#fff" : "#333" },
//                   ]}
//                 >
//                   Cancel
//                 </Text>
//               </TouchableOpacity>

//               <TouchableOpacity
//                 style={[
//                   styles.modalActionButton,
//                   { backgroundColor: isDarkMode ? "white" : "black" },
//                 ]}
//                 onPress={scheduleNotification}
//               >
//                 <Text
//                   style={[
//                     styles.modalActionButtonText,
//                     { color: isDarkMode ? "#333" : "white" },
//                   ]}
//                 >
//                   Set Reminder
//                 </Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>
//     </LinearGradient>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: "#000",
//   },
//   headerContainer: {
//     marginBottom: 20,
//     paddingHorizontal: 10,
//   },
//   header: {
//     fontSize: 28,
//     fontWeight: "bold",
//     textAlign: "left",
//     marginBottom: 5,
//     color: "#fff",
//   },
//   subHeader: {
//     fontSize: 16,
//     textAlign: "left",
//     color: "#ccc",
//   },
//   emptyState: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     padding: 20,
//   },
//   noRemindersText: {
//     fontSize: 18,
//     textAlign: "center",
//     marginTop: 15,
//     marginBottom: 5,
//     color: "#aaa",
//   },
//   noRemindersSubText: {
//     fontSize: 14,
//     textAlign: "center",
//     color: "#777",
//   },
//   listContainer: {
//     paddingBottom: 20,
//   },
//   reminderItem: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     padding: 15,
//     borderRadius: 10,
//     marginBottom: 10,
//     backgroundColor: "#111",
//     shadowColor: "#fff",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 3,
//     elevation: 2,
//   },
//   reminderIcon: {
//     displayL: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     marginRight: 15,
//   },
//   remindContent: {
//     flex: 1,
//   },
//   reminderText: {
//     fontSize: 16,
//     marginBottom: 3,
//     color: "#fff",
//   },
//   reminderTime: {
//     fontSize: 14,
//     color: "#bbb",
//   },
//   deleteButton: {
//     padding: 8,
//     marginLeft: 10,
//   },
//   fab: {
//     position: "absolute",
//     bottom: 30,
//     right: 30,
//     width: 60,
//     height: 60,
//     borderRadius: 30,
//     backgroundColor: "#fff",
//     justifyContent: "center",
//     alignItems: "center",
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 3 },
//     shadowOpacity: 0.3,
//     shadowRadius: 5,
//     elevation: 5,
//   },
//   modalContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "rgba(0,0,0,0.8)",
//   },
//   modalContent: {
//     width: "90%",
//     maxWidth: 400,
//     borderRadius: 15,
//     padding: 20,
//     backgroundColor: "#222",
//     shadowColor: "#fff",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.25,
//     shadowRadius: 4,
//     elevation: 5,
//   },
//   modalTitle: {
//     fontSize: 22,
//     fontWeight: "bold",
//     marginBottom: 20,
//     textAlign: "center",
//     color: "#fff",
//   },
//   input: {
//     padding: 15,
//     marginBottom: 15,
//     borderRadius: 10,
//     fontSize: 16,
//     backgroundColor: "#333",
//     color: "#fff",
//   },
//   datetimeContainer: {
//     marginBottom: 20,
//   },
//   modalButton: {
//     flexDirection: "row",
//     padding: 12,
//     borderRadius: 10,
//     alignItems: "center",
//     justifyContent: "center",
//     backgroundColor: "#fff",
//     marginBottom: 10,
//   },
//   buttonIcon: {
//     marginRight: 10,
//   },
//   modalButtonText: {
//     fontSize: 16,
//     fontWeight: "500",
//     color: "#000",
//   },
//   modalActions: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginTop: 0,
//   },
//   modalActionButton: {
//     flex: 1,
//     padding: 15,
//     borderRadius: 10,
//     alignItems: "center",
//     marginHorizontal: 5,
//     backgroundColor: "#fff",
//   },
//   modalActionButtonText: {
//     fontWeight: "bold",
//     fontSize: 16,
//   },
// });
