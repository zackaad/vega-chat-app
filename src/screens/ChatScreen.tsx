import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TextInput, Button } from 'react-native';
import app from '../config/config';
import { collection, addDoc, Firestore, serverTimestamp, getFirestore } from 'firebase/firestore'; 
import db from '../config/config';



const ChatScreen: React.FC = () => {
  const [message, setMessage] = useState<string>('');
  const [messages, setMessages] = useState<any[]>([]); // Adjust the type accordingly
  const messagesCollection = collection(db, 'messages');

  async function handleSend() {

    
    if (message === '') return;

   
    const newMessage = {
      text: message,
      timestamp: serverTimestamp(),
    };

    setMessage('');

    try {
      const docRef = await addDoc(messagesCollection, newMessage);
      console.log('Document written');
    } catch (error) {
      console.error('Error adding document: ', error);
    }

   
   console.log(message);
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.message}>
            <Text>{item.text}</Text>
          </View>
        )}
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
  container: {
    flex: 1,
    padding: 16,
  },
  message: {
    backgroundColor: '#e6e6e6',
    padding: 8,
    margin: 8,
    borderRadius: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 8,
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
