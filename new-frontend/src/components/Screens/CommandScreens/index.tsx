import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Terminal, Settings2, LucideIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import CommandRoute from "./CommandConfiguration";
import CommandConfigRoute from "./GroupCommandConfiguration";
import Breadcrumb from "@/components/common/breadcrumb";

// --- Types ---
interface TabButtonProps {
  value: string;
  label: string;
  Icon: LucideIcon;
  isActive: boolean;
}

/**
 * Animated Underline Trigger Component
 */
const TabButton: React.FC<TabButtonProps> = ({ value, label, Icon, isActive }) => {
  return (
    <TabsTrigger
      value={value}
      className="relative flex items-center gap-2 px-4 pb-4 pt-2 text-sm font-medium transition-colors hover:text-primary/80 focus-visible:outline-none data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none"
    >
      <Icon className="h-4 w-4" />
      <span className="relative z-10">{label}</span>
      
      {/* Framer Motion Layout Animation */}
      {isActive && (
        <motion.div
          layoutId="activeTabUnderline"
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary shadow-[0_1px_10px_rgba(var(--primary),0.5)]"
          initial={false}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 35
          }}
        />
      )}
    </TabsTrigger>
  );
};

export default function CommandScreen() {
  const [activeTab, setActiveTab] = useState<string>("command");

  return (
    <div>
  
          <div className="mb-6">
  <Breadcrumb
    items={[
      {
        label: "Module Dashboard",
        path: "/dashboard",
      },
      {
        label: "Command",
      },
    ]}
  />
</div>
        <Tabs 
          defaultValue="command" 
          onValueChange={(val) => setActiveTab(val)} 
          className="w-full"
        >
          {/* Custom Navigation Row */}
          <div className="flex items-center justify-between border-b border-border/40">
           <TabsList className="relative h-11 w-full max-w-100 bg-transparent p-0 justify-start gap-6 border-none ring-0"> <TabButton 
                value="command" 
                label="Command Center" 
                Icon={Terminal} 
                isActive={activeTab === "command"} 
              />
              <TabButton 
                value="group" 
                label="Group Configuration" 
                Icon={Settings2} 
                isActive={activeTab === "group"} 
              />
            </TabsList>
          </div>

          {/* Animated Content Transitions */}
          <div className="mt-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
            

                <TabsContent value="command" className="mt-0 ring-offset-background focus-visible:outline-none">
                  <CommandRoute />
          
                </TabsContent>

                <TabsContent value="group" className="mt-0 ring-offset-background focus-visible:outline-none">
                  <CommandConfigRoute />
              
                </TabsContent>
              </motion.div>
            </AnimatePresence>
          </div>
        </Tabs>
    </div>
  );
}