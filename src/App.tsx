/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Plus,
  Printer,
  FilePlus2,
  BookOpen,
  Compass,
  Target,
  Check,
  Sparkles,
  Download,
  ListTree,
} from 'lucide-react';
import {
  MindNode,
  ConnectionStyle,
  MindMapPreset,
  ExerciseChallenge,
  LessonStep,
} from './types/mindmap';
import {
  SAUDI_MINDMAP_PRESETS,
  STUDENT_EXERCISES,
  NODE_COLORS,
} from './data/saudiPresets';
import { MindMapCanvas } from './components/MindMapCanvas';
import { NodeInspectorPanel } from './components/NodeInspectorPanel';
import { RubricScoreBar } from './components/RubricScoreBar';
import { LessonGuideView } from './components/LessonGuideView';
import { ExamplesAndExercisesView } from './components/ExamplesAndExercisesView';
import { NodeIcon } from './components/NodeIcon';

type ActiveSection = 'studio' | 'lesson' | 'examples' | 'exercises';

export default function App() {
  const [activeSection, setActiveSection] = useState<ActiveSection>('studio');
  const [activePresetId, setActivePresetId] = useState<string>('vision-2030');
  const [activeChallenge, setActiveChallenge] = useState<ExerciseChallenge | null>(null);
  const [nodes, setNodes] = useState<MindNode[]>(() =>
    SAUDI_MINDMAP_PRESETS[0].nodes.map((n) => ({ ...n }))
  );
  const [selectedNodeId, setSelectedNodeId] = useState<string>('root');
  const [connectionStyle, setConnectionStyle] = useState<ConnectionStyle>('bezier');
  const [darkCanvas, setDarkCanvas] = useState<boolean>(false);
  const [activeLessonStep, setActiveLessonStep] = useState<number>(1);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showSummaryOutline, setShowSummaryOutline] = useState<boolean>(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3200);
  };

  const selectedNode = nodes.find((n) => n.id === selectedNodeId) || nodes[0];

  // Update a single node's properties
  const handleUpdateNode = (id: string, updates: Partial<MindNode>) => {
    setNodes((prev) =>
      prev.map((node) => {
        if (node.id === id) {
          return { ...node, ...updates };
        }
        // If updating a main branch color, optionally cascade color to its sub-branches
        if (updates.color && node.parentId === id && node.level === 'sub') {
          return { ...node, color: updates.color };
        }
        return node;
      })
    );
  };

  // Move node on canvas
  const handleMoveNode = (id: string, x: number, y: number) => {
    setNodes((prev) =>
      prev.map((node) => (node.id === id ? { ...node, x, y } : node))
    );
  };

  // Add a child branch to any node
  const handleAddChildNode = (parentId: string, customLabel?: string) => {
    const parent = nodes.find((n) => n.id === parentId);
    if (!parent) return;

    const existingChildren = nodes.filter((n) => n.parentId === parentId);
    const isParentRoot = parent.level === 'root';
    const nextLevel = isParentRoot ? 'main' : 'sub';

    // Pick a harmonious distinct color if branching from root, else inherit parent's color
    const colorPalette = NODE_COLORS.map((c) => c.hex);
    const branchColor = isParentRoot
      ? colorPalette[(existingChildren.length + 1) % colorPalette.length]
      : parent.color;

    // Calculate smart position without overlapping
    let nextX = parent.x;
    let nextY = parent.y;

    if (isParentRoot) {
      const side = existingChildren.length % 2 === 0 ? 1 : -1;
      const rowOffset = Math.floor(existingChildren.length / 2) * 145 - 90;
      nextX = parent.x + side * 310;
      nextY = parent.y + rowOffset;
    } else {
      const rootNode = nodes.find((n) => n.parentId === null);
      const direction = rootNode && parent.x < rootNode.x ? -1 : 1;
      nextX = parent.x + direction * 230;
      nextY = parent.y + (existingChildren.length - 0.5) * 95;
    }

    const newId = `node-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const newNode: MindNode = {
      id: newId,
      label:
        customLabel ||
        (isParentRoot
          ? `محور رئيسي ${existingChildren.length + 1}`
          : `فرع تفصيلي ${existingChildren.length + 1}`),
      subtitle: isParentRoot ? 'أضف عنواناً فرعياً أو مثالاً' : 'مثال تطبيقي',
      description: '',
      parentId: parent.id,
      x: nextX,
      y: nextY,
      color: branchColor,
      shape: isParentRoot ? 'rounded' : 'capsule',
      level: nextLevel,
      iconName: isParentRoot ? 'Target' : 'Lightbulb',
    };

    setNodes((prev) => [...prev, newNode]);
    setSelectedNodeId(newId);
    showToast(`تمت إضافة «${newNode.label}» بنجاح`);
  };

  // Delete a node and its descendants
  const handleDeleteNode = (id: string) => {
    const target = nodes.find((n) => n.id === id);
    if (!target || target.level === 'root') return;

    const toDelete = new Set<string>([id]);
    let added = true;
    while (added) {
      added = false;
      for (const n of nodes) {
        if (n.parentId && toDelete.has(n.parentId) && !toDelete.has(n.id)) {
          toDelete.add(n.id);
          added = true;
        }
      }
    }

    const remaining = nodes.filter((n) => !toDelete.has(n.id));
    setNodes(remaining);
    setSelectedNodeId('root');
    showToast('تم حذف الفرع من الخريطة');
  };

  // Smart Radial Auto-Layout
  const handleAutoRadialLayout = () => {
    const rootNode = nodes.find((n) => n.parentId === null);
    if (!rootNode) return;

    const centerX = 520;
    const centerY = 320;
    const mainBranches = nodes.filter((n) => n.parentId === rootNode.id);

    const updatedNodes = nodes.map((n) => ({ ...n }));
    const rootRef = updatedNodes.find((n) => n.id === rootNode.id);
    if (rootRef) {
      rootRef.x = centerX;
      rootRef.y = centerY;
    }

    const rightBranches = mainBranches.filter((_, idx) => idx % 2 === 0);
    const leftBranches = mainBranches.filter((_, idx) => idx % 2 === 1);

    const layoutSide = (branchList: MindNode[], direction: 1 | -1) => {
      const count = branchList.length;
      branchList.forEach((branch, index) => {
        const bRef = updatedNodes.find((n) => n.id === branch.id);
        if (!bRef) return;

        const verticalSpan = Math.max(260, count * 160);
        const startY = centerY - verticalSpan / 2 + verticalSpan / (count * 2);
        const stepY = count > 1 ? verticalSpan / count : 0;

        bRef.x = centerX + direction * 310;
        bRef.y = Math.round(startY + index * stepY);

        const children = updatedNodes.filter((c) => c.parentId === branch.id);
        const childSpan = Math.max(110, children.length * 95);
        const childStartY = bRef.y - childSpan / 2 + childSpan / (Math.max(1, children.length) * 2);
        const childStepY = children.length > 1 ? childSpan / children.length : 0;

        children.forEach((child, cIdx) => {
          child.x = bRef.x + direction * 235;
          child.y = Math.round(childStartY + cIdx * childStepY);
        });
      });
    };

    layoutSide(rightBranches, 1);
    layoutSide(leftBranches, -1);

    setNodes(updatedNodes);
    showToast('تم ترتيب الخريطة الذهنية شعاعياً بتوازن بصري');
  };

  // Load a Saudi preset
  const handleLoadPreset = (preset: MindMapPreset) => {
    setActivePresetId(preset.id);
    setActiveChallenge(null);
    setNodes(preset.nodes.map((n) => ({ ...n })));
    setSelectedNodeId('root');
    setActiveSection('studio');
    showToast(`تم تحميل خريطة: ${preset.title}`);
  };

  // Start a student exercise challenge
  const handleStartChallenge = (challenge: ExerciseChallenge) => {
    setActiveChallenge(challenge);
    setActivePresetId('');
    setNodes(challenge.starterNodes.map((n) => ({ ...n })));
    setSelectedNodeId('root');
    setActiveSection('studio');
    showToast(`بدأ التمرين التطبيقي: ${challenge.title}`);
  };

  // Create a fresh blank map
  const handleCreateBlankMap = () => {
    setActivePresetId('blank');
    setActiveChallenge(null);
    const freshNodes: MindNode[] = [
      {
        id: 'root',
        label: 'مشروعي المدرسي الجديد',
        subtitle: 'ثانوية الركوبة مسارات',
        description: 'اكتب هنا الفكرة الرئيسية للمشروع أو الدرس الذي تريد تلخيصه.',
        parentId: null,
        x: 520,
        y: 310,
        color: '#047857',
        shape: 'rounded',
        level: 'root',
        iconName: 'Lightbulb',
      },
      {
        id: 'b-1',
        label: 'المحور الأول: الأهداف',
        subtitle: 'ما الذي نريد تحقيقه؟',
        description: '',
        parentId: 'root',
        x: 830,
        y: 200,
        color: '#047857',
        shape: 'rounded',
        level: 'main',
        iconName: 'Target',
      },
      {
        id: 'b-2',
        label: 'المحور الثاني: خطوات التنفيذ',
        subtitle: 'البرنامج الزمني والمهام',
        description: '',
        parentId: 'root',
        x: 210,
        y: 200,
        color: '#B45309',
        shape: 'rounded',
        level: 'main',
        iconName: 'Compass',
      },
    ];
    setNodes(freshNodes);
    setSelectedNodeId('root');
    setActiveSection('studio');
    showToast('تم إنشاء خريطة ذهنية جديدة فارغة');
  };

  // Reset current map to its initial preset/challenge state
  const handleResetCurrentMap = () => {
    if (activeChallenge) {
      setNodes(activeChallenge.starterNodes.map((n) => ({ ...n })));
      showToast('تمت إعادة ضبط التمرين إلى نقطة البداية');
      return;
    }
    const foundPreset =
      SAUDI_MINDMAP_PRESETS.find((p) => p.id === activePresetId) ||
      SAUDI_MINDMAP_PRESETS[0];
    setNodes(foundPreset.nodes.map((n) => ({ ...n })));
    showToast('تمت استعادة التصميم الأصلي للنموذج');
  };

  // Add suggested keyword from active challenge
  const handleAddSuggestedKeyword = (keyword: string) => {
    const targetParent =
      selectedNode && selectedNode.level !== 'sub' ? selectedNode.id : 'root';
    handleAddChildNode(targetParent, keyword);
  };

  // Interactive actions triggered from the Model Lesson steps
  const handleLessonStepAction = (actionType: LessonStep['actionType']) => {
    if (actionType === 'load-vision') {
      handleLoadPreset(SAUDI_MINDMAP_PRESETS[0]);
    } else if (actionType === 'add-main-branch') {
      setActiveSection('studio');
      handleAddChildNode('root', 'مبادرة طلابية مبتكرة');
    } else if (actionType === 'apply-colors') {
      const palette = NODE_COLORS.map((c) => c.hex);
      const rootNode = nodes.find((n) => n.parentId === null);
      if (!rootNode) return;
      const mains = nodes.filter((n) => n.parentId === rootNode.id);
      const colorMap = new Map<string, string>();
      mains.forEach((m, i) => {
        colorMap.set(m.id, palette[i % palette.length]);
      });

      setNodes((prev) =>
        prev.map((node) => {
          if (colorMap.has(node.id)) {
            return { ...node, color: colorMap.get(node.id)! };
          }
          if (node.parentId && colorMap.has(node.parentId)) {
            return { ...node, color: colorMap.get(node.parentId)! };
          }
          return node;
        })
      );
      setActiveSection('studio');
      showToast('تم تلوين كل محور رئيسي وفروعه بلون متناسق');
    } else if (actionType === 'auto-radial' || actionType === 'evaluate') {
      setActiveSection('studio');
      handleAutoRadialLayout();
    }
  };

  // Export mind map as structured text file
  const handleExportOutline = () => {
    const rootNode = nodes.find((n) => n.parentId === null);
    if (!rootNode) return;
    const mains = nodes.filter((n) => n.parentId === rootNode.id);

    const lines: string[] = [
      '======================================================',
      `ملخص الخريطة الذهنية: ${rootNode.label}`,
      `الوصف: ${rootNode.subtitle || ''}`,
      '======================================================',
      '',
    ];

    mains.forEach((m, idx) => {
      lines.push(`${idx + 1}. المحور الرئيسي: ${m.label} (${m.subtitle || ''})`);
      const subs = nodes.filter((s) => s.parentId === m.id);
      subs.forEach((sub) => {
        lines.push(`   - ${sub.label}: ${sub.subtitle || ''}`);
      });
      lines.push('');
    });

    lines.push('------------------------------------------------------');
    lines.push('المملكة العربية السعودية - وزارة التعليم');
    lines.push('مدرسة ثانوية الركوبة مسارات - إشراف أ. أيوب كريري');

    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `خريطة-ذهنية-${rootNode.label.replace(/\s+/g, '-')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('تم تحميل ملخص الخريطة الذهنية بنجاح');
  };

  const rootNode = nodes.find((n) => n.parentId === null);
  const mainBranches = nodes.filter((n) => n.parentId === rootNode?.id);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-900">
      {/* Top Navigation Bar — Strict 3-Zone Contract */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xs border-b border-slate-200 px-4 sm:px-8 py-3.5 no-print">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Zone 1: Single text element wordmark */}
          <a
            href="#studio"
            onClick={(e) => {
              e.preventDefault();
              setActiveSection('studio');
            }}
            className="text-lg sm:text-xl font-extrabold tracking-tight text-emerald-900 font-display whitespace-nowrap"
          >
            مُحاكِي الخرائط الذهنية
          </a>

          {/* Zone 2: 4 Clean Text Navigation Links */}
          <nav className="flex items-center gap-4 sm:gap-7 text-xs sm:text-sm font-semibold text-slate-600 overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveSection('studio')}
              className={`py-1 transition-colors whitespace-nowrap cursor-pointer border-b-2 ${
                activeSection === 'studio'
                  ? 'text-emerald-800 border-emerald-700 font-bold'
                  : 'border-transparent hover:text-slate-900'
              }`}
            >
              المحاكي التفاعلي
            </button>
            <button
              type="button"
              onClick={() => setActiveSection('lesson')}
              className={`py-1 transition-colors whitespace-nowrap cursor-pointer border-b-2 ${
                activeSection === 'lesson'
                  ? 'text-emerald-800 border-emerald-700 font-bold'
                  : 'border-transparent hover:text-slate-900'
              }`}
            >
              الدرس النموذجي
            </button>
            <button
              type="button"
              onClick={() => setActiveSection('examples')}
              className={`py-1 transition-colors whitespace-nowrap cursor-pointer border-b-2 ${
                activeSection === 'examples'
                  ? 'text-emerald-800 border-emerald-700 font-bold'
                  : 'border-transparent hover:text-slate-900'
              }`}
            >
              أمثلة رؤية 2030
            </button>
            <button
              type="button"
              onClick={() => setActiveSection('exercises')}
              className={`py-1 transition-colors whitespace-nowrap cursor-pointer border-b-2 ${
                activeSection === 'exercises'
                  ? 'text-emerald-800 border-emerald-700 font-bold'
                  : 'border-transparent hover:text-slate-900'
              }`}
            >
              التمارين التطبيقية
            </button>
          </nav>

          {/* Zone 3: 2 Primary Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleCreateBlankMap}
              className="px-3.5 py-2 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <FilePlus2 className="w-3.5 h-3.5 text-emerald-700" />
              <span>خريطة جديدة</span>
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="px-3.5 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">طباعة الخريطة</span>
            </button>
          </div>
        </div>
      </header>

      {/* Subtle Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-lg border border-slate-700 flex items-center gap-2 text-xs font-semibold">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1">
        {activeSection === 'lesson' && (
          <LessonGuideView
            activeStep={activeLessonStep}
            onSelectStep={setActiveLessonStep}
            onTriggerStepAction={handleLessonStepAction}
            onSwitchToStudio={() => setActiveSection('studio')}
          />
        )}

        {(activeSection === 'examples' || activeSection === 'exercises') && (
          <ExamplesAndExercisesView
            mode={activeSection}
            activePresetId={activePresetId}
            activeChallengeId={activeChallenge?.id || null}
            onLoadPreset={handleLoadPreset}
            onStartChallenge={handleStartChallenge}
          />
        )}

        {activeSection === 'studio' && (
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 space-y-5">
            {/* Compact Educational Context Banner */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 shadow-xs">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                  <span className="font-bold text-emerald-800">
                    مدرسة ثانوية الركوبة مسارات
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>بيئة المحاكاة التفاعلية لتصميم الخرائط الذهنية</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-slate-700 font-medium">
                    إشراف الأستاذ: أيوب كريري
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-display">
                  {activeChallenge
                    ? activeChallenge.title
                    : rootNode?.label || 'تصميم الخريطة الذهنية'}
                </h1>
                {activeChallenge && (
                  <p className="text-xs sm:text-sm text-amber-900 bg-amber-50/80 border border-amber-200 rounded-lg px-3 py-1.5 mt-1">
                    <span className="font-bold">هدف التمرين الحالي: </span>
                    {activeChallenge.goal}
                  </p>
                )}
              </div>

              {/* Quick Switcher for Presets & Exercises right above the Studio */}
              <div className="flex flex-wrap items-center gap-2 shrink-0 no-print">
                <div className="flex items-center bg-slate-100 p-1 rounded-xl">
                  {SAUDI_MINDMAP_PRESETS.map((preset) => {
                    const isCurrent =
                      !activeChallenge && activePresetId === preset.id;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => handleLoadPreset(preset)}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                          isCurrent
                            ? 'bg-white text-emerald-900 shadow-2xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {preset.id === 'vision-2030'
                          ? 'رؤية 2030'
                          : preset.id === 'green-saudi'
                          ? 'السعودية الخضراء'
                          : preset.id === 'masarat-plan'
                          ? 'نظام المسارات'
                          : 'تنمية جازان'}
                      </button>
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={() => setActiveSection('lesson')}
                  className="px-3.5 py-2 text-xs font-semibold text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                >
                  <BookOpen className="w-3.5 h-3.5 text-emerald-700" />
                  <span>شرح الدرس النموذجي</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowSummaryOutline((v) => !v)}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                >
                  <ListTree className="w-3.5 h-3.5" />
                  <span>{showSummaryOutline ? 'إخفاء الملخص الشجري' : 'عرض الملخص الشجري'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleExportOutline}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                  title="تنزيل الخريطة كملف نصي منظم"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>تصدير الملخص</span>
                </button>
              </div>
            </div>

            {/* Two-Zone Sandbox Layout (68% Interactive Stage + 32% Control & Concept Deck) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
              {/* Interactive Canvas Zone */}
              <div className="lg:col-span-8">
                <MindMapCanvas
                  nodes={nodes}
                  selectedNodeId={selectedNodeId}
                  connectionStyle={connectionStyle}
                  darkCanvas={darkCanvas}
                  onSelectNode={setSelectedNodeId}
                  onMoveNode={handleMoveNode}
                  onAddChildNode={(parentId) => handleAddChildNode(parentId)}
                  onDeleteNode={handleDeleteNode}
                  onAutoRadialLayout={handleAutoRadialLayout}
                  onResetCurrentMap={handleResetCurrentMap}
                />
              </div>

              {/* Control & Concept Deck Zone */}
              <div className="lg:col-span-4 space-y-4 no-print">
                <NodeInspectorPanel
                  selectedNode={selectedNode}
                  connectionStyle={connectionStyle}
                  darkCanvas={darkCanvas}
                  onUpdateNode={handleUpdateNode}
                  onAddChildNode={(parentId) => handleAddChildNode(parentId)}
                  onDeleteNode={handleDeleteNode}
                  onChangeConnectionStyle={setConnectionStyle}
                  onToggleDarkCanvas={() => setDarkCanvas((d) => !d)}
                />

                {/* Quick Exercise Launcher Card */}
                <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xs font-bold text-slate-900 font-display flex items-center gap-1.5">
                      <Target className="w-4 h-4 text-amber-600" />
                      <span>تمارين سريعة للتطبيق العملي</span>
                    </h3>
                    <button
                      type="button"
                      onClick={() => setActiveSection('exercises')}
                      className="text-xs text-emerald-700 hover:underline font-semibold cursor-pointer"
                    >
                      عرض كل التمارين ←
                    </button>
                  </div>
                  <div className="space-y-1.5">
                    {STUDENT_EXERCISES.map((ex) => {
                      const isActiveEx = activeChallenge?.id === ex.id;
                      return (
                        <button
                          key={ex.id}
                          type="button"
                          onClick={() => handleStartChallenge(ex)}
                          className={`w-full text-right px-3 py-2 rounded-lg text-xs border transition-colors flex items-center justify-between gap-2 cursor-pointer ${
                            isActiveEx
                              ? 'bg-amber-50 border-amber-300 text-amber-950 font-bold'
                              : 'bg-slate-50 hover:bg-slate-100 border-slate-200/80 text-slate-700 font-medium'
                          }`}
                        >
                          <span className="truncate">{ex.title}</span>
                          <span className="text-[11px] text-slate-500 shrink-0">
                            {ex.difficulty}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Optional Structured Tree Summary View for Study & Revision */}
            {showSummaryOutline && rootNode && (
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 font-display">
                      الملخص الهيكلي للخريطة الذهنية: {rootNode.label}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      يتحول تصميمك البصري تلقائياً إلى ملخص دراسي منظم يساعدك على المراجعة السريعة.
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                  {mainBranches.map((main) => {
                    const subs = nodes.filter((s) => s.parentId === main.id);
                    return (
                      <div
                        key={main.id}
                        style={{ borderTopColor: main.color }}
                        className="p-4 rounded-xl bg-slate-50 border border-slate-200 border-t-4"
                      >
                        <div className="flex items-center gap-2 font-bold text-sm text-slate-900 font-display">
                          <span style={{ color: main.color }}>
                            <NodeIcon name={main.iconName} className="w-4 h-4" />
                          </span>
                          <span>{main.label}</span>
                        </div>
                        {main.subtitle && (
                          <p className="text-xs text-slate-500 mt-0.5">{main.subtitle}</p>
                        )}
                        <ul className="mt-3 space-y-1.5 border-t border-slate-200/70 pt-2.5">
                          {subs.length === 0 ? (
                            <li className="text-xs text-slate-400">
                              لا توجد فروع فرعية مضافة بعد.
                            </li>
                          ) : (
                            subs.map((sub) => (
                              <li
                                key={sub.id}
                                className="text-xs text-slate-700 flex items-start gap-1.5"
                              >
                                <span
                                  style={{ backgroundColor: main.color }}
                                  className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                                />
                                <div>
                                  <span className="font-semibold text-slate-900">
                                    {sub.label}
                                  </span>
                                  {sub.subtitle && (
                                    <span className="text-slate-500"> — {sub.subtitle}</span>
                                  )}
                                </div>
                              </li>
                            ))
                          )}
                        </ul>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Real-Time Self-Assessment Rubric Bar */}
            <RubricScoreBar
              nodes={nodes}
              activeChallenge={activeChallenge}
              onAddSuggestedKeyword={handleAddSuggestedKeyword}
            />
          </div>
        )}
      </main>

      {/* Institutional Signature Footer — Exact Requested Text */}
      <footer className="mt-12 bg-slate-900 text-white border-t-4 border-emerald-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Right side: Official Institutional Hierarchy as requested */}
            <div className="text-center md:text-right space-y-1">
              <p className="text-base sm:text-lg font-extrabold text-emerald-400 font-display tracking-wide">
                المملكة العربية السعودية
              </p>
              <p className="text-sm sm:text-base font-bold text-slate-100 font-display">
                وزارة التعليم
              </p>
              <p className="text-sm sm:text-base font-bold text-amber-400 font-display">
                مدرسة ثانوية الركوبة مسارات
              </p>
              <p className="text-sm sm:text-base font-bold text-white pt-1">
                أ. أيوب كريري
              </p>
            </div>

            {/* Center/Left educational stamp */}
            <div className="text-center md:text-left space-y-1.5 text-xs text-slate-400 border-t md:border-t-0 border-slate-800 pt-4 md:pt-0">
              <div className="text-slate-200 font-semibold">
                بيئة المحاكاة الافتراضية لتصميم الخرائط الذهنية وتطبيقات رؤية السعودية 2030
              </div>
              <div>
                المرحلة الثانوية · نظام المسارات · تنمية مهارات التفكير البصري والتخطيط الاستراتيجي
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

