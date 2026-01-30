import { useState } from "react";
import { 
  Plus, Search, Terminal, LayoutGrid, List, ChevronRight,
   ChevronLeft, ChevronsLeft, ChevronsRight,
  Calendar, Clock,
  Sparkles
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import Breadcrumb from "@/components/common/breadcrumb";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useGetScriptCount, useGetScripts } from "../../ScriptList/hooks";


export default function ScriptCardList() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const { data: rowData } = useGetScripts(currentPage, pageSize);
  const { data: scriptCount } = useGetScriptCount();

  const filteredData = (rowData || [])?.filter((t: any) =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.template?.name.toLowerCase().includes(search.toLowerCase()) ||
    t.description.toLowerCase().includes(search.toLowerCase())
  );

  const totalItems = scriptCount || 0;
  const totalPages = Math.ceil(totalItems / pageSize);

  const handleSearchChange = (val: string) => {
    setSearch(val);
    setCurrentPage(1);
  };



//   const handleRunNow = () => {
//     navigate(`/scriptRunner/scriptRunner`);
//   };

  return (
    <div className="h-screen w-full bg-background flex flex-col overflow-hidden text-foreground">
      <div className="mb-6 px-8 pt-4">
        <Breadcrumb
          items={[
            { label: "Module Dashboard", path: "/dashboard" },
              { label: "Script Dashboard", path: "/scriptRunner/scriptDashboard" },
            { label: "Script List", path: "/scriptRunner/scriptDashboard" },
          ]}
        />
      </div>

      {/* 1. Header Area */}
      <header className="h-20 border-b flex items-center justify-between px-8 shrink-0 bg-card/50 backdrop-blur-md">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Configured Scripts</h1>
          <p className="text-sm text-muted-foreground mt-0.5 font-medium">Monitoring and managing active automation schedules.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button 
            className="bg-primary hover:opacity-90 shadow-lg shadow-primary/20 gap-2 px-6"
            onClick={() => navigate("/scriptRunner/scriptRunner")}
          >
            <Plus className="h-4 w-4" /> New Script Configuration
          </Button>
        </div>
      </header>

      {/* 2. Sub-Toolbar */}
      <div className="h-14 border-b bg-muted/20 px-8 flex items-center justify-between shrink-0">
        <div className="relative w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search by name, template or description..." 
            className="pl-10 h-9 bg-background border-none ring-1 ring-border focus-visible:ring-primary/50"
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-6">
          {/* <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest text-nowrap">Active Scripts:</span>
            <Badge variant="secondary" className="font-bold">{totalItems}</Badge>
          </div> */}
            <div className="flex items-center gap-3 px-4 py-2 bg-linear-to-r from-blue-50 to-indigo-50 rounded-xl border border-primary/20">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Active Scripts</span>
                <Badge className="font-bold px-2.5 shadow-sm">
                  {totalItems}
                </Badge>
              </div>

              
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredData.map((t: any) => (
                    <Card key={t.id} className="group hover:shadow-xl hover:border-primary/40 transition-all duration-300 border-border/50 bg-card overflow-hidden flex flex-col h-74">
                      <CardHeader className="p-5 pb-3">
                        <div className="flex justify-between items-start">
                          <div className="p-2 bg-primary/10 rounded-lg text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                            <Terminal className="h-5 w-5" />
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={`text-[10px] font-bold uppercase tracking-tight ${t.scheduleType === 'ONE_TIME' ? "bg-slate-500" : "bg-purple-600"}`}>
                              {t.scheduleType}
                            </Badge>
                            {/* <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleRunNow()}>Execute Now</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu> */}
                          </div>
                        </div>
                        <CardTitle className="text-lg mt-4 group-hover:text-primary transition-colors truncate">{t.name}</CardTitle>
                        <p className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wider">Template: {t.template?.name}</p>
                      </CardHeader>
                      <CardContent className="p-5 pt-0 flex-1 flex flex-col justify-between">
                        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed italic mb-4">
                          "{t.description || "No description provided."}"
                        </p>
                        <div className="pt-4 border-t border-border/50 flex items-center justify-between mt-auto">
                           <div className="flex items-center gap-2 text-muted-foreground">
                              <Calendar className="h-3.5 w-3.5" />
                              <span className="text-xs font-medium">{t.startDateTime?.split('T')[0]}</span>
                           </div>
                          {/* <Button variant="link" size="sm" className="h-auto p-0 text-xs font-bold text-primary" onClick={() => handleRunNow(t)}>
                            Run Now <ChevronRight className="h-3 w-3" />
                          </Button> */}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                /* LIST VIEW */
                <div className="flex flex-col gap-3">
                  {filteredData.map((t: any) => (
                    <div key={t.id} className="group flex items-center bg-card border border-border/50 rounded-xl p-4 hover:border-primary/40 hover:shadow-md transition-all duration-200">
                      <div className="p-3 bg-primary/10 rounded-xl text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors shrink-0">
                        <Terminal className="h-5 w-5" />
                      </div>
                      <div className="flex-1 px-6 min-w-0">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-bold text-base group-hover:text-primary transition-colors truncate">{t.name}</h3>
                          <Badge variant="outline" className="text-[10px] h-5 border-primary/20 text-primary bg-primary/5 uppercase">
                            {t.template?.name}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground truncate italic">{t.description || "No description provided."}</p>
                      </div>
                      <div className="flex items-center gap-12 shrink-0">
                        <div className="hidden lg:flex flex-col items-end">
                          <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest flex items-center gap-1">
                            <Clock className="h-3 w-3" /> Start Time
                          </span>
                          <span className="text-xs font-semibold">{new Date(t.startDateTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
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

      {/* Pagination Footer */}
      <footer className="h-16 border-t bg-card px-8 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <p className="text-xs font-medium text-muted-foreground">Rows per page</p>
          <Select value={pageSize.toString()} onValueChange={(v) => { setPageSize(Number(v)); setCurrentPage(1); }}>
            <SelectTrigger className="h-8 w-17.5 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              {[6, 12, 24, 50].map(v => <SelectItem key={v} value={v.toString()}>{v}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-6">
          <p className="text-xs font-medium text-muted-foreground">Page {currentPage} of {totalPages || 1}</p>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setCurrentPage(1)} disabled={currentPage === 1}><ChevronsLeft className="h-4 w-4" /></Button>
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1}><ChevronLeft className="h-4 w-4" /></Button>
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === totalPages || totalPages === 0}><ChevronRight className="h-4 w-4" /></Button>
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages || totalPages === 0}><ChevronsRight className="h-4 w-4" /></Button>
          </div>
        </div>
      </footer>
    </div>
  );
}