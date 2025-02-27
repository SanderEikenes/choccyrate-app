import { View, Text, Alert, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { Tabs } from "expo-router";
import { supabase } from "../../lib/supabase";
import { Session } from "@supabase/supabase-js";
import GetProfile from "@/lib/getProfile";
import { icons } from "@/constants";

interface TabIconProps {
  icon: any;
  color: string;
  name: string;
  focused: boolean;
}

const TabIcon: React.FC<TabIconProps> = ({ icon, color, name, focused }) => {
  return (
    <View className="items-center justify-center gap-2 w-[70px] mt-7">
      <Image
        source={icon}
        resizeMode="cover"
        {...(name === "Explore" || name === "Review"
          ? { tintColor: color }
          : {})}
        className="w-7 h-7 rounded-full"
      />
    </View>
  );
};

const TabsLayout = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

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
    <>
      <Tabs
        screenOptions={{
          tabBarShowLabel: false,
          tabBarActiveTintColor: "#793510",
          tabBarInactiveTintColor: "#000",
          tabBarStyle: {
            backgroundColor: "#fff",
            borderTopColor: "#fff",
            height: 60,
          },
        }}
      >
        <Tabs.Screen
          name="profile"
          options={{
            title: username,
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={avatarUrl ? { uri: avatarUrl } : icons.user}
                color={color}
                name={username || "Profile"}
                focused={focused}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="explore"
          options={{
            title: "Explore",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.milk}
                color={color}
                name={"Explore"}
                focused={focused}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="review"
          options={{
            title: "Review",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.star}
                color={color}
                name={"Review"}
                focused={focused}
              />
            ),
          }}
        />
      </Tabs>
    </>
  );
};

export default TabsLayout;
