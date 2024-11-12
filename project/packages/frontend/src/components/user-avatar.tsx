import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { useAuth } from "../AuthContext";

export function UserAvatar() {
  const { user, setIsAuthed } = useAuth();
  // Get the first letter of the username for the fallback avatar
  const userInitial = user?.username
    ? user.username.charAt(0).toUpperCase()
    : "U";

  const handleLogout = async () => {
    const response = await fetch("http://localhost:3000/auth/signout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    if (response.ok) {
      setIsAuthed(false);
    };
  }

  return (
    <HoverCard>
      <HoverCardTrigger>
        <Avatar className="w-10 h-10">
          <AvatarFallback>{userInitial}</AvatarFallback>
        </Avatar>
      </HoverCardTrigger>
      <HoverCardContent className="w-48 max-w-xs p-4 space-y-2">
        <div className="flex justify-center items-center space-x-2">
          <Avatar>
            <AvatarFallback>{userInitial}</AvatarFallback>
          </Avatar>
          <h4 className="text-sm font-semibold">{user.username}</h4>
        </div>

        <div className="flex justify-center">
          <Button
            variant="outline"
            size="sm"
            className="text-sm"
            onClick={handleLogout}
          >
            Log Out
          </Button>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
