import { View, Text, ScrollView, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "../../lib/supabase";
import GetChocolateMilks from "@/lib/getChocolateMilks";
import { icons } from "@/constants";
import { LinearGradient } from "expo-linear-gradient";

const Explore = () => {
  const [chocolateMilks, setChocolateMilks] = useState<any[] | null>(null);

  useEffect(() => {
    GetChocolateMilks().then((data) => setChocolateMilks(data));
  }, []);

  if (!chocolateMilks) {
    return (
      <SafeAreaView>
        <View>
          <Text>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }
  return (
    <LinearGradient colors={["#FFF8E1", "#FFECB3"]}>
      <SafeAreaView className="font-aregular">
        <ScrollView className="grid grid-cols-1">
          {chocolateMilks.map((chocolateMilk) => (
            <View
              key={chocolateMilk.id}
              className="flex-col items-center justify-center bg-white my-4 mx-8 p-4 rounded-lg"
            >
              <View>
                <Image
                  source={{ uri: chocolateMilk.image_url }}
                  className="w-[200px] h-48 object-cover"
                />
              </View>
              <View className="mt-4">
                <Text className="text-3xl text-secondary font-abold leading-[1.5]">
                  {chocolateMilk.name}
                </Text>
                <Text className="text-xl text-[#a06749] font-asemibold">
                  {chocolateMilk.brand}
                </Text>
                <Text className="text-2xl font-aregular">
                  {chocolateMilk.description}
                </Text>
                <View className="flex-row items-center gap-2 mt-4">
                  <Image source={icons.star} className="w-5 h-5" />
                  <Text className="text-2xl font-aregular leading-[1.5]">
                    {chocolateMilk.average_rating}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default Explore;
