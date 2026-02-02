import { useState } from "react";
import { 
  Plus, Search, Terminal, LayoutGrid, List, ChevronRight,
   ChevronLeft, ChevronsLeft, ChevronsRight,
  Calendar,
  Sparkles,
  ArrowUpRight
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import Breadcrumb from "@/components/common/breadcrumb";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useGetScriptCount, useGetScripts } from "./hooks";


export default function ParsedReport() {
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



const handleViewReport = (script: any) => {
    navigate("/scriptRunner/parsedExecution", { 
      state: { 
        scriptId: script.id, 
        scriptName: script.name,
        status: "SUCCESS" 
      } 
    });
  };

  
  return (
    <div className="h-screen w-full bg-background flex flex-col overflow-hidden text-foreground">
      <div className="mb-6 ">
        <Breadcrumb
          items={[
            { label: "Module Dashboard", path: "/dashboard" },
            { label: "Parsed Report", path: "/scriptRunner/parsedReport" },
          ]}
        />
      </div>

      {/* 1. Header Area */}
      <header className="h-20 border-b flex items-center justify-between px-8 shrink-0 bg-card/50 backdrop-blur-md">
        <div>
      <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-3">
            Parsed <span className="text-primary underline underline-offset-8 decoration-primary/30">Executions</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-2 font-medium">
            Analyze parsed data output from completed script cycles.
          </p>
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

     <main className="flex-1 overflow-hidden">
        <ScrollArea className="h-full w-full px-8">
          <div className="max-w-7xl mx-auto py-4">
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
  {filteredData.map((t: any) => (
    <Card 
      key={t.id} 
      className="group relative border border-border/50 hover:border-primary/40 bg-card/50 backdrop-blur-sm hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden"
    >
      {/* Subtle top accent line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-primary/10 group-hover:bg-primary transition-colors" />
      
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start mb-3">
          <div className="p-2 bg-secondary/80 rounded-xl text-secondary-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
            <Terminal className="h-4 w-4" />
          </div>
          <Badge 
            variant="outline" 
            className="rounded-md border-primary/20 text-[9px] uppercase tracking-wider font-bold text-primary bg-primary/5 px-2 py-0"
          >
            {t.template?.name || 'Standard'}
          </Badge>
        </div>
        
        <h3 className="text-sm font-bold leading-tight group-hover:text-primary transition-colors truncate">
          {t.name}
        </h3>
      </CardHeader>
      
      <CardContent className="p-4 pt-1">
        <p className="text-[11px] text-muted-foreground line-clamp-2 mb-4 min-h-[32px] leading-relaxed">
          {t.description || "View execution details and parsed data for this script."}
        </p>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between text-[10px] border-b border-dashed border-border/60 pb-1.5">
            <span className="text-muted-foreground flex items-center gap-1">
              <Calendar className="h-3 w-3" /> Last Run
            </span>
            <span className="font-medium">{t.startDateTime?.split('T')[0]}</span>
          </div>
        </div>

        <Button 
          onClick={() => handleViewReport(t)}
          variant="ghost"
          className="w-full rounded-xl group/btn h-9 text-xs font-bold border border-border/100 hover:bg-primary hover:text-white transition-all gap-2"
        >
            Explore Execution Data
          <ArrowUpRight className="h-3 w-3 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
        </Button>
      </CardContent>
    </Card>
  ))}
</div>
            ) : (

              <div className="space-y-3">
                {filteredData.map((t: any) => (
                  <div key={t.id} className="group flex items-center bg-card border border-border/40 rounded-2xl p-4 hover:border-primary/40 hover:bg-muted/10 transition-all">
                    <div className="h-12 w-12 bg-muted rounded-xl flex items-center justify-center text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors shrink-0">
                      <Terminal className="h-5 w-5" />
                    </div>
                    <div className="flex-1 px-6">
                      <h3 className="font-bold text-lg mb-0.5">{t.name}</h3>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="font-bold text-primary/70 uppercase tracking-widest">{t.template?.name}</span>
                        <span>•</span>
                        <span>{t.description || 'No description'}</span>
                      </div>
                    </div>
                    <Button variant="ghost" className="rounded-xl hover:bg-primary/10 hover:text-primary" onClick={() => handleViewReport(t)}>
                      View Results <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
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