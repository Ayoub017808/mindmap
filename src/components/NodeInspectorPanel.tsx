import React from 'react';
import {
  Plus,
  Trash2,
  Palette,
  Type,
  Sparkles,
  Share2,
  Layers,
} from 'lucide-react';
import { MindNode, NodeShape, ConnectionStyle } from '../types/mindmap';
import { NODE_COLORS } from '../data/saudiPresets';
import { AVAILABLE_ICONS, NodeIcon } from './NodeIcon';

interface NodeInspectorPanelProps {
  selectedNode: MindNode | undefined;
  connectionStyle: ConnectionStyle;
  darkCanvas: boolean;
  onUpdateNode: (id: string, updates: Partial<MindNode>) => void;
  onAddChildNode: (parentId: string) => void;
  onDeleteNode: (id: string) => void;
  onChangeConnectionStyle: (style: ConnectionStyle) => void;
  onToggleDarkCanvas: () => void;
}

export const NodeInspectorPanel: React.FC<NodeInspectorPanelProps> = ({
  selectedNode,
  connectionStyle,
  darkCanvas,
  onUpdateNode,
  onAddChildNode,
  onDeleteNode,
  onChangeConnectionStyle,
  onToggleDarkCanvas,
}) => {
  if (!selectedNode) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
        <p className="text-sm text-slate-600">
          اختر أي عقدة على الخريطة الذهنية لتعديل عنوانها أو لونها أو إضافة فروع جديدة منها.
        </p>
      </div>
    );
  }

  const isRoot = selectedNode.level === 'root';

  return (
    <aside className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <span className="text-xs font-semibold text-emerald-700 block">
            لوحة التحكم بالعقدة المحددة
          </span>
          <h2 className="text-base font-bold text-slate-900 font-display mt-0.5">
            {isRoot
              ? 'الفكرة المركزية (المركز)'
              : selectedNode.level === 'main'
              ? 'فرع رئيسي (محور)'
              : 'فرع فرعي (مثال تفصيلي)'}
          </h2>
        </div>

        <button
          type="button"
          onClick={() => onAddChildNode(selectedNode.id)}
          className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>تفرع جديد</span>
        </button>
      </div>

      {/* Title & Subtitle Inputs */}
      <div className="space-y-3">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            عنوان العقدة (الكلمة المفتاحية)
          </label>
          <div className="relative">
            <input
              type="text"
              value={selectedNode.label}
              onChange={(e) => onUpdateNode(selectedNode.id, { label: e.target.value })}
              placeholder="مثال: الطاقة المتجددة"
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white text-slate-900 font-semibold"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            وصف مختصر أو مثال واقعي
          </label>
          <input
            type="text"
            value={selectedNode.subtitle || ''}
            onChange={(e) => onUpdateNode(selectedNode.id, { subtitle: e.target.value })}
            placeholder="مثال: مشروع سكاكا للطاقة الشمسية"
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white text-slate-700"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            ملاحظات تفصيلية للطالب (تظهر في الملخص)
          </label>
          <textarea
            rows={2}
            value={selectedNode.description || ''}
            onChange={(e) => onUpdateNode(selectedNode.id, { description: e.target.value })}
            placeholder="اكتب شرحاً مبسطاً أو فائدة هذا المحور..."
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white text-slate-700 resize-none"
          />
        </div>
      </div>

      {/* Color Picker */}
      <div>
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-2">
          <Palette className="w-3.5 h-3.5 text-emerald-700" />
          <span>لون الفرع والارتباط الذهني</span>
        </div>
        <div className="grid grid-cols-7 gap-2">
          {NODE_COLORS.map((c) => {
            const isSelectedColor = selectedNode.color.toLowerCase() === c.hex.toLowerCase();
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => onUpdateNode(selectedNode.id, { color: c.hex })}
                title={c.name}
                style={{ backgroundColor: c.hex }}
                className={`h-7 rounded-lg transition-transform cursor-pointer ${
                  isSelectedColor
                    ? 'ring-2 ring-offset-2 ring-slate-900 scale-105'
                    : 'opacity-85 hover:opacity-100'
                }`}
              />
            );
          })}
        </div>
      </div>

      {/* Icon Selector */}
      <div>
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>الرمز البصري للعقدة</span>
        </div>
        <div className="grid grid-cols-7 gap-1.5">
          {AVAILABLE_ICONS.map((item) => {
            const active = selectedNode.iconName === item.name;
            return (
              <button
                key={item.name}
                type="button"
                onClick={() => onUpdateNode(selectedNode.id, { iconName: item.name })}
                title={item.label}
                className={`p-2 rounded-lg border flex items-center justify-center transition-colors cursor-pointer ${
                  active
                    ? 'bg-emerald-700 text-white border-emerald-700'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                <NodeIcon name={item.name} className="w-4 h-4" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Node Shape & Connection Style */}
      <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            <span className="inline-flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-slate-500" />
              <span>شكل الإطار</span>
            </span>
          </label>
          <div className="flex bg-slate-100 p-1 rounded-lg">
            {(
              [
                { id: 'rounded', label: 'بطاقة' },
                { id: 'capsule', label: 'كبسولة' },
                { id: 'circle', label: 'دائري' },
              ] as { id: NodeShape; label: string }[]
            ).map((sh) => (
              <button
                key={sh.id}
                type="button"
                onClick={() => onUpdateNode(selectedNode.id, { shape: sh.id })}
                className={`flex-1 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  selectedNode.shape === sh.id
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {sh.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            <span className="inline-flex items-center gap-1">
              <Share2 className="w-3.5 h-3.5 text-slate-500" />
              <span>نمط الروابط</span>
            </span>
          </label>
          <div className="flex bg-slate-100 p-1 rounded-lg">
            {(
              [
                { id: 'bezier', label: 'عضوي' },
                { id: 'step', label: 'هندسي' },
                { id: 'straight', label: 'مستقيم' },
              ] as { id: ConnectionStyle; label: string }[]
            ).map((st) => (
              <button
                key={st.id}
                type="button"
                onClick={() => onChangeConnectionStyle(st.id)}
                className={`flex-1 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  connectionStyle === st.id
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Canvas Dark/Light & Delete */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={onToggleDarkCanvas}
          className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
        >
          {darkCanvas ? 'الوضع النهاري للوحة' : 'الوضع الليلي للوحة'}
        </button>

        {!isRoot && (
          <button
            type="button"
            onClick={() => onDeleteNode(selectedNode.id)}
            className="px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>حذف العقدة</span>
          </button>
        )}
      </div>
    </aside>
  );
};
