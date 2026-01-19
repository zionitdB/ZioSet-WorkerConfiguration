
import { useState, useEffect } from "react";
import {  IconLogout, IconLock } from "@tabler/icons-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import CustomModal from "@/components/common/Modal/DialogModal"; // Your modal component
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { User2Icon } from "lucide-react";
import { useChangePassword, useGetUserById } from "./UserProfile/hooks";
import { useLogout } from "../login/hook";

export default function ProfileSection() {
  const [open, setOpen] = useState(false);
  // const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [greeting, setGreeting] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  
 const storedUser = JSON.parse(sessionStorage.getItem("user") || "{}");
const userId = storedUser?.isd || "";


  const { data: userDetails } = useGetUserById(userId);


  const { mutate: updatePassword } = useChangePassword();
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
    userId: userId, 
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


  const navigate = useNavigate();

  // const handleLogout = () => {
  //   localStorage.removeItem("user");
  //   navigate("/login");
  // };



  const logoutMutation = useLogout();

const handleLogout = () => {
  logoutMutation.mutate(undefined, {
    onSuccess: () => {
      localStorage.removeItem("user");
      navigate("/login");
    },
  });
};




    const handleProfile = () => {
    navigate("/user-profile");
  };


  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
  }, []);


  


  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
     <PopoverTrigger asChild>
      <motion.button
        aria-label="User Account Menu"
        className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/20 text-foreground shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <FaUser className="w-6 h-6" />
      </motion.button>
    </PopoverTrigger>
        <PopoverContent
          align="end"
          sideOffset={10}
          className="w-90 rounded-xl border border-gray-200 bg-background p-5 shadow-2xl dark:border-gray-700 "
        >
          {/* Greeting */}
          <div className="mb-4">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
              {greeting}, <span className="font-normal">{userDetails?.firstName||''} {userDetails?.lastName||""}</span>
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">{userDetails?.department?.departmentName||""}</p>
          </div>

          {/* Search Input */}
          {/* <div className="relative mb-4">
            <IconSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="search"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search profile options"
              className="w-full rounded-md border border-gray-300 px-10 py-2 text-sm placeholder-gray-400 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
            />
          </div> */}

          <hr className="mb-4 border-gray-200 dark:border-gray-700" />

          {/* Toggles */}
          {/* <div className="mb-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Allow Notifications
              </span>
              <Switch
                checked={notificationsEnabled}
                onCheckedChange={setNotificationsEnabled}
                className={`${
                  notificationsEnabled ? "bg-primary-600" : "bg-gray-300 dark:bg-gray-600"
                } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500`}
              >
                <span
                  className={`${
                    notificationsEnabled ? "translate-x-6" : "translate-x-1"
                  } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                />
              </Switch>
            </div>
          </div> */}

          <hr className="mb-4 border-gray-200 dark:border-gray-700" />

          {/* Menu Items */}
          <nav className="flex flex-col space-y-2">
            <button
              className="flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 transition-all duration-200"
              aria-label="profile"
                  onClick={handleProfile}
            >
              <User2Icon className="mr-2 h-5 w-5" />
              Profile
            </button>

            <button
              className="flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 transition-all duration-200"
              onClick={() => setIsModalOpen(true)}
            >
              <IconLock className="mr-2 h-5 w-5" />
              Change Password
            </button>

            <button
              className="flex items-center rounded-md px-3 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 transition-all duration-200 shadow-md"
              aria-label="Logout"
              onClick={handleLogout}
            >
              <IconLogout className="mr-2 h-5 w-5" />
              Logout
            </button>
          </nav>
        </PopoverContent>
      </Popover>
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
  <div>

    {/* <div className="p-2">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Username
      </label>
      <p className="font-semibold">{userDetails?.userName}</p>
    </div> */}

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


    </>
  );
}
