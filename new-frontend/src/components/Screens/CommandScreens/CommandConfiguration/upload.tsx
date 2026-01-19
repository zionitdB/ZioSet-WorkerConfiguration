"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { fetchData } from "@/serviceAPI/serviceApi";

interface UploadFormProps {
  commandId: number;
  onClose: () => void;
}

const UploadForm: React.FC<UploadFormProps> = ({ commandId, onClose }) => {
  const [file, setFile] = useState<File | null>(null);

  const handleUpload = async () => {
    if (!file) return toast.error("Please choose a file.");
    const formData = new FormData();
    formData.append("file", file);
    formData.append("commandId", commandId + "");

    try {
      await fetchData("/configuration/uploadCommandFile", {
        method: "POST",
        body: formData,
      });
      toast.success("Uploaded successfully");
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Upload failed");
    }
  };

  return (
    <div className="space-y-4 p-3">
      <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
      <Button onClick={handleUpload}>Upload</Button>
    </div>
  );
};

export default UploadForm;
