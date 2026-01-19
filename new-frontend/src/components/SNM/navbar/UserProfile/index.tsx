import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, Mail, Phone, Building, ShieldCheck, BadgeCheck, Lock as IconLock, RollerCoaster } from "lucide-react";
import { useChangePassword, useGetUserById } from "./hooks";
import CustomModal from "@/components/common/Modal/DialogModal";
import { Separator } from "@/components/ui/separator";
import { FaGenderless } from "react-icons/fa";

const UserProfileSection: React.FC = () => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
const userId = storedUser?.id || "";


  const { data: userDetails, isLoading: loadingDetails } = useGetUserById(userId);

  const { mutate: updatePassword } = useChangePassword();

  const [isModalOpen, setIsModalOpen] = useState(false);
const [passwordForm, setPasswordForm] = useState({
  newPassword: "",
  confirmPassword: "",
});

const [errorMessage, setErrorMessage] = useState("");

const handlePasswordChange = (field: string, value: string) => {
  setPasswordForm((prev) => ({ ...prev, [field]: value }));
};

const handlePasswordSubmit = () => {
  const { newPassword, confirmPassword } = passwordForm;

  if (newPassword !== confirmPassword) {
    setErrorMessage("New password and Confirm password do not match!");
    return;
  }

  setErrorMessage("");

  const payload = {
    userName: userDetails?.userName, 
    newPassword,
  };

  updatePassword(payload, {
    onSuccess: () => {
      setIsModalOpen(false);
      setPasswordForm({ newPassword: "", confirmPassword: "" });
    },
    onError: (error) => {
      console.log("Password update failed:", error);
    },
  });
};




  if (loadingDetails) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <p className="text-muted-foreground">Loading Profile...</p>
      </div>
    );
  }

  if (!userDetails) {
    return <p className="text-center text-red-500">User data not found.</p>;
  }

  const {
    firstName,
    lastName,
    emailId,
    contactNo,
    empId,
    userName,
    role,
    department,
    active,
    gender,
  } = userDetails;

  return (
    <div className=" mx-auto p-6 space-y-6">
      <Card className="shadow-lg border rounded-2xl">
        <CardHeader className="flex gap-4 items-center">
          <Avatar className="h-20 w-20">
            <AvatarImage
              src={`https://ui-avatars.com/api/?name=${firstName}+${lastName}&background=random`}
            />
            <AvatarFallback>
              {(firstName[0] + lastName[0]).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="flex flex-col flex-1">
            <CardTitle className="text-2xl font-semibold">
              {firstName} {lastName}
            </CardTitle>

            <div className="flex items-center gap-2 mt-1">
              <Badge variant="default" className="flex items-center gap-1">
                <ShieldCheck size={14} />
                {role?.roleName}
              </Badge>

              <Badge variant={active ? "default" : "destructive"}>
                {active ? "Active" : "Inactive"}
              </Badge>
            </div>
          </div>

          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => setIsModalOpen(true)}
          >
            <IconLock className="h-5 w-5" /> Change Password
          </Button>
        </CardHeader>

<Separator/>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div className="flex gap-3 items-center p-4 border rounded-xl bg-muted/40">
            <User className="text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Username</p>
              <p className="font-semibold">{userName}</p>
            </div>
          </div>

          <div className="flex gap-3 items-center p-4 border rounded-xl bg-muted/40">
            <Mail className="text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Email</p>
              <p className="font-semibold">{emailId}</p>
            </div>
          </div>

          <div className="flex gap-3 items-center p-4 border rounded-xl bg-muted/40">
            <Phone className="text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Contact No</p>
              <p className="font-semibold">{contactNo}</p>
            </div>
          </div>
  <div className="flex gap-3 items-center p-4 border rounded-xl bg-muted/40">
            <FaGenderless className="text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Gender</p>
              <p className="font-semibold">{gender}</p>
            </div>
          </div>
          <div className="flex gap-3 items-center p-4 border rounded-xl bg-muted/40">
            <Building className="text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Department</p>
              <p className="font-semibold">
                {department?.departmentName} ({department?.code})
              </p>
            </div>
          </div>

          <div className="flex gap-3 items-center p-4 border rounded-xl bg-muted/40">
            <BadgeCheck className="text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Employee ID</p>
              <p className="font-semibold">{empId}</p>
            </div>
          </div>
             <div className="flex gap-3 items-center p-4 border rounded-xl bg-muted/40">
            <RollerCoaster className="text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Role</p>
              <p className="font-semibold">{role?.roleName}</p>
            </div>
          </div>
        </CardContent>
      </Card>
<CustomModal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  dialogTitle="Change Password"
  dialogDescription="Update your account password"
  width="max-w-md"
  formId="change-password-form"
  showCloseButton={false}
  showSaveButton={false}
>
  <div >

    {/* Show username as text only */}
    <div className="p-2">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Username
      </label>
      <p className="font-semibold">{userDetails?.userName}</p>
    </div>

    {/* Password Fields */}
    {["newPassword", "confirmPassword"].map((field, idx) => (
      <div key={idx} className="space-y-1 p-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
          {field.replace(/([A-Z])/g, " $1")}
        </label>
        <Input
          type="password"
          value={(passwordForm as any)[field]}
          onChange={(e) => handlePasswordChange(field, e.target.value)}
          placeholder={`Enter ${field.replace(/([A-Z])/g, " $1")}`}
        />
      </div>
    ))}

    {errorMessage && (
      <p className="text-red-500 text-sm px-2">{errorMessage}</p>
    )}

    <div className="flex justify-end gap-2 mt-4">
      <Button variant="outline" onClick={() => setIsModalOpen(false)}>
        Close
      </Button>
      <Button type="button" onClick={handlePasswordSubmit}>
        Submit
      </Button>
    </div>
  </div>
</CustomModal>


    </div>
  );
};

export default UserProfileSection;
