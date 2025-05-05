import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Barcode from "react-native-barcode-builder";

export default function App() {
  const ticketId = "TICKET-123456";

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Event Ticket</Text>
      <Barcode
        value={ticketId}
        format="CODE128"
        width={2}
        height={100}
        text={ticketId}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    marginBottom: 20,
    fontWeight: "bold",
  },
});
