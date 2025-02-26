import { Image, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../constants";
import { LinearGradient } from "expo-linear-gradient";
import CustomButton from "@/components/CustomButton";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function App() {
  return (
    <LinearGradient colors={["#FFF8E1", "#FFECB3"]}>
      <SafeAreaView className="h-full ">
        <ScrollView contentContainerStyle={{ height: "100%" }}>
          <View className="w-full min-h-[85vh] justify-center items-center px-4 ">
            <Image source={images.logo} className="w-[300px] h-[300px]" />

            <View>
              <Text className="text-6xl mt-8 font-abold text-secondary leading-[1.5]">
                Choccyrate
              </Text>
            </View>

            <CustomButton
              title="Get started"
              handlePress={() => router.push("/explore")}
              containerStyles="w-full mt-8"
            />
          </View>
        </ScrollView>
        <StatusBar backgroundColor="#793510" style="light" />
      </SafeAreaView>
    </LinearGradient>
  );
}
