import React, { useState } from 'react';
import { 
  X, 
  Github, 
  ExternalLink, 
  CheckCircle2, 
  User, 
  School, 
  Save
} from 'lucide-react';
import { ProjectMetadataState } from '../../types';

interface DemoLinksModalProps {
  isOpen: boolean;
  onClose: () => void;
  metadata: ProjectMetadataState;
  onSaveMetadata: (newMeta: ProjectMetadataState) => void;
}

export const DemoLinksModal: React.FC<DemoLinksModalProps> = ({
  isOpen,
  onClose,
  metadata,
  onSaveMetadata,
}) => {
  const [form, setForm] = useState<ProjectMetadataState>({ ...metadata });
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveMetadata(form);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div className="bg-slate-900 border border-slate-800 rounded-lg w-full max-w-lg p-5 shadow-2xl space-y-4 relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 p-1 text-slate-400 hover:text-slate-200 rounded hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-2.5 border-b border-slate-800 pb-3">
          <div className="w-7 h-7 rounded bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-200">
            <Github className="w-4 h-4 text-blue-400" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-100">
              Mentor Evaluation & Submission Links
            </h2>
            <p className="text-[11px] text-slate-400">
              Update GitHub repository and live deployment URL for review and evaluation
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          
          {/* GitHub Link */}
          <div className="space-y-1">
            <label className="text-slate-300 font-medium flex items-center space-x-1.5">
              <span>GitHub Repository URL:</span>
            </label>
            <input
              type="url"
              required
              value={form.githubUrl}
              onChange={(e) => setForm({ ...form, githubUrl: e.target.value })}
              placeholder="https://github.com/your-username/multimodal-classroom-agent"
              className="w-full bg-[#070b12] border border-slate-800 rounded-md px-3 py-1.5 text-slate-200 font-mono text-xs focus:outline-none"
            />
          </div>

          {/* Live Demo Link */}
          <div className="space-y-1">
            <label className="text-slate-300 font-medium flex items-center space-x-1.5">
              <span>Live Deployment Demo URL:</span>
            </label>
            <input
              type="url"
              required
              value={form.demoUrl}
              onChange={(e) => setForm({ ...form, demoUrl: e.target.value })}
              placeholder="https://ais-dev-c6zi3c37mglug6x27t2dan-978881424768.asia-east1.run.app"
              className="w-full bg-[#070b12] border border-slate-800 rounded-md px-3 py-1.5 text-slate-200 font-mono text-xs focus:outline-none"
            />
          </div>

          {/* Mentor Name & Student Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-slate-300 font-medium">Assigned Mentor:</label>
              <input
                type="text"
                value={form.mentorName}
                onChange={(e) => setForm({ ...form, mentorName: e.target.value })}
                placeholder="Mentor Name (e.g., Dr. A. Sharma)"
                className="w-full bg-[#070b12] border border-slate-800 rounded-md px-3 py-1.5 text-slate-200 text-xs focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-medium">Student / Lead Author:</label>
              <input
                type="text"
                value={form.studentName}
                onChange={(e) => setForm({ ...form, studentName: e.target.value })}
                placeholder="Full Name"
                className="w-full bg-[#070b12] border border-slate-800 rounded-md px-3 py-1.5 text-slate-200 text-xs focus:outline-none"
              />
            </div>
          </div>

          {/* Institution */}
          <div className="space-y-1">
            <label className="text-slate-300 font-medium">Institution / Department:</label>
            <input
              type="text"
              value={form.institution}
              onChange={(e) => setForm({ ...form, institution: e.target.value })}
              placeholder="Department of Computer Science & Artificial Intelligence"
              className="w-full bg-[#070b12] border border-slate-800 rounded-md px-3 py-1.5 text-slate-200 text-xs focus:outline-none"
            />
          </div>

          {/* Submit Actions */}
          <div className="pt-2 border-t border-slate-800 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-md text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-blue-600 hover:bg-blue-500 text-white transition-colors"
            >
              {savedSuccess ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Saved</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Review Links</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
