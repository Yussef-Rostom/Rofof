import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import { changeUserPassword } from "@/store/accountSlice";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export function SecurityForm() {
    const { toast } = useToast();
    const dispatch = useDispatch<AppDispatch>();
    const { passwordLoading } = useSelector((state: RootState) => state.account);

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const hasPasswordChanges =
        currentPassword !== "" &&
        newPassword !== "" &&
        confirmPassword !== "" &&
        newPassword === confirmPassword;

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

        try {
            await dispatch(
                changeUserPassword({ oldPassword: currentPassword, newPassword })
            ).unwrap();

            toast({
                title: "Password Changed",
                description: "Your password has been changed successfully.",
            });

            // Clear form fields
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (error: any) {
            toast({
                title: "Password Change Failed",
                description: error || "There was an error changing your password.",
                variant: "destructive",
            });
        }
    };

    return (
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

                    <div className="flex justify-end">
                        <Button
                            type="submit"
                            disabled={passwordLoading || !hasPasswordChanges}
                        >
                            {passwordLoading ? "Changing..." : "Change Password"}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
