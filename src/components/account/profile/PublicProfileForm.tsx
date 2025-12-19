                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import { updateUserProfile, uploadProfileImage } from "@/store/accountSlice";
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
import { Camera } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function PublicProfileForm() {
    const { toast } = useToast();
    const dispatch = useDispatch<AppDispatch>();
    const { user } = useSelector((state: RootState) => state.user);
    const { profileLoading, uploadLoading } = useSelector(
        (state: RootState) => state.account
    );

    const fileInputRef = useRef<HTMLInputElement>(null);

    const [displayName, setDisplayName] = useState("");
    const [bio, setBio] = useState("");
    const [avatarUrl, setAvatarUrl] = useState("");

    useEffect(() => {
        if (user) {
            setDisplayName(user.fullName);
            if (user.profile) {
                setBio(user.profile.bio);
                setAvatarUrl(user.profile.avatarUrl);
            }
        }
    }, [user]);

    const hasChanges =
        displayName !== (user?.fullName || "") ||
        bio !== (user?.profile?.bio || "") ||
        avatarUrl !== (user?.profile?.avatarUrl || "");

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
            toast({
                title: "Profile Updated",
                description: "Your public profile has been updated successfully.",
            });
        }
    };

    const handleImageChange = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];

            const validImageTypes = ["image/jpeg", "image/png", "image/gif"];
            if (!validImageTypes.includes(file.type)) {
                toast({
                    title: "Invalid File Type",
                    description: "Only JPG, PNG, or GIF images are allowed.",
                    variant: "destructive",
                });
                return;
            }

            const formData = new FormData();
            formData.append("image", file);

            try {
                const resultAction = await dispatch(uploadProfileImage(formData));
                if (uploadProfileImage.fulfilled.match(resultAction)) {
                    const imageUrl = resultAction.payload.imageUrl;
                    setAvatarUrl(imageUrl);
                    toast({
                        title: "Image Uploaded",
                        description: "Your profile picture has been updated.",
                    });
                }
            } catch (error) {
                toast({
                    title: "Upload Failed",
                    description: "There was an error uploading your image.",
                    variant: "destructive",
                });
            }
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    return (
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
                        <Avatar className="h-24 w-24 border-2 border-border">
                            <AvatarImage src={avatarUrl} />
                            <AvatarFallback className="text-lg">
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
                            className="resize-none"
                        />
                    </div>

                    <div className="flex justify-end">
                        <Button
                            type="submit"
                            disabled={profileLoading || !hasChanges}
                        >
                            {profileLoading ? "Saving..." : "Save Changes"}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
