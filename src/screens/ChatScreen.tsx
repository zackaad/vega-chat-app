import React, { useState, useEffect, useRef } from 'react';
import { View, Text, FlatList, StyleSheet, TextInput, Button, Image, TouchableOpacity } from 'react-native';
import { collection, addDoc, serverTimestamp, query, onSnapshot, limit, orderBy } from 'firebase/firestore';
import db from '../config/config';
import 'firebase/auth';
import { useRoute } from '@react-navigation/native';
import ImagePicker, { launchImageLibrary } from 'react-native-image-picker';
import { getStorage, ref , uploadBytes, getBlob, getDownloadURL} from '@firebase/storage';
import { getApp } from 'firebase/app';


interface RouteParams {
  userDisplayName: string | undefined;
  userPhotoURL: string | undefined;
  currentRoomNumber: string | undefined;
}

const ChatScreen: React.FC = () => {
  const [message, setMessage] = useState<string>('');
  const [messages, setMessages] = useState<any[]>([]);
  const [image, setImage] = useState<string | null>(null);
 

  

  const openImageGallery = () => {
    const options = {
      title: 'Select Image',
      storageOptions: {
        skipBackup: true,
      },
    };


    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        // User canceled the image picker
      } else if (response.error) {
        console.error('ImagePicker Error: ', response.error);
      } else {
        // Image selected successfully
        const selectedImageUri = response.assets[0].uri;
        setImage(selectedImageUri);
      }
    });
    
  };

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
    if (message === '' && !image) return;
  
    const newMessage = {
      text: message,
      timestamp: serverTimestamp(),
      userID: userDisplayName,
      imageURL: image ? image : null,
      isImage: !!image
    };
  
    try {
      const docRef = await addDoc(messageCollection, newMessage);
      console.log('Document written');
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  
    console.log('Message:', message, 'Image:', image);
    setMessage('');
    setImage(null);
  }

  
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
  {item.isImage ? (
    <Image source={{ uri: item.imageURL }} style={styles.messageImage} />
  ) : (
    <Text style={styles.messageText}>
      {item.text}
    </Text>
  )}
  {item.timestamp && (
    <Text style={styles.timestampText}>
      {item.timestamp.toDate().toLocaleTimeString()}
    </Text>
  )}
</View>
    </View>
  )}
  onContentSizeChange={() => {
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
        <TouchableOpacity onPress={openImageGallery}>
          <Text>   Attach image</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  timestampText: {
  color: 'black', // Black text color for the timestamp
  fontSize: 12, // Adjust the font size as needed
},
  messageImage: {
    width: 200, // You can adjust the width and height as needed
    height: 200,
    borderRadius: 8,
  },
  
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