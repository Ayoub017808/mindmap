import React from 'react';
import {
  Compass,
  Target,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  BookOpen,
} from 'lucide-react';
import { SAUDI_MINDMAP_PRESETS, STUDENT_EXERCISES } from '../data/saudiPresets';
import { MindMapPreset, ExerciseChallenge } from '../types/mindmap';

interface ExamplesAndExercisesViewProps {
  mode: 'examples' | 'exercises';
  activePresetId: string;
  activeChallengeId: string | null;
  onLoadPreset: (preset: MindMapPreset) => void;
  onStartChallenge: (challenge: ExerciseChallenge) => void;
}

export const ExamplesAndExercisesView: React.FC<ExamplesAndExercisesViewProps> = ({
  mode,
  activePresetId,
  activeChallengeId,
  onLoadPreset,
  onStartChallenge,
}) => {
  if (mode === 'examples') {
    return (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800">
            <span>نماذج تطبيقية جاهزة</span>
            <span>·</span>
            <span>الحياة الواقعية في المملكة ورؤية 2030</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display mt-1">
            مكتبة الخرائط الذهنية الوطنية والتعليمية
          </h1>
          <p className="text-sm sm:text-base text-slate-600 mt-1 max-w-3xl">
            استعرض أمثلة حقيقية متكاملة تحاكي مشاريع رؤية السعودية 2030، نظام المسارات الثانوي، والتنمية الإقليمية في منطقة جازان. يمكنك فتح أي نموذج في المحاكي والتعديل عليه بحرية.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SAUDI_MINDMAP_PRESETS.map((preset) => {
            const isCurrent = preset.id === activePresetId;
            return (
              <article
                key={preset.id}
                className={`bg-white rounded-2xl border p-6 transition-all flex flex-col justify-between ${
                  isCurrent
                    ? 'border-emerald-700 ring-2 ring-emerald-600/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div>
                  {/* Unboxed clean metadata per design rules */}
                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                    <span className="font-semibold text-emerald-800">{preset.category}</span>
                    <span aria-hidden="true">·</span>
                    <span>{preset.nodes.length} عقد مترابطة</span>
                    {isCurrent && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="text-amber-700 font-bold">معروض حالياً في المحاكي</span>
                      </>
                    )}
                  </div>

                  <h2 className="text-xl font-bold text-slate-900 font-display">
                    {preset.title}
                  </h2>

                  <p className="text-sm text-slate-600 leading-relaxed mt-2">
                    {preset.summary}
                  </p>

                  <div className="mt-4 pt-4 border-t border-slate-100 space-y-2 text-xs">
                    <div className="text-slate-700">
                      <span className="font-bold text-slate-900">التطبيق الواقعي: </span>
                      {preset.realWorldContext}
                    </div>
                    <div className="text-emerald-800 font-medium">
                      <span className="font-bold">المحاور: </span>
                      {preset.visionAlignment}
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500">
                    قابل للتعديل والإضافة في المحاكي
                  </span>
                  <button
                    type="button"
                    onClick={() => onLoadPreset(preset)}
                    className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>فتح النموذج في المحاكي</span>
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    );
  }

  // Exercises Mode
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-xs font-semibold text-amber-800">
          <span>تمارين عملية وتحديات طلابية</span>
          <span>·</span>
          <span>ثانوية الركوبة مسارات</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display mt-1">
          التمارين التطبيقية والمحاكاة الواقعية للطلاب
        </h1>
        <p className="text-sm sm:text-base text-slate-600 mt-1 max-w-3xl">
          اختر أحد التحديات الواقعية التالية ليتم فتح خريطة البداية في المحاكي، ثم استخدم الكلمات المفتاحية المقترحة وأضف الفروع المطلوبة لاجتياز التقييم الذاتي بنسبة 100%.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {STUDENT_EXERCISES.map((ex, index) => {
          const isCurrent = activeChallengeId === ex.id;
          return (
            <article
              key={ex.id}
              className={`bg-white rounded-2xl border p-6 flex flex-col justify-between transition-all ${
                isCurrent
                  ? 'border-amber-600 ring-2 ring-amber-500/20'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                  <span className="font-mono-nums font-bold text-slate-800">0{index + 1}</span>
                  <span>·</span>
                  <span className="font-semibold text-amber-800">المستوى: {ex.difficulty}</span>
                  <span>·</span>
                  <span>
                    المطلوب: {ex.requiredMainBranches} محاور و{ex.requiredSubNodes} فروع
                  </span>
                </div>

                <h2 className="text-lg font-bold text-slate-900 font-display leading-snug">
                  {ex.title}
                </h2>

                <div className="mt-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700 leading-relaxed">
                  <span className="font-bold text-slate-900 block mb-1">سيناريو التمرين:</span>
                  {ex.scenario}
                </div>

                <div className="mt-3 text-xs text-slate-700 leading-relaxed">
                  <span className="font-bold text-emerald-800 flex items-center gap-1 mb-1">
                    <Target className="w-3.5 h-3.5" />
                    <span>المطلوب تنفيذه من الطالب:</span>
                  </span>
                  {ex.goal}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100">
                  <span className="text-xs font-bold text-slate-700 block mb-1.5">
                    أفكار وكلمات مفتاحية مساعدة:
                  </span>
                  <div className="text-xs text-slate-600 leading-relaxed">
                    {ex.suggestedKeywords.join(' · ')}
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => onStartChallenge(ex)}
                  className="w-full py-2.5 px-4 bg-slate-900 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>بدء التطبيق العملي لهذا التمرين</span>
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};
