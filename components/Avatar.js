import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";
import useResource from "../hooks/useResource";
import Image from "next/image";
import { useAuth } from "../contexts/auth";
export default function Avatar({ url, size, profilePage, testMode }) {
  const [uploading, setUploading] = useState(false);
  const { downloadImage, avatarUrl, getAbsoluteAvatarUrl } = useResource();
  const { setAvatarUrl, updateProfile } = useAuth();
  useEffect(() => {
    if (url) downloadImage(url);
  }, [url]);

  const onUpload = (url, absoluteAvatar_url) => {
    setAvatarUrl(url);
    updateProfile({
      avatar_url: url,
      absolute_avatar_url: absoluteAvatar_url,
    }); // username, website,
  };

  async function uploadAvatar(event) {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("You must select an image to upload.");
      }

      const file = event.target.files[0];
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      let { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }
      const absoluteUrl = await getAbsoluteAvatarUrl(filePath);

      onUpload(filePath, absoluteUrl);
    } catch (error) {
      alert(error.message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      {avatarUrl ? (
        <Image
          width={size}
          height={size}
          src={avatarUrl}
          alt="Avatar"
          className="avatar image"
          style={{ height: size, width: size, padding: 0 }}
        />
      ) : (
        <div
          className="avatar no-image"
          style={{ height: size, width: size }}
        />
      )}
      {profilePage && (
        <div style={{ width: size }}>
          <label className="button primary block" htmlFor="single">
            {uploading ? "Uploading ..." : "Upload"}
          </label>
          <input
            style={{
              visibility: "hidden",
              position: "relative",
            }}
            type="file"
            id="single"
            accept="image/*"
            onChange={uploadAvatar}
            disabled={uploading || testMode == true}
          />
        </div>
      )}
    </div>
  );
}
