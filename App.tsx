import React from 'react';
import { Provider } from 'react-redux';
import { store } from './src/store';
import { HomeScreen } from './src/screens/HomeScreen';
import { ProductDetailScreen } from './src/screens/ProductDetailScreen';
import { RecordSaleScreen } from './src/screens/RecordSaleScreen';
import { SalesHistoryScreen } from './src/screens/SalesHistoryScreen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';
import { Colors } from './src/theme/colors';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const Stack = createStackNavigator();

const toastConfig = {
  success: (props: any) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: Colors.success, backgroundColor: Colors.surface, borderRadius: 12, height: 60 }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 15,
        fontWeight: '700',
        color: Colors.text
      }}
      text2Style={{
        fontSize: 13,
        color: Colors.textLight
      }}
    />
  ),
  error: (props: any) => (
    <ErrorToast
      {...props}
      style={{ borderLeftColor: Colors.error, backgroundColor: Colors.surface, borderRadius: 12, height: 60 }}
      text1Style={{
        fontSize: 15,
        fontWeight: '700',
        color: Colors.text
      }}
      text2Style={{
        fontSize: 13,
        color: Colors.textLight
      }}
    />
  ),
};

export default function App() {
  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={styles.container}>
        <Provider store={store}>
          <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              <Stack.Screen name="Home" component={HomeScreen} />
              <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
              <Stack.Screen name="RecordSale" component={RecordSaleScreen} />
              <Stack.Screen name="SalesHistory" component={SalesHistoryScreen} />
            </Stack.Navigator>
          </NavigationContainer>
        </Provider>
        <Toast config={toastConfig} />
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
