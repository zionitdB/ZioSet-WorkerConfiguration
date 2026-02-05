
// import { Outlet } from "react-router-dom";
// import Navbar from "../SNM/navbar";
// import { NavigationProgress } from "./topProgressBar";
// import Customization from "../layout/Customization";
// import Sidebar from "../SNM/Sidebar";
// import { useState } from "react";
// import { ScrollArea } from "@/components/ui/scroll-area";

// export default function RootRoute() {
//   const [sidebarOpen, setSidebarOpen] = useState(true);

//   return (
//     <>
//       <NavigationProgress />
//       <div className="flex flex-col h-screen overflow-hidden">
 
//         <Navbar
//           toggleSidebar={() => setSidebarOpen((prev) => !prev)}
//         />

//         <div className="flex flex-1 overflow-hidden">
//           <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

//           <main
//             className="flex-1 border bg-background text-foreground"
//             style={{ borderRadius: "calc(var(--radius) - 4px)" }}
//           >
//             <ScrollArea className="h-[calc(100vh-4rem)]"> 
//               <div className="mx-auto max-w-screen-2xl md:p-6">
//                 <Outlet />
//               </div>
//               <Customization />
              
//             </ScrollArea>
//           </main>
//         </div>
//       </div>
//     </>
//   );
// }













import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../SNM/navbar";
import { NavigationProgress } from "./topProgressBar";
import Customization from "../layout/Customization";
import Sidebar from "../SNM/Sidebar";
import { useState } from "react";
import { ScrollArea } from "../ui/scroll-area";
export default function RootRoute() {
  const location = useLocation();
  const hideSidebarRoutes = ["/app/dashboard", "/settings"];
  const shouldHideSidebar = hideSidebarRoutes.includes(location.pathname);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <>
      <NavigationProgress />
      <div className="flex flex-col h-screen overflow-hidden ">
        {/* Navbar on top */}
        <Navbar toggleSidebar={() => setSidebarOpen((prev) => !prev)} />

        {/* Sidebar and main content below navbar */}
        <div className="flex flex-1 overflow-hidden">
          {/* {shouldHideSidebar ? (
            <ModuleSidebar />
          ) : (
            <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
          ):null} */}

             {!shouldHideSidebar && (
                    <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
                  )}
 <main
            className="flex-1 border bg-background text-foreground"
            style={{ borderRadius: "calc(var(--radius) - 4px)" }}
          >
            <ScrollArea className="h-[calc(100vh-4rem)]"> 
              <div className="mx-auto p-4">
                <Outlet />
              </div>
              
              <Customization />
              
            </ScrollArea>
          </main>
        </div>
      </div>
    </>
  );
}