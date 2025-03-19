import React, { useState, useEffect } from "react";
import axios from "axios";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import { FiUpload, FiImage, FiMaximize2, FiMinimize2, FiEdit2 } from "react-icons/fi";
import { FaFileWord, FaFilePdf, FaMagic, FaSave, FaTimes } from "react-icons/fa";
import { MdOutlineContentCopy } from "react-icons/md";

const FileUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("");
  const [editableText, setEditableText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [animateText, setAnimateText] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Trigger text animation when text changes
  useEffect(() => {
    if (text) {
      setAnimateText(true);
      setEditableText(text);
      const timer = setTimeout(() => setAnimateText(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [text]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const selectedFile = event.target.files[0];
      setFile(selectedFile);
      setError("");

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select an image file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.data.error) {
        setError(response.data.error);
        setText("");
      } else {
        setText(response.data.text || "");
      }
    } catch (error) {
      setError("Error uploading file. Please try again.");
      console.error("Error uploading file:", error);
    } finally {
      setLoading(false);
    }
  };

  const downloadAsWord = () => {
    const contentToDownload = isEditing ? editableText : text;
    const blob = new Blob([contentToDownload], { type: "application/msword" });
    saveAs(blob, "extracted_text.doc");
  };

  const downloadAsPDF = () => {
    const pdf = new jsPDF();
    const contentToDownload = isEditing ? editableText : text;

    // Split text into lines to avoid text going off the page
    const textLines = pdf.splitTextToSize(contentToDownload, 180);
    pdf.text(textLines, 15, 20);
    pdf.save("extracted_text.pdf");
  };

  const copyToClipboard = () => {
    const contentToCopy = isEditing ? editableText : text;
    navigator.clipboard.writeText(contentToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const toggleEditing = () => {
    if (isEditing) {
      // Save changes
      setText(editableText);
    } else {
      // Start editing
      setEditableText(text);
    }
    setIsEditing(!isEditing);
  };

  const cancelEditing = () => {
    setEditableText(text);
    setIsEditing(false);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditableText(e.target.value);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black p-6 relative overflow-hidden">
      {/* Enhanced animated background elements */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden z-0">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black animate-gradient-shift"></div>

        {/* Floating particles */}
        <div className="particles">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="particle"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                width: `${Math.random() * 3 + 1}px`,
                height: `${Math.random() * 3 + 1}px`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${Math.random() * 10 + 10}s`,
              }}
            ></div>
          ))}
        </div>

        {/* Enhanced glowing orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-teal-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
        <div className="absolute bottom-1/3 left-1/3 w-64 h-64 bg-pink-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-3000"></div>
      </div>

      {/* Grid overlay for cyberpunk effect */}
      <div className="fixed inset-0 bg-grid-pattern opacity-5 z-0"></div>

      {/* Fullscreen Text View */}
      {isFullscreen && (
        <div className="fixed inset-0 bg-black/95 z-50 flex flex-col p-6 overflow-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-white">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-300">
                Extracted Text
              </span>
            </h2>
            <div className="flex gap-3">
              {!isEditing && (
                <button
                  onClick={toggleEditing}
                  className="flex items-center justify-center gap-2 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all"
                >
                  <FiEdit2 className="text-lg" /> Edit
                </button>
              )}
              {isEditing && (
                <>
                  <button
                    onClick={toggleEditing}
                    className="flex items-center justify-center gap-2 py-2 px-4 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all"
                  >
                    <FaSave className="text-lg" /> Save
                  </button>
                  <button
                    onClick={cancelEditing}
                    className="flex items-center justify-center gap-2 py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all"
                  >
                    <FaTimes className="text-lg" /> Cancel
                  </button>
                </>
              )}
              <button
                onClick={toggleFullscreen}
                className="flex items-center justify-center gap-2 py-2 px-4 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all"
              >
                <FiMinimize2 className="text-lg" /> Exit Fullscreen
              </button>
            </div>
          </div>
          
          {isEditing ? (
            <textarea
              value={editableText}
              onChange={handleTextChange}
              className="flex-grow bg-gray-800 text-gray-200 p-6 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none resize-none font-mono text-base"
              placeholder="Edit extracted text here..."
            />
          ) : (
            <div className="flex-grow bg-gray-800/80 backdrop-blur-sm border border-gray-700 rounded-lg p-6 overflow-y-auto">
              <p className="text-gray-300 whitespace-pre-wrap">{text}</p>
            </div>
          )}
          
          <div className="flex justify-center gap-4 mt-6">
            <button
              onClick={copyToClipboard}
              className="flex items-center justify-center gap-2 py-3 px-6 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-all hover:shadow-lg hover:shadow-gray-700/50"
            >
              <MdOutlineContentCopy className="text-lg" />
              {copied ? "Copied!" : "Copy Text"}
            </button>
            <button
              onClick={downloadAsWord}
              className="flex items-center justify-center gap-2 py-3 px-6 bg-gradient-to-r from-green-700 to-emerald-600 hover:from-green-800 hover:to-emerald-700 text-white rounded-lg transition-all hover:shadow-lg hover:shadow-green-700/30"
            >
              <FaFileWord className="text-lg" />
              Word
            </button>
            <button
              onClick={downloadAsPDF}
              className="flex items-center justify-center gap-2 py-3 px-6 bg-gradient-to-r from-red-700 to-rose-600 hover:from-red-800 hover:to-rose-700 text-white rounded-lg transition-all hover:shadow-lg hover:shadow-red-700/30"
            >
              <FaFilePdf className="text-lg" />
              PDF
            </button>
          </div>
        </div>
      )}

      <div className="relative z-10 w-full max-w-6xl">
        <div className="text-center mb-12">
          <div className="relative inline-block">
            <h1 className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 pb-2 tracking-tight">
              Image to Text Extractor
            </h1>
            <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 rounded-full transform scale-x-0 animate-expand"></div>
          </div>
          <p className="text-gray-400 mt-4 text-lg max-w-2xl mx-auto leading-relaxed">
            Extract text from any image with advanced OCR technology powered by
            AI
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section - Enhanced */}
          <div className="bg-gray-900/80 backdrop-blur-sm rounded-xl shadow-xl overflow-hidden border border-gray-800 transition-all hover:shadow-2xl hover:shadow-blue-900/20 group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl"></div>
            <div className="p-8 relative">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                <FiUpload className="mr-3 text-blue-500 group-hover:animate-bounce" />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">
                  Upload Image
                </span>
              </h2>

              <div className="mt-6 mb-6">
                <div
                  className="border-2 border-dashed border-gray-700 rounded-xl p-10 text-center hover:border-blue-500 transition-all cursor-pointer group-hover:shadow-inner group-hover:shadow-blue-900/10"
                  onClick={() =>
                    document.getElementById("file-upload")?.click()
                  }
                >
                  {preview ? (
                    <div className="flex flex-col items-center">
                      <div className="relative mb-4 rounded-lg overflow-hidden group">
                        <img
                          src={preview}
                          alt="Preview"
                          className="max-h-56 max-w-full object-contain rounded-lg transition-transform group-hover:scale-105 duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-2">
                          <span className="text-white text-sm font-medium">
                            Click to change
                          </span>
                        </div>
                      </div>
                      <p className="text-gray-400">Image selected</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center py-8">
                      <div className="w-20 h-20 rounded-full bg-gray-800/80 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <FiImage className="text-4xl text-gray-500 group-hover:text-blue-400 transition-colors" />
                      </div>
                      <p className="text-gray-400 mb-2">
                        Drag & drop an image or click to browse
                      </p>
                      <p className="text-gray-600 text-sm">
                        Supports JPG, PNG, GIF
                      </p>
                    </div>
                  )}
                  <input
                    id="file-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              </div>

              <button
                onClick={handleUpload}
                disabled={loading || !file}
                className={`w-full py-4 rounded-lg font-medium flex items-center justify-center transition-all ${
                  loading || !file
                    ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 hover:shadow-lg hover:shadow-purple-500/20"
                }`}
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    <FaMagic className="mr-2" /> Extract Text
                  </>
                )}
              </button>

              {error && (
                <div className="mt-4 p-4 bg-red-900/30 border border-red-800 rounded-lg text-red-400 animate-pulse">
                  {error}
                </div>
              )}
            </div>
          </div>

          {/* Results Section - Enhanced with new buttons */}
          <div className="bg-gray-900/80 backdrop-blur-sm rounded-xl shadow-xl overflow-hidden border border-gray-800 transition-all hover:shadow-2xl hover:shadow-purple-900/20 group">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-pink-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl"></div>
            <div className="p-8 relative">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-300">
                    Extracted Text
                  </span>
                </h2>
                {text && (
                  <div className="flex gap-2">
                    {!isEditing ? (
                      <button
                        onClick={toggleEditing}
                        className="flex items-center justify-center p-2 bg-blue-600/80 hover:bg-blue-600 text-white rounded-lg transition-all"
                        title="Edit Text"
                      >
                        <FiEdit2 className="text-sm" />
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={toggleEditing}
                          className="flex items-center justify-center p-2 bg-green-600/80 hover:bg-green-600 text-white rounded-lg transition-all"
                          title="Save Changes"
                        >
                          <FaSave className="text-sm" />
                        </button>
                        <button
                          onClick={cancelEditing}
                          className="flex items-center justify-center p-2 bg-red-600/80 hover:bg-red-600 text-white rounded-lg transition-all"
                          title="Cancel Editing"
                        >
                          <FaTimes className="text-sm" />
                        </button>
                      </>
                    )}
                    <button
                      onClick={toggleFullscreen}
                      className="flex items-center justify-center p-2 bg-gray-700/80 hover:bg-gray-700 text-white rounded-lg transition-all"
                      title="Fullscreen View"
                    >
                      <FiMaximize2 className="text-sm" />
                    </button>
                  </div>
                )}
              </div>

              {isEditing ? (
                <textarea
                  value={editableText}
                  onChange={handleTextChange}
                  className="bg-gray-800/90 border border-gray-700 rounded-xl p-5 h-72 w-full overflow-y-auto mb-6 text-gray-300 focus:border-blue-500 focus:outline-none resize-none"
                  placeholder="Edit extracted text here..."
                />
              ) : (
                <div className="bg-gray-800/90 border border-gray-700 rounded-xl p-5 h-72 overflow-y-auto mb-6 scrollbar-custom">
                  {text ? (
                    <p
                      className={`text-gray-300 whitespace-pre-wrap ${
                        animateText ? "animate-text-appear" : ""
                      }`}
                    >
                      {text}
                    </p>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-gray-500">
                      <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center mb-4">
                        <svg
                          className="w-8 h-8 text-gray-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      </div>
                      <p>Extracted text will appear here</p>
                      <p className="text-gray-600 text-sm mt-2">
                        Upload an image to get started
                      </p>
                    </div>
                  )}
                </div>
              )}

              {text && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    onClick={copyToClipboard}
                    className="flex items-center justify-center gap-2 py-3 px-4 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-all hover:shadow-lg hover:shadow-gray-700/50"
                  >
                    <MdOutlineContentCopy className="text-lg" />
                    {copied ? "Copied!" : "Copy Text"}
                  </button>
                  <button
                    onClick={downloadAsWord}
                    className="flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-green-700 to-emerald-600 hover:from-green-800 hover:to-emerald-700 text-white rounded-lg transition-all hover:shadow-lg hover:shadow-green-700/30"
                  >
                    <FaFileWord className="text-lg" />
                    Word
                  </button>
                  <button
                    onClick={downloadAsPDF}
                    className="flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-red-700 to-rose-600 hover:from-red-800 hover:to-rose-700 text-white rounded-lg transition-all hover:shadow-lg hover:shadow-red-700/30"
                  >
                    <FaFilePdf className="text-lg" />
                    PDF
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="text-center mt-10 text-gray-500 text-sm">
          <p className="inline-block relative">
            Upload any image containing text to extract its content
            <span className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-500 to-transparent"></span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
