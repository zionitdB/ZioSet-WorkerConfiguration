import { useState } from "react";
import { 
  CheckCircle2, XCircle, Clock, ShieldCheck, 
  LayoutGrid, List, Search, ChevronRight, 
  AlertCircle, Terminal, Calendar, Sparkles,
  ChevronLeft, ChevronsLeft, ChevronsRight,
  FileCode, User, Zap
} from "lucide-react";
import { format } from "date-fns";
import { useGetScriptsByStatus, useScriptActions } from "./hooks";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import toast from "react-hot-toast";

export default function ScriptApprovalScreen() {
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Pagination State
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [search, setSearch] = useState("");

  const [confirmData, setConfirmData] = useState<{ id: number; name: string; type: 'approve' | 'reject' } | null>(null);

  // Note: Passing page - 1 because most backends use 0-based indexing for pages
  const { data: response, isLoading } = useGetScriptsByStatus(activeTab, page, pageSize);
  const { approve, reject } = useScriptActions();

  const scripts = response?.data?.content || [];
  const totalElements = response?.data?.totalElements || 0;
  const totalPages = response?.data?.totalPages || 1;

  const filteredScripts = scripts.filter((s: any) => 
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleAction = async () => {
    if (!confirmData) return;
    
    const promise = confirmData.type === 'approve' 
      ? approve.mutateAsync(confirmData.id) 
      : reject.mutateAsync(confirmData.id);

    toast.promise(promise, {
      loading: `${confirmData.type === 'approve' ? 'Approving' : 'Rejecting'}...`,
    });

    setConfirmData(null);
  };

  const handleTabChange = (val: any) => {
    setActiveTab(val);
    setPage(1);
  };

  const getStatusConfig = () => {
    switch(activeTab) {
      case 'pending':
        return {
          icon: Clock,
          color: 'text-amber-500',
          bg: 'bg-amber-50 dark:bg-amber-950/30',
          border: 'border-amber-200 dark:border-amber-800',
          badge: 'bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300'
        };
      case 'approved':
        return {
          icon: CheckCircle2,
          color: 'text-emerald-500',
          bg: 'bg-emerald-50 dark:bg-emerald-950/30',
          border: 'border-emerald-200 dark:border-emerald-800',
          badge: 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300'
        };
      case 'rejected':
        return {
          icon: XCircle,
          color: 'text-rose-500',
          bg: 'bg-rose-50 dark:bg-rose-950/30',
          border: 'border-rose-200 dark:border-rose-800',
          badge: 'bg-rose-100 dark:bg-rose-900/50 text-rose-700 dark:text-rose-300'
        };
    }
  };

  const statusConfig = getStatusConfig();

  return (
    <div className="h-screen flex flex-col bg-linear-to-br from-background via-background to-muted/20">
      {/* Enhanced Header with Gradient */}
      <div className="relative px-8 py-8 border-b bg-linear-to-r from-background via-card to-background backdrop-blur-xl shrink-0">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:20px_20px]" />
        <div className="relative flex justify-between items-center max-w-7xl mx-auto w-full">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
                <ShieldCheck className="relative h-10 w-10 text-primary" />
              </div>
              <div>
                <h1 className="text-4xl font-bold tracking-tight bg-linear-to-r from-foreground to-foreground/70 bg-clip-text">
                  Script Governance
                </h1>
                <p className="text-sm text-muted-foreground mt-1">Manage and review script approvals</p>
              </div>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-auto">
            <TabsList className="grid grid-cols-3 h-12 p-1.5 bg-muted/50 backdrop-blur-sm border border-border/50 rounded-xl shadow-inner">
              <TabsTrigger 
                value="pending" 
                className="rounded-lg data-[state=active]:bg-amber-500 data-[state=active]:text-white data-[state=active]:shadow-md transition-all gap-2 px-4"
              >
                <Clock className="h-4 w-4" />
                <span className="font-semibold">Pending</span>
                {activeTab === 'pending' && (
                  <Badge variant="secondary" className="ml-1 bg-white/20 text-white border-0 h-5">
                    {totalElements}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger 
                value="approved" 
                className="rounded-lg data-[state=active]:bg-emerald-500 data-[state=active]:text-white data-[state=active]:shadow-md transition-all gap-2 px-4"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span className="font-semibold">Approved</span>
              </TabsTrigger>
              <TabsTrigger 
                value="rejected" 
                className="rounded-lg data-[state=active]:bg-rose-500 data-[state=active]:text-white data-[state=active]:shadow-md transition-all gap-2 px-4"
              >
                <XCircle className="h-4 w-4" />
                <span className="font-semibold">Rejected</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Enhanced Toolbar */}
      <div className="px-8 py-4 border-b bg-card/30 backdrop-blur-sm shrink-0">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="relative max-w-md flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/50" />
            <Input 
              placeholder="Search scripts by name..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-12 h-12 bg-background/50 rounded-2xl border-border/50 focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary/40 transition-all text-base"
            />
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-muted/60 p-1.5 rounded-xl border border-border/40 shadow-sm">
              <Button 
                variant={viewMode === 'grid' ? 'default' : 'ghost'} 
                size="sm" 
                onClick={() => setViewMode('grid')} 
                className="h-9 w-9 p-0 rounded-lg transition-all"
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button 
                variant={viewMode === 'list' ? 'default' : 'ghost'} 
                size="sm" 
                onClick={() => setViewMode('list')} 
                className="h-9 w-9 p-0 rounded-lg transition-all"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>

            <div className={`px-4 py-2.5 rounded-xl ${statusConfig.bg} ${statusConfig.border} border flex items-center gap-2`}>
              <statusConfig.icon className={`h-4 w-4 ${statusConfig.color}`} />
              <span className="text-sm font-semibold capitalize">{activeTab}</span>
              <Badge className={statusConfig.badge + " border-0"}>
                {filteredScripts.length}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <main className="flex-1 overflow-hidden relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent pointer-events-none" />
        <ScrollArea className="h-full">
          <div className="max-w-7xl mx-auto p-8">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-32">
                <div className="relative">
                  <div className="h-16 w-16 rounded-full border-4 border-muted animate-pulse" />
                  <div className="absolute inset-0 h-16 w-16 rounded-full border-4 border-primary border-t-transparent animate-spin" />
                </div>
                <p className="text-muted-foreground mt-6 font-medium">Loading scripts...</p>
              </div>
            ) : filteredScripts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-32 text-center">
                <div className={`h-24 w-24 rounded-3xl ${statusConfig.bg} flex items-center justify-center mb-6`}>
                  <Terminal className={`h-12 w-12 ${statusConfig.color} opacity-40`} />
                </div>
                <h3 className="text-2xl font-bold mb-2">No Scripts Found</h3>
                <p className="text-muted-foreground max-w-md">
                  {search 
                    ? `No scripts match "${search}" in the ${activeTab} section` 
                    : `There are no ${activeTab} scripts at the moment`
                  }
                </p>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
  {filteredScripts.map((script: any) => (
    <Card 
      key={script.id} 
      className="group border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-xl rounded-2xl overflow-hidden bg-card/50 backdrop-blur-sm relative"
    >
      {/* Visual Accent Line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/50 via-primary to-primary/50 opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start mb-2">
          <div className="relative">
            {/* Smaller Icon Container */}
            <div className="relative p-2 bg-primary/10 rounded-xl text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
              <FileCode className="h-4 w-4" />
            </div>
          </div>
          <Badge variant="outline" className="text-[9px] font-bold px-2 py-0 h-5 bg-background/50 uppercase">
            {script.scheduleType}
          </Badge>
        </div>

        {/* Smaller Title */}
        <CardTitle className="text-sm font-bold truncate group-hover:text-primary transition-colors">
          {script.name}
        </CardTitle>
        
        <div className="flex items-center gap-1.5 mt-1">
          <Sparkles className="h-3 w-3 text-muted-foreground/60" />
          <p className="text-[10px] text-muted-foreground font-medium truncate">
            {script.template?.name || 'Standard'}
          </p>
        </div>
      </CardHeader>
      
      <CardContent className="p-4 pt-1">
        {/* Reduced Description height and text size */}
        <div className="mb-4">
          <p className="text-xs text-muted-foreground line-clamp-2 italic leading-snug min-h-[32px]">
            {script.description || 'No description provided'}
          </p>
        </div>
        
        {activeTab === 'pending' && (
          <div className="flex gap-2 pt-3 border-t border-border/40">
            <Button 
              size="sm"
              className="flex-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 h-8 text-[11px] font-bold shadow-sm"
              onClick={() => setConfirmData({ id: script.id, name: script.name, type: 'approve' })}
            >
              Approve
            </Button>
            <Button 
              size="sm"
              variant="outline" 
              className="flex-1 rounded-lg border-rose-200 text-rose-600 hover:bg-rose-50 h-8 text-[11px] font-bold"
              onClick={() => setConfirmData({ id: script.id, name: script.name, type: 'reject' })}
            >
              Reject
            </Button>
          </div>
        )}

        {activeTab === 'approved' && (
          <div className="flex items-center gap-1.5 text-emerald-600 pt-2 border-t border-border/40">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Active</span>
          </div>
        )}

        {activeTab === 'rejected' && (
          <div className="flex items-center gap-1.5 text-rose-600 pt-2 border-t border-border/40">
            <XCircle className="h-3.5 w-3.5" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Rejected</span>
          </div>
        )}
      </CardContent>
    </Card>
  ))}
</div>
            ) : (
              <div className="space-y-3">
                {filteredScripts.map((script: any) => (
                  <div 
                    key={script.id} 
                    className="group flex items-center justify-between p-5 bg-card/50 backdrop-blur-sm border border-primary/10 rounded-2xl hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300"
                  >
                    
                    <div className="flex items-center gap-5 flex-1 min-w-0">
                      <div className="relative shrink-0">
                        <div className="absolute inset-0 bg-primary/20 blur-md rounded-xl group-hover:blur-lg transition-all" />
                        <div className="relative h-14 w-14 bg-linear-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:from-primary group-hover:to-primary/80 group-hover:text-white transition-all duration-300 shadow-lg">
                          <FileCode className="h-7 w-7" />
                        </div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-base mb-1 group-hover:text-primary transition-colors truncate">
                          {script.name}
                        </h3>
                        <p className="text-sm text-muted-foreground italic truncate">
                          {script.description || 'No description provided'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 shrink-0">
                      <div className="flex items-center gap-3">
                        <Badge variant="secondary" className="text-xs font-semibold px-3 py-1.5">
                          {script.template?.name || 'N/A'}
                        </Badge>
                        <Badge variant="outline" className="text-xs font-semibold px-3 py-1.5">
                          {script.scheduleType}
                        </Badge>
                      </div>
                      
                      {activeTab === 'pending' && (
                        <div className="flex gap-2 border-l border-border/50 pl-4 ml-2">
                          <Button 
                            size="sm" 
                            className="bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 rounded-lg h-9 px-4 font-semibold shadow-md" 
                            onClick={() => setConfirmData({ id: script.id, name: script.name, type: 'approve' })}
                          >
                            <CheckCircle2 className="h-4 w-4 mr-1.5" />
                            Approve
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg h-9 px-4 font-semibold" 
                            onClick={() => setConfirmData({ id: script.id, name: script.name, type: 'reject' })}
                          >
                            <XCircle className="h-4 w-4 mr-1.5" />
                            Reject
                          </Button>
                        </div>
                      )}

                      {activeTab === 'approved' && (
                        <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 pl-4 border-l border-border/50">
                          <CheckCircle2 className="h-5 w-5" />
                          <span className="text-sm font-semibold">Active</span>
                        </div>
                      )}

                      {activeTab === 'rejected' && (
                        <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 pl-4 border-l border-border/50">
                          <XCircle className="h-5 w-5" />
                          <span className="text-sm font-semibold">Rejected</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </ScrollArea>
      </main>

      {/* Enhanced Pagination Footer */}
      <footer className="h-20 border-t bg-card/80 backdrop-blur-xl px-8 flex items-center justify-between shrink-0 shadow-[0_-8px_30px_-10px_rgba(0,0,0,0.15)]">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-muted-foreground">Rows per page</span>
            <Select 
              value={pageSize.toString()} 
              onValueChange={(v) => { setPageSize(Number(v)); setPage(1); }}
            >
              <SelectTrigger className="h-10 w-20 text-sm rounded-xl border-border/50 bg-background/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[5,10, 20,30, 50].map(v => (
                  <SelectItem key={v} value={v.toString()}>{v}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="h-10 w-px bg-border" />
          
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-muted/50">
            <Zap className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold">
              {totalElements} <span className="text-muted-foreground font-normal">total scripts</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <p className="text-sm font-semibold text-muted-foreground">
            Page <span className="text-foreground font-bold">{page}</span> 
            <span className="mx-2 text-border">of</span> 
            <span className="text-foreground font-bold">{totalPages || 1}</span>
          </p>
          
          <div className="flex items-center gap-1.5">
            <Button 
              variant="outline" 
              size="icon" 
              className="h-10 w-10 rounded-xl border-border/50 hover:bg-primary hover:text-white hover:border-primary transition-all" 
              onClick={() => setPage(1)} 
              disabled={page === 1}
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              className="h-10 w-10 rounded-xl border-border/50 hover:bg-primary hover:text-white hover:border-primary transition-all" 
              onClick={() => setPage(p => p - 1)} 
              disabled={page === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              className="h-10 w-10 rounded-xl border-border/50 hover:bg-primary hover:text-white hover:border-primary transition-all" 
              onClick={() => setPage(p => p + 1)} 
              disabled={page === totalPages || totalPages === 0}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              className="h-10 w-10 rounded-xl border-border/50 hover:bg-primary hover:text-white hover:border-primary transition-all" 
              onClick={() => setPage(totalPages)} 
              disabled={page === totalPages || totalPages === 0}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </footer>

      {/* Enhanced Confirmation Dialog */}
      <AlertDialog open={!!confirmData} onOpenChange={() => setConfirmData(null)}>
        <AlertDialogContent className="rounded-3xl border-none shadow-2xl max-w-md">
          <AlertDialogHeader>
            <div className={`h-16 w-16 rounded-2xl mb-6 flex items-center justify-center relative ${
              confirmData?.type === 'approve' 
                ? 'bg-gradient-to-br from-emerald-100 to-emerald-50 dark:from-emerald-950 dark:to-emerald-900' 
                : 'bg-gradient-to-br from-rose-100 to-rose-50 dark:from-rose-950 dark:to-rose-900'
            }`}>
              <div className={`absolute inset-0 ${confirmData?.type === 'approve' ? 'bg-emerald-500' : 'bg-rose-500'} blur-xl opacity-20 rounded-2xl`} />
              {confirmData?.type === 'approve' ? (
                <CheckCircle2 className="relative h-9 w-9 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <XCircle className="relative h-9 w-9 text-rose-600 dark:text-rose-400" />
              )}
            </div>
            <AlertDialogTitle className="text-2xl font-bold">
              {confirmData?.type === 'approve' ? 'Approve Script?' : 'Reject Script?'}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base py-3 leading-relaxed">
              {confirmData?.type === 'approve' 
                ? 'This script will be authorized and made available for execution.' 
                : 'This script will be rejected and removed from the approval queue.'
              }
              <div className="mt-4 p-4 rounded-xl bg-muted/50 border border-border/50">
                <p className="text-foreground font-semibold">
                  {confirmData?.name}
                </p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-3 mt-2">
            <AlertDialogCancel className="rounded-xl h-12 border-border/50 hover:bg-muted font-semibold">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleAction}
              className={`rounded-xl h-12 px-8 font-semibold shadow-lg transition-all ${
                confirmData?.type === 'approve' 
                  ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 shadow-emerald-500/30' 
                  : 'bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-700 hover:to-rose-600 shadow-rose-500/30'
              }`}
            >
              {confirmData?.type === 'approve' ? 'Approve Script' : 'Reject Script'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}