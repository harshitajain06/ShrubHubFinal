import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ImageBackground, Alert, StyleSheet } from 'react-native';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';  // Removed updateProfile
import { auth } from '../../config/firebase';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';

const backImage = require('../../assets/images/Img2.png');

const RegisterScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = async () => {
    try {
      // Register user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Extract username from email (part before '@')
      const username = email.split('@')[0];

      // Send email verification
      await sendEmailVerification(user);

      // Show success toast and alert
      Alert.alert('Success', 'Account created successfully! Please verify your email.');
      Toast.show({
        type: 'success',
        text1: 'Account created successfully!',
        text2: 'Please verify your email.',
      });

      // Navigate to ForumPageWithTabs with username
      navigation.navigate('ForumPageWithTabs', { username });
    } catch (error) {
      let errorMessage;
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'The email address is already in use by another account.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'The email address is not valid.';
          break;
        case 'auth/operation-not-allowed':
          errorMessage = 'Email/password accounts are not enabled. Please contact support.';
          break;
        case 'auth/weak-password':
          errorMessage = 'The password is too weak.';
          break;
        default:
          errorMessage = 'An unknown error occurred. Please try again later.';
      }

      // Show error alert and toast
      Alert.alert('Error', errorMessage);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: errorMessage,
      });
    }
  };

  return (
    <ImageBackground source={backImage} style={styles.container}>
      <View style={styles.innerContainer}>
        <Text style={styles.title}>Welcome Form</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="white"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="white"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={handleSignUp} style={styles.button}>
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')} style={styles.button}>
            <Text style={styles.buttonText}>Log In</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Toast />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerContainer: {
    alignItems: 'center',
  },
  title: {
    color: 'white',
    fontSize: 40,
    fontWeight: 'bold',
    fontStyle: 'italic',
    marginVertical: 20,
  },
  input: {
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 20,
    width: 300,
    height: 50,
    padding: 10,
    color: 'white',
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
    marginTop: 20,
    marginRight: 60,
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

export default RegisterScreen;
