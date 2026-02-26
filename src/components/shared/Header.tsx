"use client";

import React from "react";
import { Bell, LogOut, Settings, User, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface HeaderProps {
  /** Dynamic page title displayed on the left */
  title: string;
  /** Optional subtitle / breadcrumb text */
  subtitle?: string;
  /** User display name */
  userName?: string;
  /** User email address */
  userEmail?: string;
  /** User avatar image URL */
  userAvatarUrl?: string;
  /** Unread notification count (0 hides the badge) */
  notificationCount?: number;
  /** Callback fired when the notification bell is clicked */
  onNotificationClick?: () => void;
  /** Callback fired when the user selects "Log out" */
  onLogout?: () => void;
  /** Callback fired when the user selects "Settings" */
  onSettingsClick?: () => void;
  /** Callback fired when the user selects "Profile" */
  onProfileClick?: () => void;
  /** Additional class names for the outer container */
  className?: string;
}

// ---------------------------------------------------------------------------
// Helper -- derive initials from a name string
// ---------------------------------------------------------------------------

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part.charAt(0))
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function Header({
  title,
  subtitle,
  userName = "User",
  userEmail = "",
  userAvatarUrl,
  notificationCount = 0,
  onNotificationClick,
  onLogout,
  onSettingsClick,
  onProfileClick,
  className,
}: HeaderProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-20 flex h-16 items-center justify-between border-b bg-background/95 px-4 backdrop-blur-sm sm:px-6",
        className
      )}
    >
      {/* ---------- Left: page title ---------- */}
      <div className="flex flex-col justify-center pl-12 lg:pl-0">
        <h1 className="text-lg font-semibold leading-tight text-foreground">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        )}
      </div>

      {/* ---------- Right: notifications + user menu ---------- */}
      <div className="flex items-center gap-2">
        {/* Notification bell */}
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label={`Notifications${notificationCount > 0 ? ` (${notificationCount} unread)` : ""}`}
          onClick={onNotificationClick}
        >
          <Bell className="size-5 text-muted-foreground" />
          {notificationCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -right-1 -top-1 flex size-5 items-center justify-center p-0 text-[10px]"
            >
              {notificationCount > 99 ? "99+" : notificationCount}
            </Badge>
          )}
        </Button>

        {/* User dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-2 px-2 py-1.5 h-auto"
            >
              <Avatar size="sm">
                {userAvatarUrl && (
                  <AvatarImage src={userAvatarUrl} alt={userName} />
                )}
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                  {getInitials(userName)}
                </AvatarFallback>
              </Avatar>
              <span className="hidden text-sm font-medium sm:inline-block">
                {userName}
              </span>
              <ChevronsUpDown className="hidden size-4 text-muted-foreground sm:inline-block" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col gap-0.5">
                <p className="text-sm font-medium">{userName}</p>
                {userEmail && (
                  <p className="text-xs text-muted-foreground truncate">
                    {userEmail}
                  </p>
                )}
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <DropdownMenuItem onClick={onProfileClick}>
                <User className="mr-2 size-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onSettingsClick}>
                <Settings className="mr-2 size-4" />
                Settings
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuItem variant="destructive" onClick={onLogout}>
              <LogOut className="mr-2 size-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

export default Header;
