import { View, Text, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "../../lib/supabase";
import GetChocolateMilks from "@/lib/getChocolateMilks";

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
    <SafeAreaView>
      <ScrollView>
        <Text>Explore</Text>
        {chocolateMilks.map((chocolateMilk) => (
          <View key={chocolateMilk.id}>
            <Text>{chocolateMilk.name}</Text>
            <Text>{chocolateMilk.brand}</Text>
            <Text>{chocolateMilk.description}</Text>
            <Text>{chocolateMilk.average_rating}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Explore;
