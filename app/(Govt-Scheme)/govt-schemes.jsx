import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import SchemeCard from '../../components/schemecard';
import { useEffect, useState } from 'react';
import { supabase } from '../../utils/supabase/client';

export default function GovtSchemes() {
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSchemes = async () => {
      try {
        setLoading(true);
        const { data: schemeData, error: supabaseError } = await supabase
          .from('scheme')
          .select('*');

        if (supabaseError) {
          throw supabaseError;
        }

        setSchemes(schemeData || []);
        console.log(schemes);
      } catch (err) {
        console.error("Error fetching schemes:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSchemes();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className="text-lg text-gray-600 mt-4">Loading schemes...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center p-4">
        <Text className="text-lg text-red-600 mb-2">Error loading schemes</Text>
        <Text className="text-gray-700">{error}</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView className="pt-6 pb-8">
        {/* Header Section */}
        <View className="px-4 mb-6">
          <Text className="text-3xl font-bold text-green-800 mb-2">Government Schemes</Text>
          <Text className="text-gray-600">Discover benefits available for farmers</Text>
          <View className="h-1 w-16 bg-green-500 rounded-full mt-3"/>
        </View>

        {schemes.length > 0 ? (
          <View className="px-4">
            {schemes.map((scheme) => (
              <View key={scheme.id} className="mb-4">
                <SchemeCard
                  id={scheme.id.toString()}
                  title={scheme.title}
                  imageUrl={scheme.imagelink}
                />
              </View>
            ))}
            <Text className="text-gray-500 text-center mt-4 mb-4">
              Showing {schemes.length} schemes
            </Text>
          </View>
        ) : (
          <View className="px-4 py-6">
            <Text className="text-lg text-gray-600 text-center">
              No schemes found in the database
            </Text>
            <Text className="text-gray-500 text-center mt-2">
              Please check your Supabase connection and table data
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}