import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  ActivityIndicator,
  StyleSheet,
  FlatList,
  RefreshControl,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '../../utils/supabase/client';
import { useAuth } from '../../context/AuthContext';

const FarmerConnect = () => {
  const [content, setContent] = useState('');
  const [images, setImages] = useState([]);
  const [problemType, setProblemType] = useState('');
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [commentingOnPost, setCommentingOnPost] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setRefreshing(true);
      
      // Fetch posts with user info
      const { data: postsData, error: postsError } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (postsError) throw postsError;

      // Process posts with comments and user data
      const postsWithDetails = await Promise.all(
        postsData.map(async (post) => {
          // Get post author info
          const { data: authorData } = await supabase
            .from('user')
            .select('name, district')
            .eq('userid', post.user_id)
            .single();

          // Get comments for this post
          const { data: commentsData } = await supabase
            .from('comments')
            .select('*, user:user(name)')
            .eq('post_id', post.id);

          return {
            ...post,
            user: authorData || { name: 'Anonymous', district: '' },
            comments: commentsData || []
          };
        })
      );

      setPosts(postsWithDetails);
    } catch (error) {
      console.error('Error fetching posts:', error);
      Alert.alert('Error', 'Failed to load posts');
    } finally {
      setRefreshing(false);
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.8,
      });

      if (!result.canceled) {
        setImages((prev) => [...prev, ...result.assets].slice(0, 5));
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to select images');
    }
  };

  const uploadImages = async () => {
    const imageUrls = [];
    
    for (const image of images) {
      const formData = new FormData();
      const fileExt = image.uri.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `post_images/${fileName}`;

      formData.append('files', {
        uri: image.uri,
        name: fileName,
        type: `image/${fileExt}`,
      });

      const { data, error } = await supabase.storage
        .from('post-images')
        .upload(filePath, formData);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('post-images')
        .getPublicUrl(filePath);

      imageUrls.push(publicUrl);
    }

    return imageUrls;
  };

  const createPost = async () => {
    if (!content.trim()) {
      Alert.alert('Error', 'Please describe your farming issue');
      return;
    }

    try {
      setLoading(true);
      
      let imageUrls = [];
      if (images.length > 0) {
        imageUrls = await uploadImages();
      }

      const { error } = await supabase.from('posts').insert({
        user_id: user.userid,
        content,
        image_urls: imageUrls,
        problem_type,
        district: user.district,
        crops: user.crops || [],
      });

      if (error) throw error;

      Alert.alert('Success', 'Post created successfully!');
      setContent('');
      setImages([]);
      setProblemType('');
      fetchPosts();
    } catch (error) {
      console.error('Post creation error:', error);
      Alert.alert('Error', error.message || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  const addComment = async (postId) => {
    if (!commentText.trim()) {
      Alert.alert('Error', 'Please enter a comment');
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase.from('comments').insert({
        post_id: postId,
        user_id: user.userid,
        content: commentText,
      });

      if (error) throw error;

      setCommentText('');
      setCommentingOnPost(null);
      fetchPosts();
    } catch (error) {
      console.error('Error adding comment:', error);
      Alert.alert('Error', 'Failed to add comment');
    } finally {
      setLoading(false);
    }
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const renderPost = ({ item }) => (
    <View style={styles.postCard}>
      <View style={styles.postHeader}>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{item.user?.name || 'Anonymous'}</Text>
          <Text style={styles.userLocation}>{item.district}</Text>
        </View>
        <Text style={styles.postTime}>
          {new Date(item.created_at).toLocaleDateString()}
        </Text>
      </View>

      {item.problem_type && (
        <Text style={styles.problemType}>Problem: {item.problem_type}</Text>
      )}

      <Text style={styles.postContent}>{item.content}</Text>

      {item.image_urls && item.image_urls.length > 0 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {item.image_urls.map((uri, index) => (
            <Image
              key={`img-${item.id}-${index}`}
              source={{ uri }}
              style={styles.postImage}
            />
          ))}
        </ScrollView>
      )}

      <View style={styles.commentsSection}>
        <Text style={styles.commentsTitle}>
          {item.comments.length} {item.comments.length === 1 ? 'Comment' : 'Comments'}
        </Text>
        
        {item.comments.map((comment) => (
          <View key={comment.id} style={styles.comment}>
            <Text style={styles.commentAuthor}>
              {comment.user?.name || 'Anonymous'}:
            </Text>
            <Text style={styles.commentText}>{comment.content}</Text>
          </View>
        ))}

        {commentingOnPost === item.id ? (
          <View style={styles.commentInputContainer}>
            <TextInput
              placeholder="Write your comment..."
              value={commentText}
              onChangeText={setCommentText}
              style={styles.commentInput}
              multiline
            />
            <View style={styles.commentButtons}>
              <TouchableOpacity
                onPress={() => addComment(item.id)}
                style={styles.commentButton}
              >
                <Text style={styles.commentButtonText}>Post</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setCommentingOnPost(null)}
                style={[styles.commentButton, styles.cancelButton]}
              >
                <Text style={styles.commentButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <TouchableOpacity
            onPress={() => setCommentingOnPost(item.id)}
            style={styles.addCommentButton}
          >
            <Text style={styles.addCommentText}>Add Comment</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.createPostContainer}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Share Your Farming Challenge</Text>

        <Text style={styles.label}>Describe your issue</Text>
        <TextInput
          placeholder="e.g., My wheat crops have yellow spots on leaves..."
          multiline
          numberOfLines={4}
          value={content}
          onChangeText={setContent}
          style={styles.input}
          textAlignVertical="top"
        />

        <Text style={styles.label}>Problem type</Text>
        <TextInput
          placeholder="e.g., pest infestation, plant disease, irrigation"
          value={problemType}
          onChangeText={setProblemType}
          style={styles.input}
        />

        <Text style={styles.label}>Add photos (max 5)</Text>
        <TouchableOpacity
          onPress={pickImage}
          style={[styles.imageButton, images.length >= 5 && styles.disabledButton]}
          disabled={images.length >= 5}
        >
          <Text style={styles.buttonText}>
            {images.length > 0 ? 'Add More Images' : 'Select Images'}
          </Text>
        </TouchableOpacity>

        {images.length > 0 && (
          <View style={styles.imagePreviewContainer}>
            {images.map((img, index) => (
              <View key={`img-${index}`} style={styles.imageWrapper}>
                <Image source={{ uri: img.uri }} style={styles.previewImage} />
                <TouchableOpacity 
                  onPress={() => removeImage(index)} 
                  style={styles.removeImageButton}
                >
                  <Text style={styles.removeImageText}>×</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        <TouchableOpacity
          onPress={createPost}
          disabled={loading}
          style={[styles.submitButton, loading && styles.disabledButton]}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.submitButtonText}>Share with Community</Text>
          )}
        </TouchableOpacity>
      </ScrollView>

      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
        style={styles.postsContainer}
        contentContainerStyle={styles.postsContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={fetchPosts}
          />
        }
        ListHeaderComponent={
          <Text style={styles.postsTitle}>Community Posts</Text>
        }
        ListEmptyComponent={
          <Text style={styles.noPostsText}>No posts yet. Be the first to share!</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  createPostContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    maxHeight: '50%',
  },
  postsContainer: {
    flex: 1,
  },
  postsContent: {
    padding: 16,
    paddingBottom: 32,
  },
  postsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  noPostsText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#2e7d32',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    backgroundColor: '#f9f9f9',
    fontSize: 14,
  },
  imageButton: {
    backgroundColor: '#e8f5e9',
    borderWidth: 1,
    borderColor: '#c8e6c9',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#2e7d32',
    fontWeight: '500',
  },
  imagePreviewContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  imageWrapper: {
    marginRight: 8,
    marginBottom: 8,
    position: 'relative',
  },
  previewImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  removeImageButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#f44336',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  removeImageText: {
    color: '#fff',
    fontSize: 16,
    lineHeight: 20,
  },
  submitButton: {
    backgroundColor: '#4caf50',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  postCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: 'column',
  },
  userName: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
  },
  userLocation: {
    fontSize: 12,
    color: '#666',
  },
  postTime: {
    fontSize: 12,
    color: '#666',
  },
  problemType: {
    color: '#4caf50',
    marginBottom: 8,
    fontWeight: '500',
  },
  postContent: {
    fontSize: 14,
    marginBottom: 12,
    lineHeight: 20,
    color: '#333',
  },
  postImage: {
    width: 200,
    height: 200,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  commentsSection: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 12,
  },
  commentsTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  comment: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
  },
  commentAuthor: {
    fontWeight: 'bold',
    fontSize: 12,
    color: '#2e7d32',
  },
  commentText: {
    fontSize: 14,
    color: '#333',
  },
  commentInputContainer: {
    marginTop: 8,
  },
  commentInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
    minHeight: 40,
    backgroundColor: '#f9f9f9',
  },
  commentButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  commentButton: {
    backgroundColor: '#4caf50',
    padding: 8,
    borderRadius: 8,
    marginLeft: 8,
    minWidth: 60,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f44336',
  },
  commentButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  addCommentButton: {
    backgroundColor: '#e8f5e9',
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  addCommentText: {
    color: '#2e7d32',
    fontWeight: '500',
  },
});

export default FarmerConnect;