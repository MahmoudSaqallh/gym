import type { Metadata } from "next";
import { EditProfile } from "@/components/dashboard/settings/edit-profile";

export const metadata: Metadata = { title: "Edit Profile – Kinora" };

export default function EditProfilePage() {
  return <EditProfile />;
}
