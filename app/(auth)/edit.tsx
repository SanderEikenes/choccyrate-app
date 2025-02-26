import { View, Text, TextInput, Alert, Button, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "@/components/CustomButton";
import { LinearGradient } from "expo-linear-gradient";
import { Session } from "@supabase/supabase-js";
import * as ImagePicker from "expo-image-picker";
import { supabase } from "@/lib/supabase";
import * as FileSystem from "expo-file-system";
import { router } from "expo-router";
import { v4 as uuidv4 } from "uuid";

const FormData = global.FormData;

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
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Sorry, we need camera roll permissions to make this work!");
      return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      const image = result.assets[0];
      await uploadImageToServer(image.uri, image.fileName || "avatar.jpg");
    }
  };

  const uploadImageToServer = async (uri: string, fileName: string) => {
    try {
      // Ensure the file exists
      const fileInfo = await FileSystem.getInfoAsync(uri);
      if (!fileInfo.exists) {
        throw new Error("File does not exist at the given URI");
      }

      // Read file as a Blob
      const response = await fetch(uri);
      const blob = await response.blob();

      // Generate a unique filename
      const fileExt = fileName.split(".").pop();
      const uuidFileName = `ball7.${fileExt}`;
      const filePath = `avatars/${session?.user.id}-${uuidFileName}`;

      // Create FormData and append the image
      const formData = new FormData();
      formData.append("file", {
        uri: uri, // File URI
        name: uuidFileName, // Unique filename
        type: `image/${fileExt}`, // MIME type
      } as any); // `as any` bypasses the TypeScript type check

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, formData, {
          cacheControl: "3600",
          upsert: true,
          contentType: `image/${fileExt}`,
        });

      if (uploadError) {
        console.error("Error uploading file:", uploadError);
        Alert.alert("Error uploading file!");
        return;
      }

      const { data } = await supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      if (data) {
        console.log("Public URL:", data.publicUrl);
        setAvatar(data.publicUrl);
      }
    } catch (error) {
      console.error("Error reading file:", error);
      Alert.alert("Error reading file!");
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
        avatar_url: avatar,
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
