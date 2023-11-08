import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TextInput, Button } from 'react-native';

const dummyMessages = [
  { id: '1', text: 'Hello!', sender: 'User' },
  { id: '2', text: 'Hi there!', sender: 'Friend' },
  { id: '3', text: 'How are you?', sender: 'User' },
  { id: '4', text: "I'm good, thanks!", sender: 'Friend' },
  // Add more messages as needed
];

const ChatScreen: React.FC = ({ navigation }) => {

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState(dummyMessages);

  function handleSend(){
    if(message === "") return;
    console.log(message);

    setMessage('');
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
