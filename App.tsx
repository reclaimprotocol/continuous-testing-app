/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { StatusBar, StyleSheet, useColorScheme, View, TextInput, Button, Text } from 'react-native';
import { useState } from 'react';
import { ReclaimVerification } from '@reclaimprotocol/inapp-rn-sdk';
import secrets from './secrets.json';


const reclaimVerification = new ReclaimVerification();

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const [inputText, setInputText] = useState('');
  const [statusResult, setStatusResult] = useState<'success' | 'fail'>();

  const handleSubmit = async () => {
    try{
      const verificationResult = await reclaimVerification.startVerification({
        appId: secrets.RECLAIM_APP_ID,
        secret: secrets.RECLAIM_APP_SECRET,
        providerId: inputText,
      });
      console.log(verificationResult);
      setStatusResult('success')
    } catch (error) {
      console.error(error);
      setStatusResult('fail')
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <Text>Welcome</Text>
      <TextInput
        testID='input-text'
        style={styles.input}
        value={inputText}
        onChangeText={setInputText}
        placeholder="Enter Provider ID here"
        placeholderTextColor="#666"
      />
      <Button
        testID='submit-button'
        title="Test"
        onPress={handleSubmit}
      />
      {statusResult ? (
        <Text testID={statusResult + '-text'} style={styles.submittedText}>
          Test {statusResult}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  submittedText: {
    marginTop: 20,
    fontSize: 16,
  },
});

export default App;
