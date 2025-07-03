import React, { useState, useRef } from 'react';
import { Upload, File, X, CheckCircle, AlertCircle, Cloud } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const API_BASE_URL = process.env.REACT_APP_API_URL;

const UploadForm = ({ onUpload }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});
  const [uploadStatus, setUploadStatus] = useState({});
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [subjectName, setSubjectName] = useState('');
  const [subjectCode, setSubjectCode] = useState('');
  const [semester, setSemester] = useState('');
  const [description, setDescription] = useState('');

  const fileInputRef = useRef(null);
  const { token } = useAuth();

  const allowedFileTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
    'image/jpeg',
    'image/png',
    'image/gif'
  ];
  const maxFileSize = 10 * 1024 * 1024; // 10MB

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === 'dragenter' || e.type === 'dragover');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFileSelection(Array.from(e.dataTransfer.files));
  };

  const handleFileInput = (e) => {
    handleFileSelection(Array.from(e.target.files));
  };

  const handleFileSelection = (files) => {
    const validFiles = files.filter(file => {
      if (!allowedFileTypes.includes(file.type)) {
        alert(`${file.name} is not a supported file type.`);
        return false;
      }
      if (file.size > maxFileSize) {
        alert(`${file.name} is too large. Max size is 10MB.`);
        return false;
      }
      return true;
    });
    setSelectedFiles(prev => [...prev, ...validFiles]);
  };

  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setUploadProgress(prev => {
      const newProgress = { ...prev };
      delete newProgress[index];
      return newProgress;
    });
    setUploadStatus(prev => {
      const newStatus = { ...prev };
      delete newStatus[index];
      return newStatus;
    });
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const uploadFile = async (file, index) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("subjectName", subjectName);
    formData.append("subjectCode", subjectCode);
    formData.append("semester", semester);
    formData.append("description", description);

    try {
      setUploadStatus(prev => ({ ...prev, [index]: 'uploading' }));
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_BASE_URL}/api/upload`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Upload failed: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      setUploadStatus(prev => ({ ...prev, [index]: 'success' }));
      setUploadProgress(prev => ({ ...prev, [index]: 100 }));
      onUpload?.(result);
      return result;
    } catch (error) {
      console.error("Upload error:", error.message);
      setUploadStatus(prev => ({ ...prev, [index]: 'error' }));
      return null;
    }
  };

  const handleUploadAll = async () => {
    if (!selectedFiles.length) return;
    setIsUploading(true);

    const results = await Promise.allSettled(
      selectedFiles.map((file, index) =>
        uploadStatus[index] !== 'success' ? uploadFile(file, index) : Promise.resolve()
      )
    );

    const hasFailures = results.some(r => r.status === 'rejected');
    if (hasFailures) console.warn('Some uploads failed.');

    setTimeout(() => {
      setSelectedFiles([]);
      setUploadProgress({});
      setUploadStatus({});
    }, 2000);

    setIsUploading(false);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success': return <CheckCircle className="text-green-500" size={16} />;
      case 'error': return <AlertCircle className="text-red-500" size={16} />;
      case 'uploading': return <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>;
      default: return <File className="text-gray-400" size={16} />;
    }
  };

  return (
    <div className="bg-white font-inter rounded-lg shadow-soft border border-gray-200 p-6 mb-8">
      <div className="flex items-center space-x-2 mb-4">
        <Cloud className="text-blue-600" size={20} />
        <h3 className="text-lg font-semibold text-gray-800">Upload Files</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <input type="text" placeholder="Subject Name" value={subjectName} onChange={(e) => setSubjectName(e.target.value)} className="w-full p-3 border-2 border-gray-300 rounded-lg text-purple-600 placeholder-purple-400 focus:ring-2 focus:ring-pink-400" required />
        <input type="text" placeholder="Subject Code" value={subjectCode} onChange={(e) => setSubjectCode(e.target.value)} className="w-full p-3 border-2 border-gray-300 rounded-lg text-purple-600 placeholder-purple-400 focus:ring-2 focus:ring-pink-400" required />
        <select value={semester} onChange={(e) => setSemester(e.target.value)} className="w-full p-3 border-2 border-gray-300 rounded-lg text-purple-600 focus:ring-2 focus:ring-pink-400" required>
          <option value="">Select Semester</option>
          {[...Array(8)].map((_, i) => (<option key={i} value={`Semester ${i + 1}`}>{`Semester ${i + 1}`}</option>))}
        </select>
        <textarea placeholder="Description (optional)" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-3 border-2 border-gray-300 rounded-lg text-purple-600 placeholder-purple-400 focus:ring-2 focus:ring-pink-400"></textarea>
      </div>

      <div className={`relative border-2 border-dashed rounded-lg p-8 text-center ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}`} onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}>
        <input ref={fileInputRef} type="file" multiple onChange={handleFileInput} accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <div className="text-lg font-medium text-gray-700 mb-2">Drop files here or click to browse</div>
        <div className="text-sm text-gray-500">Supports: PDF, DOC, DOCX, TXT, JPG, PNG, GIF (max 10MB each)</div>
      </div>

      {selectedFiles.length > 0 && (
        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Selected Files ({selectedFiles.length})</h4>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {selectedFiles.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(uploadStatus[index])}
                  <div>
                    <div className="text-sm font-medium text-gray-700 truncate">{file.name}</div>
                    <div className="text-xs text-gray-500">{formatFileSize(file.size)}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {uploadProgress[index] && (
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full transition-all duration-300" style={{ width: `${uploadProgress[index]}%` }}></div>
                    </div>
                  )}
                  <button onClick={() => removeFile(index)} className="p-1 text-gray-400 hover:text-red-500 transition-colors" disabled={uploadStatus[index] === 'uploading'}>
                    <X size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 flex justify-end">
            <button onClick={handleUploadAll} disabled={isUploading || !selectedFiles.length} className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center space-x-2">
              {isUploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <Upload size={16} />
                  <span>Upload All</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadForm;
