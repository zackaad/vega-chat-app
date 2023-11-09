import React, { useState, useEffect } from 'react';
import {Pressable, View, Text, TouchableOpacity, FlatList, StyleSheet, Image, StatusBar } from 'react-native';
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
  const [currentRoomNumber, setCurrentRoomNumber] = useState<string>('1');

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
      <StatusBar barStyle="light-content" backgroundColor="#8B31E6" />
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
        <Text style={styles.notSignedInText}>Not signed in</Text>
      )}
      <Text style={styles.heading}>Welcome, {user?.displayName}</Text>
      <Text style={styles.subheading}>Choose a chatroom:</Text>
      <FlatList
        data={chatRooms}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.chatRoomList}
        renderItem={({ item }) => (
          <Pressable
            style={[
              styles.chatRoomButton,
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
          </Pressable>
        )}
      />
    </View>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#8B31E6',
  padding: 16,
  paddingTop: 32,
  paddingBottom: 0,
  justifyContent: 'flex-start',
  alignItems: 'center',
  marginBottom: 24,
  marginTop: 0,
  borderTopRightRadius: 32,
  borderTopLeftRadius: 32,
  borderWidth: 2,
  borderColor: '#fff',
  shadowColor: '#000',
  shadowOffset: {
    width: 0,
    height: 5,
  },
  shadowOpacity: 0.3,
  shadowRadius: 6,
  elevation: 5,
  borderTopWidth: 0,
},
  activeRoom: {
    opacity: 0.7,
    backgroundColor: '#8B31E6',
  },
  heading: {
    fontSize: 24,
    color: 'white',
    marginBottom: 16,
  },
  subheading: {
    fontSize: 18,
    color: 'white',
    marginBottom: 8,
  },
  chatRoomList: {
    flexGrow: 1,
    justifyContent: 'center',
  width: '100%',
  marginBottom: 16,
  paddingHorizontal: 16,
},
  chatRoomButton: {
    padding: 15,
    marginVertical: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
},
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
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
    padding: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
  },
  notSignedInText: {
    fontSize: 16,
    color: 'white',
    marginBottom: 16,
  },
});



export default HomeScreen;
