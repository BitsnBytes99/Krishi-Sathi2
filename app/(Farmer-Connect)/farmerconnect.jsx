import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, Alert, ActivityIndicator, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '@supabase/supabase-js'; // Make sure this path is correct
import { useAuth } from '../../context/AuthContext';

const FarmerConnect = () => {
  const [content, setContent] = useState('');
  const [images, setImages] = useState([]);
  const [problemType, setProblemType] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // Dummy post component
  const DummyPost = () => (
    <View style={styles.postContainer}>
      <View style={styles.userInfo}>
        <Image 
          source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwKEUIsRE5HjIkLgw-OTsVRC9_sGzArngslw&s' }} 
          style={styles.avatar}
        />
        <View>
          <Text style={styles.userName}>Vishal Kaur</Text>
          <Text style={styles.postMeta}>Vaishali, Bihar - 09 Apr 2025</Text>
        </View>
      </View>

      <Text style={styles.cropTitle}>Maize</Text>
      <Text style={styles.postText}>
        Green colour ka keeda, jise humare taraf gandhaki kaha jata hai. 
        Lagbhag sare makke pe hai. Isse koi nuksaan bhi hoga kya? Yahi haa 
        to iska kya nivaaran hai?
      </Text>

      <Image
        source={{ uri: 'https://via.placeholder.com/400x300?text=Maize+Pest' }}
        style={styles.postImage}
        resizeMode="cover"
      />

      <View style={styles.actionBar}>
        <TouchableOpacity style={styles.actionButton}>
          <Text>👍 Helpful</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Text>💬 Comment</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Text>🔗 Share</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'We need access to your photos to upload images');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      setImages([...images, ...result.assets].slice(0, 5));
    }
  };

  const uploadImage = async (uri) => {
    try {
      if (!supabase?.storage) throw new Error('Storage service not available');

      const response = await fetch(uri);
      const blob = await response.blob();
      const fileExt = uri.split('.').pop();
      const filePath = `${Date.now()}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from('post-images')
        .upload(filePath, blob, { contentType: `image/${fileExt}` });

      if (error) throw error;
      
      const { data: { publicUrl } } = supabase.storage
        .from('post-images')
        .getPublicUrl(data.path);

      return publicUrl;
    } catch (error) {
      console.error('Upload error:', error);
      throw new Error('Failed to upload image');
    }
  };

  const createPost = async () => {
    if (!content.trim()) {
      Alert.alert('Error', 'Please describe your farming issue');
      return;
    }

    if (!user?.userid) {
      Alert.alert('Error', 'You must be logged in to create a post');
      return;
    }

    try {
      setLoading(true);

      const imageUrls = images.length > 0 
        ? await Promise.all(images.map(img => uploadImage(img.uri)))
        : [];

      const { error } = await supabase.from('posts').insert({
        user_id: user.userid,
        content,
        image_urls: imageUrls,
        problem_type: problemType,
        district: user.district,
        crops: user.crops || []
      });

      if (error) throw error;

      Alert.alert('Success', 'Your post has been shared!');
      setContent('');
      setImages([]);
      setProblemType('');
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
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
              <Image
                source={{ uri: img.uri }}
                style={styles.previewImage}
              />
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

      <View style={styles.separator} />
      
      <Text style={styles.sectionTitle}>Recent Community Posts</Text>
      <DummyPost />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  contentContainer: {
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  label: {
    fontSize: 14,
    color: '#666',
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
    backgroundColor: '#f0f9f0',
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
    marginBottom: 24,
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
  separator: {
    borderBottomWidth: 1,
    borderColor: '#eee',
    marginVertical: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  // Dummy post styles
  postContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  userName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  postMeta: {
    color: '#666',
    fontSize: 12,
  },
  cropTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#2e7d32',
    marginBottom: 8,
  },
  postText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
  },
  actionBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 12,
  },
  actionButton: {
    paddingHorizontal: 12,
  },
});

export default FarmerConnect;