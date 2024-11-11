import { useEffect, useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User } from "../../../shared/src/types/user";
import axios from "axios";

export function UserAvatar() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Fetch user data from the API
    axios
      .get("http://localhost:3000/auth/whoami", { withCredentials: true })
      .then((response) => {
        setUser(response.data);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  }, []);

  // Get the first letter of the username for the fallback avatar
  const userInitial = user?.username ? user.username.charAt(0).toUpperCase() : "U";

  return (
    <Avatar className="w-10 h-10">
      {/* Show user initial */}
      <AvatarFallback>{userInitial}</AvatarFallback>
    </Avatar>
  );
}
