import React, { useState } from 'react';
import { 
  Copy, 
  Check, 
  Download, 
  FileCode, 
  Terminal, 
  FolderTree
} from 'lucide-react';
import { PYTHON_CODE_FILES } from '../../data/initialData';

export const PythonCodeViewer: React.FC = () => {
  const fileKeys = Object.keys(PYTHON_CODE_FILES) as (keyof typeof PYTHON_CODE_FILES)[];
  const [activeFile, setActiveFile] = useState<keyof typeof PYTHON_CODE_FILES>('app.py');
  const [copied, setCopied] = useState(false);

  const currentCode = PYTHON_CODE_FILES[activeFile];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const filename = activeFile.split('/').pop() || 'code.py';
    const blob = new Blob([currentCode], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-slate-100">
            Offline Python Edge Implementation
          </h2>
          <p className="text-[11px] text-slate-400">
            Production modular Python source code matching your 9 Epics and 17 Tasks submission structure.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleCopy}
            className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Code'}</span>
          </button>

          <button
            onClick={handleDownload}
            className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium bg-blue-600 hover:bg-blue-500 text-white transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download {activeFile.split('/').pop()}</span>
          </button>
        </div>
      </div>

      {/* Terminal Quickstart */}
      <div className="bg-[#070b12] border border-slate-800 rounded-md p-3 text-xs font-mono text-slate-300 space-y-1.5">
        <div className="flex items-center space-x-2 text-slate-400 text-[11px] uppercase">
          <Terminal className="w-3.5 h-3.5" />
          <span>Local Terminal Execution:</span>
        </div>
        <div className="space-y-0.5 text-slate-400 pl-3 border-l border-slate-800 text-[11px]">
          <div><span className="text-emerald-400 font-bold">$</span> python -m venv venv</div>
          <div><span className="text-emerald-400 font-bold">$</span> source venv/bin/activate  <span className="text-slate-600"># Windows: .\venv\Scripts\activate</span></div>
          <div><span className="text-emerald-400 font-bold">$</span> pip install -r requirements.txt</div>
          <div><span className="text-emerald-400 font-bold">$</span> streamlit run app.py</div>
        </div>
      </div>

      {/* Code Browser Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
        
        {/* File Directory Sidebar */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3 space-y-2">
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-300 pb-1.5 border-b border-slate-800">
            <FolderTree className="w-3.5 h-3.5 text-blue-400" />
            <span>Files ({fileKeys.length})</span>
          </div>

          <div className="space-y-1">
            {fileKeys.map((file) => {
              const isSelected = activeFile === file;
              return (
                <button
                  key={file}
                  onClick={() => setActiveFile(file)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs font-mono transition-colors flex items-center justify-between ${
                    isSelected
                      ? 'bg-slate-800 text-white font-medium border border-slate-700'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850'
                  }`}
                >
                  <div className="flex items-center space-x-2 truncate">
                    <FileCode className="w-3.5 h-3.5 shrink-0 text-slate-500" />
                    <span className="truncate">{file}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Code Viewport Area */}
        <div className="lg:col-span-3 bg-[#070b12] border border-slate-800 rounded-lg overflow-hidden flex flex-col">
          <div className="bg-slate-900/80 px-3.5 py-2 border-b border-slate-800 flex items-center justify-between text-xs">
            <span className="font-mono text-slate-300 font-medium">{activeFile}</span>
            <span className="text-slate-500 font-mono text-[11px]">
              {currentCode.split('\n').length} lines
            </span>
          </div>

          <div className="p-3.5 overflow-x-auto max-h-[500px] font-mono text-xs text-slate-200 leading-relaxed scrollbar-thin">
            <pre>
              <code>{currentCode}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
