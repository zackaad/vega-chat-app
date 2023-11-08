import React, { useState, useEffect, useRef} from 'react';
import { View, Text, FlatList, StyleSheet, TextInput, Button, Image} from 'react-native';
import app from '../config/config';
import { collection, addDoc, Firestore, serverTimestamp, getFirestore, orderBy, query, onSnapshot, limit } from 'firebase/firestore'; 
import db from '../config/config';
import 'firebase/auth';
import { useRoute } from '@react-navigation/native';

interface RouteParams {
  userDisplayName: string | undefined;
  userPhotoURL: string | undefined;
  currentRoomNumber: string | undefined;
}

const ChatScreen: React.FC = () => {
  const [message, setMessage] = useState<string>('');
  const [messages, setMessages] = useState<any[]>([]); 
 

 
  const route = useRoute();
  const { userDisplayName, userPhotoURL, currentRoomNumber } = route.params as RouteParams;
  const flatListRef = useRef<FlatList | null>(null);
  const messageCollection = collection(
    db,
    `chatRooms/room/${currentRoomNumber}`
  );





  useEffect(() => {

    
    const q = query(messageCollection, orderBy('timestamp'), limit(50));

    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const newMessages: any[] = [];
      querySnapshot.forEach((doc) => {
        newMessages.push({ id: doc.id, ...doc.data() });
      });
      setMessages(newMessages);
    });

    return () => {
      unsubscribe(); // Unsubscribe from real-time updates when the component unmounts
    };
  }, []);


  async function handleSend() {

    
    if (message === '') return;

    console.log(`chatRooms/room/${currentRoomNumber}`)

   
    const newMessage = {
      text: message,
      timestamp: serverTimestamp(),
      userID: userDisplayName,
      
    };

    setMessage('');

    try {
      const docRef = await addDoc(messageCollection, newMessage);
      console.log('Document written');
    } catch (error) {
      console.error('Error adding document: ', error);
    }

   
   console.log(message);
  }

  useEffect(() => {
    // Scroll to the bottom when the component mounts and when a new message arrives
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  return (
    <View style={styles.container}>
      <FlatList
  ref={(ref) => (flatListRef.current = ref)}
  data={messages}
  keyExtractor={(item) => item.id}
  renderItem={({ item }) => (
    <View style={item.userID === userDisplayName ? styles.senderMessageContainer : styles.message}>
      {userPhotoURL && (
        <Image source={{ uri: userPhotoURL }} style={styles.userImage} />
      )}
      <View style={styles.messageContent}>
        <Text style={styles.senderName}>
          {item.userID}:
        </Text>
        <Text style={styles.messageText}>
          {item.text}
        </Text>
      </View>
    </View>
  )}
  onContentSizeChange={() => {
    // Automatically scroll to the bottom when content size changes (new message)
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }}
/>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type your message..."
          value={message}
          onChangeText={(text) => setMessage(text)}
        />
        <Button title="Send" onPress={handleSend} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  senderMessageContainer: {
    flexDirection: 'row', // Arrange contents in a row
    alignItems: 'center', // Align items vertically
    backgroundColor: '#add8e6', // Light blue background color
    padding: 8,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 8,
  },
  senderMessageText: {
    color: 'white', // White text color for the sender's message
    fontSize: 16,
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#8B31E6'
  },
  message: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e6e6e6',
    padding: 8,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 8,
  },
  messageContent: {
    marginLeft: 10,
    flex: 1,
  },
  senderName: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  messageText: {
    fontSize: 16,
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 8,
    backgroundColor: 'white',
    borderRadius: 8,
    marginTop: 16,

  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
  },
});

export default ChatScreen;