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

const test_provider_id = '6d3f6753-7ee6-49ee-a545-62f1b1822ae5';

const reclaimVerification = new ReclaimVerification();

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const [inputText, setInputText] = useState('');
  const [submittedText, setSubmittedText] = useState('');

  const handleSubmit = async () => {
    const verificationResult = await reclaimVerification.startVerification({
      appId: secrets.RECLAIM_APP_ID,
      secret: secrets.RECLAIM_APP_SECRET,
      providerId: test_provider_id,
    });
    console.log(verificationResult);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <Text>Welcome</Text>
      <TextInput
        style={styles.input}
        value={inputText}
        onChangeText={setInputText}
        placeholder="Enter text here"
        placeholderTextColor="#666"
      />
      <Button
        testID='submit-button'
        title="Submit"
        onPress={handleSubmit}
      />
      {submittedText ? (
        <Text style={styles.submittedText}>
          Submitted text: {submittedText}
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
