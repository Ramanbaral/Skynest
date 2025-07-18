"use client";
import { useUser, useClerk } from "@clerk/nextjs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import Link from "next/link";

export default function UserProfile() {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  return (
    <DropdownMenu>
      {isLoaded && (
        <>
          <DropdownMenuTrigger asChild>
            <div className="inline-flex items-center gap-1.5 cursor-default">
              <span>Welcome, {user?.emailAddresses[0].emailAddress}</span> <ChevronDown />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="start">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuGroup>
              <Link href="/profile">
                <DropdownMenuItem>Profile</DropdownMenuItem>
              </Link>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                signOut({ redirectUrl: "/" });
              }}
            >
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </>
      )}
    </DropdownMenu>
  );
}
