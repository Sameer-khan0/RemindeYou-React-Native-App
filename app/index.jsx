import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Platform, useColorScheme } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as Notifications from "expo-notifications";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

async function setupNotificationChannel() {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("reminders", {
      name: "Reminders",
      importance: Notifications.AndroidImportance.HIGH,
      sound: "default",
      vibrationPattern: [0, 250, 250, 250],
      enableVibrate: true,
    });
  }
}

async function requestPermissions() {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== "granted") {
    alert("Notification permissions are required for reminders");
    return false;
  }
  return true;
}

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function ReminderApp() {
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [tempDate, setTempDate] = useState(new Date());

  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";

  useEffect(() => {
    const initialize = async () => {
      await requestPermissions();
      await setupNotificationChannel();
    };
    initialize();
  }, []);

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setTempDate(selectedDate);
      setShowTimePicker(true);
    }
  };

  const handleTimeChange = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) {
      const finalDate = new Date(tempDate);
      finalDate.setHours(selectedTime.getHours());
      finalDate.setMinutes(selectedTime.getMinutes());
      finalDate.setSeconds(0);
      setDate(finalDate);
    }
  };

  const scheduleNotification = async () => {
    const now = new Date();
    const timeDifference = date.getTime() - now.getTime();
  
    if (timeDifference <= 1000) {
      alert("Please select a time at least 1 second in the future");
      return;
    }
  
    try {
      // Cancel any existing notifications
      await Notifications.cancelAllScheduledNotificationsAsync();
  
      console.log("Scheduling notification for:", date.toISOString());
      console.log("Current time:", now.toISOString());
  
      const identifier = await Notifications.scheduleNotificationAsync({
        content: {
          title: "Reminder Alert! ⏰",
          body: `Your reminder for ${date.toLocaleString()}`,
          sound: "default",
          data: { reminderTime: date.toISOString() },
        },
        trigger: date, // Schedule notification for the specific date and time
      });
  
      console.log("Notification scheduled with ID:", identifier);
      alert(`✅ Reminder set for ${date.toLocaleString()}`);
    } catch (error) {
      console.error("Notification scheduling error:", error);
      alert("Failed to set reminder: " + error.message);
    }
  };
  
  

  return (
    <LinearGradient
      colors={isDarkMode ? ["#1A1A2E", "#16213E"] : ["#E3F2FD", "#BBDEFB"]}
      style={styles.container}
    >
      <View style={styles.card}>
        <Text style={[styles.title, isDarkMode && styles.darkText]}>
          Reminder Scheduler
        </Text>
        
        <View style={styles.dateContainer}>
          <Ionicons 
            name="calendar-outline" 
            size={24} 
            color={isDarkMode ? "#fff" : "#333"} 
          />
          <Text style={[styles.dateText, isDarkMode && styles.darkText]}>
            {date.toLocaleString()}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => setShowDatePicker(true)}
        >
          <LinearGradient
            colors={["#6200EE", "#BB86FC"]}
            style={styles.buttonGradient}
          >
            <Ionicons name="calendar" size={20} color="#fff" />
            <Text style={styles.buttonText}>Pick Date</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={scheduleNotification}
        >
          <LinearGradient
            colors={["#00C853", "#00E676"]}
            style={styles.buttonGradient}
          >
            <Ionicons name="alarm" size={20} color="#fff" />
            <Text style={styles.buttonText}>Set Reminder</Text>
          </LinearGradient>
        </TouchableOpacity>

        {(showDatePicker || showTimePicker) && (
          <View style={styles.pickerContainer}>
            {showDatePicker && (
              <DateTimePicker
                value={tempDate}
                mode="date"
                minimumDate={new Date()}
                display={Platform.OS === "ios" ? "inline" : "default"}
                onChange={handleDateChange}
                accentColor="#6200EE"
              />
            )}
            {showTimePicker && (
              <DateTimePicker
                value={tempDate}
                mode="time"
                display={Platform.OS === "ios" ? "inline" : "default"}
                onChange={handleTimeChange}
                accentColor="#6200EE"
              />
            )}
          </View>
        )}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 15,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 20,
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    padding: 10,
    borderRadius: 8,
  },
  dateText: {
    fontSize: 16,
    color: "#333",
    marginLeft: 10,
    flex: 1,
  },
  darkText: {
    color: "#fff",
  },
  button: {
    marginVertical: 10,
    borderRadius: 12,
    overflow: "hidden",
  },
  buttonGradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 10,
  },
  pickerContainer: {
    marginTop: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
  },
});