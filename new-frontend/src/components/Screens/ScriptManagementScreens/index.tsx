import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Terminal, Settings2, LucideIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ScriptRunner from "./ScriptRunner";
import ScriptListRoute from "./ScriptList";
import ExecutionResultRoute from "./ExucutionResult";
import Breadcrumb from "@/components/common/breadcrumb";


interface TabButtonProps {
  value: string;
  label: string;
  Icon: LucideIcon;
  isActive: boolean;
}


const TabButton: React.FC<TabButtonProps> = ({ value, label, Icon, isActive }) => {
  return (
    <TabsTrigger
      value={value}
      className="relative flex items-center gap-2 px-4 pb-4 pt-2 text-sm font-medium transition-colors hover:text-primary/80 focus-visible:outline-none data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none"
    >
      <Icon className="h-4 w-4" />
      <span className="relative z-10">{label}</span>
      
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

export default function ScriptManagementScreen() {
  const [activeTab, setActiveTab] = useState<string>("addscript");

  return (
    <div>
  
   <div className="mb-6">
          <Breadcrumb
            items={[
              {
                label: "Module Dashboard",
                path: "/app/dashboard",
              },
              {
                label: "Script Management",
              },
            ]}
          />
        </div>

        
        <Tabs 
          defaultValue="addscript" 
          onValueChange={(val) => setActiveTab(val)} 
          className="w-full"
        >
          {/* Custom Navigation Row */}
          <div className="flex items-center justify-between border-b border-border/40">
           <TabsList className="relative h-11 w-full max-w-100 bg-transparent p-0 justify-start gap-6 border-none ring-0"> <TabButton 
                value="addscript" 
                label="Add Script" 
                Icon={Terminal} 
                isActive={activeTab === "addscript"} 
              />
              <TabButton 
                value="scriptList" 
                label="Script List" 
                Icon={Settings2} 
                isActive={activeTab === "scriptList"} 
              />
               <TabButton 
                value="execution" 
                label="Execution Result" 
                Icon={Settings2} 
                isActive={activeTab === "execution"} 
              />
            </TabsList>
          </div>


          <div className="mt-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >

                     <TabsContent value="addscript" className="mt-0 ring-offset-background focus-visible:outline-none">
                  <ScriptRunner />
              
                </TabsContent>


                <TabsContent value="scriptList" className="mt-0 ring-offset-background focus-visible:outline-none">
                  <ScriptListRoute />
          
                </TabsContent>

           

                  <TabsContent value="execution" className="mt-0 ring-offset-background focus-visible:outline-none">
                  <ExecutionResultRoute />
              
                </TabsContent>
              </motion.div>
            </AnimatePresence>
          </div>
        </Tabs>
    </div>
  );
}