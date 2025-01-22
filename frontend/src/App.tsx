import React, { useState } from "react";
import axios from "axios";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import { FiUpload, FiDownload } from "react-icons/fi";
import { FaFileWord, FaFilePdf } from "react-icons/fa";

const FileUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
      setError("");
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file to upload.");
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
      setText(response.data.text);
    } catch (error) {
      setError("Error uploading file. Please try again.");
      console.error("Error uploading file:", error);
    } finally {
      setLoading(false);
    }
  };

  const downloadAsWord = () => {
    const blob = new Blob([text], { type: "application/msword" });
    saveAs(blob, "extracted_text.doc");
  };

  const downloadAsPDF = () => {
    const pdf = new jsPDF();
    pdf.text(text, 10, 10);
    pdf.save("extracted_text.pdf");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-800 via-gray-900 to-black p-6">
      <div className="relative overflow-hidden w-full max-w-6xl p-6 rounded-lg shadow-xl bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 text-white">
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full animate-pulse opacity-20"></div>
        <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-gradient-to-br from-green-500 to-teal-500 rounded-full animate-bounce opacity-10"></div>
        <div className="flex flex-wrap lg:flex-nowrap gap-8">
          {/* File Upload Section */}
          <div className="w-full lg:w-1/2 p-6 bg-gray-800 rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold text-center mb-6">
              Text Extraction Tool
            </h1>
            <div className="flex items-center justify-center mb-6">
              <FiUpload className="text-5xl text-blue-500 animate-bounce" />
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full p-3 mb-4 text-gray-300 border-2 border-dashed border-gray-600 rounded-lg bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleUpload}
              className={`w-full py-3 flex items-center justify-center gap-2 text-lg font-semibold rounded-lg ${
                loading
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600"
              }`}
              disabled={loading}
            >
              {loading ? "Extracting..." : "Extract Text"}
            </button>
            {error && (
              <div className="mt-4 text-red-400 text-center">{error}</div>
            )}
          </div>

          {/* Extracted Text Section */}
          <div className="w-full lg:w-1/2 p-6 bg-gray-800 rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold text-center mb-6">
              Extracted Text
            </h2>
            {text ? (
              <>
                <div className="p-4 bg-gray-900 border border-gray-700 rounded-lg text-gray-300 mb-6 whitespace-pre-wrap h-40 overflow-y-auto">
                  {text}
                </div>
                <div className="flex flex-wrap gap-4 justify-center">
                  <button
                    onClick={downloadAsWord}
                    className="flex items-center gap-2 py-3 px-6 bg-green-500 hover:bg-green-600 text-white rounded-lg"
                  >
                    <FaFileWord className="text-xl" /> Download as Word
                  </button>
                  <button
                    onClick={downloadAsPDF}
                    className="flex items-center gap-2 py-3 px-6 bg-red-500 hover:bg-red-600 text-white rounded-lg"
                  >
                    <FaFilePdf className="text-xl" /> Download as PDF
                  </button>
                </div>
              </>
            ) : (
              <p className="text-gray-400 text-center">
                No text extracted yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
