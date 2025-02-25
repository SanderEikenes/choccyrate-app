import { View, Text, ScrollView, Image } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import FormField from "../../components/FormField";

import { images } from "../../constants";
import CustomButton from "@/components/CustomButton";
import { Link } from "expo-router";

const SignUp = () => {
  const [form, setform] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [isSubmitting, setisSubmitting] = useState(false);

  const submit = () => {};

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="w-full justify-center px-4 my-6 min-h-[85vh]">
          <Image
            source={images.logo}
            resizeMode="contain"
            className="w-[115px] h-[35px]"
          />
          <Text className="text-2xl font-bold text-white mt-8 font-psemibold">
            Sign up to Aora
          </Text>
          <FormField
            title="Email"
            value={form.email}
            handleChangeText={(e: string) => setform({ ...form, email: e })}
            otherStyles="mt-7"
            keyboardType="email-address"
            placeholder="Enter your email"
          />

          <FormField
            title="Username"
            value={form.username}
            handleChangeText={(e: string) => setform({ ...form, username: e })}
            otherStyles="mt-7"
            placeholder="Username"
          />

          <FormField
            title="Password"
            value={form.password}
            handleChangeText={(e: string) => setform({ ...form, password: e })}
            otherStyles="mt-7"
            placeholder="Enter your password"
          />

          <CustomButton
            title="Sign In"
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={isSubmitting}
          />

          <View className="justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-gray-100 font-pregular">
              Have an account already?
            </Text>
            <Link
              href={"/sign-in"}
              className="text-lg text-secondary font-psemibold"
            >
              Sign in
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUp;
