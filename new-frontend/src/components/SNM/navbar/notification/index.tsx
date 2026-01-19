"use client";

import { useState, useMemo } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { FaBell } from "react-icons/fa";
import {
  useGetAllNotifications,
  useGetReadNotifications,
  useGetUnreadNotifications,
} from "./hooks";
import NotificationList from "./notificationList";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

const statusOptions = [
  { value: "all", label: "All Notifications" },
  { value: "read", label: "Read" },
  { value: "unread", label: "Unread" },
];

export default function NotificationSection() {
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState<"all" | "read" | "unread">("all");

const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
const departmentName = storedUser?.department?.departmentName || "";


  const {
    data: allNotifications = [],
    isLoading: loadingAll,
  } = useGetAllNotifications(departmentName);
  const {
    data: readNotifications = [],
    isLoading: loadingRead,
  } = useGetReadNotifications(departmentName);
  const {
    data: unreadNotifications = [],
    isLoading: loadingUnread,
  } = useGetUnreadNotifications(departmentName);

  // ✅ Select dataset based on filter
  const { notifications, loading } = useMemo(() => {
    switch (filter) {
      case "read":
        return { notifications: readNotifications, loading: loadingRead };
      case "unread":
        return { notifications: unreadNotifications, loading: loadingUnread };
      default:
        return { notifications: allNotifications, loading: loadingAll };
    }
  }, [
    filter,
    allNotifications,
    readNotifications,
    unreadNotifications,
    loadingAll,
    loadingRead,
    loadingUnread,
  ]);

  return (
    <Popover open={open} onOpenChange={setOpen}>

      <PopoverTrigger asChild>
        <button
          aria-label="Notifications"
          className={cn(
            "relative rounded-md p-2 transition-colors",
            "bg-secondary text-secondary-foreground hover:bg-secondary/80"
          )}
        >
          <FaBell className="text-lg" />
          {unreadNotifications?.length > 0 && (
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-destructive rounded-full animate-pulse border border-background" />
          )}
        </button>
      </PopoverTrigger>

      {/* 🔽 Popover Content */}
      <PopoverContent
        side="bottom"
        align="end"
        className={cn(
          "w-[24rem] sm:w-[28rem] md:w-[32rem] lg:w-[36rem]",
          "max-h-[calc(100vh-5rem)] rounded-lg border shadow-md p-4",
          "bg-popover text-popover-foreground transition-all duration-200"
        )}
      >

        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <h3 className="text-lg font-semibold">Notifications</h3>
            <span className="rounded-full bg-primary text-primary-foreground px-2 text-xs font-medium">
              {allNotifications?.length || 0}
            </span>
          </div>
          {/* <button className="text-sm text-primary underline hover:opacity-80">
            Mark all as read
          </button> */}
        </div>

        {/* Filter Dropdown */}
        <div className="mb-3">
          <Select value={filter} onValueChange={(val: "all" | "read" | "unread") => setFilter(val)}>
            <SelectTrigger className="w-full">
              <span>{statusOptions.find((opt) => opt.value === filter)?.label}</span>
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map(({ value, label }) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Notifications List or Skeleton */}
        {loading ? (
          <ul className="divide-y divide-border">
            {[...Array(4)].map((_, idx) => (
              <li key={idx} className="flex flex-col gap-2 p-3">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex flex-col gap-1 flex-1">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
                <Skeleton className="h-3 w-full" />
              </li>
            ))}
          </ul>
        ) : (
      <NotificationList notifications={notifications.slice(0, 3)} />

        )}


        <div className="mt-4 flex justify-center">
    <Link to="/notifications"     onClick={() => setOpen(false)} >
    <Button variant="outline" size="sm">
      View All
    </Button>
  </Link>
        </div>
      </PopoverContent>
    </Popover>
  );
}
