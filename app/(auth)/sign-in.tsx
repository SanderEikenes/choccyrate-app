import { View, Text, ScrollView, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import FormField from "../../components/FormField";

import { images } from "../../constants";
import CustomButton from "@/components/CustomButton";
import { Link } from "expo-router";
import Auth from "@/components/Auth";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

const SignIn = () => {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return (
    <SafeAreaView className="bg-primary h-full">
      <Auth signin={true} />
    </SafeAreaView>
  );
};

export default SignIn;
