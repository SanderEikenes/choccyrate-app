import { View, Text, TextInput, Alert, Button, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "@/components/CustomButton";
import { LinearGradient } from "expo-linear-gradient";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { router } from "expo-router";
import { launchImageLibrary } from "react-native-image-picker";

const EditProfile = () => {
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [session, setSession] = useState<Session | null>(null);
  const [avatar, setAvatar] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  useEffect(() => {
    if (session) getProfile();
  }, [session]);

  const uploadImage = async () => {
    // Open Image Picker
    const result = await launchImageLibrary({ mediaType: "photo" });

    if (result.didCancel || !result.assets || result.assets.length === 0) {
      return;
    }

    const image = result.assets[0];
    if (!image.uri) {
      Alert.alert("Error", "Invalid image selected");
      return;
    }
  };

  async function getProfile() {
    try {
      if (!session?.user) throw new Error("No user on the session!");

      const { data, error, status } = await supabase
        .from("profiles")
        .select(`username, biography, avatar_url`)
        .eq("id", session?.user.id)
        .single();
      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setUsername(data.username);
        setBio(data.biography);
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
    }
  }

  function updateProfile() {
    if (!session?.user) {
      console.error("No user on the session!");
      return;
    }

    supabase
      .from("profiles")
      .update({
        biography: bio,
        username: username,
      })
      .eq("id", session?.user.id)
      .then(({ error }) => {
        if (error) {
          console.error("Error updating profile:", error);
          Alert.alert("Error updating profile!");
        } else {
          Alert.alert("Profile updated successfully!");
          router.push("/profile");
        }
      });
  }

  return (
    <LinearGradient colors={["#FFF8E1", "#FFECB3"]}>
      <SafeAreaView className="p-8 h-full">
        <View>
          <Text className="text-2xl text-center text-secondary font-abold mt-8">
            Edit Profile
          </Text>
          <Text>{session?.user.email}</Text>
        </View>
        <View>
          <Text className="text-lg text-secondary font-asemibold">
            Username
          </Text>
          <TextInput
            className="bg-white p-2 rounded-lg"
            value={username}
            defaultValue="Username"
            onChangeText={(text) => setUsername(text)}
          />
        </View>
        <View className="mt-4">
          <Text className="text-lg text-secondary font-asemibold">Bio</Text>
          <TextInput
            className="bg-white p-2 rounded-lg"
            value={bio}
            defaultValue="Bio"
            onChangeText={(text) => setBio(text)}
          />
        </View>
        <View>
          <Text className="text-lg text-secondary font-asemibold">Avatar</Text>
          <Button title="Pick an image" onPress={uploadImage} />
          {avatar && <Image source={{ uri: avatar }} />}
        </View>
        <CustomButton
          title="Save"
          handlePress={updateProfile}
          containerStyles="mt-8"
        />
      </SafeAreaView>
    </LinearGradient>
  );
};

export default EditProfile;
