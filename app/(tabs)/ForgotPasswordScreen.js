import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ImageBackground, Alert, StyleSheet } from 'react-native';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';

const backImage = require('../../assets/images/Img2.png');

const ForgotPasswordScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');

  const handleSend = () => {
    const auth = getAuth();
    
    sendPasswordResetEmail(auth, email)
      .then(() => {
        // Password reset email sent
        Alert.alert('Success', 'Password reset link sent to your email.');
        navigation.navigate('LoginScreen');
      })
      .catch((error) => {
        // Handle errors here
        let errorMessage;
        switch (error.code) {
          case 'auth/invalid-email':
            errorMessage = 'The email address is badly formatted.';
            break;
          case 'auth/user-not-found':
            errorMessage = 'There is no user corresponding to this email.';
            break;
          default:
            errorMessage = 'An error occurred. Please try again.';
        }

        Alert.alert('Error', errorMessage);
      });
  };

  return (
    <ImageBackground source={backImage} style={styles.container}>
      <View style={styles.overlay}>
        <Text style={styles.title}>Reset Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="white"
          value={email}
          onChangeText={setEmail}
        />
        <TouchableOpacity onPress={handleSend} style={styles.button}>
          <Text style={styles.buttonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    alignItems: 'center',
  },
  title: {
    color: 'white',
    fontSize: 20,
    marginBottom: 20,
  },
  input: {
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 20,
    width: 300,
    height: 50,
    padding: 10,
    color: 'white',
    marginBottom: 20,
  },
  button: {
    backgroundColor: 'transparent',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'white',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
});

export default ForgotPasswordScreen;
