"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { UploadSimple, FileText, CheckCircle, CircleDashed, FileImage, FilePdf, FileDoc, Check, Clock } from "@phosphor-icons/react";
import { motion, AnimatePresence } from "framer-motion";
import { contracts } from "@/lib/mock-data";

const pipelineSteps = [
  "Upload",
  "OCR",
  "Layout Analysis",
  "Clause Extraction",
  "Risk Analysis"
];

export default function UploadPage() {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadState, setUploadState] = useState<"idle" | "processing" | "complete">("idle");
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const recentUploads = contracts.slice(0, 4);

  useEffect(() => {
    let progressInterval: NodeJS.Timeout;
    let stepTimeout: NodeJS.Timeout;

    if (uploadState === "processing") {
      if (currentStepIndex < pipelineSteps.length) {
        // Reset progress for current step
        setProgress(0);
        
        // Simulate progress bar filling up for current step
        progressInterval = setInterval(() => {
          setProgress((prev) => {
            if (prev >= 100) {
              clearInterval(progressInterval);
              return 100;
            }
            return prev + 5;
          });
        }, 100);

        // Move to next step after 2.5 seconds
        stepTimeout = setTimeout(() => {
          clearInterval(progressInterval);
          if (currentStepIndex === pipelineSteps.length - 1) {
            setUploadState("complete");
          } else {
            setCurrentStepIndex((prev) => prev + 1);
          }
        }, 2500);
      }
    }

    return () => {
      clearInterval(progressInterval);
      clearTimeout(stepTimeout);
    };
  }, [uploadState, currentStepIndex]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      handleFileSelected(file);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelected(e.target.files[0]);
    }
  };

  const handleFileSelected = async (file: File) => {
    setSelectedFile(file);
    setUploadState("processing");
    setCurrentStepIndex(0);
    setProgress(0);

    const uploadedInfo = {
      id: "uploaded",
      title: file.name,
      size: (file.size / (1024 * 1024)).toFixed(2) + " MB",
      uploadDate: new Date().toISOString().split("T")[0],
      status: "Active",
      partyA: "APCPDCL (Southern Power Distribution Company of AP)",
      partyB: "AP-SPSU Contractor / Licensee",
      riskLevel: "Medium",
      effectiveDate: new Date().toISOString().split("T")[0],
      expirationDate: "2027-12-31"
    };

    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("last_uploaded_contract", JSON.stringify(uploadedInfo));
        sessionStorage.setItem("last_uploaded_contract", JSON.stringify(uploadedInfo));
      } catch (e) {}
    }

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", file.name);

      const res = await fetch("/api/contracts/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        if (typeof window !== "undefined") {
          const analysis = data.analysis || {};
          const updated = {
            ...uploadedInfo,
            id: data.id || "uploaded",
            title: data.title || analysis.title || file.name,
            partyA: analysis.partyA || uploadedInfo.partyA,
            partyB: analysis.partyB || uploadedInfo.partyB,
            riskLevel: analysis.riskLevel || uploadedInfo.riskLevel,
            clauses: analysis.clauses || [],
            obligations: analysis.obligations || [],
            risks: analysis.risks || [],
            effectiveDate: analysis.effectiveDate || uploadedInfo.effectiveDate,
          };
          localStorage.setItem("last_uploaded_contract", JSON.stringify(updated));
          sessionStorage.setItem("last_uploaded_contract", JSON.stringify(updated));
        }
      }
    } catch (err) {
      console.log("Backend gateway upload notice:", err);
    }
  };

  const resetUpload = () => {
    setSelectedFile(null);
    setUploadState("idle");
    setCurrentStepIndex(0);
    setProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-[100dvh] bg-[#FAFAFA] p-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-[#1E1E2D] mb-2 font-display">Upload Contract</h1>
          <p className="text-gray-500">Supported formats: PDF, DOCX, PNG, JPG, TIFF</p>
        </div>

        {/* Upload Zone */}
        <div className="space-y-8">
          <AnimatePresence mode="wait">
            {uploadState === "idle" ? (
              <motion.div
                key="dropzone"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`
                  border-2 border-dashed rounded-2xl p-16 flex flex-col items-center justify-center
                  cursor-pointer transition-colors duration-200
                  ${isDragging ? 'border-[#DC2626] bg-[#DC2626]/5' : 'border-gray-200 bg-white hover:border-[#DC2626]/50'}
                `}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleFileInput}
                  accept=".pdf,.docx,.doc,.png,.jpg,.jpeg,.tiff"
                />
                
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                  <UploadSimple size={48} className={`transition-colors ${isDragging ? 'text-[#DC2626]' : 'text-gray-400'}`} weight="light" />
                </div>
                
                <h3 className="text-xl font-semibold text-[#1E1E2D] mb-2">Drag & drop your contract here</h3>
                <p className="text-gray-500 mb-8">or click to browse from your computer</p>
                
                <div className="flex gap-3">
                  {['PDF', 'DOCX', 'PNG', 'TIFF'].map(ext => (
                    <span key={ext} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-md text-xs font-medium">
                      {ext}
                    </span>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="processing"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm"
              >
                {/* File Info */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm">
                      <FilePdf size={28} className="text-[#DC2626]" weight="light" />
                    </div>
                    <div>
                      <p className="font-semibold text-[#1E1E2D]">{selectedFile?.name || "Contract_Agreement.pdf"}</p>
                      <p className="text-sm text-gray-500">
                        {selectedFile ? (selectedFile.size / 1024 / 1024).toFixed(2) : "2.4"} MB
                      </p>
                    </div>
                  </div>
                  {uploadState === "complete" && (
                    <button
                      onClick={resetUpload}
                      className="text-sm font-medium text-[#DC2626] hover:text-[#DC2626]/80 px-4 py-2"
                    >
                      Upload Another
                    </button>
                  )}
                </div>

                {/* Pipeline Steps */}
                <div className="relative">
                  {/* Connecting Line */}
                  <div className="absolute top-5 left-8 right-8 h-0.5 bg-gray-100 -z-10" />
                  <div 
                    className="absolute top-5 left-8 h-0.5 bg-[#DC2626] -z-10 transition-all duration-500"
                    style={{ width: `${Math.min(100, (currentStepIndex / (pipelineSteps.length - 1)) * 100)}%` }}
                  />

                  <div className="flex justify-between relative z-0">
                    {pipelineSteps.map((step, idx) => {
                      const isCompleted = idx < currentStepIndex || uploadState === "complete";
                      const isCurrent = idx === currentStepIndex && uploadState !== "complete";
                      
                      return (
                        <div key={step} className="flex flex-col items-center w-32">
                          <div className={`
                            w-10 h-10 rounded-full flex items-center justify-center mb-4 transition-colors duration-300
                            ${isCompleted ? 'bg-[#DC2626] text-white' : 
                              isCurrent ? 'bg-white border-2 border-[#DC2626] text-[#DC2626]' : 
                              'bg-white border-2 border-gray-200 text-gray-400'}
                          `}>
                            {isCompleted ? (
                              <Check weight="bold" />
                            ) : isCurrent ? (
                              <CircleDashed weight="regular" className="animate-spin" />
                            ) : (
                              <div className="w-2.5 h-2.5 rounded-full bg-gray-200" />
                            )}
                          </div>
                          <span className={`text-sm font-medium text-center ${isCurrent || isCompleted ? 'text-[#1E1E2D]' : 'text-gray-400'}`}>
                            {step}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Current Step Progress */}
                {uploadState === "processing" && (
                  <div className="mt-12 bg-gray-50 rounded-xl p-6">
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-medium text-[#1E1E2D]">
                        {pipelineSteps[currentStepIndex]}...
                      </span>
                      <span className="text-sm text-gray-500">{progress}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <motion.div 
                        className="h-full bg-[#DC2626]"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ ease: "linear" }}
                      />
                    </div>
                  </div>
                )}
                
                {uploadState === "complete" && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-8 flex justify-center"
                  >
                    <Link
                      href="/contracts/uploaded"
                      className="bg-[#DC2626] text-white px-8 py-3 rounded-lg font-medium hover:bg-[#DC2626]/90 transition-colors shadow-sm inline-block cursor-pointer"
                    >
                      View Contract Details
                    </Link>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Recent Uploads */}
        <div>
          <h2 className="text-xl font-bold text-[#1E1E2D] mb-6">Recent Uploads</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {recentUploads.map((contract, i) => (
              <Link key={contract.id} href={`/contracts/${contract.id}`}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col h-full hover:border-[#DC2626]/30 transition-colors cursor-pointer group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center group-hover:bg-[#DC2626]/5 transition-colors">
                      <FileText size={24} className="text-gray-500 group-hover:text-[#DC2626] transition-colors" weight="light" />
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                      contract.status === 'Active' ? 'bg-green-50 text-green-700 border-green-100' :
                      contract.status === 'Review' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                      'bg-gray-50 text-gray-700 border-gray-100'
                    }`}>
                      {contract.status}
                    </span>
                  </div>
                  
                  <h3 className="font-semibold text-[#1E1E2D] text-sm mb-1 line-clamp-2" title={contract.title}>
                    {contract.title}
                  </h3>
                  
                  <div className="mt-auto pt-4 flex items-center justify-between text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Clock size={14} /> Today, 10:42 AM
                    </span>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
