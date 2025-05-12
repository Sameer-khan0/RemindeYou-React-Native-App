import React, { useState, useEffect, useRef } from 'react';
import { 
  Text, 
  View, 
  StyleSheet, 
  Alert, 
  TouchableOpacity, 
  SafeAreaView,
  StatusBar
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withRepeat, 
  withSequence,
  Easing,
  runOnJS
} from 'react-native-reanimated';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';

export default function EnhancedBarcodeScanner() {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState('back');
  const [scanned, setScanned] = useState(false);
  const [flashMode, setFlashMode] = useState('off');
  const [scanActive, setScanActive] = useState(true);
  
  // Animation values
  const scanLinePosition = useSharedValue(0);
  const scanFrameOpacity = useSharedValue(1);
  const successOpacity = useSharedValue(0);
  const buttonScale = useSharedValue(1);
  
  useEffect(() => {
    if (!permission) {
      requestPermission();
    }
  }, [permission]);

  // Start scan line animation when scanner is active
  useEffect(() => {
    if (scanActive && !scanned) {
      scanLinePosition.value = 0;
      scanLinePosition.value = withRepeat(
        withTiming(1, { duration: 2000, easing: Easing.linear }),
        -1,
        false
      );
    }
  }, [scanActive, scanned]);

  // Success animation when barcode is detected
  useEffect(() => {
    if (scanned) {
      scanFrameOpacity.value = withTiming(0.3, { duration: 300 });
      successOpacity.value = withTiming(1, { duration: 500 });
    } else {
      scanFrameOpacity.value = withTiming(1, { duration: 300 });
      successOpacity.value = withTiming(0, { duration: 300 });
    }
  }, [scanned]);

  const handleBarCodeScanned = ({ type, data }) => {
    if (scanned) return;
    
    setScanned(true);
    setScanActive(false);
    
    // Button press animation
    buttonScale.value = withSequence(
      withTiming(1.2, { duration: 100 }),
      withTiming(1, { duration: 100 })
    );
    
    // Vibration feedback could be added here
    
    // Show alert with short delay for animation to complete
    setTimeout(() => {
      Alert.alert(
        'Barcode Detected', 
        `Type: ${type}\nData: ${data}`,
        [
          { text: 'Copy', onPress: () => console.log('Copy pressed') },
          { text: 'Scan Again', onPress: () => handleScanAgain() }
        ]
      );
    }, 500);
  };

  const handleScanAgain = () => {
    setScanned(false);
    setScanActive(true);
  };
  
  const toggleFlash = () => {
    setFlashMode(flashMode === 'off' ? 'torch' : 'off');
    buttonScale.value = withSequence(
      withTiming(1.2, { duration: 100 }),
      withTiming(1, { duration: 100 })
    );
  };
  
  const toggleCamera = () => {
    setFacing(facing === 'back' ? 'front' : 'back');
    buttonScale.value = withSequence(
      withTiming(1.2, { duration: 100 }),
      withTiming(1, { duration: 100 })
    );
  };

  // Animated styles
  const scanLineStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: scanLinePosition.value * 220 }],
      opacity: scanLinePosition.value < 0.1 || scanLinePosition.value > 0.9 ? 0 : 1
    };
  });

  const scanFrameStyle = useAnimatedStyle(() => {
    return {
      opacity: scanFrameOpacity.value
    };
  });

  const successIconStyle = useAnimatedStyle(() => {
    return {
      opacity: successOpacity.value,
      transform: [{ scale: successOpacity.value }]
    };
  });

  const buttonAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: buttonScale.value }]
    };
  });

  if (!permission || !permission.granted) {
    return (
      <SafeAreaView style={styles.permissionContainer}>
        <StatusBar barStyle="dark-content" backgroundColor="#f5f5f7" />
        <Animated.View style={[styles.permissionContent, { opacity: 1 }]}>
          <MaterialCommunityIcons name="camera-off" size={64} color="#555" />
          <Text style={styles.permissionTitle}>Camera Access Required</Text>
          <Text style={styles.permissionMessage}>
            Please grant camera permission to scan barcodes and QR codes
          </Text>
          <TouchableOpacity
            style={styles.permissionButton}
            onPress={requestPermission}
            activeOpacity={0.8}
          >
            <Text style={styles.permissionButtonText}>Grant Permission</Text>
          </TouchableOpacity>
        </Animated.View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Scan Barcode</Text>
      </View>
      
      <View style={styles.cameraContainer}>
        <CameraView
          style={styles.camera}
          facing={facing}
          flashMode={flashMode}
          onBarcodeScanned={scanActive && !scanned ? handleBarCodeScanned : undefined}
          barcodeScannerSettings={{
            barcodeTypes: ['qr', 'ean13', 'code128', 'upc_a', 'upc_e', 'pdf417', 'aztec'],
          }}
        >
          <View style={styles.overlay}>
            {/* Darkened corners */}
            <View style={styles.overlayTop} />
            <View style={styles.middleRow}>
              <View style={styles.overlayLeft} />
              
              {/* Scanner window */}
              <Animated.View style={[styles.scanFrame, scanFrameStyle]}>
                {/* Corner markers */}
                <View style={[styles.cornerTL, styles.corner]} />
                <View style={[styles.cornerTR, styles.corner]} />
                <View style={[styles.cornerBL, styles.corner]} />
                <View style={[styles.cornerBR, styles.corner]} />
                
                {/* Scanning line */}
                {!scanned && scanActive && (
                  <Animated.View style={[styles.scanLine, scanLineStyle]} />
                )}
                
                {/* Success icon */}
                <Animated.View style={[styles.successContainer, successIconStyle]}>
                  <MaterialCommunityIcons name="check-circle" size={80} color="#4CAF50" />
                </Animated.View>
              </Animated.View>
              
              <View style={styles.overlayRight} />
            </View>
            <View style={styles.overlayBottom} />
          </View>
        </CameraView>
      </View>
      
      {/* Instructions */}
      <View style={styles.instructions}>
        <Text style={styles.instructionText}>
          {scanned 
            ? 'Barcode detected! Tap Scan Again to continue' 
            : 'Position barcode within the frame to scan'}
        </Text>
      </View>
      
      {/* Controls */}
      <View style={styles.controls}>
        <Animated.View style={buttonAnimatedStyle}>
          <TouchableOpacity 
            style={styles.circleButton} 
            onPress={toggleFlash}
            activeOpacity={0.8}
          >
            <Ionicons 
              name={flashMode === 'off' ? 'flash-off' : 'flash'} 
              size={24} 
              color="#fff" 
            />
          </TouchableOpacity>
        </Animated.View>
        
        <Animated.View style={buttonAnimatedStyle}>
          <TouchableOpacity 
            style={[styles.circleButton, styles.mainButton]} 
            onPress={scanned ? handleScanAgain : () => setScanActive(!scanActive)}
            activeOpacity={0.7}
          >
            <Ionicons 
              name={scanned ? 'scan' : (scanActive ? 'pause' : 'play')} 
              size={30} 
              color="#fff" 
            />
          </TouchableOpacity>
        </Animated.View>
        
        <Animated.View style={buttonAnimatedStyle}>
          <TouchableOpacity 
            style={styles.circleButton} 
            onPress={toggleCamera}
            activeOpacity={0.8}
          >
            <Ionicons name="camera-reverse" size={24} color="#fff" />
          </TouchableOpacity>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    padding: 16,
    paddingTop: 8,
    backgroundColor: '#000',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  cameraContainer: {
    flex: 1,
    overflow: 'hidden',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
  },
  overlayTop: {
    height: '25%',
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  middleRow: {
    flexDirection: 'row',
    height: 280,
  },
  overlayLeft: {
    width: '10%',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  overlayRight: {
    width: '10%',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  overlayBottom: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  scanFrame: {
    width: '80%',
    height: '100%',
    position: 'relative',
    borderRadius: 8,
    overflow: 'hidden',
  },
  corner: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderColor: '#fff',
    backgroundColor: 'transparent',
  },
  cornerTL: {
    top: 0,
    left: 0,
    borderLeftWidth: 3,
    borderTopWidth: 3,
    borderTopLeftRadius: 8,
  },
  cornerTR: {
    top: 0,
    right: 0,
    borderRightWidth: 3,
    borderTopWidth: 3,
    borderTopRightRadius: 8,
  },
  cornerBL: {
    bottom: 0,
    left: 0,
    borderLeftWidth: 3,
    borderBottomWidth: 3,
    borderBottomLeftRadius: 8,
  },
  cornerBR: {
    bottom: 0,
    right: 0,
    borderRightWidth: 3,
    borderBottomWidth: 3,
    borderBottomRightRadius: 8,
  },
  scanLine: {
    height: 2,
    width: '100%',
    backgroundColor: '#4CAF50',
    boxShadow: '0px 0px 4px rgba(76, 175, 80, 0.8)',
  },
  successContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  instructions: {
    padding: 16,
    alignItems: 'center',
  },
  instructionText: {
    color: '#ddd',
    fontSize: 16,
    textAlign: 'center',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 24,
    paddingBottom: 36,
    backgroundColor: '#000',
  },
  circleButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  mainButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#4CAF50',
  },
  permissionContainer: {
    flex: 1,
    backgroundColor: '#f5f5f7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  permissionContent: {
    width: '80%',
    alignItems: 'center',
    padding: 24,
  },
  permissionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 12,
    color: '#333',
  },
  permissionMessage: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 32,
  },
  permissionButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  permissionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});