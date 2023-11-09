import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import ChatScreen from './src/screens/ChatScreen';
import { Text } from 'react-native';
import usePushNotification from './src/utils/UsePush';

const Stack = createNativeStackNavigator();

function App() {

 
  useEffect(() =>{
    usePushNotification;
  },[])

  return (
    
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name='Authentication' component={LoginScreen} />
        <Stack.Screen name='Home' component={HomeScreen} />
        <Stack.Screen name='Chat' component={ChatScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
