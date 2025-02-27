import { supabase } from "./supabase";
import uuid from "react-native-uuid";

export const getProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from("profiles")
    .select("username, biography, avatar_url")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Error fetching profile:", error.message);
    return null;
  }

  return data;
};

export const uploadAvatar = async (userId: string, imageUri: string) => {
  try {
    const fileExt = imageUri.split(".").pop();
    const uniqueId = uuid.v4();
    const filePath = `avatars/${userId}-${uniqueId}.${fileExt}`;
    const formData = new FormData();
    formData.append("file", {
      uri: imageUri,
      name: filePath,
      type: `image/${fileExt}`,
    } as any);

    const { error } = await supabase.storage
      .from("avatars")
      .upload(filePath, formData, { upsert: true });

    if (error) throw error;

    const { data: publicUrlData } = supabase.storage
      .from("avatars")
      .getPublicUrl(filePath);
    return publicUrlData.publicUrl;
  } catch (error) {
    console.error("Error uploading avatar:", (error as any).message);
    return null;
  }
};

export function updateProfile(
  userId: string,
  userData: { username?: string; biography?: string; avatar_url?: string }
) {
  return new Promise<boolean>(async (resolve) => {
    try {
      const { error } = await supabase.from("profiles").upsert({
        id: userId,
        username: userData.username,
        biography: userData.biography,
        avatar_url: userData.avatar_url,
      });

      if (error) throw error;

      resolve(true);
    } catch (error) {
      console.error("Error updating profile:", (error as Error).message);
      resolve(false);
    }
  });
}
