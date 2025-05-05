import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-wagmi-charts';

// Define dummy data for the chart
const dummyData = [
  { timestamp: 1625945400000, value: 33575.25 },
  { timestamp: 1625946300000, value: 33645.25 },
  { timestamp: 1625947200000, value: 33700.50 },
  { timestamp: 1625948100000, value: 33745.75 },
  { timestamp: 1625949000000, value: 33800.00 },
  { timestamp: 1625949900000, value: 33855.25 },
  { timestamp: 1625950800000, value: 33910.50 },
  { timestamp: 1625951700000, value: 33960.75 },
  { timestamp: 1625952600000, value: 34000.00 },
  { timestamp: 1625953500000, value: 34050.25 },
];

function BinanceLikeChart() {
  const width = Dimensions.get('window').width; // Get the screen width
  const height = 300; // Define a fixed height for the chart

  return (
    <View style={styles.container}>
      <LineChart.Provider data={dummyData}>
        <LineChart style={{ width, height }}>
          <LineChart.Path strokeWidth={2} color="blue" />
          <LineChart.CursorCrosshair>
            <LineChart.Tooltip />
          </LineChart.CursorCrosshair>
        </LineChart>
      </LineChart.Provider>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding:40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default BinanceLikeChart;
