import React, { useState } from 'react';
import { 
  Download, 
  Search, 
  UserPlus, 
  CheckCircle2, 
  Clock, 
  ShieldCheck
} from 'lucide-react';
import { Student } from '../../types';

interface SustainedAttendanceTableProps {
  students: Student[];
  sustainedThreshold: number;
  onOpenEnrollModal: () => void;
  onManualMark: (studentId: string) => void;
}

export const SustainedAttendanceTable: React.FC<SustainedAttendanceTableProps> = ({
  students,
  sustainedThreshold,
  onOpenEnrollModal,
  onManualMark,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.rollNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const presentCount = students.filter((s) => s.presenceStatus === 'Present').length;
  const verifyingCount = students.filter((s) => s.presenceStatus === 'Verifying').length;
  const absentCount = students.filter((s) => s.presenceStatus === 'Absent').length;

  // Export to CSV
  const handleExportCSV = () => {
    const headers = [
      'Student ID',
      'Roll Number',
      'Student Name',
      'Department',
      'Attendance Status',
      'Sustained Duration (s)',
      'Marked At',
      'Confidence',
      'Verification Method',
    ];

    const rows = students.map((s) => [
      s.id,
      s.rollNo,
      `"${s.name}"`,
      `"${s.department}"`,
      s.presenceStatus,
      s.sustainedTimeSec,
      s.markedAt || 'N/A',
      `${Math.round(s.confidence * 100)}%`,
      s.presenceStatus === 'Present' ? 'Biometric Sustained Vision' : 'Pending',
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Classroom_Attendance_Log_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-4 space-y-3.5">
      {/* Header & Primary Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
        <div>
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Sustained Attendance Verification Log
            </h2>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Temporal Presence Gate: Sustained presence requirement (&ge; {sustainedThreshold}s) prevents hallway walk-by false records.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={onOpenEnrollModal}
            className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 transition-colors"
          >
            <UserPlus className="w-3.5 h-3.5 text-slate-400" />
            <span>Enroll Student</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filter and Summary Counts */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by student name, roll ID, or department..."
            className="w-full bg-slate-950 border border-slate-800 rounded-md pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center space-x-3 text-[11px] font-mono text-slate-400">
          <span className="flex items-center space-x-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Present: <strong className="text-slate-200">{presentCount}</strong></span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            <span>Verifying: <strong className="text-slate-200">{verifyingCount}</strong></span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
            <span>Absent: <strong className="text-slate-400">{absentCount}</strong></span>
          </span>
        </div>
      </div>

      {/* Structured Enterprise Table */}
      <div className="overflow-x-auto rounded-md border border-slate-800">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider text-[10px] font-mono border-b border-slate-800">
            <tr>
              <th className="py-2.5 px-3">Participant</th>
              <th className="py-2.5 px-3">Roll ID</th>
              <th className="py-2.5 px-3">Department</th>
              <th className="py-2.5 px-3">Sustained Window</th>
              <th className="py-2.5 px-3">Status</th>
              <th className="py-2.5 px-3">Timestamp</th>
              <th className="py-2.5 px-3">Confidence</th>
              <th className="py-2.5 px-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80 bg-slate-900/40">
            {filteredStudents.map((student) => {
              const isPresent = student.presenceStatus === 'Present';
              const isVerifying = student.presenceStatus === 'Verifying';

              return (
                <tr key={student.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-2 px-3 flex items-center space-x-2.5">
                    <img
                      src={student.avatar}
                      alt={student.name}
                      className="w-7 h-7 rounded-full object-cover border border-slate-700"
                    />
                    <div>
                      <span className="font-medium text-slate-200 block text-xs">{student.name}</span>
                      <span className="text-[10px] text-slate-500 font-mono">ID: {student.id}</span>
                    </div>
                  </td>

                  <td className="py-2 px-3 font-mono text-slate-300">
                    {student.rollNo}
                  </td>

                  <td className="py-2 px-3 text-slate-400">
                    {student.department}
                  </td>

                  <td className="py-2 px-3">
                    <div className="space-y-1 max-w-[110px]">
                      <div className="flex justify-between text-[10px] font-mono text-slate-400">
                        <span>{student.sustainedTimeSec}s</span>
                        <span>req. {sustainedThreshold}s</span>
                      </div>
                      <div className="w-full bg-slate-800 h-1 rounded-xs overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${
                            isPresent ? 'bg-emerald-500' : 'bg-amber-500'
                          }`}
                          style={{
                            width: `${Math.min(100, (student.sustainedTimeSec / sustainedThreshold) * 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                  </td>

                  <td className="py-2 px-3">
                    <span
                      className={`inline-flex items-center space-x-1.5 px-2 py-0.5 rounded text-[11px] font-mono ${
                        isPresent
                          ? 'text-emerald-400 bg-emerald-500/10'
                          : isVerifying
                          ? 'text-amber-400 bg-amber-500/10'
                          : 'text-slate-500 bg-slate-800/50'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        isPresent ? 'bg-emerald-400' : isVerifying ? 'bg-amber-400' : 'bg-slate-600'
                      }`} />
                      <span>{student.presenceStatus}</span>
                    </span>
                  </td>

                  <td className="py-2 px-3 font-mono text-slate-300 text-[11px]">
                    {student.markedAt || <span className="text-slate-600">—</span>}
                  </td>

                  <td className="py-2 px-3 font-mono text-[11px]">
                    {student.confidence > 0 ? (
                      <span className="text-slate-300">{Math.round(student.confidence * 100)}%</span>
                    ) : (
                      <span className="text-slate-600">—</span>
                    )}
                  </td>

                  <td className="py-2 px-3 text-right">
                    {student.presenceStatus !== 'Present' ? (
                      <button
                        onClick={() => onManualMark(student.id)}
                        className="px-2 py-1 rounded text-[10px] font-medium bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700 transition-colors"
                        title="Instructor manual override"
                      >
                        Manual Mark
                      </button>
                    ) : (
                      <span className="text-[10px] text-emerald-400 font-mono">Verified</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
