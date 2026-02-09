





import { useState } from "react";
import { 
  CheckCircle2, XCircle, Clock, ShieldCheck, 
  LayoutGrid, List, Search, ChevronRight, 
  ChevronLeft, ChevronsLeft, ChevronsRight,
  FileCode, Sparkles, Zap,
  Terminal,
  Code2,
  User,
  Laptop,
  Globe,
  Calendar
} from "lucide-react";
import { format } from "date-fns";
import { useGetScriptsByStatus, useScriptActions } from "./hooks";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import toast from "react-hot-toast";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import Breadcrumb from "@/components/common/breadcrumb";

export default function ScriptApprovalScreen() {
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Pagination State
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [search, setSearch] = useState("");

  // Dialog State
  const [dialogData, setDialogData] = useState<{ id: number; type: 'pending' | 'preview' } | null>(null);

  // API Hooks
  const { data: response, isLoading } = useGetScriptsByStatus(activeTab, page, pageSize);
  const { approve, reject } = useScriptActions();

  const scripts = response?.data?.content || [];
  const totalElements = response?.data?.totalElements || 0;
  const totalPages = response?.data?.totalPages || 1;

  const filteredScripts = scripts.filter((s: any) => 
    s.name.toLowerCase().includes(search.toLowerCase())
  );

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
        <div className="mb-4">
               <Breadcrumb
        items={[
          { label: "Module Dashboard", path: "/app/dashboard" },
          { label: "Script Approval", path: "/app/scriptRunner/scriptApproval" },
        ]}
      />

        </div>

      {/* Header */}
      <div className="relative px-8 py-8 border-b bg-linear-to-r from-background via-card to-background backdrop-blur-xl shrink-0">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-size-[20px_20px]" />
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

      {/* Toolbar */}
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

      {/* Content */}
      <main className="flex-1 overflow-hidden relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent pointer-events-none" />
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
                  <FileCode className={`h-12 w-12 ${statusConfig.color} opacity-40`} />
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
                    <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-primary/50 via-primary to-primary/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <CardHeader className="p-4 pb-2">
                      <div className="flex justify-between items-start mb-2">
                        <div className="relative">
                          <div className="relative p-2 bg-primary/10 rounded-xl text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                            <FileCode className="h-4 w-4" />
                          </div>
                        </div>
                        <Badge variant="outline" className="text-[9px] font-bold px-2 py-0 h-5 bg-background/50 uppercase">
                          {script.scheduleType}
                        </Badge>
                      </div>
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
                      <div className="mb-4">
                        <p className="text-xs text-muted-foreground line-clamp-2 italic leading-snug min-h-8">
                          {script.description || 'No description provided'}
                        </p>
                      </div>

                      {/* Action Buttons */}
                      <Button
                        size="sm"
                        className="w-full rounded-lg bg-primary hover:bg-primary/90 h-8 text-[11px] font-bold shadow-sm"
                        onClick={() => setDialogData({ id: script.id, type: activeTab === 'pending' ? 'pending' : 'preview' })}
                      >
                        {activeTab === 'pending' ? 'Action' : 'Preview'}
                      </Button>
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
                      <Button
                        size="sm"
                        className="rounded-lg bg-primary hover:bg-primary/90 h-9 px-4 font-semibold"
                        onClick={() => setDialogData({ id: script.id, type: activeTab === 'pending' ? 'pending' : 'preview' })}
                      >
                        {activeTab === 'pending' ? 'Action' : 'Preview'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </ScrollArea>
      </main>

      {/* Pagination Footer */}
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
            <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl border-border/50 hover:bg-primary hover:text-white hover:border-primary transition-all" onClick={() => setPage(1)} disabled={page === 1}>
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl border-border/50 hover:bg-primary hover:text-white hover:border-primary transition-all" onClick={() => setPage(p => Math.max(p-1, 1))} disabled={page === 1}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl border-border/50 hover:bg-primary hover:text-white hover:border-primary transition-all" onClick={() => setPage(p => Math.min(p+1, totalPages))} disabled={page === totalPages}>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl border-border/50 hover:bg-primary hover:text-white hover:border-primary transition-all" onClick={() => setPage(totalPages)} disabled={page === totalPages}>
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </footer>


<Dialog open={!!dialogData} onOpenChange={() => setDialogData(null)}>
  <DialogContent className="max-w-5xl w-full h-[90vh] p-0 flex flex-col gap-0 overflow-hidden sm:rounded-3xl">
    
    <DialogHeader className="p-6 pb-4 border-b bg-muted/20">
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <DialogTitle className="text-2xl font-bold tracking-tight">
            {dialogData?.type === 'pending' ? 'Approve Script Action' : 'Script Metadata'}
          </DialogTitle>
          <DialogDescription className="flex items-center gap-2">
            <Badge variant="outline" className="font-mono uppercase text-[10px]">
              ID: {dialogData?.id}
            </Badge>
            <span>Review configuration and execution logic.</span>
          </DialogDescription>
        </div>
      </div>
    </DialogHeader>

    <ScrollArea className="flex-1 h-70">
      <div className=" p-6">
      {dialogData && (() => {
        const script = scripts.find((s: any) => s.id === dialogData.id);
        if (!script) return <div className="py-20 text-center text-muted-foreground">Script not found</div>;

        return (
          <div className="space-y-8 pb-4">
            
            <section>
              <h4 className="text-sm font-semibold mb-4 flex items-center gap-2 text-primary">
                <Globe className="w-4 h-4" /> General Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-muted/30 p-4 rounded-xl border">
                <DetailItem label="Script Name" value={script.name} bold />
                <DetailItem label="Type" value={<Badge variant="secondary">{script.scriptType}</Badge>} />
                <DetailItem label="Schedule" value={script.scheduleType} />
                <DetailItem label="Start Date" value={script.startDateTime ? format(new Date(script.startDateTime), 'PPp') : 'N/A'} icon={<Calendar className="w-3 h-3"/>} />
                <DetailItem label="Interval" value={`${script.repeatEverySeconds || 0}s`} icon={<Clock className="w-3 h-3"/>} />
                <DetailItem label="Active Status" value={
                  script.template?.isActive 
                    ? <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-200">Active</Badge> 
                    : <Badge variant="destructive">Inactive</Badge>
                } />
              </div>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <Laptop className="w-4 h-4" /> Targets & Hosts
                </h4>
                <div className="space-y-3 text-sm border-l-2 border-muted pl-4">
                  <DetailItem inline label="Platforms" value={script.targetPlatformsCsv} />
                  <DetailItem inline label="Host Name" value={script.hostName} />
                  <DetailItem inline label="Added By" value={script.addedBy} icon={<User className="w-3 h-3"/>} />
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <Code2 className="w-4 h-4" /> Template Parameters
                </h4>
                <div className="bg-background border rounded-lg p-3">
                  {script.template?.parameters?.length ? (
                    <div className="space-y-2">
                      {script.template.parameters.map((p: any, idx: number) => (
                        <div key={idx} className="flex justify-between text-xs border-b border-dotted pb-1 last:border-0">
                          <span className="font-mono text-muted-foreground">{p.paramName}</span>
                          <span className="font-medium">{p.defaultValue || '—'}</span>
                        </div>
                      ))}
                    </div>
                  ) : <p className="text-xs text-muted-foreground italic">No parameters defined</p>}
                </div>
              </div>
            </section>

            <section className="space-y-3">
              <h4 className="text-sm font-semibold flex items-center gap-2">
                <Terminal className="w-4 h-4" /> Script Execution Content
              </h4>
              <div className="relative group">
                <pre className="bg-zinc-950 text-zinc-50 p-5 w-240 rounded-xl text-[13px] font-mono leading-relaxed overflow-x-auto border shadow-inner">
                  {script.scriptText || '// No content available'}
                </pre>
              </div>

              {Object.keys(script.scriptArgument || {}).length > 0 && (
                <div className="mt-4">
                  <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Arguments (JSON)</p>
                  <pre className="bg-muted p-3 rounded-lg text-xs font-mono">
                    {JSON.stringify(script.scriptArgument, null, 2)}
                  </pre>
                </div>
              )}
            </section>
          </div>
        );
      })()}
      </div>
    </ScrollArea>

 <DialogFooter className="px-6 py-4 border-t bg-background/80 backdrop-blur sticky bottom-0">
      {activeTab === 'pending' && dialogData?.type === 'pending' ? (
        <div className="flex gap-3 w-full">
          <Button
            onClick={async () => {
              const promise = approve.mutateAsync(dialogData.id);
              toast.promise(promise, { loading: 'Approving...', });
              setDialogData(null);
            }}
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-11 font-semibold"
          >
            Approve
          </Button>

          <Button
            onClick={async () => {
              const promise = reject.mutateAsync(dialogData.id);
              toast.promise(promise, { loading: 'Rejecting...', });
              setDialogData(null);
            }}
            className="flex-1 bg-rose-600 hover:bg-rose-700 text-white rounded-xl h-11 font-semibold"
          >
            Reject
          </Button>
        </div>
      ) : (
        <Button
          onClick={() => setDialogData(null)}
          className="rounded-xl h-11 border border-border/50 hover:bg-muted font-semibold"
        >
          Close
        </Button>
      )}
    </DialogFooter>
  </DialogContent>
</Dialog>



    </div>

    
  );
}

function DetailItem({ label, value, bold, icon, inline }: any) {
  if (inline) {
    return (
      <div className="flex justify-between items-center py-1">
        <span className="text-muted-foreground flex items-center gap-1.5">{icon} {label}</span>
        <span className="font-medium">{value || 'N/A'}</span>
      </div>
    )
  }
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[10px] uppercase font-bold text-muted-foreground/70 tracking-tight">{label}</span>
      <div className={`text-sm flex items-center gap-1.5 ${bold ? 'font-semibold' : 'font-medium'}`}>
        {icon && <span className="text-muted-foreground">{icon}</span>}
        {value || 'N/A'}
      </div>
    </div>
  );
}