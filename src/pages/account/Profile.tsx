import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import { clearMessages, fetchAccountProfile } from "@/store/accountSlice";
import { useToast } from "@/hooks/use-toast";
import ProfilePageSkeleton from "@/pages/account/ProfilePageSkeleton";
import { PublicProfileForm } from "@/components/account/profile/PublicProfileForm";
import { AccountDetailsForm } from "@/components/account/profile/AccountDetailsForm";
import { SecurityForm } from "@/components/account/profile/SecurityForm";

export default function Profile() {
  const { toast } = useToast();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.user);
  const { profileLoading, error, successMessage } = useSelector(
    (state: RootState) => state.account
  );

  useEffect(() => {
    dispatch(fetchAccountProfile());
  }, [dispatch]);

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
    if (successMessage) {
      toast({
        title: "Success",
        description: successMessage,
      });
      dispatch(clearMessages());
    }
  }, [error, successMessage, toast, dispatch]);

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

      <PublicProfileForm />
      <AccountDetailsForm />
      <SecurityForm />
    </div>
  );
}
