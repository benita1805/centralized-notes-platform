import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import UploadForm from '../components/UploadForm';
import {
  FileText, Download, Trash2, Calendar, User, BookOpen, Hash, Layers
} from 'lucide-react';

const API_BASE_URL = process.env.REACT_APP_API_URL;


const Upload = () => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    fetchUploadedFiles();
  }, []);

  const fetchUploadedFiles = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/files`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const files = await response.json();
        setUploadedFiles(files);
      }
    } catch (error) {
      console.error('Failed to fetch files:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = () => {
    fetchUploadedFiles();
  };

  const handleDownload = async (fileId, filename) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/files/${fileId}/download`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Failed to download file:', error);
    }
  };

  const handleDelete = async (fileId) => {
    if (!window.confirm('Are you sure you want to delete this file?')) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/files/${fileId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        fetchUploadedFiles();
      }
    } catch (error) {
      console.error('Failed to delete file:', error);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  const getFileIcon = (mimeType) => {
    if (mimeType.startsWith('image/')) return '🖼️';
    if (mimeType.includes('pdf')) return '📄';
    if (mimeType.includes('word') || mimeType.includes('document')) return '📝';
    if (mimeType.includes('text')) return '📃';
    return '📁';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-sunset-retro flex items-center justify-center text-cyanGlow font-sans">
        <p className="animate-pulse text-lg">Loading files...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sunset-retro text-white font-sans">
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="bg-white bg-opacity-90 backdrop-blur-lg rounded-2xl p-8 shadow-2xl mb-6">
          <h2 className="text-4xl font-bold text-purple-600 mb-2 tracking-wide">📁 Upload Files</h2>
          <p className="text-gray-600">Share your notes, labs, and documents</p>
        </div>

        <UploadForm onUpload={handleUpload} />

        <div className="bg-white rounded-lg shadow-soft border border-gray-200 mt-8">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FileText className="text-blue-600" size={20} />
                <h3 className="text-lg font-semibold text-gray-800">
                  Uploaded Files ({uploadedFiles.length})
                </h3>
              </div>
            </div>
          </div>

          {uploadedFiles.length === 0 ? (
            <div className="p-12 text-center">
              <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">No files uploaded</h3>
              <p className="text-gray-500">Upload your first file to get started</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {uploadedFiles.map((file) => (
                <div key={file._id || file.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="text-2xl">
                        {getFileIcon(file.mimeType || file.mime_type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 truncate">
                          {file.originalName || file.original_name || file.filename}
                        </h4>
                        <div className="flex items-center flex-wrap gap-3 mt-1 text-xs text-gray-500">
                          <span>{formatFileSize(file.size)}</span>
                          <span className="flex items-center gap-1"><Calendar size={12} /> {formatDate(file.createdAt)}</span>
                          {file.subjectName && <span className="flex items-center gap-1"><BookOpen size={12} /> {file.subjectName}</span>}
                          {file.subjectCode && <span className="flex items-center gap-1"><Hash size={12} /> {file.subjectCode}</span>}
                          {file.semester && <span className="flex items-center gap-1"><Layers size={12} /> {file.semester}</span>}
                          {file.uploadedBy && <span className="flex items-center gap-1"><User size={12} /> {file.uploadedBy.email || file.uploadedBy}</span>}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleDownload(file._id || file.id, file.originalName || file.filename)}
                        className="bg-gradient-to-r from-yellow-400 to-pink-500 text-white px-4 py-2 rounded-lg shadow hover:scale-105 transition"
                        title="Download file"
                      >
                        <Download size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(file._id || file.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        title="Delete file"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {file.description && (
                    <div className="mt-3 text-sm text-gray-600 pl-10">
                      {file.description}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Upload;
