import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { Camera, Mail, Phone, Save, User } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const API_BASE = "http://localhost:8080/api/user";

export default function Profile() {
  const token = localStorage.getItem("token");
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState({ message: "", type: "" });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) return;

    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);
    setFormData({
      name: parsedUser.name || "",
      email: parsedUser.email || "",
      phone: parsedUser.phone || "",
    });
    setPreviewImage(parsedUser.image || parsedUser.avatar || "");
  }, []);

  useEffect(() => {
    if (!selectedImage) return undefined;

    const objectUrl = URL.createObjectURL(selectedImage);
    setPreviewImage(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedImage]);

  const profileImage = useMemo(
    () => previewImage || user?.image || user?.avatar || "https://i.pravatar.cc/200?img=12",
    [previewImage, user]
  );

  const handleChange = (event) => {
    setFormData((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  const updateProfileRequest = async (payloadUser) => {
    const headers = token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {};

    const multipartData = new FormData();
    multipartData.append(
      "user",
      new Blob([JSON.stringify(payloadUser)], { type: "application/json" })
    );
    if (selectedImage) {
      multipartData.append("file", selectedImage);
      multipartData.append("image", selectedImage);
      multipartData.append("picture", selectedImage);
    }

    const jsonPayload = {
      ...payloadUser,
      image: previewImage || payloadUser.image,
    };

    const requestOptions = [
      {
        method: "put",
        url: `${API_BASE}/update/${payloadUser.id}`,
        data: multipartData,
        headers,
      },
      {
        method: "put",
        url: `${API_BASE}/updateProfile/${payloadUser.id}`,
        data: multipartData,
        headers,
      },
      {
        method: "put",
        url: `${API_BASE}/${payloadUser.id}`,
        data: jsonPayload,
        headers: {
          ...headers,
          "Content-Type": "application/json",
        },
      },
    ];

    let lastError;
    for (const request of requestOptions) {
      try {
        const response = await axios(request);
        return response.data?.user || response.data || payloadUser;
      } catch (error) {
        lastError = error;
      }
    }

    throw lastError;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!user) return;

    setSaving(true);
    setStatus({ message: "", type: "" });

    const updatedUser = {
      ...user,
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      image: previewImage || user.image || user.avatar || "",
      avatar: previewImage || user.avatar || user.image || "",
    };

    try {
      const savedUser = await updateProfileRequest(updatedUser);
      const mergedUser = {
        ...updatedUser,
        ...savedUser,
        image: savedUser.image || updatedUser.image,
        avatar: savedUser.avatar || updatedUser.avatar,
      };

      setUser(mergedUser);
      localStorage.setItem("user", JSON.stringify(mergedUser));
      localStorage.setItem("email", mergedUser.email || "");
      setEditing(false);
      setSelectedImage(null);
      setStatus({ message: "Profile updated successfully.", type: "success" });
    } catch (error) {
      console.error("Error updating profile:", error);
      setStatus({
        message:
          error.response?.data?.message ||
          "Profile update failed. Check the backend update endpoint.",
        type: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        <p>No user found in localStorage.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#1d4ed8,_#0f172a_55%)] text-white">
      <Navbar />
      <div className="mx-auto max-w-6xl px-4 pb-16 pt-28">
        <div className="grid gap-6 lg:grid-cols-[1.05fr_1.4fr]">
          <motion.section
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="rounded-[32px] border border-white/15 bg-white/10 p-8 shadow-2xl backdrop-blur-xl"
          >
            <div className="flex flex-col items-center text-center">
              <div className="relative">
                <img
                  src={profileImage}
                  alt={user.name}
                  className="h-36 w-36 rounded-[28px] border-4 border-cyan-300/70 object-cover shadow-xl"
                />
                <label className="absolute -bottom-3 -right-3 flex h-11 w-11 cursor-pointer items-center justify-center rounded-2xl bg-amber-400 text-slate-950 shadow-lg transition hover:scale-105">
                  <Camera size={18} />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
              </div>

              <h1 className="mt-6 text-3xl font-black tracking-tight">{user.name}</h1>
              <p className="mt-2 rounded-full bg-cyan-400/20 px-4 py-1 text-sm font-semibold uppercase tracking-[0.25em] text-cyan-200">
                {user.role}
              </p>

              <div className="mt-8 grid w-full grid-cols-3 gap-3 text-left">
                <div className="rounded-3xl bg-slate-950/35 p-4">
                  <p className="text-2xl font-bold">{user.courses?.length || 0}</p>
                  <p className="text-sm text-slate-300">Courses</p>
                </div>
                <div className="rounded-3xl bg-slate-950/35 p-4">
                  <p className="text-2xl font-bold">{user.followers || 0}</p>
                  <p className="text-sm text-slate-300">Learning</p>
                </div>
                <div className="rounded-3xl bg-slate-950/35 p-4">
                  <p className="text-2xl font-bold">{user.following || 0}</p>
                  <p className="text-sm text-slate-300">Completed</p>
                </div>
              </div>

              <div className="mt-8 w-full space-y-3 text-left">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.25em] text-slate-300">Email</p>
                  <p className="mt-1 text-sm text-white">{user.email || "No email available."}</p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.25em] text-slate-300">Phone</p>
                  <p className="mt-1 text-sm text-white">{user.phone || "No phone available."}</p>
                </div>
              </div>
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="rounded-[32px] border border-white/15 bg-[#fff8ea] p-8 text-slate-900 shadow-2xl"
          >
            <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-600">
                  Profile Studio
                </p>
                <h2 className="mt-2 text-3xl font-black">Update your details</h2>
              </div>
              <button
                type="button"
                onClick={() => setEditing((prev) => !prev)}
                className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
              >
                {editing ? "Cancel Editing" : "Edit Profile"}
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-5 md:grid-cols-2">
                <label className="block">
                  <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <User size={16} /> Name
                  </span>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={!editing}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 disabled:cursor-not-allowed disabled:bg-slate-100"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <Mail size={16} /> Email
                  </span>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={!editing}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 disabled:cursor-not-allowed disabled:bg-slate-100"
                  />
                </label>
              </div>

              <label className="block">
                <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <Phone size={16} /> Phone
                </span>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={!editing}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 disabled:cursor-not-allowed disabled:bg-slate-100"
                />
              </label>

              <div className="rounded-[28px] bg-gradient-to-r from-cyan-50 to-amber-50 p-5">
                <p className="text-sm font-semibold text-slate-700">Profile picture</p>
                <p className="mt-1 text-sm text-slate-500">
                  Choose a new image and save to update your avatar.
                </p>
                <label className="mt-4 inline-flex cursor-pointer items-center rounded-2xl bg-cyan-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-cyan-700">
                  Upload Picture
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={!editing}
                    onChange={handleImageChange}
                  />
                </label>
              </div>

              {status.message && (
                <p className={status.type === "success" ? "text-green-600" : "text-red-600"}>
                  {status.message}
                </p>
              )}

              <button
                type="submit"
                disabled={!editing || saving}
                className="inline-flex items-center gap-2 rounded-2xl bg-amber-400 px-5 py-3 font-bold text-slate-950 transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                <Save size={18} />
                {saving ? "Saving..." : "Save Profile"}
              </button>
            </form>
          </motion.section>
        </div>
      </div>
      <Footer />
    </div>
  );
}
