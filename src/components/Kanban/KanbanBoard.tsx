import React, { useState } from 'react';
import { 
  Kanban, 
  CheckCircle2, 
  Github, 
  ExternalLink, 
  Filter, 
  Edit3,
  Layers
} from 'lucide-react';
import { KanbanTask, Epic, ProjectMetadataState } from '../../types';

interface KanbanBoardProps {
  epics: Epic[];
  tasks: KanbanTask[];
  onUpdateTaskStatus: (taskId: string, newStatus: KanbanTask['status']) => void;
  projectMeta: ProjectMetadataState;
  onOpenLinksModal: () => void;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  epics,
  tasks,
  onUpdateTaskStatus,
  projectMeta,
  onOpenLinksModal,
}) => {
  const [selectedEpicFilter, setSelectedEpicFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTasks = tasks.filter((t) => {
    const matchesEpic = selectedEpicFilter === 'all' || t.epicId === selectedEpicFilter;
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesEpic && matchesSearch;
  });

  const completedCount = tasks.filter((t) => t.status === 'Completed').length;
  const inReviewCount = tasks.filter((t) => t.status === 'In Review').length;
  const inProgressCount = tasks.filter((t) => t.status === 'In Progress').length;
  const todoCount = tasks.filter((t) => t.status === 'To Do').length;
  const progressPercent = Math.round((completedCount / tasks.length) * 100);

  const columns: { status: KanbanTask['status']; label: string; count: number; badgeColor: string }[] = [
    { status: 'To Do', label: 'Backlog / To Do', count: todoCount, badgeColor: 'text-slate-400 bg-slate-800' },
    { status: 'In Progress', label: 'In Progress', count: inProgressCount, badgeColor: 'text-sky-400 bg-sky-500/10' },
    { status: 'In Review', label: 'In Review / QA', count: inReviewCount, badgeColor: 'text-amber-400 bg-amber-500/10' },
    { status: 'Completed', label: 'Completed & Verified', count: completedCount, badgeColor: 'text-emerald-400 bg-emerald-500/10' },
  ];

  return (
    <div className="space-y-4">
      {/* Mentor Submission & Project Deliverables Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                Evaluation Deliverables
              </span>
              <h2 className="text-sm font-semibold text-slate-100">
                Project Tracking: 9 Epics & 17 Stories/Tasks
              </h2>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Please ensure the Demo and GitHub links are configured so your mentor can review and evaluate your project.
            </p>
          </div>

          <button
            onClick={onOpenLinksModal}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5 text-slate-400" />
            <span>Configure Review Links</span>
          </button>
        </div>

        {/* Links Preview & Progress Strip */}
        <div className="pt-2.5 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-4 text-slate-300 font-mono text-[11px]">
            <div className="flex items-center space-x-1.5">
              <Github className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-500">GitHub:</span>
              {projectMeta.githubUrl ? (
                <a
                  href={projectMeta.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-400 hover:underline flex items-center space-x-1 truncate max-w-[240px]"
                >
                  <span>{projectMeta.githubUrl}</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              ) : (
                <span className="text-amber-400 italic">Not set</span>
              )}
            </div>

            <div className="flex items-center space-x-1.5">
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-500">Live Demo:</span>
              {projectMeta.demoUrl ? (
                <a
                  href={projectMeta.demoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-400 hover:underline flex items-center space-x-1 truncate max-w-[240px]"
                >
                  <span>{projectMeta.demoUrl}</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              ) : (
                <span className="text-amber-400 italic">Not set</span>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2 text-xs font-mono">
            <span className="text-slate-400">Tasks Completed:</span>
            <span className="font-bold text-emerald-400">{completedCount}/{tasks.length} ({progressPercent}%)</span>
            <div className="w-20 bg-slate-800 h-1.5 rounded-xs overflow-hidden">
              <div
                className="bg-emerald-500 h-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Epics Filter Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-3 space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center space-x-1.5 text-slate-400">
            <Filter className="w-3.5 h-3.5" />
            <span className="font-medium text-slate-300">Epic Filter (9 Epics):</span>
          </div>

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter tasks by keyword..."
            className="bg-slate-950 border border-slate-800 rounded-md px-2.5 py-1 text-xs text-slate-200 placeholder-slate-500 focus:outline-none"
          />
        </div>

        {/* Epic Filter Buttons */}
        <div className="flex flex-wrap gap-1 pt-1">
          <button
            onClick={() => setSelectedEpicFilter('all')}
            className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors ${
              selectedEpicFilter === 'all'
                ? 'bg-blue-600 text-white font-medium'
                : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
            }`}
          >
            All Epics (17 Tasks)
          </button>
          {epics.map((epic) => (
            <button
              key={epic.id}
              onClick={() => setSelectedEpicFilter(epic.id)}
              className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors ${
                selectedEpicFilter === epic.id
                  ? 'bg-blue-600 text-white font-medium'
                  : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              Epic {epic.number}: {epic.title.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Kanban Board Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {columns.map((col) => {
          const colTasks = filteredTasks.filter((t) => t.status === col.status);

          return (
            <div
              key={col.status}
              className="bg-slate-900/60 border border-slate-800 rounded-lg p-3 flex flex-col space-y-2.5 min-h-[480px]"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                <span className="text-xs font-semibold text-slate-300">
                  {col.label}
                </span>
                <span className={`px-1.5 py-0.2 rounded text-[10px] font-mono font-medium ${col.badgeColor}`}>
                  {colTasks.length}
                </span>
              </div>

              {/* Task Cards */}
              <div className="space-y-2 flex-1 overflow-y-auto">
                {colTasks.map((task) => (
                  <div
                    key={task.id}
                    className="p-3 rounded-md bg-[#070b12] border border-slate-800/90 hover:border-slate-700 transition-colors space-y-2 group"
                  >
                    {/* Epic Tag & Priority */}
                    <div className="flex items-center justify-between text-[10px] font-mono">
                      <span className="text-slate-400">
                        {task.epicTitle}
                      </span>
                      <span className={`font-semibold ${
                        task.priority === 'High' ? 'text-rose-400' : 'text-slate-500'
                      }`}>
                        {task.priority} • {task.storyPoints}pt
                      </span>
                    </div>

                    {/* Task Title */}
                    <h3 className="text-xs font-medium text-slate-200 group-hover:text-blue-400 transition-colors leading-snug">
                      {task.title}
                    </h3>

                    {/* Task Description */}
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      {task.description}
                    </p>

                    {/* Acceptance Criteria */}
                    <div className="space-y-1 bg-slate-900/80 p-2 rounded border border-slate-800/80 text-[10px]">
                      <span className="text-slate-500 font-mono block text-[9.5px] uppercase">Acceptance Criteria:</span>
                      {task.acceptanceCriteria.map((crit, idx) => (
                        <div key={idx} className="flex items-start space-x-1.5 text-slate-300">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{crit}</span>
                        </div>
                      ))}
                    </div>

                    {/* Transition Controls */}
                    <div className="pt-1.5 border-t border-slate-800/60 flex items-center justify-between text-[10px] font-mono">
                      <span className="text-slate-500">Move:</span>
                      <div className="flex space-x-1">
                        {task.status !== 'In Progress' && (
                          <button
                            onClick={() => onUpdateTaskStatus(task.id, 'In Progress')}
                            className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-sky-300 transition-colors"
                          >
                            Progress
                          </button>
                        )}
                        {task.status !== 'In Review' && (
                          <button
                            onClick={() => onUpdateTaskStatus(task.id, 'In Review')}
                            className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-amber-300 transition-colors"
                          >
                            Review
                          </button>
                        )}
                        {task.status !== 'Completed' && (
                          <button
                            onClick={() => onUpdateTaskStatus(task.id, 'Completed')}
                            className="px-1.5 py-0.5 rounded bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 transition-colors"
                          >
                            ✓ Done
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {colTasks.length === 0 && (
                  <div className="text-center py-8 text-slate-600 text-xs font-mono italic">
                    No active tasks
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
