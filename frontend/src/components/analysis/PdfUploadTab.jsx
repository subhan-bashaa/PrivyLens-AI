import { useState, useRef } from 'react';
import { UploadCloud, FileText, X, CheckCircle2, FileUp } from 'lucide-react';

const PdfUploadTab = ({ file, setFile, error, setError }) => {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (selectedFile) => {
    if (selectedFile.type !== 'application/pdf' && !selectedFile.name.endsWith('.pdf')) {
      setError('Please select a valid PDF file.');
      return;
    }
    if (selectedFile.size > 15 * 1024 * 1024) {
      setError('File size exceeds the 15MB limit.');
      return;
    }
    setFile(selectedFile);
    setError('');
  };

  return (
    <div className="space-y-4">
      {!file ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`
            border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer
            transition-all duration-200 flex flex-col items-center justify-center
            ${
              isDragging
                ? 'border-primary bg-primary/5 scale-[0.99]'
                : 'border-border hover:border-primary/40 hover:bg-card-hover bg-card'
            }
          `}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="hidden"
          />
          <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-3">
            <UploadCloud className="w-7 h-7" />
          </div>
          <h4 className="text-sm font-bold text-text-primary mb-1">
            Drop your Privacy Policy PDF here
          </h4>
          <p className="text-xs text-text-tertiary mb-3">
            Supports official legal agreements, terms, and disclosures up to 15MB
          </p>
          <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-primary text-white hover:bg-primary-dark shadow-sm transition-all">
            <FileUp className="w-3.5 h-3.5" />
            Browse File
          </span>
        </div>
      ) : (
        /* Selected File Card */
        <div className="bg-card rounded-2xl border border-border p-4 flex items-center justify-between shadow-sm animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-text-primary flex items-center gap-1.5">
                {file.name}
                <CheckCircle2 className="w-4 h-4 text-success" />
              </p>
              <p className="text-xs text-text-tertiary mt-0.5">
                {(file.size / 1024).toFixed(1)} KB • PDF Document Ready
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setFile(null)}
            className="p-2 text-text-tertiary hover:text-danger hover:bg-danger-light rounded-xl transition-colors cursor-pointer"
            title="Remove file"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {error && (
        <p className="text-xs text-danger font-medium animate-fade-in">{error}</p>
      )}
    </div>
  );
};

export default PdfUploadTab;
