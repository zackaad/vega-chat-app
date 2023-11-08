import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Image } from 'react-native';
import auth, { FirebaseUser } from '@react-native-firebase/auth';
import { GoogleSignin, GoogleSigninButton } from '@react-native-google-signin/google-signin';


GoogleSignin.configure({
  webClientId: '576966639179-laprvni5190t516hgub7dpcj3u0fpaho.apps.googleusercontent.com',
});



interface ChatRoom {
  id: string;
  name: string;
}

interface HomeScreenProps {
  navigation: any; // Replace with your specific navigation prop type
}

const chatRooms: ChatRoom[] = [
  { id: '1', name: 'Science' },
  { id: '2', name: 'Fitness' },
  { id: '3', name: 'Film' },
  { id: '4', name: 'Technology' },
];

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [currentRoomNumber, setCurrentRoomNumber] = useState<string>('1') ;

  function onAuthStateChanged(user: FirebaseUser | null) {
    setUser(user);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return () => subscriber(); // Unsubscribe on unmount
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
        <View style={styles.userContainer}>
          {user.photoURL && (
            <Image source={{ uri: user.photoURL }} style={styles.userImage} />
          )}
          <View style={styles.userInfo}>
            <TouchableOpacity style={styles.signOutButton} onPress={signOut}>
              <Text style={styles.buttonText}>Sign Out</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <Text>Not signed in</Text>
      )}
      <Text style={styles.heading}>Welcome {user?.displayName}</Text>
      <Text style={styles.heading}>Choose a chatroom:</Text>
      <FlatList
        data={chatRooms}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.chatRoomList}
        renderItem={({ item }) => (
          <TouchableOpacity
          style={[
            styles.chatRoomButton,
            currentRoomNumber === item.id ? styles.activeRoom : null,
          ]}
          onPress={() => {
            setCurrentRoomNumber(item.id);
            navigation.navigate('Chat', {
              userDisplayName: user?.displayName,
              userPhotoURL: user?.photoURL,
              currentRoomNumber: item.id,
            });
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
    backgroundColor: '#8B31E6', // Set the background color to purple
  },
  activeRoom: {
    opacity: 0.7,
  },
  heading: {
    fontSize: 18,
    color: 'white',
    padding: 50 
  },
  chatRoomList: {
    justifyContent: 'center',
    flexGrow: 1,
  },
  chatRoomButton: {
    padding: 15,
    marginVertical: 10,
    backgroundColor: 'grey',
    borderRadius: 5,
    width: '100%',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  userInfo: {
    marginLeft: 20,
  },
  signOutButton: {
    padding: 10,
    backgroundColor: 'grey',
    borderRadius: 5,
    marginTop: 10,
  },
});

export default HomeScreen;