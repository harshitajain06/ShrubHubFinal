import React, { useState, useEffect } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView, SafeAreaView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db, auth } from '../../config/firebase';

// Import your back button image
import backButtonImage from '../../assets/images/Back.png';

const PostPage = () => {
  const route = useRoute();
  const { plant } = route.params;
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const navigation = useNavigation();

  const fetchComments = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'posts', plant.id, 'comments'));
      const commentsList = [];
      querySnapshot.forEach((doc) => {
        const { text, userId } = doc.data();
        commentsList.push({ text, userId, id: doc.id });
      });
      setComments(commentsList);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const handleAddComment = async () => {
    if (!comment) {
      return;
    }

    try {
      const commentsRef = collection(db, 'posts', plant.id, 'comments');
      await addDoc(commentsRef, {
        text: comment,
        userId: auth.currentUser.uid,
        createdAt: new Date(),
      });
      setComment('');
      fetchComments();
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
      <SafeAreaView style={{ flex: 1, backgroundColor: '#7C9D45' }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Image source={backButtonImage} style={styles.backButtonImage} />
          </TouchableOpacity>
          <Text style={styles.caption}>{plant.caption}</Text>
        </View>
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.imageContainer}>
            <Image source={{ uri: plant.imageUrl }} style={styles.image} />
          </View>
          <View style={styles.descriptionContainer}>
            <Text style={styles.description}>{plant.description}</Text>
          </View>
          <View style={styles.commentsSection}>
            <Text style={styles.commentsTitle}>Comments</Text>
            {comments.map((comment, index) => (
              <Text key={index} style={styles.comment}>{comment.text}</Text>
            ))}
          </View>
          <View style={styles.commentInputContainer}>
            <TextInput
              placeholder="Add a comment"
              placeholderTextColor="grey"
              style={styles.commentInput}
              value={comment}
              onChangeText={setComment}
            />
            <TouchableOpacity onPress={handleAddComment} style={styles.addButton}>
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: 'white',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    marginTop: 40
  },
  backButtonImage: {
    width: 32,
    height: 24,
    tintColor: 'white', // Customize the tint color if needed
  },
  caption: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
    marginLeft: -15,
  },
  imageContainer: {
    borderWidth: 3,
    borderColor: '#7C9D45',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: 300,
  },
  descriptionContainer: {
    backgroundColor: '#7C9D45',
    borderRadius: 20,
    padding: 10,
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
  },
  commentsSection: {
    marginTop: 20,
    marginBottom: 20,
  },
  commentsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  comment: {
    fontSize: 16,
    marginBottom: 5,
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#7C9D45',
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
    padding: 10,
    marginBottom: 20,
  },
  commentInput: {
    flex: 1,
    paddingRight: 10,
  },
  addButton: {
    backgroundColor: '#7C9D45',
    padding: 10,
    borderRadius: 10,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default PostPage;
