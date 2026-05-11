import { useForm } from "react-hook-form";
import PageWrapper from "../components/layout/PageWrapper";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import Avatar from "../components/ui/Avatar";
import axiosInstance from "../services/axios.instance";
import useAuthStore from "../store/authStore";

export default function ProfilePage() {
  const { user, setAuth, accessToken } = useAuthStore();
  const { register: reg1, handleSubmit: hs1 } = useForm({
    defaultValues: { name: user?.name, avatar: user?.avatar }
  });
  const { register: reg2, handleSubmit: hs2, reset } = useForm();

  const updateProfile = async (data) => {
    const res = await axiosInstance.put("/users/me", data);
    setAuth(res.data.data, accessToken);
    alert("Profile updated!");
  };

  const changePassword = async (data) => {
    await axiosInstance.put("/users/me/password", data);
    reset();
    alert("Password changed successfully!");
  };

  return (
    <PageWrapper>
      <h1 className="text-xl font-bold text-gray-800 mb-6">Profile</h1>
      <div className="max-w-md space-y-6">
        <div className="flex items-center gap-4 bg-white border border-gray-200 rounded-xl p-5">
          <Avatar name={user?.name} src={user?.avatar} size="lg" />
          <div>
            <p className="font-semibold text-gray-800">{user?.name}</p>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
          <h2 className="text-base font-semibold text-gray-700">Update Profile</h2>
          <form onSubmit={hs1(updateProfile)} className="space-y-4">
            <Input label="Name" {...reg1("name")} />
            <Input label="Avatar URL" placeholder="https://..." {...reg1("avatar")} />
            <Button type="submit">Save Changes</Button>
          </form>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
          <h2 className="text-base font-semibold text-gray-700">Change Password</h2>
          <form onSubmit={hs2(changePassword)} className="space-y-4">
            <Input label="Old Password" type="password" {...reg2("oldPassword")} />
            <Input label="New Password" type="password" {...reg2("newPassword")} />
            <Button type="submit">Change Password</Button>
          </form>
        </div>
      </div>
    </PageWrapper>
  );
}