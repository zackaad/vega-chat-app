import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import auth from '@react-native-firebase/auth';
import { GoogleSignin, GoogleSigninButton } from '@react-native-google-signin/google-signin';

GoogleSignin.configure({
  webClientId: '576966639179-laprvni5190t516hgub7dpcj3u0fpaho.apps.googleusercontent.com'
});

const chatRooms = [
  { id: '1', name: 'Science' },
  { id: '2', name: 'Fitness' },
  { id: '3', name: 'Film' },
  { id: '4', name: 'Technology' },
];

const HomeScreen: React.FC = ({ navigation }) => {
  const [user, setUser] = useState<any | null>(null);

  function onAuthStateChanged(user: any | null) {
    setUser(user);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  const signOut = async () => {
    try {
      await GoogleSignin.signOut();
      setUser(null);
      navigation.navigate('Authentication');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      {user ? (
        <View>
          <Text>Welcome, {user.displayName}</Text>
          <TouchableOpacity
            style={styles.signOutButton}
            onPress={signOut}
          >
            <Text style={styles.buttonText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <Text>Not signed in</Text>
      )}
      <Text style={styles.heading}>Chat Rooms:</Text>
      <FlatList
        data={chatRooms}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.chatRoomList}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.chatRoomButton}
            onPress={() => {
                navigation.navigate('Chat')
            }}
          >
            <Text style={styles.buttonText}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading: {
    fontSize: 18,
    marginVertical: 10,
  },
  chatRoomList: {
    justifyContent: 'center',
  flexGrow: 1, // Make the chat rooms fill the screen vertically
  },
  chatRoomButton: {
    padding: 15,
    marginVertical: 10,
    backgroundColor: 'grey', // Change the color to grey
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
  },
  signOutButton: {
    padding: 10,
    backgroundColor: 'red',
    borderRadius: 5,
  },
});

export default HomeScreen;
