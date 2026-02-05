






import { useState } from "react";
import { 
  Plus, 
  Search, 
  MoreVertical, 
  Terminal, 
  LayoutGrid, 
  List, 
  ChevronRight,
  Filter,
  ChevronLeft,
  ChevronsLeft,
  ChevronsRight,
  TerminalIcon,
  Play
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import Breadcrumb from "@/components/common/breadcrumb";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDeleteScriptTemplate, useGetScriptTemplatesList } from "../ScriptRunner/hooks";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function ScriptTemplateList() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<any>(null);
  
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const { data: TEMPLATES, refetch } = useGetScriptTemplatesList(currentPage, pageSize);

  const TemplateData = TEMPLATES?.data?.content || [];
  const filteredData = TemplateData?.filter((t: any) =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.description.toLowerCase().includes(search.toLowerCase())
  );

  const totalItems = TEMPLATES?.data?.totalElements || filteredData.length;
  const totalPages = TEMPLATES?.data?.totalPages || Math.ceil(totalItems / pageSize);
  const currentItems = filteredData; // Note: slicing usually happens on server in this hook

  const handleSearchChange = (val: string) => {
    setSearch(val);
    setCurrentPage(1);
  };

  const navigate = useNavigate();

  const handleRunNow = (template: any) => {
    navigate('/app/scriptRunner/scriptTemplateRun', { state: { template } });
  };

  const deleteMutation = useDeleteScriptTemplate();

  const handleDelete = (data: any) => {
    setDeleteTarget(data);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (deleteTarget) {
      deleteMutation.mutate(deleteTarget.id, {
        onSuccess: () => {
          refetch();
          setDeleteDialogOpen(false);
          setDeleteTarget(null);
        },
      });
    }
  };

  return (
    <div className="h-screen w-full bg-background flex flex-col overflow-hidden text-foreground">
      <div className="mb-6 px-8 pt-4">
        <Breadcrumb
          items={[
            { label: "Module Dashboard", path: "/app/dashboard" },
            { label: "Script Templates", path: "/app/scriptRunner/scriptTemplate" },
          ]}
        />
      </div>

      {/* 1. Header Area */}
      <header className="h-20 border-b flex items-center justify-between px-8 shrink-0 bg-card/50 backdrop-blur-md">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Script Templates</h1>
          <p className="text-sm text-muted-foreground mt-0.5 font-medium">Manage and deploy reusable automation logic.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="hidden md:flex gap-2 border-dashed">
            <Filter className="h-4 w-4" /> Filter
          </Button>
          <Button 
            className="bg-primary hover:opacity-90 shadow-lg shadow-primary/20 gap-2 px-6"
            onClick={() => navigate("/app/scriptRunner/scriptTemplateForm")}
          >
            <Plus className="h-4 w-4" /> Create Script Template
          </Button>
        </div>
      </header>

      {/* 2. Sub-Toolbar */}
      <div className="h-14 border-b bg-muted/20 px-8 flex items-center justify-between shrink-0">
        <div className="relative w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search templates..." 
            className="pl-10 h-9 bg-background border-none ring-1 ring-border focus-visible:ring-primary/50"
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Total Templates:</span>
            <span className="text-sm font-bold"> {totalItems}</span>
          </div>
          
          {/* Working Layout Toggle Buttons */}
          <div className="flex items-center gap-2 border-l pl-6">
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded transition-colors ${viewMode === 'grid' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-primary'}`}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded transition-colors ${viewMode === 'list' ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-primary'}`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <main className="flex-1 bg-muted/5 overflow-hidden">
        <ScrollArea className="h-full w-full">
          <div className="p-8">
            <div className="max-w-7xl mx-auto">
              
              {viewMode === 'grid' ? (
                /* GRID VIEW LAYOUT */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {currentItems.map((t: any) => (
                    <Card key={t.id} className="group hover:shadow-xl hover:border-primary/40 transition-all duration-300 border-border/50 bg-card overflow-hidden flex flex-col h-70">
                      <CardHeader className="p-5 pb-3">
                        <div className="flex justify-between items-start">
                          <div className="p-2 bg-primary/10 rounded-lg text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                            <Terminal className="h-5 w-5" />
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={`text-[10px] font-bold uppercase tracking-tight ${t.isActive ? "bg-green-600 text-white" : "bg-red-600 text-white"}`}>
                              {t.isActive ? "Active" : "InActive"}
                            </Badge>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleRunNow(t)}>Run Template</DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(t)}>Delete</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                        <CardTitle className="text-lg mt-4 group-hover:text-primary transition-colors truncate">{t.name}</CardTitle>
                      </CardHeader>
                      <CardContent className="p-5 pt-0 flex-1 flex flex-col justify-between">
                        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed italic">
                          "{t.description}"
                        </p>
                        <div className="pt-4 border-t border-border/50 flex items-center justify-between mt-auto">
                          <div className="flex flex-col gap-1">
                            <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Type</span>
                            <span className="text-xs font-semibold">{t.scriptType}</span>
                          </div>
                          <Button variant="link" size="sm" className="h-auto p-0 text-xs font-bold text-primary" onClick={() => handleRunNow(t)}>
                            Run Now <ChevronRight className="h-3 w-3" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                /* BEAUTIFUL LIST VIEW LAYOUT */
                <div className="flex flex-col gap-3">
                  {currentItems.map((t: any) => (
                    <div 
                      key={t.id} 
                      className="group flex items-center bg-card border border-border/50 rounded-xl p-4 hover:border-primary/40 hover:shadow-md transition-all duration-200"
                    >
                      <div className="p-3 bg-primary/10 rounded-xl text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors shrink-0">
                        <Terminal className="h-5 w-5" />
                      </div>
                      
                      <div className="flex-1 px-6 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-bold text-base group-hover:text-primary transition-colors truncate">
                            {t.name}
                          </h3>
                          <Badge className={`text-[10px] h-5 ${t.isActive ? "bg-green-600/10 text-green-600 border-green-600/20" : "bg-red-600/10 text-red-600 border-red-600/20"}`} variant="outline">
                            {t.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground truncate italic">
                          {t.description}
                        </p>
                      </div>

                      <div className="flex items-center gap-12 shrink-0">
                        <div className="hidden lg:flex flex-col">
                          <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Type</span>
                          <span className="text-xs font-semibold">{t.scriptType}</span>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <Button 
                            variant="secondary" 
                            size="sm" 
                            className="h-9 px-4 gap-2 font-semibold"
                            onClick={() => handleRunNow(t)}
                          >
                            <Play className="h-3.5 w-3.5 fill-current" /> Run Now
                          </Button>
                          
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-9 w-9">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleRunNow(t)}>Run Template</DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(t)}>Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </div>
          </div>
        </ScrollArea>
      </main>

      {/* 3. Footer / Pagination */}
      <footer className="h-16 border-t bg-card px-8 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <p className="text-xs font-medium text-muted-foreground">Rows per page</p>
          <Select 
            value={pageSize.toString()} 
            onValueChange={(val) => {
              setPageSize(Number(val));
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="h-8 w-17.5 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="6">6</SelectItem>
              <SelectItem value="12">12</SelectItem>
              <SelectItem value="24">24</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-6">
          <p className="text-xs font-medium text-muted-foreground">
            Page {currentPage} of {totalPages || 1}
          </p>
          <div className="flex items-center gap-1">
            <Button 
              variant="outline" 
              size="icon" 
              className="h-8 w-8" 
              onClick={() => setCurrentPage(1)} 
              disabled={currentPage === 1}
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              className="h-8 w-8" 
              onClick={() => setCurrentPage(prev => prev - 1)} 
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              className="h-8 w-8" 
              onClick={() => setCurrentPage(prev => prev + 1)} 
              disabled={currentPage === totalPages || totalPages === 0}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              className="h-8 w-8" 
              onClick={() => setCurrentPage(totalPages)} 
              disabled={currentPage === totalPages || totalPages === 0}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </footer>

      {/* Delete Confirmation Alert */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="rounded-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 bg-destructive/10 rounded-lg">
                <TerminalIcon className="h-6 w-6 text-destructive" />
              </div>
              Confirm Delete
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base pt-2">
              Are you sure you want to delete Template{" "}
              <span className="font-semibold text-foreground">
                {deleteTarget?.name}
              </span>
              ? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel className="rounded-lg">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive hover:bg-destructive/90 rounded-lg"
            >
              Delete Script Template
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}