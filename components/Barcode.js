import React from 'react';
import { View } from 'react-native';
import Barcode from '@adrianso/react-native-barcode-builder';

export default function BarcodeGenerator() {
  return (
    <View>
      <Barcode value="1234567890" format="CODE128" />
    </View>
  );
}
 