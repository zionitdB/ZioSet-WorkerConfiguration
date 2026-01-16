import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useUpdateViewNotification, useDeleteNotification } from "./hooks";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Notification {
  id: number;
  title: string;
  message: string;
  viewed: number;
  raisedTime: string;
  viewedTime?: string | null;
}

export default function NotificationList({
  notifications,
}: {
  notifications: Notification[];
}) {
  const { mutate: markAsRead } = useUpdateViewNotification();
  const { mutate: deleteNotification } = useDeleteNotification();
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const timeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const diff = (Date.now() - date.getTime()) / 1000;
    if (diff < 60) return `${Math.floor(diff)}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  const handleNotificationClick = (id: number, viewed: number) => {
    if (viewed === 0) markAsRead(id);
  };

  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-3">
        <div className="p-4 rounded-full bg-muted shadow-sm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 text-muted-foreground"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 17h5l-1.405-1.405M19 13V7a2 2 0 00-2-2H7a2 2 0 00-2 2v6m14 0a2 2 0 01-2 2H7a2 2 0 01-2-2m14 0H5m4 4h6"
            />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            No Notifications
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            You’re all caught up! There’s nothing new to see right now.
          </p>
        </div>
      </div>
    );
  }

  return (
    <ul className="space-y-2">
      {notifications.map((n) => (
        <li
          key={n.id}
          onClick={() => handleNotificationClick(n.id, n.viewed)}
          className={cn(
            "group cursor-pointer flex items-start gap-4 rounded-xl border p-4 transition-all",
            "hover:bg-accent hover:shadow-sm",
            n.viewed === 0
              ? "bg-accent/30 border-primary/20"
              : "bg-background border-border"
          )}
        >
          {/* Avatar */}
          <Avatar className="h-11 w-11 shadow-sm ring-1 ring-border">
            <AvatarImage
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                n.title
              )}&background=random`}
              alt={n.title}
            />
            <AvatarFallback>
              {n.title
                .split(" ")
                .map((w) => w[0])
                .join("")}
            </AvatarFallback>
          </Avatar>

          {/* Content */}
          <div className="flex flex-col flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h4
                  className={cn(
                    "font-semibold text-sm leading-tight",
                    n.viewed === 0
                      ? "text-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  {n.title}
                </h4>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {n.message}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <time className="text-xs text-muted-foreground whitespace-nowrap">
                  {timeAgo(n.raisedTime)}
                </time>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedId(n.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>

                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Delete Notification
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this notification? This
                        action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => {
                          if (selectedId !== null) {
                            deleteNotification(selectedId);
                            setSelectedId(null);
                          }
                        }}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-2">
              <Badge
                variant={n.viewed === 0 ? "default" : "secondary"}
                className={cn(
                  "text-xs px-2 py-0.5 rounded-full",
                  n.viewed === 0
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {n.viewed === 0 ? "Unread" : "Read"}
              </Badge>

              {n.viewed === 0 && (
                <span className="ml-auto w-2 h-2 rounded-full bg-primary animate-pulse" />
              )}
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
