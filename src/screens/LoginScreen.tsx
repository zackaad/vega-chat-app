import React, { useState, useEffect } from 'react';
import { View, Text, Button, ActivityIndicator } from 'react-native';
import auth from '@react-native-firebase/auth';
import { GoogleSignin, GoogleSigninButton } from '@react-native-google-signin/google-signin';

// Configure Google Sign-In with your webClientId
GoogleSignin.configure({
  webClientId: '576966639179-laprvni5190t516hgub7dpcj3u0fpaho.apps.googleusercontent.com'
})

const LoginScreen: React.FC = ({ navigation }) => {
  const [loading, setLoading] = useState(false);

  // Function for handling Google Sign-In
  async function onGoogleButtonPress() {
    setLoading(true);
    try {
      // Check if your device supports Google Play services
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      // Get the user's ID token
      const { idToken } = await GoogleSignin.signIn();
  
      // Create a Google credential with the token
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
  
      // Sign in the user with the Google credential
      await auth().signInWithCredential(googleCredential);
      navigation.navigate('Home'); // Navigate to the 'Home' screen on successful login
    } catch (error) {
      console.error('Google Sign-In Error:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#8B31E6' }}>
      <Text style={styles.welcomeText}>Welcome to Vega</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#FFFFFF" />
      ) : (
        // Render a Google Sign-In button
        <GoogleSigninButton
          style={{ width: 192, height: 48 }}
          size={GoogleSigninButton.Size.Wide}
          color={GoogleSigninButton.Color.Light}
          onPress={onGoogleButtonPress}
        />
      )}
    </View>
  );
};

// Styles for the LoginScreen component
const styles = {
  welcomeText: {
    fontSize: 48,
    color: 'white',
    fontFamily: 'Tahoma',
  },
};

export default LoginScreen;
