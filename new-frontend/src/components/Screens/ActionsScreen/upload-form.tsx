import { useState } from "react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { fetchData } from "@/serviceAPI/serviceApi";

const UploadActionForm = ({ actionId, onSuccess }: any) => {
  const [file, setFile] = useState<File | null>(null);

  const handleUpload = async () => {
    if (!file) return toast.error("Select file");

    const ext = file.name.split(".").pop()?.toLowerCase();
    if (!["pdf", "docx", "txt"].includes(ext!))
      return toast.error("Only .pdf, .docx, .txt allowed");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("actionId", actionId);

    await fetchData("/configuration/addNewAction", {
      method: "POST",
      body: formData,
    });

    toast.success("File uploaded");
    onSuccess();
  };

  return (
    <div className="space-y-4">
      <input
        type="file"
        accept=".pdf,.docx,.txt"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />
      <Button onClick={handleUpload}>Upload</Button>
    </div>
  );
};

export default UploadActionForm;
