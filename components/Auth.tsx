import React, { useState } from "react";
import { Alert, StyleSheet, View, Text, TextInput } from "react-native";
import { supabase } from "../lib/supabase";
import { Button, Input } from "@rneui/themed";
import { Link, Redirect, router } from "expo-router";
import CustomButton from "./CustomButton";

interface AuthProps {
  signin: boolean;
}

export default function Auth({ signin }: AuthProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);

  async function signInWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) Alert.alert(error.message);
    setLoading(false);

    if (!error) {
      router.push("/profile");
    }
  }

  async function signUpWithEmail() {
    setLoading(true);
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: { user_name: username },
      },
    });

    if (error) Alert.alert(error.message);
    if (!session)
      Alert.alert("Please check your inbox for email verification!");
    setLoading(false);
  }

  return (
    <View style={styles.container}>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Text className="font-asemibold text-secondary">Email:</Text>
        <TextInput
          onChangeText={(text) => setEmail(text)}
          value={email}
          placeholder="Email"
          autoCapitalize={"none"}
          className="bg-white p-2 rounded-lg"
        />
      </View>
      <View style={styles.verticallySpaced}>
        <Text className="font-asemibold text-secondary">Password:</Text>
        <TextInput
          onChangeText={(text) => setPassword(text)}
          value={password}
          placeholder="Password"
          secureTextEntry={true}
          className="bg-white p-2 rounded-lg"
        />
      </View>
      {signin ? (
        <View>
          <View style={[styles.verticallySpaced, styles.mt20]}>
            <CustomButton title="Sign in" handlePress={signInWithEmail} />
          </View>
          <View className="justify-center pt-5 flex-row gap-2">
            <Text className="font-asemibold text-secondary">
              Don't have an account?
            </Text>
            <Link href={"/sign-up"} className="font-asemibold text-secondary">
              Sign up here!
            </Link>
          </View>
        </View>
      ) : (
        <View>
          <View>
            <Text className="font-asemibold text-secondary">Username</Text>
            <TextInput
              placeholder="Username"
              value={username}
              onChangeText={(text) => setUsername(text)}
              className="bg-white p-2 rounded-lg"
            />
          </View>
          <View style={[styles.verticallySpaced, styles.mt20]}>
            <CustomButton title="Sign up" handlePress={signUpWithEmail} />
          </View>
          <View className="justify-center pt-5 flex-row gap-2">
            <Text className="font-asemibold text-secondary">
              Already have an account?
            </Text>
            <Link href={"/sign-in"} className="font-asemibold text-secondary">
              Sign in here!
            </Link>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 12,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: "stretch",
  },
  mt20: {
    marginTop: 20,
  },
});
