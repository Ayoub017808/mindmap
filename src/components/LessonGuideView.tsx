import React from 'react';
import {
  CheckCircle2,
  Lightbulb,
  BookOpen,
  ArrowLeft,
  Compass,
  GitBranch,
  Palette,
  LayoutGrid,
  Sparkles,
} from 'lucide-react';
import { MODEL_LESSON_STEPS } from '../data/saudiPresets';
import { LessonStep } from '../types/mindmap';

interface LessonGuideModalProps {
  activeStep: number;
  onSelectStep: (step: number) => void;
  onTriggerStepAction: (actionType: LessonStep['actionType']) => void;
  onSwitchToStudio: () => void;
}

export const LessonGuideView: React.FC<LessonGuideModalProps> = ({
  activeStep,
  onSelectStep,
  onTriggerStepAction,
  onSwitchToStudio,
}) => {
  const currentLesson =
    MODEL_LESSON_STEPS.find((s) => s.stepNumber === activeStep) || MODEL_LESSON_STEPS[0];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Lesson Header Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800">
              <span>الدرس النموذجي التطبيقي</span>
              <span aria-hidden="true">·</span>
              <span>مهارات التفكير والتخطيط البصري</span>
              <span aria-hidden="true">·</span>
              <span>المرحلة الثانوية - نظام المسارات</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 font-display">
              فن صناعة الخرائط الذهنية وتطبيقاتها في رؤية السعودية 2030
            </h1>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              تعلّم في ٤ خطوات عملية مبسطة كيف تحوّل الدروس الطويلة والمشاريع الوطنية الكبرى إلى خريطة ذهنية بصرية منظمة يسهل فهمها واستذكارها وعرضها أمام زملائك.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={onSwitchToStudio}
              className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
            >
              <span>الانتقال إلى مساحة التصميم التفاعلية</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Why Mind Maps Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900 mb-1.5 font-display">
              <BookOpen className="w-4 h-4 text-emerald-700" />
              <span>ما هي الخريطة الذهنية؟</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              أداة تفكير بصرية تحاكي طريقة عمل الخلايا العصبية في الدماغ، حيث تبدأ من فكرة مركزية وتتفرع منها الأفكار الرئيسية والفرعية باستخدام الألوان والرموز والكلمات المفتاحية.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900 mb-1.5 font-display">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>لماذا يستخدمها طلاب المسارات؟</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              تختصر الفصول الدراسية الطويلة في صفحة واحدة، ترفع قوة التذكر والاسترجاع بنسبة عالية، وتساعد في تخطيط مشاريع التخرج والمبادرات التطوعية والعروض التقديمية.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900 mb-1.5 font-display">
              <Compass className="w-4 h-4 text-sky-700" />
              <span>ارتباطها برؤية المملكة 2030</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              برامج الرؤية ومشاريعها الكبرى (نيوم، السعودية الخضراء، التحول الرقمي) مبنية على محاور وركائز مترابطة؛ والخريطة الذهنية هي أفضل وسيلة لاستيعاب هذا التكامل الوطني.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive 4-Step Walkthrough */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Steps Navigation Sidebar */}
        <div className="lg:col-span-4 space-y-2.5">
          <h2 className="text-base font-bold text-slate-900 mb-3 font-display px-1">
            خطوات الدرس النموذجي (خطوة بخطوة)
          </h2>
          {MODEL_LESSON_STEPS.map((step) => {
            const isActive = step.stepNumber === activeStep;
            return (
              <button
                key={step.stepNumber}
                type="button"
                onClick={() => onSelectStep(step.stepNumber)}
                className={`w-full text-right p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                  isActive
                    ? 'bg-emerald-900 text-white border-emerald-900 shadow-xs'
                    : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200'
                }`}
              >
                <span
                  className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold font-mono-nums shrink-0 mt-0.5 ${
                    isActive
                      ? 'bg-amber-400 text-slate-950'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  0{step.stepNumber}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold font-display leading-snug">
                    {step.title}
                  </div>
                  <div
                    className={`text-xs mt-1 truncate ${
                      isActive ? 'text-emerald-100' : 'text-slate-500'
                    }`}
                  >
                    {step.concept}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Step Detailed Interactive Card */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700">
              <span>المرحلة 0{currentLesson.stepNumber} من 04</span>
              <span>·</span>
              <span>{currentLesson.concept}</span>
            </div>
            <div className="flex items-center gap-1.5">
              {MODEL_LESSON_STEPS.map((s) => (
                <button
                  key={s.stepNumber}
                  type="button"
                  onClick={() => onSelectStep(s.stepNumber)}
                  aria-label={`انتقل للخطوة ${s.stepNumber}`}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    s.stepNumber === activeStep
                      ? 'w-8 bg-emerald-700'
                      : 'w-2.5 bg-slate-200 hover:bg-slate-300'
                  }`}
                />
              ))}
            </div>
          </div>

          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mt-4 font-display">
            {currentLesson.title}
          </h3>

          <p className="text-base text-slate-700 leading-relaxed mt-3">
            {currentLesson.explanation}
          </p>

          {/* Visual Interactive Diagram inside Lesson */}
          <div className="my-6 p-5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="text-xs font-bold text-slate-500 mb-3">
              توضيح بصري للقاعدة في هذه الخطوة:
            </div>

            {currentLesson.stepNumber === 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 py-3">
                <div className="px-4 py-3 rounded-lg border border-rose-200 bg-rose-50/60 text-rose-900 text-xs max-w-xs text-center">
                  <span className="font-bold block mb-1">❌ طريقة غير صحيحة:</span>
                  «سوف نتحدث في هذا الملخص عن كافة أهداف ومشاريع رؤية المملكة العربية السعودية لعام ٢٠٣٠م بالتفصيل»
                </div>
                <div className="px-6 py-4 rounded-2xl border-2 border-emerald-700 bg-emerald-900 text-white text-center shadow-sm">
                  <span className="text-[11px] text-amber-300 block mb-0.5">✓ طريقة احترافية في المركز</span>
                  <span className="text-base font-bold font-display block">رؤية السعودية 2030</span>
                  <span className="text-xs text-emerald-200">مستقبل وطن طموح</span>
                </div>
              </div>
            )}

            {currentLesson.stepNumber === 2 && (
              <div className="flex flex-wrap items-center justify-center gap-4 py-2">
                <div className="px-4 py-2.5 rounded-xl bg-emerald-800 text-white text-xs font-bold">
                  ١. مجتمع حيوي
                </div>
                <span className="text-slate-400 font-bold">←</span>
                <div className="px-5 py-3 rounded-2xl bg-slate-900 text-white text-sm font-bold font-display">
                  رؤية 2030 (المركز)
                </div>
                <span className="text-slate-400 font-bold">→</span>
                <div className="px-4 py-2.5 rounded-xl bg-amber-700 text-white text-xs font-bold">
                  ٢. اقتصاد مزدهر
                </div>
                <span className="text-slate-400 font-bold">↓</span>
                <div className="px-4 py-2.5 rounded-xl bg-sky-700 text-white text-xs font-bold">
                  ٣. وطن طموح
                </div>
              </div>
            )}

            {currentLesson.stepNumber === 3 && (
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 py-2 text-xs">
                <div className="px-4 py-2.5 rounded-xl bg-amber-700 text-white font-bold">
                  فرع رئيسي: اقتصاد مزدهر
                </div>
                <span className="text-amber-700 font-bold">⟸ يتفرع بنفس اللون إلى:</span>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1.5 rounded-full bg-amber-50 border border-amber-300 text-amber-900 font-semibold">
                    مشروع نيوم
                  </span>
                  <span className="px-3 py-1.5 rounded-full bg-amber-50 border border-amber-300 text-amber-900 font-semibold">
                    القدية والبحر الأحمر
                  </span>
                  <span className="px-3 py-1.5 rounded-full bg-amber-50 border border-amber-300 text-amber-900 font-semibold">
                    نظام المسارات الثانوي
                  </span>
                </div>
              </div>
            )}

            {currentLesson.stepNumber === 4 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
                <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                  <GitBranch className="w-4 h-4 text-emerald-700 mx-auto mb-1" />
                  <span className="font-bold block text-slate-800">توازن الفروع</span>
                  <span className="text-slate-500">يمين ويسار المركز</span>
                </div>
                <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                  <Palette className="w-4 h-4 text-amber-600 mx-auto mb-1" />
                  <span className="font-bold block text-slate-800">تناسق الألوان</span>
                  <span className="text-slate-500">لون لكل محور</span>
                </div>
                <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                  <Lightbulb className="w-4 h-4 text-sky-600 mx-auto mb-1" />
                  <span className="font-bold block text-slate-800">إيجاز الكلمات</span>
                  <span className="text-slate-500">عناوين مركزة</span>
                </div>
                <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                  <LayoutGrid className="w-4 h-4 text-purple-600 mx-auto mb-1" />
                  <span className="font-bold block text-slate-800">عدم التداخل</span>
                  <span className="text-slate-500">مسافات مريحة للعين</span>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-900 mb-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>مثال واقعي من المملكة العربية السعودية</span>
              </div>
              <p className="text-xs sm:text-sm text-emerald-950 leading-relaxed">
                {currentLesson.saudiExample}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-900 mb-1">
                <Lightbulb className="w-4 h-4 text-amber-700 shrink-0" />
                <span>نصيحة تطبيقية للطالب</span>
              </div>
              <p className="text-xs sm:text-sm text-amber-950 leading-relaxed">
                {currentLesson.ruleOfThumb}
              </p>
            </div>
          </div>

          {/* Action Bar */}
          <div className="mt-6 pt-5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => onTriggerStepAction(currentLesson.actionType)}
              className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{currentLesson.interactiveActionLabel}</span>
            </button>

            <div className="flex items-center gap-2">
              {currentLesson.stepNumber > 1 && (
                <button
                  type="button"
                  onClick={() => onSelectStep(currentLesson.stepNumber - 1)}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                >
                  الخطوة السابقة
                </button>
              )}
              {currentLesson.stepNumber < 4 && (
                <button
                  type="button"
                  onClick={() => onSelectStep(currentLesson.stepNumber + 1)}
                  className="px-4 py-2 text-xs font-semibold text-slate-900 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors cursor-pointer"
                >
                  الخطوة التالية ←
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
