import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

type AdminAvatarProps = { 
  username: string;
  zIndex?: number;
};

export function AdminAvatar({ username, zIndex }: AdminAvatarProps) {
  const userInitial = username ? username.charAt(0).toUpperCase() : "U";

  return (
    <HoverCard>
      <HoverCardTrigger>
        <Avatar className="w-9 h-9 border-2 border-gray-300" style={{ zIndex }}>
          <AvatarFallback>{userInitial}</AvatarFallback>
        </Avatar>
      </HoverCardTrigger>
      <HoverCardContent
        style={{ width: "auto", paddingTop: "0.5rem", paddingBottom: "0.5rem" }}
      >
        <div className="flex justify-center items-center">
          <h4 className="text-sm">{username}</h4>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
