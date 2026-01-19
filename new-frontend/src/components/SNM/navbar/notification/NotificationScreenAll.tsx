

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  useGetAllNotifications,
  useGetReadNotifications,
  useGetUnreadNotifications,
} from "./hooks";
import { Skeleton } from "@/components/ui/skeleton";
import NotificationList from "./notificationList";

export default function NotificationsPage() {
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
const departmentName = storedUser?.department?.departmentName || "";

  const {
    data: all = [],
    isLoading: loadingAll,
  } = useGetAllNotifications(departmentName);

  const {
    data: read = [],
    isLoading: loadingRead,
  } = useGetReadNotifications(departmentName);

  const {
    data: unread = [],
    isLoading: loadingUnread,
  } = useGetUnreadNotifications(departmentName);

  return (
    <div className="w-full mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Notifications</h1>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Notifications</TabsTrigger>
          <TabsTrigger value="read">Read</TabsTrigger>
          <TabsTrigger value="unread">Unread</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          {loadingAll ? (
            <NotificationSkeleton />
          ) : (
            <NotificationList notifications={all} />
          )}
        </TabsContent>

        <TabsContent value="read">
          {loadingRead ? (
            <NotificationSkeleton />
          ) : (
            <NotificationList notifications={read} />
          )}
        </TabsContent>

        <TabsContent value="unread">
          {loadingUnread ? (
            <NotificationSkeleton />
          ) : (
            <NotificationList notifications={unread} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Reusable Skeleton for loading state
function NotificationSkeleton() {
  return (
    <ul className="divide-y divide-border">
      {[...Array(6)].map((_, idx) => (
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
  );
}
