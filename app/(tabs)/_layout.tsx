import { View, Text } from "react-native";
import React from "react";
import { Tabs } from "expo-router";

const TabsLayout = () => {
  return (
    <>
      <Tabs>
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            headerShown: false,
          }}
        />

        <Tabs.Screen
          name="explore"
          options={{
            title: "Explore",
            headerShown: false,
          }}
        />

        <Tabs.Screen
          name="review"
          options={{
            title: "Review",
            headerShown: false,
          }}
        />
      </Tabs>
    </>
  );
};

export default TabsLayout;
