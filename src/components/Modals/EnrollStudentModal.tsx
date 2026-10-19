import React, { useState } from 'react';
import { X, UserPlus, Check } from 'lucide-react';
import { Student } from '../../types';

interface EnrollStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEnroll: (student: Omit<Student, 'id' | 'sustainedTimeSec' | 'presenceStatus' | 'confidence' | 'currentEngagement' | 'headPose' | 'eyesOpen' | 'earValue'>) => void;
}

const SAMPLE_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
];

export const EnrollStudentModal: React.FC<EnrollStudentModalProps> = ({
  isOpen,
  onClose,
  onEnroll,
}) => {
  const [name, setName] = useState('');
  const [rollNo, setRollNo] = useState(`CS-2024-0${Math.floor(Math.random() * 80 + 30)}`);
  const [department, setDepartment] = useState('Computer Science');
  const [avatar, setAvatar] = useState(SAMPLE_AVATARS[0]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onEnroll({
      name: name.trim(),
      rollNo: rollNo.trim(),
      department: department.trim(),
      avatar,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div className="bg-slate-900 border border-slate-800 rounded-lg w-full max-w-md p-5 shadow-2xl space-y-4 relative">
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 p-1 text-slate-400 hover:text-slate-200 rounded hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center space-x-2.5 border-b border-slate-800 pb-3">
          <div className="w-7 h-7 rounded bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-200">
            <UserPlus className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-100">Enroll Student for Sustained Biometrics</h2>
            <p className="text-[11px] text-slate-400">Classroom Face Recognition Reference Database</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div className="space-y-1">
            <label className="text-slate-300 font-medium">Student Full Name:</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Diya Sengupta"
              className="w-full bg-[#070b12] border border-slate-800 rounded-md px-3 py-1.5 text-slate-200 focus:outline-none text-xs"
            />
          </div>

          <div className="space-y-1">
            <label className="text-slate-300 font-medium">Roll Number / Registration ID:</label>
            <input
              type="text"
              required
              value={rollNo}
              onChange={(e) => setRollNo(e.target.value)}
              className="w-full bg-[#070b12] border border-slate-800 rounded-md px-3 py-1.5 text-slate-200 font-mono text-xs focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-slate-300 font-medium">Department:</label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full bg-[#070b12] border border-slate-800 rounded-md px-3 py-1.5 text-slate-200 text-xs focus:outline-none"
            >
              <option value="Computer Science">Computer Science</option>
              <option value="Artificial Intelligence">Artificial Intelligence & ML</option>
              <option value="Data Science">Data Science</option>
              <option value="Information Technology">Information Technology</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-300 font-medium">Profile Image Reference:</label>
            <div className="flex items-center space-x-2">
              {SAMPLE_AVATARS.map((imgUrl, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setAvatar(imgUrl)}
                  className={`relative rounded-full overflow-hidden w-8 h-8 border transition-transform ${
                    avatar === imgUrl ? 'border-blue-500 scale-105' : 'border-slate-800 opacity-60'
                  }`}
                >
                  <img src={imgUrl} alt="Avatar" className="w-full h-full object-cover" />
                  {avatar === imgUrl && (
                    <div className="absolute inset-0 bg-blue-600/40 flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-md text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-1.5 rounded-md text-xs font-medium bg-emerald-600 hover:bg-emerald-500 text-white"
            >
              Enroll Student
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
