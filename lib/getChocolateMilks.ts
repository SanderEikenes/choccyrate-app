import { supabase } from "./supabase";

export default async function GetChocolateMilks() {
  const { data } = await supabase.from("chocolate_milks").select("*");
  return data;
}

export async function GetChocolateMilkFromId(chocolateMilkId: string) {
  const { data } = await supabase
    .from("chocolate_milks")
    .select("*")
    .eq("id", chocolateMilkId)
    .single();
  return data;
}

export async function GetChocolateMilkNameFromId(chocolateMilkId: string) {
  const { data } = await supabase
    .from("chocolate_milks")
    .select("name")
    .eq("id", chocolateMilkId)
    .single();
  return data;
}
