

// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogClose,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { ReactNode } from "react";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Loader2 } from "lucide-react";

// interface CustomModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   dialogTitle?: string;
//   dialogDescription?: string;
//   children?: ReactNode;
//   formId?: string;
//   isLoading?: boolean;
//   width?: any;
//   height?: any;
//   showCloseButton?: boolean;
//   showSaveButton?: boolean;
// }

// const CustomModal = ({
//   isOpen,
//   onClose,
//   dialogTitle = "Dialog Title",
//   dialogDescription = "Dialog Description",
//   children,
//   formId,
//   isLoading = false,
//   width,
//   height,
//   showCloseButton = true,
//   showSaveButton = true,
// }: CustomModalProps) => {
//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent 
//         className={`${width} border-border bg-background shadow-lg ${height}`}
//       >
//         {/* Enhanced Header */}
//         <DialogHeader className="space-y-2 pb-4 border-b border-border">
//           <DialogTitle className="text-xl font-semibold tracking-tight text-foreground">
//             {dialogTitle}
//           </DialogTitle>
//           {dialogDescription && (
//             <DialogDescription className="text-sm text-muted-foreground">
//               {dialogDescription}
//             </DialogDescription>
//           )}
//         </DialogHeader>

//         {/* Scrollable Content */}
//         <ScrollArea className="max-h-[400px] pr-2">
//           <div className="modal-body pb-4">{children}</div>
//         </ScrollArea>

//         {/* Enhanced Footer */}
//         <DialogFooter className="sm:justify-start md:justify-end gap-2 pt-4 border-t border-border">
//           {showCloseButton && (
//             <DialogClose asChild>
//               <Button 
//                 type="button" 
//                 variant="secondary" 
//                 onClick={onClose}
//                 disabled={isLoading}
//                 className="transition-colors"
//               >
//                 Close
//               </Button>
//             </DialogClose>
//           )}
//           {showSaveButton && formId && (
//             <Button 
//               form={formId} 
//               type="submit"
//               disabled={isLoading}
//               className="min-w-[80px] transition-colors"
//             >
//               {isLoading ? (
//                 <>
//                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                   Saving...
//                 </>
//               ) : (
//                 "Save"
//               )}
//             </Button>
//           )}
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default CustomModal;





import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2 } from "lucide-react";
import { ReactNode } from "react";

interface CustomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  dialogTitle?: string;
  dialogDescription?: string;
  children?: ReactNode;
  formId?: string;
  isLoading?: boolean;
  side?: "top" | "bottom" | "left" | "right";
  width?: string;
  height?: string;
  showCloseButton?: boolean;
  showSaveButton?: boolean;
}

const CustomModal = ({
  isOpen,
  onClose,
  dialogTitle = "Title",
  dialogDescription,
  children,
  formId,
  isLoading = false,
  side = "right",
  width = "w-130!",
  showCloseButton = true,
  showSaveButton = true,
}: CustomSheetProps) => {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side={side} className={`${width} max-w-none! w-130! flex flex-col`}>
        {/* Header */}
   <SheetHeader className="border-b border-border pb-2 space-y-3">
  <div className="flex items-center gap-3">
    <span className="h-8 w-1 rounded-full bg-primary" />
    <SheetTitle className="text-lg font-semibold tracking-tight">
      {dialogTitle}
    </SheetTitle>
  </div>

  {dialogDescription && (
    <SheetDescription className="text-sm text-muted-foreground pl-4">
      {dialogDescription}
    </SheetDescription>
  )}
</SheetHeader>


        {/* Scrollable Body */}
        <ScrollArea className="flex-1 max-h-120  pr-2">
          <div className="py-4 px-4">{children}</div>
        </ScrollArea>

        {/* Footer */}
        <SheetFooter className="border-t pt-4 gap-2">
          {showCloseButton && (
            <SheetClose asChild>
              <Button
                variant="secondary"
                onClick={onClose}
                disabled={isLoading}
              >
                Close
              </Button>
            </SheetClose>
          )}

          {showSaveButton && formId && (
            <Button
              type="submit"
              form={formId}
              disabled={isLoading}
              className="min-w-22.5"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save"
              )}
            </Button>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default CustomModal;
