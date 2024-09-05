import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert, ActivityIndicator, KeyboardAvoidingView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { collection, addDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, db } from '../../config/firebase';
import { useNavigation } from '@react-navigation/native';

const CreatePost = () => {
  const navigation = useNavigation();
  const [caption, setCaption] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [descriptionFocused, setDescriptionFocused] = useState(false);

  const handleImageUpload = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 4],
        quality: 1,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      console.log('Error selecting image:', error);
    }
  };

  const handleCreatePost = async () => {
    if (!caption || !description || !image) {
      Alert.alert("Incomplete Fields", "Please fill in all fields before creating the post.");
      return;
    }

    setUploading(true);
    try {
      const storage = getStorage();
      const imageRef = ref(storage, `images/${Date.now()}.jpg`);
      const response = await fetch(image);
      const blob = await response.blob();
      await uploadBytes(imageRef, blob);
      const imageUrl = await getDownloadURL(imageRef);

      const postsRef = collection(db, 'posts');
      await addDoc(postsRef, {
        caption,
        description,
        imageUrl,
        createdAt: new Date(),
        userId: auth.currentUser.uid,
      });

      Alert.alert("Post created!", "Your post has been successfully created.");
      navigation.goBack();
    } catch (error) {
      console.log('Error creating post:', error);
      Alert.alert("Error", "There was an error creating your post. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
      <View style={styles.container}>
        <TextInput
          placeholder="(Caption)"
          placeholderTextColor="white"
          style={[styles.input, styles.textInput, styles.centeredText]}
          value={caption}
          onChangeText={setCaption}
        />
        {!descriptionFocused && (
          <TouchableOpacity onPress={handleImageUpload} style={styles.imageUpload}>
            {image ? (
              <Image source={{ uri: image }} style={styles.image} />
            ) : (
              <Text style={styles.imageUploadText}>Add Image Here</Text>
            )}
          </TouchableOpacity>
        )}
        <TextInput
          placeholder="(Description)"
          placeholderTextColor="white"
          style={[styles.input, styles.textArea, styles.textInput, styles.centeredText]}
          value={description}
          onChangeText={setDescription}
          onFocus={() => setDescriptionFocused(true)}
          onBlur={() => setDescriptionFocused(false)}
          multiline
        />
        {!descriptionFocused && (
          <TouchableOpacity onPress={handleCreatePost} style={styles.button} disabled={uploading}>
            {uploading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text style={styles.buttonText}>Create</Text>
            )}
          </TouchableOpacity>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
  },
  input: {
    marginBottom: 20,
    padding: 10,
  },
  textInput: {
    backgroundColor: '#7C9D45',
    borderRadius: 25,
    color: 'white',
    paddingHorizontal: 20,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'center',
  },
  centeredText: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
  imageUpload: {
    width: '100%',
    height: 300,
    borderWidth: 2,
    borderColor: '#7C9D45',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  imageUploadText: {
    color: '#7C9D45',
    fontWeight: 'bold',
    fontSize: 16,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  button: {
    backgroundColor: '#7C9D45',
    padding: 15,
    borderRadius: 20,
    alignItems: 'center',
    width: '50%',
    alignSelf: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default CreatePost;
