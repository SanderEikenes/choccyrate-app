import { View, Text, Alert, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

import { Link, router } from "expo-router";
import CustomButton from "@/components/CustomButton";
import { SafeAreaView } from "react-native-safe-area-context";
import { Session } from "@supabase/supabase-js";
import { LinearGradient } from "expo-linear-gradient";

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

  return (
    <SafeAreaView>
      <View className="w-full justify-center flex-col items-center px-4 my-6">
        <Image source={{ uri: avatarUrl }} className="w-[100px] h-[100px]" />
        <Text className="text-4xl">{username}</Text>
        <Text className="text-lg">{bio}</Text>
        <CustomButton
          title="Edit profile"
          handlePress={() => router.push("/")}
          containerStyles="mt-8 w-full"
        />
      </View>
    </SafeAreaView>
  );
};

export default Profile;
