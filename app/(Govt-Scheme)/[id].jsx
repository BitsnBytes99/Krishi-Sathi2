import { View, Text, Image, ScrollView, Linking } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import CustomButton from '../../components/CustomButton';
import { useEffect, useState } from 'react';
import { supabase } from '../../utils/supabase/client'; // Make sure you have this setup

export default function SchemeDetailPage() {
  const { id } = useLocalSearchParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchScheme = async () => {
      try {
        setLoading(true);
        const { data: schemeData, error: supabaseError } = await supabase
          .from('scheme')
          .select('*')
          .eq('id', id)
          .single();

        if (supabaseError) {
          throw supabaseError;
        }

        setData(schemeData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchScheme();
  }, [id]);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center p-6">
        <Text className="text-lg text-gray-600">Loading scheme details...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center p-6">
        <Text className="text-lg text-red-600">Error: {error}</Text>
      </View>
    );
  }

  if (!data) {
    return (
      <View className="flex-1 items-center justify-center p-6">
        <Text className="text-lg text-red-600">Scheme not found.</Text>
      </View>
    );
  }

  const handleApplyPress = () => {
    if (data.applylink) {
      Linking.openURL(data.applylink);
    }
  };

  // Helper function to split text with bullet points into an array
  const parseBulletPoints = (text) => {
    if (!text) return [];
    return text.split('\n').filter(item => item.trim() !== '');
  };

  return (
    <ScrollView className="p-4 bg-gray-50">
      {data.imagelink && (
        <Image
          source={{ uri: data.imagelink }}
          className="w-full h-56 rounded-2xl mb-6 shadow-md"
          resizeMode="cover"
        />
      )}

      {/* Title Section */}
      <View className="mb-6">
        <Text className="text-3xl font-bold text-green-800 mb-2">{data.title}</Text>
        <View className="h-1 w-20 bg-green-600 rounded-full"/>
      </View>

      {/* Overview Section */}
      {data.overview && (
        <View className="bg-white rounded-2xl p-5 mb-5 shadow-sm">
          <Text className="text-xl font-semibold mb-3 text-gray-800">Overview</Text>
          <Text className="text-gray-700 leading-6">{data.overview}</Text>
        </View>
      )}

      {/* Benefits Section */}
      {data.benefits && (
        <View className="bg-white rounded-2xl p-5 mb-5 shadow-sm">
          <Text className="text-xl font-semibold mb-3 text-gray-800">Benefits</Text>
          {parseBulletPoints(data.benefits).map((item, i) => (
            <View key={i} className="flex-row items-start mb-2">
              <Text className="text-green-600 text-lg mr-2">•</Text>
              <Text className="text-gray-700 flex-1">{item}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Eligibility Section */}
      {data.eligibility && (
        <View className="bg-white rounded-2xl p-5 mb-5 shadow-sm">
          <Text className="text-xl font-semibold mb-3 text-gray-800">Eligibility</Text>
          {parseBulletPoints(data.eligibility).map((item, i) => (
            <View key={i} className="flex-row items-start mb-2">
              <Text className="text-green-600 text-lg mr-2">•</Text>
              <Text className="text-gray-700 flex-1">{item}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Documents Section */}
      {data.requiredoc && (
        <View className="bg-white rounded-2xl p-5 mb-5 shadow-sm">
          <Text className="text-xl font-semibold mb-3 text-gray-800">Required Documents</Text>
          {parseBulletPoints(data.requiredoc).map((item, i) => (
            <View key={i} className="flex-row items-start mb-2">
              <Text className="text-green-600 text-lg mr-2">•</Text>
              <Text className="text-gray-700 flex-1">{item}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Apply Now Button */}
      {data.applylink && (
        <View className="mt-6 mb-10">
          <CustomButton title="Apply Now" onPress={handleApplyPress} />
        </View>
      )}
    </ScrollView>
  );
}