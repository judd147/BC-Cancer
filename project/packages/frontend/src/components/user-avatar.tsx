import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "../AuthContext";
export function UserAvatar() {
  const { user } = useAuth();
  // Get the first letter of the username for the fallback avatar
  const userInitial = user?.username ? user.username.charAt(0).toUpperCase() : "U";

  return (
    <Avatar className="w-10 h-10">
      {/* Show user initial */}
      <AvatarFallback>{userInitial}</AvatarFallback>
    </Avatar>
  );
}
