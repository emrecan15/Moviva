import { getUserDetails } from "@/lib/movieService";
import SettingsClient from "./_components/SettingsClient";

export default async function SettingsPage() {
  const user = await getUserDetails();

  return <SettingsClient user={user} />;
}
