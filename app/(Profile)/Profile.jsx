import { View, Text, TouchableOpacity, Alert, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';

const Profile = () => {
  const router = useRouter();

  // Simulated User Data (Replace with real data)
  const [user, setUser] = useState({
    name: "John Doe",
    email: "johndoe@example.com",
    phone: "9876543210",
    district: "Pune",
  });

  // FAQ Section Data
  const faqData = [
    { question: "How can I apply for a farming scheme?", answer: "You can apply via the government website or visit the nearest agriculture office." },
    { question: "What are the benefits of Kisan Credit Card?", answer: "It provides easy credit access with low-interest rates for farmers." },
    { question: "How to check scheme eligibility?", answer: "Check eligibility on the scheme's official page or consult an agriculture officer." },
  ];

  // State for handling open FAQ items
  const [openFAQ, setOpenFAQ] = useState(null);

  // Function to toggle FAQ visibility
  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  // Dummy Applied Schemes Data (Replace with real applied schemes)
  const appliedSchemes = [
    { title: "PM-Kisan Samman Nidhi", status: "Approved" },
    { title: "Soil Health Card Scheme", status: "Pending" },
  ];

  // Logout function
  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        onPress: () => {
          // Perform logout actions (Clear auth tokens, etc.)
          router.push('/sign-in'); // Redirect to Sign-in
        },
      },
    ]);
  };

  return (
    <View className="flex-1 p-6">
      {/* Header with Logout */}
      <View className="flex-row justify-between items-center mb-6">
        <Text className="text-2xl font-bold text-[#678a1d]">👤 Profile</Text>
        <TouchableOpacity onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={28} color="red" />
        </TouchableOpacity>
      </View>

      {/* User Information Card */}
      <View className="p-6 rounded-xl shadow-md border border-[#678a1d]">
        <Text className="text-lg font-semibold text-[#678a1d]">👨‍🌾 Name:</Text>
        <Text className="text-gray-700 mb-3">{user.name}</Text>

        <Text className="text-lg font-semibold text-[#678a1d]">📧 Email:</Text>
        <Text className="text-gray-700 mb-3">{user.email}</Text>

        <Text className="text-lg font-semibold text-[#678a1d]">📞 Phone:</Text>
        <Text className="text-gray-700 mb-3">{user.phone}</Text>

        <Text className="text-lg font-semibold text-[#678a1d]">📍 District:</Text>
        <Text className="text-gray-700">{user.district}</Text>
      </View>

      {/* FAQ Section */}
      <Text className="text-xl font-bold text-[#678a1d] mt-6 mb-2">❓ Frequently Asked Questions</Text>
      <View className="rounded-xl shadow-md p-4 border border-[#678a1d]">
        {faqData.map((item, index) => (
          <TouchableOpacity key={index} onPress={() => toggleFAQ(index)} className="mb-2">
            <View className="flex-row justify-between items-center p-3 rounded-lg border border-[#678a1d]">
              <Text className="text-[#678a1d] font-medium">{item.question}</Text>
              <Ionicons name={openFAQ === index ? "chevron-up" : "chevron-down"} size={20} color="#678a1d" />
            </View>
            {openFAQ === index && (
              <View className="p-3 rounded-lg mt-1 border border-[#678a1d]">
                <Text className="text-gray-700">{item.answer}</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* Applied Schemes Section */}
      <Text className="text-xl font-bold text-[#678a1d] mt-6 mb-2">📜 Your Applied Schemes</Text>
      <View className="rounded-xl shadow-md p-4 border border-[#678a1d]">
        {appliedSchemes.length > 0 ? (
          <FlatList
            data={appliedSchemes}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View className="flex-row justify-between items-center p-3 rounded-lg border border-[#678a1d] mb-2">
                <Text className="text-[#678a1d] font-medium">{item.title}</Text>
                <Text className={`px-2 py-1 rounded-lg text-sm ${item.status === "Approved" ? "bg-[#678a1d] text-white" : "bg-yellow-400 text-black"}`}>
                  {item.status}
                </Text>
              </View>
            )}
          />
        ) : (
          <Text className="text-gray-700">No schemes applied yet.</Text>
        )}
      </View>
    </View>
  );
};

export default Profile;
