import { View, Text, Alert, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

import { Link, router } from "expo-router";
import CustomButton from "@/components/CustomButton";
import { SafeAreaView } from "react-native-safe-area-context";
import { createClient, Session } from "@supabase/supabase-js";
import { LinearGradient } from "expo-linear-gradient";
import { icons } from "@/constants";

const Profile = () => {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [session, setSession] = useState<Session | null>(null);
  const [bio, setBio] = useState("");

  useEffect(() => {
    if (session) getProfile();
  }, [session]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  async function logout() {
    setSession(null);
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session?.user) {
      Alert.alert("No active user session!");
      console.error("No active user session!");
      return;
    }

    console.log("Logging out user:", sessionData.session.user);

    const { error } = await supabase.auth.signOut();
    if (error) {
      Alert.alert("There was an error logging out!");
      console.error("Error logging out:", error);
    } else {
      console.log("User logged out successfully");
      setSession(null); // Clear session state
      router.push("/");
    }
  }

  async function getProfile() {
    try {
      setLoading(true);
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
        setAvatarUrl(data.avatar_url);
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  if (!session?.user) {
    return (
      <LinearGradient colors={["#FFF8E1", "#FFECB3"]}>
        <SafeAreaView className="h-full">
          <View className="w-full justify-center flex-col items-center px-4 my-6 min-h-[85vh]">
            <Text className="text-4xl font-abold leading-[1.5] text-secondary">
              Profile
            </Text>
            <Text className="text-2xl font-aregular">
              Please sign in to view your profile
            </Text>
            <CustomButton
              title="Sign in"
              handlePress={() => router.push("/sign-in")}
              containerStyles="mt-8 w-full"
            />
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }
  return (
    <LinearGradient colors={["#FFF8E1", "#FFECB3"]}>
      <SafeAreaView className="h-full">
        <View className="w-full min-h-[85vh] justify-center flex-col items-center px-4 my-6">
          <Image
            source={avatarUrl ? { uri: avatarUrl } : icons.user}
            className="w-[100px] h-[100px] rounded-full"
          />
          <Text className="text-4xl font-abold leading-[1.5] text-secondary">
            {username}
          </Text>
          <Text className="text-2xl font-aregular">{bio}</Text>
          <CustomButton
            title="Edit profile"
            handlePress={() => router.push("/edit")}
            containerStyles="mt-8 w-full"
          />
          <CustomButton
            title="Sign out"
            handlePress={logout}
            containerStyles="mt-4 w-full bg-red-500"
          />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default Profile;
