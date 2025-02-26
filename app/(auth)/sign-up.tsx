import { View, Text, ScrollView, Image } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import FormField from "../../components/FormField";

import { images } from "../../constants";
import CustomButton from "@/components/CustomButton";
import { Link } from "expo-router";
import Auth from "@/components/Auth";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

const SignUp = () => {
  return (
    <SafeAreaView className="bg-primary h-full">
      <Auth signin={false} />
    </SafeAreaView>
  );
};

export default SignUp;
