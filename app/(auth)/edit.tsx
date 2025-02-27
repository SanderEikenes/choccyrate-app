import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, Image, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import CustomButton from "@/components/CustomButton";
import { getProfile, updateProfile, uploadAvatar } from "@/lib/profileUpdating";
import { supabase } from "@/lib/supabase";

const EditProfile = () => {
  const [username, setUsername] = useState("");
  const [biography, setBiography] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) {
        Alert.alert("No user found. Please log in.");
        return;
      }
      setUserId(session.session.user.id);

      const profile = await getProfile(session.session.user.id);
      if (profile) {
        setUsername(profile.username);
        setBiography(profile.biography);
        setAvatar(profile.avatar_url);
      }
    };

    fetchProfile();
  }, []);

  const handleImagePick = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission denied",
        "You need to grant camera roll permissions."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && userId) {
      const uploadedAvatarUrl = await uploadAvatar(
        userId,
        result.assets[0].uri
      );
      if (uploadedAvatarUrl) setAvatar(uploadedAvatarUrl);
    }
  };

  const handleProfileUpdate = async () => {
    if (!userId) return;

    const success = await updateProfile(userId, {
      username: username,
      biography: biography,
      avatar_url: avatar || undefined,
    });
    if (success) {
      Alert.alert("Profile updated successfully!");
      router.push("/profile");
    } else {
      Alert.alert("Error updating profile. Please try again.");
    }
  };

  return (
    <LinearGradient colors={["#FFF8E1", "#FFECB3"]}>
      <SafeAreaView className="p-8 h-full">
        <View>
          <Text className="text-2xl text-center text-secondary font-bold mt-8">
            Edit Profile
          </Text>
        </View>
        <View>
          <Text className="text-lg text-secondary font-semibold">Username</Text>
          <TextInput
            className="bg-white p-2 rounded-lg"
            value={username}
            onChangeText={setUsername}
          />
        </View>
        <View className="mt-4">
          <Text className="text-lg text-secondary font-semibold">Bio</Text>
          <TextInput
            className="bg-white p-2 rounded-lg"
            value={biography}
            onChangeText={setBiography}
          />
        </View>
        <View>
          <Text className="text-lg text-secondary font-semibold">Avatar</Text>
          {avatar && (
            <Image
              source={{ uri: avatar }}
              style={{ width: 100, height: 100 }}
              className="rounded-full mt-2"
            />
          )}
          <CustomButton
            title="Pick an image"
            handlePress={handleImagePick}
            containerStyles="mt-4"
          />
        </View>
        <CustomButton
          title="Save"
          handlePress={handleProfileUpdate}
          containerStyles="mt-8"
        />
      </SafeAreaView>
    </LinearGradient>
  );
};

export default EditProfile;
