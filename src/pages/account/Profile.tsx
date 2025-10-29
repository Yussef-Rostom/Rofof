import { useState, useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { Camera } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import {
  changeUserPassword,
  clearMessages,
  fetchAccountProfile,
  updateUserEmail,
  updateUserProfile,
  uploadProfileImage,
} from "@/store/accountSlice";
import ProfilePageSkeleton from "@/pages/account/ProfilePageSkeleton";

export default function Profile() {
  const { toast } = useToast();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.user);
  const {
    profileLoading,
    emailLoading,
    passwordLoading,
    error,
    successMessage,
    uploadLoading,
  } = useSelector((state: RootState) => state.account);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    dispatch(fetchAccountProfile()); // Fetch initial profile data
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setDisplayName(user.fullName);
      setEmail(user.email);
      if (user.profile) {
        setBio(user.profile.bio);
        setAvatarUrl(user.profile.avatarUrl);
      }
    }
  }, [user]);

  useEffect(() => {
    if (error) {
      const isEmailConflict = error.toLowerCase().includes("email already");
      toast({
        title: isEmailConflict ? "Email Already Registered" : "Update Failed",
        description: error,
        variant: "destructive",
      });
      dispatch(clearMessages());
    }
  }, [error, successMessage, toast, dispatch]);

  const hasProfileChanges =
    displayName !== (user?.fullName || "") ||
    bio !== (user?.profile?.bio || "") ||
    avatarUrl !== (user?.profile?.avatarUrl || "");

  const hasEmailChanges = email !== (user?.email || "");

  const hasPasswordChanges =
    currentPassword !== "" &&
    newPassword !== "" &&
    confirmPassword !== "" &&
    newPassword === confirmPassword;

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const changes: { fullName?: string; bio?: string; avatarUrl?: string } = {};
    if (user?.fullName !== displayName) {
      changes.fullName = displayName;
    }
    if (user?.profile?.bio !== bio) {
      changes.bio = bio;
    }
    if (avatarUrl) {
      changes.avatarUrl = avatarUrl;
    }

    if (Object.keys(changes).length > 0) {
      await dispatch(updateUserProfile(changes));
    }
  };

  const handleEmailUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (hasEmailChanges) {
      await dispatch(updateUserEmail({ email }));
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!hasPasswordChanges) {
      if (newPassword !== confirmPassword) {
        toast({
          title: "Passwords Don't Match",
          description: "Please make sure your new passwords match.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Missing Password Fields",
          description: "Please fill in all password fields.",
          variant: "destructive",
        });
      }
      return;
    }

    await dispatch(
      changeUserPassword({ oldPassword: currentPassword, newPassword })
    );
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];

      // Client-side validation for image types
      const validImageTypes = ["image/jpeg", "image/png", "image/gif"];
      if (!validImageTypes.includes(file.type)) {
        toast({
          title: "Invalid File Type",
          description: "Only JPG, PNG, or GIF images are allowed.\n",
          variant: "destructive",
        });
        return;
      }

      const formData = new FormData();
      formData.append("image", file);

      const imageUrl = (await dispatch(uploadProfileImage(formData))).payload
        .imageUrl;
      setAvatarUrl(imageUrl);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  if (profileLoading && !user) {
    return <ProfilePageSkeleton />;
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-3xl font-display font-bold tracking-tight">
          Profile Settings
        </h2>
        <p className="text-muted-foreground">
          Manage your account information and security
        </p>
      </div>

      {/* Public Profile Section */}
      <Card>
        <CardHeader>
          <CardTitle>Public Profile</CardTitle>
          <CardDescription>
            This information will be visible to other users on the platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleProfileUpdate} className="space-y-6">
            <div className="flex items-center gap-6">
              <Avatar className="h-24 w-24">
                <AvatarImage
                  src={
                    avatarUrl
                  }
                />
                <AvatarFallback>
                  {user?.fullName?.charAt(0) || "JD"}
                </AvatarFallback>
              </Avatar>
              <div>
                <Input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  className="hidden"
                  accept="image/*"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={triggerFileInput}
                  disabled={uploadLoading}
                >
                  <Camera className="h-4 w-4 mr-2" />
                  {uploadLoading ? "Uploading..." : "Change Photo"}
                </Button>
                <p className="text-xs text-muted-foreground mt-2">
                  JPG, PNG or GIF. Max size 2MB.
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="displayName">Display Name</Label>
              <Input
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Your display name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us about yourself..."
                rows={4}
              />
            </div>

            <Button
              type="submit"
              disabled={profileLoading || !hasProfileChanges}
            >
              {profileLoading ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Account Details Section */}
      <Card>
        <CardHeader>
          <CardTitle>Account Details</CardTitle>
          <CardDescription>Update your account email address</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleEmailUpdate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
              />
            </div>

            <Button type="submit" disabled={emailLoading || !hasEmailChanges}>
              {emailLoading ? "Updating..." : "Update Email"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Security Section */}
      <Card>
        <CardHeader>
          <CardTitle>Security</CardTitle>
          <CardDescription>
            Change your password to keep your account secure
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
              />
            </div>

            <Button
              type="submit"
              disabled={passwordLoading || !hasPasswordChanges}
            >
              {passwordLoading ? "Changing..." : "Change Password"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
