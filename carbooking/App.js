import {View, Text} from 'react-native';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import BlankScreen from './screens/BlankScreen';
import LoginScreen from './screens/auth/LoginScreen';
import RegisterScreen from './screens/auth/RegisterScreen';
import HomeScreen from './screens/HomeScreen';

// Booking
import BookingScreen from './screens/booking/BookingScreen';
import BookingDetailScreen from './screens/booking/BookingDetailScreen';
// History
import HistoryScreen from './screens/history/HistoryScreen';
import HistoryDetail from './screens/history/HistoryDetail';

// Carparking
import CarparkingScreen from './screens/carparking/CarparkingScreen';
import CarparkingDetailScreen from './screens/carparking/CarparkingDetailScreen';

// Footer
// import Footer from './components/Footer';
const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Carparking"
          component={CarparkingScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="CarparkingDetail"
          component={CarparkingDetailScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Booking"
          component={BookingScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="BookingDetail"
          component={BookingDetailScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="History"
          component={HistoryScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="HistoryDetail"
          component={HistoryDetail}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
