import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import { updateUserEmail } from "@/store/accountSlice";
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

export function AccountDetailsForm() {
    const { toast } = useToast();
    const dispatch = useDispatch<AppDispatch>();
    const { user } = useSelector((state: RootState) => state.user);
    const { emailLoading } = useSelector((state: RootState) => state.account);

    const [email, setEmail] = useState("");

    useEffect(() => {
        if (user) {
            setEmail(user.email);
        }
    }, [user]);

    const hasChanges = email !== (user?.email || "");

    const handleEmailUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (hasChanges) {
            try {
                await dispatch(updateUserEmail({ email })).unwrap();
                toast({
                    title: "Email Updated",
                    description: "Your email address has been updated successfully.",
                });
            } catch (error: any) {
                toast({
                    title: "Update Failed",
                    description: error || "There was an error updating your email.",
                    variant: "destructive",
                });
            }
        }
    };

    return (
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

                    <div className="flex justify-end">
                        <Button type="submit" disabled={emailLoading || !hasChanges}>
                            {emailLoading ? "Updating..." : "Update Email"}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
