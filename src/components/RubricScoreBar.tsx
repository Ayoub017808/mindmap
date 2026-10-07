import React from 'react';
import { CheckCircle2, AlertCircle, Sparkles, Layers, GitBranch, Palette, FileText } from 'lucide-react';
import { MindNode, ExerciseChallenge } from '../types/mindmap';

interface RubricCriterion {
  id: string;
  label: string;
  passed: boolean;
  detail: string;
  icon: React.ReactNode;
}

interface RubricScoreBarProps {
  nodes: MindNode[];
  activeChallenge: ExerciseChallenge | null;
  onAddSuggestedKeyword?: (keyword: string) => void;
}

export const RubricScoreBar: React.FC<RubricScoreBarProps> = ({
  nodes,
  activeChallenge,
  onAddSuggestedKeyword,
}) => {
  const rootNode = nodes.find((n) => n.parentId === null);
  const mainBranches = nodes.filter((n) => n.parentId === rootNode?.id);
  const subBranches = nodes.filter((n) => n.parentId !== null && n.parentId !== rootNode?.id);
  const uniqueColors = new Set(mainBranches.map((n) => n.color)).size;
  const nodesWithNotes = nodes.filter((n) => n.subtitle && n.subtitle.trim().length > 0).length;

  const targetMain = activeChallenge ? activeChallenge.requiredMainBranches : 3;
  const targetSub = activeChallenge ? activeChallenge.requiredSubNodes : 4;

  const criteria: RubricCriterion[] = [
    {
      id: 'root',
      label: 'الفكرة المركزية',
      passed: Boolean(rootNode && rootNode.label.trim().length >= 3),
      detail: rootNode ? `«${rootNode.label}»` : 'غير محددة',
      icon: <Layers className="w-4 h-4" />,
    },
    {
      id: 'main',
      label: 'الفروع الرئيسية',
      passed: mainBranches.length >= targetMain,
      detail: `${mainBranches.length} من ${targetMain} محاور`,
      icon: <GitBranch className="w-4 h-4" />,
    },
    {
      id: 'sub',
      label: 'الأمثلة والتفرعات',
      passed: subBranches.length >= targetSub,
      detail: `${subBranches.length} من ${targetSub} فروع فرعية`,
      icon: <Sparkles className="w-4 h-4" />,
    },
    {
      id: 'color',
      label: 'التنوع اللوني للذاكرة',
      passed: uniqueColors >= Math.min(3, Math.max(1, mainBranches.length)),
      detail: `${uniqueColors} ألوان مميزة`,
      icon: <Palette className="w-4 h-4" />,
    },
    {
      id: 'desc',
      label: 'الكلمات المفتاحية التوضيحية',
      passed: nodesWithNotes >= Math.min(4, nodes.length),
      detail: `${nodesWithNotes} عقد مشروحة`,
      icon: <FileText className="w-4 h-4" />,
    },
  ];

  const passedCount = criteria.filter((c) => c.passed).length;
  const percentage = Math.round((passedCount / criteria.length) * 100);

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-900 font-display">
              مؤشر جودة الخريطة الذهنية (التقييم الذاتي للطالب)
            </h3>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs font-medium text-emerald-800">
              {percentage === 100
                ? '● مكتملة باحترافية عالية'
                : percentage >= 60
                ? '● جيدة جداً (أضف مزيداً من التفرعات)'
                : '▲ في بداية التصميم'}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            يقيس هذا المؤشر مدى التزام خريطتك الذهنية بقواعد التخطيط البصري السليم وتوازن الفروع.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-left">
            <span className="text-xs text-slate-500 block">نسبة الاكتمال المعياري</span>
            <span className="text-lg font-bold text-slate-900 font-mono-nums">{percentage}%</span>
          </div>
          <div className="w-28 h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-700 transition-transform duration-200 origin-right"
              style={{ transform: `scaleX(${percentage / 100})` }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 pt-3">
        {criteria.map((item) => (
          <div
            key={item.id}
            className={`p-2.5 rounded-lg border transition-colors ${
              item.passed
                ? 'bg-emerald-50/50 border-emerald-200 text-emerald-950'
                : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}
          >
            <div className="flex items-center justify-between gap-1.5">
              <span className="text-xs font-bold flex items-center gap-1.5">
                {item.icon}
                <span>{item.label}</span>
              </span>
              {item.passed ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              )}
            </div>
            <div className="mt-1 flex items-center justify-between text-xs">
              <span className="text-slate-600 truncate">{item.detail}</span>
              <span className="font-semibold text-[11px]">
                {item.passed ? 'مكتمل' : 'يحتاج تعزيز'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {activeChallenge && (
        <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
          <div className="text-xs text-slate-700">
            <span className="font-bold text-amber-800">الكلمات المفتاحية المقترحة للتمرين (انقر لإضافتها فوراً): </span>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {activeChallenge.suggestedKeywords.map((kw) => (
              <button
                key={kw}
                type="button"
                onClick={() => onAddSuggestedKeyword && onAddSuggestedKeyword(kw)}
                className="px-2.5 py-1 text-xs font-medium bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-md transition-colors cursor-pointer whitespace-nowrap"
              >
                + {kw}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
