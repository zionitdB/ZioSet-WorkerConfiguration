import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import ProfileSection from "./profile";
import NotificationSection from "./notification";
import { ThemeCustomizer } from "@/components/components/customizer";
import SearchCommandDialog from "./SearchModalNavigation";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { FiBox, FiSearch, FiMenu } from "react-icons/fi";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const SimpleNavbar: React.FC<{ toggleSidebar: any }> = ({ toggleSidebar }) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();

  // Routes where sidebar button should be hidden
  const hideSidebarRoutes = ["/dashboard", "/settings"];
  const shouldHideSidebarButton = hideSidebarRoutes.includes(location.pathname);

  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      id="app-header"
      className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60"
    >
      <div className="flex h-16 items-center justify-between px-4 lg:px-6">
        
        {/* Left Section - Logo & Menu */}
        <div className="flex items-center gap-3 lg:gap-4">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <motion.div 
              whileHover={{ scale: 1.05, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 rounded-xl bg-linear-to-br from-primary to-primary/70 flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20"
            >
              <FiBox className="w-5 h-5" />
            </motion.div>
            <div className="hidden sm:block">
              <img 
                src="/logo-02.png" 
                alt="Zioset Agent" 
                className="h-7 w-auto dark:invert dark:brightness-200 transition-all" 
              />
            </div>
          </div>

          {/* Sidebar Toggle Button */}
          {!shouldHideSidebarButton && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={toggleSidebar}
                    className="hidden md:flex items-center justify-center w-9 h-9 rounded-lg border border-border bg-background hover:bg-accent transition-colors"
                    aria-label="Toggle Sidebar"
                  >
                    <FiMenu className="w-4 h-4" />
                  </motion.button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>Toggle Sidebar</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}

          {/* Mobile Menu Button */}
          {!shouldHideSidebarButton && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleSidebar}
              className="flex md:hidden items-center justify-center w-9 h-9 rounded-lg border border-border bg-background hover:bg-accent transition-colors"
              aria-label="Toggle Sidebar"
            >
              <FiMenu className="w-4 h-4" />
            </motion.button>
          )}
        </div>

        {/* Center Section - Search (Desktop) */}
        <div className="hidden lg:flex flex-1 max-w-md mx-8">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.div 
                  whileHover={{ scale: 1.01 }}
                  className="relative w-full cursor-pointer group"
                  onClick={() => setSearchOpen(true)}
                        id="quick-search"
                >
                  <div className="relative">
                    <Input 
                      readOnly 
                      placeholder="Search anything..." 
                      className="w-full h-10 pl-10 pr-16 bg-muted/50 border-border/50 focus-visible:ring-primary/20 transition-all group-hover:bg-muted group-hover:border-primary/30" 
                    />
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                      <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-background px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                        <span className="text-xs">⌘</span>K
                      </kbd>
                    </div>
                  </div>
                </motion.div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Quick search (⌘K)</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center gap-2">
          {/* Mobile Search Button */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.button
          
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSearchOpen(true)}
                  className="flex lg:hidden items-center justify-center w-9 h-9 rounded-lg border border-border bg-background hover:bg-accent transition-colors"
                  aria-label="Search"
                >
                  <FiSearch className="w-4 h-4" />
                </motion.button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Search</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Theme Customizer */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center justify-center w-9 h-9 rounded-lg border border-border bg-background hover:bg-accent transition-colors cursor-pointer"
                >
                  <ThemeCustomizer />
                </motion.div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Customize Theme</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Notifications */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  id="notifications"
                  className="flex items-center justify-center w-9 h-9 rounded-lg border border-border bg-background hover:bg-accent transition-colors cursor-pointer relative"
                >
                  <NotificationSection />
                </motion.div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Notifications</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Divider */}
          <div className="hidden sm:block w-px h-6 bg-border mx-1" />

          {/* Profile Section */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="ml-1"
            id="user-profile"
          >
            <ProfileSection />
          </motion.div>
        </div>
      </div>

      <SearchCommandDialog open={searchOpen} setOpen={setSearchOpen} />
    </motion.nav>
  );
};

export default SimpleNavbar;