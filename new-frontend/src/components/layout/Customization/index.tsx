import { useState } from "react";
import { IconX } from "@tabler/icons-react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";

import BorderRadius from "./BorderRadius";
import FontFamily from "./FontFamily";
import { ThemeSwitcher } from "./themeSwitcher";
import { ThemeCustomizer } from "@/components/components/customizer";

export default function Customization() {
  const [open, setOpen] = useState(false);

  return (
    <Drawer direction="right" open={open} onOpenChange={setOpen}>
      {/* Trigger Button (FAB) */}
   
        <Button
          size="icon"
          className="fixed right-2 top-1/4 z-50 h-12 w-12 rounded-tl-full rounded-bl-full rounded-tr-full rounded-br-md shadow-md
            bg-primary text-primary-foreground dark:bg-primary dark:text-primary-foreground"
        >

          {/* Animated rotating IconSettings */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              repeat: Infinity,
              ease: "linear",
              duration: 2,
            }}
          >
            <ThemeCustomizer  />
          </motion.div>
        </Button>


      {/* Drawer Content */}
      <DrawerContent
        className="bg-background text-foreground dark:bg-background dark:text-foreground 
                   w-[280px] ml-auto h-full shadow-xl border-l border-border dark:border-border"
      >
        {/* Header */}
        <DrawerHeader className="flex justify-between items-center px-4 py-3 border-b border-border dark:border-border">
          <DrawerTitle className="text-lg font-semibold">UI Customization</DrawerTitle>
          <DrawerClose asChild>
            <Button size="icon" variant="ghost" className="text-foreground dark:text-foreground">
              <IconX className="w-5 h-5" />
            </Button>
          </DrawerClose>
        </DrawerHeader>

        {/* Scrollable Content Area */}
        <ScrollArea className="h-full mb-6 p-4 space-y-6 bg-background text-foreground dark:bg-background dark:text-foreground">
          <div>
            <FontFamily />
            <Separator className="border-border dark:border-border" />
          </div>
          <div>
            <BorderRadius />
            <Separator className="border-border dark:border-border" />
          </div>
          <div className="mb-32">
            <ThemeSwitcher />
            <Separator className="border-border dark:border-border" />
          </div>
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  );
}
