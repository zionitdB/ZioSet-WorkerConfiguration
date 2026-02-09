import { useEffect, useState } from "react";
import {
  FileText,
  Terminal,
  CheckCircle,
  Settings2,
  Plus,
  Trash2,
  CloudUpload,
  Package,
  Monitor,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  useGetPlatforms,
  useUploadFile,
  useGetScriptTypes,
  useSubmitScriptTemplate,
  useGetParamTypes,
} from "../ScriptRunner/hooks";
import { Separator } from "@/components/ui/separator";
import Breadcrumb from "@/components/common/breadcrumb";
import { useNavigate } from "react-router-dom";

const STEPS = [
  {
    id: 0,
    title: "Basic Information",
    icon: FileText,
    desc: "Name and description",
  },
  {
    id: 1,
    title: "Configuration",
    icon: Terminal,
    desc: "Script and Dependencies",
  },
  {
    id: 2,
    title: "Requirements",
    icon: Settings2,
    desc: "Platform & Parameters",
  },
  { id: 3, title: "Review + Create", icon: CheckCircle, desc: "Summary" },
];

export default function ScriptTemplateForm() {
  const [step, setStep] = useState(0);

  const { data: scriptTypes } = useGetScriptTypes();
  const { data: paramTypes } = useGetParamTypes();

  const { data: platformList } = useGetPlatforms();
  const uploadMutation = useUploadFile();
  const submitMutation = useSubmitScriptTemplate();
  const initialFormState = {
    templetName: "",
    templetDescription: "",
    scriptType: "",
    scriptCategory: "",
    allowedExtensions: [],
    command: "",
    scriptFile: null,
    scriptFileId: null,
    dependencyFiles: [],
    dependencyFileIds: [],
    targetPlatforms: [],
    active: true,
    parameters: [],
  };

  const [form, setForm] = useState<any>(initialFormState);

  const navigate = useNavigate();

  const update = (key: string, value: any) =>
    setForm((p: any) => ({ ...p, [key]: value }));

  const handleScriptTypeChange = (value: string) => {
    const selected = scriptTypes?.find((t: any) => t.enumName === value);
    if (selected) {
      setForm((prev: any) => ({
        ...prev,
        scriptType: value,
        scriptCategory: selected.category,
        allowedExtensions: selected.extensions || [],
      }));
    }
  };

  const onFileUpload = async (e: any, target: "main" | "dependency") => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (target === "main") {
      const file = files[0];
      if (form.allowedExtensions.length > 0) {
        const isValid = form.allowedExtensions.some((ext: string) =>
          file.name.endsWith(ext),
        );
        if (!isValid)
          return alert(
            `Allowed extensions: ${form.allowedExtensions.join(", ")}`,
          );
      }
      const res = await uploadMutation.mutateAsync(file);
      setForm((prev: any) => ({
        ...prev,
        scriptFile: file,
        scriptFileId: res.id,
      }));
    } else {
      const fileArray = Array.from(files);
      for (const file of fileArray as File[]) {
        const res = await uploadMutation.mutateAsync(file);
        setForm((prev: any) => ({
          ...prev,
          dependencyFiles: [...prev.dependencyFiles, file],
          dependencyFileIds: [...prev.dependencyFileIds, res.id],
        }));
      }
    }
  };

  const removeDependency = (index: number) => {
    setForm((prev: any) => {
      const newFiles = [...prev.dependencyFiles];
      const newIds = [...prev.dependencyFileIds];
      newFiles.splice(index, 1);
      newIds.splice(index, 1);
      return { ...prev, dependencyFiles: newFiles, dependencyFileIds: newIds };
    });
  };

  const addParameter = () => {
    update("parameters", [
      ...form.parameters,
      { paramName: "", paramType: "", required: true, defaultValue: "" },
    ]);
  };

  const updateParameter = (index: number, field: string, value: any) => {
    const newParams = [...form.parameters];
    newParams[index] = { ...newParams[index], [field]: value };
    update("parameters", newParams);
  };

  const handleFinalSubmit = () => {
    const payload = {
      name: form.templetName,
      description: form.templetDescription,
      scriptType: form.scriptType,
      command: form.scriptCategory === "TEXT" ? form.command : "",
      scriptFileId: form.scriptCategory === "FILE" ? form.scriptFileId : null,
      dependencyFileIds: form.dependencyFileIds,
      targetPlatforms: form.targetPlatforms,
      active: form.active,
      parameters: form.parameters,
    };
    submitMutation.mutate(payload);
  };

  useEffect(() => {
    if (submitMutation.isSuccess) {
      setStep(5);
    }
  }, [submitMutation.isSuccess]);

  const extractVariables = (text: string) => {
    const regex = /\${(.*?)}/g;
    const matches = [...text.matchAll(regex)];
    return [...new Set(matches.map((match) => match[1]))];
  };

  const handleCommandChange = (value: string) => {
    update("command", value);

    const variables = extractVariables(value);

    setForm((prev: any) => {
      const existingParams = prev.parameters.filter((p: any) =>
        variables.includes(p.paramName),
      );

      const newVars = variables.filter(
        (v) => !existingParams.find((p: any) => p.paramName === v),
      );

      const newParams = [
        ...existingParams,
        ...newVars.map((v) => ({
          paramName: v,
          paramType: "TEXT",
          required: true,
          defaultValue: "",
          isAutoGenerated: true,
        })),
      ];

      return { ...prev, parameters: newParams };
    });
  };

  const isSuccess = submitMutation.isSuccess;


  const isStepValid = () => {
    switch (step) {
      case 0:
        return form.templetName.trim().length > 0;

      case 1:
        if (!form.scriptType) return false;
        if (form.scriptCategory === "TEXT" && !form.command.trim())
          return false;
        if (form.scriptCategory === "FILE" && !form.scriptFileId) return false;
        return true;

      case 2:
        return form.targetPlatforms.length > 0;

      case 3:
        return true;

      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen">
      <div className="mb-6">
        <Breadcrumb
          items={[
            {
              label: "Module Dashboard",
              path: "/app/dashboard",
            },
            {
              label: "Script Templates",
              path: "/app/scriptRunner/scriptTemplate",
            },
            {
              label: "Template Form",
              path: "/app/scriptRunner/scriptTemplateForm",
            },
          ]}
        />
      </div>

      <div className="p-2 mx-auto">
        <div className="mb-4">
          <h1 className="text-2xl font-bold tracking-tight ">
            Create Script Template
          </h1>
        </div>
        <Separator></Separator>
        {!isSuccess ? (
          <div className="grid mt-4 grid-cols-[300px_1fr] gap-8">
            <div className="space-y-1">
              {STEPS.map((s, i) => (
                <button
                  key={s.id}
                  onClick={() => setStep(i)}
                  className={`w-full text-left flex items-center gap-4 p-4 rounded-lg transition-all border ${
                    step === i
                      ? "bg-muted border-primary/20 shadow-sm ring-1 ring-primary/10"
                      : "border-transparent text-slate-500"
                  }`}
                >
                  <div
                    className={`h-8 w-8 flex items-center justify-center rounded-full shrink-0 ${step >= i ? "bg-primary text-white" : "bg-slate-200"}`}
                  >
                    {step > i ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <s.icon className="h-4 w-4" />
                    )}
                  </div>
                  <div className="overflow-hidden">
                    <p
                      className={`text-sm font-bold truncate ${step === i ? "text-primary" : ""}`}
                    >
                      {s.title}
                    </p>
                    <p className="text-[11px] opacity-70 font-medium truncate">
                      {s.desc}
                    </p>
                  </div>
                </button>
              ))}
            </div>

            <Card className="  overflow-hidden">
              <div className="px-6 py-4 bg-muted border-b flex justify-between items-center">
                <span className="text-xs font-bold uppercase text-slate-500 tracking-widest">
                  {STEPS[step].title}
                </span>
                <span className="text-xs font-bold text-primary">
                  Step {step + 1} / 4
                </span>
              </div>

              <CardContent className="p-8 ">
                {step === 0 && (
                  <div className="space-y-6 animate-in fade-in">
                    <div className="grid gap-2">
                      <Label className="text-xs font-bold uppercase text-slate-500 tracking-widest">
                        Template Name
                      </Label>
                      <Input
                        value={form.templetName}
                        onChange={(e) => update("templetName", e.target.value)}
                        placeholder="Enter template name..."
                        className={
                          !form.templetName && step === 0
                            ? "border-red-500"
                            : ""
                        }
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label className="text-xs font-bold uppercase text-slate-500 tracking-widest">
                        Description
                      </Label>
                      <Textarea
                        value={form.templetDescription}
                        onChange={(e) =>
                          update("templetDescription", e.target.value)
                        }
                        rows={5}
                        placeholder="What does this template do?"
                      />
                    </div>
                  </div>
                )}

                {/* STEP 1: CONFIGURATION (DYNAMIC UI) */}
                {step === 1 && (
                  <div className="space-y-6 animate-in fade-in">
                    {/* <div className="grid grid-cols-2 gap-4">
 <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase text-slate-500">Script Name</Label>
                      <Input value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="e.g. system_backup_v1" />
                    </div>
                    <div className="grid gap-2">
                    <Label className="text-xs font-bold uppercase text-slate-500">Script Description</Label>
                    <Input value={form.description} onChange={(e) => update("description", e.target.value)} placeholder="Short script description..." />
                  </div>

                    </div>
                    */}
                    <div className="flex gap-4 items-end">
                      <div className="flex-1 space-y-2">
                        <Label className="text-xs font-bold uppercase text-slate-500">
                          Script Type
                        </Label>
                        <Select
                          value={form.scriptType}
                          onValueChange={handleScriptTypeChange}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            {scriptTypes?.map((t: any) => (
                              <SelectItem key={t.enumName} value={t.enumName}>
                                {t.displayName}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {form.scriptCategory === "TEXT" ? (
                      <div className="mt-2 p-3 border-l-4 border-primary bg-primary/10 rounded-md">
                        <p className="text-xs font-semibold text-primary mb-1">
                          💡 How to use variables
                        </p>
                        <p className="text-[10px] text-foreground italic">
                          Wrap your variable name in{" "}
                          <span className="font-mono text-foreground bg-primary/50 px-1 rounded">
                            ${"{variableName}"}
                          </span>{" "}
                          to reference it. <br />
                          For example, if your variable is{" "}
                          <span className="font-bold text-purple-600">
                            applicationName
                          </span>
                          , use{" "}
                          <span className="font-mono text-foreground bg-primary/50 px-1 rounded">
                            ${"{applicationName}"}
                          </span>{" "}
                          in your script.
                        </p>
                      </div>
                    ) : null}

                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase text-slate-500">
                        Script Content
                      </Label>
                      {form.scriptCategory === "FILE" ? (
                        <div className="border-2 border-dashed rounded-xl p-8 text-center hover:bg-primary/5 cursor-pointer relative transition-all group">
                          <input
                            type="file"
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            onChange={(e) => onFileUpload(e, "main")}
                            accept={form.allowedExtensions.join(",")}
                          />
                          <CloudUpload className="mx-auto h-10 w-10 text-muted-foreground group-hover:text-primary" />
                          <p className="mt-2 text-sm font-medium">
                            Upload script file
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Allowed: {form.allowedExtensions.join(", ")}
                          </p>
                          {form.scriptFile && (
                            <Badge className="mt-4" variant="secondary">
                              {form.scriptFile.name}
                            </Badge>
                          )}
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="relative min-h-52 font-mono text-sm border rounded-md overflow-hidden bg-slate-950">
                            <div
                              className="absolute inset-0 p-3 whitespace-pre-wrap wrap-break-word leading-5 pointer-events-none"
                              style={{ color: "transparent" }}
                              dangerouslySetInnerHTML={{
                                __html: form.command
                                  .replace(/&/g, "&amp;")
                                  .replace(/</g, "&lt;")
                                  .replace(
                                    /\$\{(.*?)\}/g,
                                    '<span class="bg-primary/40 rounded">$&</span>',
                                  ),
                              }}
                            />

                            <Textarea
                              className="relative z-10 bg-transparent text-slate-200 caret-white border-none focus-visible:ring-0 min-h-52 w-full resize-none p-3 font-mono text-sm leading-5"
                              value={form.command}
                              onChange={(e) =>
                                handleCommandChange(e.target.value)
                              }
                              placeholder="# Type your script here... use ${my_var} to create a parameter"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-4 pt-4 border-t">
                      <Label className="text-xs font-bold uppercase text-slate-500 flex items-center gap-2">
                        <Package className="h-3 w-3" /> Dependencies
                      </Label>
                      <div className="border-2 border-dashed rounded-xl p-8 text-center hover:bg-secondary/50 cursor-pointer relative transition-all group">
                        <input
                          type="file"
                          multiple
                          className="absolute inset-0 opacity-0 cursor-pointer"
                          onChange={(e) => onFileUpload(e, "dependency")}
                        />
                        <Package className="mx-auto h-12 w-12 text-muted-foreground group-hover:text-primary" />
                        <p className="mt-2 text-lg font-semibold">
                          Drop dependency files here
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Multiple files allowed
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {form.dependencyFiles.map((f: File, i: number) => (
                          <Badge
                            key={i}
                            variant="secondary"
                            className="pl-3 pr-1 py-1 gap-2 "
                          >
                            {f.name}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-5 w-5 rounded-full"
                              onClick={() => removeDependency(i)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-8 animate-in fade-in">
                    {/* Target Platforms Section */}
                    <div className="space-y-3">
                      <Label className="text-xs font-bold uppercase text-slate-500 tracking-widest">
                        Target Platforms
                      </Label>
                      <div className="flex flex-wrap gap-2">
                        {platformList?.map((p: any) => (
                          <Button
                            key={p.enumName}
                            variant={
                              form.targetPlatforms.includes(p.enumName)
                                ? "default"
                                : "outline"
                            }
                            size="sm"
                            className="rounded-full transition-all"
                            onClick={() => {
                              const exists = form.targetPlatforms.includes(
                                p.enumName,
                              );
                              update(
                                "targetPlatforms",
                                exists
                                  ? form.targetPlatforms.filter(
                                      (x: any) => x !== p.enumName,
                                    )
                                  : [...form.targetPlatforms, p.enumName],
                              );
                            }}
                          >
                            <Monitor className="h-3.5 w-3.5 mr-2" />
                            {p.displayName}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Template Parameters Section */}
                    <div className="space-y-8 animate-in fade-in">
                      <div className="space-y-4 pt-4 border-t">
                        <div className="flex justify-between items-center">
                          <div className="space-y-0.5">
                            <Label className="text-xs font-bold uppercase text-slate-500 tracking-widest">
                              Template Parameters
                            </Label>

                            <div className="mt-4 p-4 border border-primary/20 bg-primary/5 rounded-xl">
                              <div className="flex items-start gap-3">
                                <div className="p-2 bg-primary/10 rounded-lg">
                                  <Settings2 className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                  <h4 className="text-sm font-bold text-primary">
                                    Smart Variable Sync
                                  </h4>
                                  <p className="text-[11px] text-slate-600 leading-relaxed mt-1">
                                    We detected{" "}
                                    <Badge
                                      variant="secondary"
                                      className="px-1 h-4 text-[10px]"
                                    >
                                      {
                                        form.parameters.filter(
                                          (p: any) => p.isAutoGenerated,
                                        ).length
                                      }
                                    </Badge>{" "}
                                    variables in your script. Each{" "}
                                    <code className="bg-primary/20 px-1 rounded text-primary">
                                      ${"{name}"}
                                    </code>{" "}
                                    you type in Step 1 automatically appears
                                    here as a required parameter.
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={addParameter}
                            className="h-8 gap-1.5 text-xs font-bold border-primary/20 text-primary hover:bg-primary/5"
                          >
                            <Plus className="h-3.5 w-3.5" /> Add Parameter
                          </Button>
                        </div>

                        <div className="space-y-2">
                          {form.parameters.length > 0 && (
                            <div className="grid grid-cols-12 gap-2 px-3 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                              <div className="col-span-4 text-left">
                                Param Name
                              </div>
                              <div className="col-span-3 text-left">Type</div>
                              <div className="col-span-3 text-left">
                                Default Value
                              </div>
                              <div className="col-span-1 text-center">Req.</div>
                              <div className="col-span-1 text-right">
                                Action
                              </div>
                            </div>
                          )}

                          <div className="space-y-3">
                            {form.parameters.length === 0 ? (
                              <div className="text-center py-8 border border-dashed rounded-lg bg-slate-50/50">
                                <p className="text-xs text-slate-400">
                                  No parameters defined yet.
                                </p>
                              </div>
                            ) : (
                              form.parameters.map((p: any, idx: number) => {
                                const isAuto = p.isAutoGenerated === true;

                                return (
                                  <div
                                    key={idx}
                                    className={`grid grid-cols-12 gap-2 items-center p-3 rounded-lg border shadow-sm
        ${isAuto ? "bg-primary/5 border-primary/30" : "bg-muted border-slate-200"}
      `}
                                  >
                                    {/* Param Name */}
                                    <div className="col-span-4">
                                      <Input
                                        className="h-9 text-xs"
                                        value={p.paramName}
                                        disabled={isAuto} // 🔒 LOCK
                                        onChange={(e) =>
                                          updateParameter(
                                            idx,
                                            "paramName",
                                            e.target.value,
                                          )
                                        }
                                      />
                                    </div>

                                    <div className="col-span-3">
                                      <Select
                                        value={p.paramType}
                                        disabled={isAuto}
                                        onValueChange={(v) =>
                                          updateParameter(idx, "paramType", v)
                                        }
                                      >
                                        <SelectTrigger className="h-9 w-full text-xs">
                                          <SelectValue placeholder="Select Type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {paramTypes?.data?.map(
                                            (t: string) => (
                                              <SelectItem key={t} value={t}>
                                                {t}
                                              </SelectItem>
                                            ),
                                          )}
                                        </SelectContent>
                                      </Select>
                                    </div>

                                    <div className="col-span-3">
                                      <Input
                                        className="h-9 text-xs"
                                        value={p.defaultValue}
                                        placeholder="Value..."
                                        onChange={(e) =>
                                          updateParameter(
                                            idx,
                                            "defaultValue",
                                            e.target.value,
                                          )
                                        }
                                      />
                                    </div>

                                    <div className="col-span-1 flex justify-center">
                                      <Switch
                                        checked={p.required}
                                        onCheckedChange={(v) =>
                                          updateParameter(idx, "required", v)
                                        }
                                      />
                                    </div>

                                    <div className="col-span-1 flex justify-end">
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        disabled={isAuto}
                                        className={`h-8 w-8 ${
                                          isAuto
                                            ? "opacity-40 cursor-not-allowed"
                                            : "hover:text-destructive"
                                        }`}
                                        onClick={() => {
                                          if (isAuto) return;
                                          const n = [...form.parameters];
                                          n.splice(idx, 1);
                                          update("parameters", n);
                                        }}
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </div>
                                );
                              })
                            )}
                          </div>
                        </div>
                        <div className="flex items-center w-30 gap-3 border px-4 h-10 rounded-md bg-slate-50">
                          <Label className="text-xs font-bold uppercase text-slate-500">
                            Active
                          </Label>
                          <Switch
                            checked={form.active}
                            onCheckedChange={(v) => update("active", v)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-6 animate-in zoom-in-95">
                    <div className="grid grid-cols-2 gap-6 p-6 border rounded-xl bg-muted">
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          Display Name
                        </p>
                        <p className="text-sm font-semibold">
                          {form.templetName}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          Type
                        </p>
                        <Badge>{form.scriptType}</Badge>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          Platforms
                        </p>
                        <p className="text-xs">
                          {form.targetPlatforms.join(", ") || "None selected"}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          Assets
                        </p>
                        <p className="text-xs">
                          {form.dependencyFileIds.length} dependencies uploaded
                        </p>
                      </div>
                    </div>
                    {form.scriptCategory === "TEXT" && (
                      <div className="p-4 bg-slate-900 rounded-lg max-h-40 overflow-auto">
                        <pre className="text-green-500 font-mono text-xs">
                          {form.command}
                        </pre>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>

              <div className="px-8 py-4 bg-muted border-t flex justify-between">
                <Button variant="outline" onClick={() => window.history.back()}>
                  Cancel
                </Button>

                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    disabled={step === 0}
                    onClick={() => setStep(step - 1)}
                  >
                    Back
                  </Button>
                  {step < 3 ? (
                    <Button
                      onClick={() => setStep(step + 1)}
                      disabled={!isStepValid() || uploadMutation.isPending}
                    >
                      Next Step
                    </Button>
                  ) : (
                    <Button
                      className="bg-green-600 hover:bg-green-700 text-white px-8"
                      onClick={handleFinalSubmit}
                      disabled={!isStepValid() || submitMutation.isPending}
                    >
                      {submitMutation.isPending
                        ? "Saving..."
                        : "Create Template"}
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 animate-in zoom-in-95">
            <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center mb-6">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>

            <h2 className="text-2xl font-bold text-green-700">
              Template Created Successfully 🎉
            </h2>

            <p className="text-sm text-muted-foreground mt-2 text-center max-w-md">
              Your script template{" "}
              <span className="font-semibold">{form.templetName}</span> has been
              created and is ready to run or manage.
            </p>

            <div className="flex gap-4 mt-8">
              <Button
                variant="outline"
                onClick={() => {
                  setForm(initialFormState);
                  setStep(0);
                }}
              >
                Create Another Template
              </Button>

              <Button
                className="bg-primary hover:bg-primary/90"
                onClick={() => navigate("/app/scriptRunner/scriptTemplate")}
              >
                Go to Template List
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
