import React, { useRef, useState } from 'react';
import {
  Plus,
  Trash2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sparkles,
  Move,
  GitCommit,
  Maximize2,
} from 'lucide-react';
import { MindNode, ConnectionStyle } from '../types/mindmap';
import { NodeIcon } from './NodeIcon';

interface MindMapCanvasProps {
  nodes: MindNode[];
  selectedNodeId: string;
  connectionStyle: ConnectionStyle;
  darkCanvas: boolean;
  onSelectNode: (id: string) => void;
  onMoveNode: (id: string, x: number, y: number) => void;
  onAddChildNode: (parentId: string) => void;
  onDeleteNode: (id: string) => void;
  onAutoRadialLayout: () => void;
  onResetCurrentMap: () => void;
}

export const MindMapCanvas: React.FC<MindMapCanvasProps> = ({
  nodes,
  selectedNodeId,
  connectionStyle,
  darkCanvas,
  onSelectNode,
  onMoveNode,
  onAddChildNode,
  onDeleteNode,
  onAutoRadialLayout,
  onResetCurrentMap,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState<number>(0.92);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 30, y: 10 });
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState<boolean>(false);
  const [panStart, setPanStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const handleNodePointerDown = (e: React.PointerEvent, node: MindNode) => {
    e.stopPropagation();
    onSelectNode(node.id);
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const pointerCanvasX = (e.clientX - rect.left - pan.x) / zoom;
    const pointerCanvasY = (e.clientY - rect.top - pan.y) / zoom;
    setDraggingNodeId(node.id);
    setDragOffset({
      x: pointerCanvasX - node.x,
      y: pointerCanvasY - node.y,
    });
  };

  const handleCanvasPointerDown = (e: React.PointerEvent) => {
    if (draggingNodeId) return;
    setIsPanning(true);
    setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (draggingNodeId && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const pointerCanvasX = (e.clientX - rect.left - pan.x) / zoom;
      const pointerCanvasY = (e.clientY - rect.top - pan.y) / zoom;
      const nextX = Math.round((pointerCanvasX - dragOffset.x) / 10) * 10;
      const nextY = Math.round((pointerCanvasY - dragOffset.y) / 10) * 10;
      onMoveNode(draggingNodeId, nextX, nextY);
    } else if (isPanning) {
      setPan({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y,
      });
    }
  };

  const handlePointerUp = () => {
    setDraggingNodeId(null);
    setIsPanning(false);
  };

  const handleCenterCanvas = () => {
    setZoom(0.92);
    setPan({ x: 30, y: 10 });
  };

  const buildPathD = (parent: MindNode, child: MindNode): string => {
    const startX = parent.x;
    const startY = parent.y;
    const endX = child.x;
    const endY = child.y;

    if (connectionStyle === 'straight') {
      return `M ${startX} ${startY} L ${endX} ${endY}`;
    }

    if (connectionStyle === 'step') {
      const midX = (startX + endX) / 2;
      return `M ${startX} ${startY} L ${midX} ${startY} L ${midX} ${endY} L ${endX} ${endY}`;
    }

    // Organic Bezier curve
    const deltaX = (endX - startX) * 0.5;
    const c1x = startX + deltaX;
    const c1y = startY;
    const c2x = endX - deltaX;
    const c2y = endY;
    return `M ${startX} ${startY} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${endX} ${endY}`;
  };

  return (
    <div className="relative flex flex-col bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
      {/* Top Canvas Control Strip */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 bg-white border-b border-slate-200 z-10">
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <Move className="w-4 h-4 text-emerald-700 shrink-0" />
          <span className="font-semibold text-slate-800">لوحة المحاكاة التفاعلية:</span>
          <span className="hidden sm:inline">
            اسحب أي عقدة لتغيير موقعها · انقر على (+) لإضافة فرع جديد
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={onAutoRadialLayout}
            className="px-3 py-1.5 text-xs font-semibold text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
            <span>ترتيب شعاعي ذكي</span>
          </button>

          <button
            type="button"
            onClick={onResetCurrentMap}
            className="px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1 cursor-pointer whitespace-nowrap"
            title="إعادة ضبط مواقع الخريطة"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>إعادة ضبط</span>
          </button>

          <div className="h-4 w-px bg-slate-200 mx-1" />

          <button
            type="button"
            onClick={() => setZoom((z) => Math.max(0.55, Number((z - 0.1).toFixed(2))))}
            className="p-1.5 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            title="تصغير العرض"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-xs font-mono-nums font-semibold text-slate-700 min-w-[3rem] text-center">
            {Math.round(zoom * 100)}%
          </span>
          <button
            type="button"
            onClick={() => setZoom((z) => Math.min(1.35, Number((z + 0.1).toFixed(2))))}
            className="p-1.5 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            title="تكبير العرض"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleCenterCanvas}
            className="p-1.5 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            title="توسيط الخريطة"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Interactive Stage */}
      <div
        ref={containerRef}
        onPointerDown={handleCanvasPointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        className={`relative w-full h-[560px] overflow-hidden select-none touch-none ${
          darkCanvas ? 'canvas-grid-dark' : 'canvas-grid-bg'
        } ${isPanning ? 'cursor-grabbing' : 'cursor-grab'}`}
      >
        <div
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: '0 0',
          }}
          className="relative w-[1150px] h-[660px]"
        >
          {/* SVG Connections Layer */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <filter id="line-glow" x="-10%" y="-10%" width="120%" height="120%">
                <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodOpacity="0.12" />
              </filter>
            </defs>
            {nodes.map((node) => {
              if (!node.parentId) return null;
              const parent = nodes.find((p) => p.id === node.parentId);
              if (!parent) return null;

              const pathD = buildPathD(parent, node);
              const isSelectedBranch =
                selectedNodeId === node.id || selectedNodeId === parent.id;
              const strokeWidth =
                node.level === 'main' ? (isSelectedBranch ? 4.5 : 3.5) : isSelectedBranch ? 3 : 2.2;

              return (
                <g key={`edge-${parent.id}-${node.id}`}>
                  <path
                    d={pathD}
                    fill="none"
                    stroke={node.color}
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    strokeOpacity={isSelectedBranch ? 0.95 : 0.72}
                    filter="url(#line-glow)"
                  />
                  {/* Animated pulse particle on main branches */}
                  <circle r={node.level === 'main' ? 4 : 3} fill={node.color}>
                    <animateMotion
                      dur={node.level === 'main' ? '3.5s' : '4.5s'}
                      repeatCount="indefinite"
                      path={pathD}
                    />
                  </circle>
                </g>
              );
            })}
          </svg>

          {/* Interactive Mind Nodes Layer */}
          {nodes.map((node) => {
            const isSelected = node.id === selectedNodeId;
            const isRoot = node.level === 'root';
            const isMain = node.level === 'main';

            const shapeClasses =
              node.shape === 'capsule'
                ? 'rounded-full'
                : node.shape === 'circle'
                ? 'rounded-3xl'
                : 'rounded-2xl';

            return (
              <div
                key={node.id}
                onPointerDown={(e) => handleNodePointerDown(e, node)}
                style={{
                  left: `${node.x}px`,
                  top: `${node.y}px`,
                  transform: 'translate(-50%, -50%)',
                  borderColor: node.color,
                }}
                className={`absolute group transition-shadow duration-150 cursor-move ${shapeClasses} ${
                  isRoot
                    ? 'w-64 p-4 bg-slate-900 text-white border-[3px] shadow-md'
                    : isMain
                    ? 'w-56 p-3.5 bg-white text-slate-900 border-2 shadow-sm'
                    : 'w-48 p-2.5 bg-white/95 text-slate-800 border shadow-xs'
                } ${
                  isSelected
                    ? 'ring-4 ring-emerald-500/30 z-30'
                    : 'hover:shadow-md z-20'
                }`}
              >
                {/* Top Row: Icon + Level Indicator */}
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      style={{
                        backgroundColor: isRoot ? '#047857' : `${node.color}18`,
                        color: isRoot ? '#FFFFFF' : node.color,
                      }}
                      className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                    >
                      <NodeIcon name={node.iconName} className="w-4 h-4" />
                    </span>
                    <span
                      className={`text-[11px] font-medium truncate ${
                        isRoot ? 'text-amber-300' : 'text-slate-500'
                      }`}
                    >
                      {isRoot
                        ? 'الفكرة المركزية'
                        : isMain
                        ? 'محور رئيسي'
                        : 'فرع تفصيلي'}
                    </span>
                  </div>

                  {/* Quick Actions on Node */}
                  <div className="flex items-center gap-1 opacity-95 group-hover:opacity-100">
                    <button
                      type="button"
                      onPointerDown={(e) => e.stopPropagation()}
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddChildNode(node.id);
                      }}
                      title="إضافة فرع متفرع من هذه العقدة"
                      className={`w-6 h-6 rounded-md flex items-center justify-center transition-colors cursor-pointer ${
                        isRoot
                          ? 'bg-emerald-700 hover:bg-emerald-600 text-white'
                          : 'bg-slate-100 hover:bg-emerald-600 hover:text-white text-slate-700'
                      }`}
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>

                    {!isRoot && (
                      <button
                        type="button"
                        onPointerDown={(e) => e.stopPropagation()}
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteNode(node.id);
                        }}
                        title="حذف هذا الفرع"
                        className="w-6 h-6 rounded-md bg-slate-100 hover:bg-rose-600 hover:text-white text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Node Title */}
                <div
                  className={`font-bold font-display leading-snug ${
                    isRoot
                      ? 'text-base text-white'
                      : isMain
                      ? 'text-sm text-slate-900'
                      : 'text-xs text-slate-800'
                  }`}
                >
                  {node.label}
                </div>

                {/* Node Subtitle / Keyword */}
                {node.subtitle && (
                  <div
                    className={`mt-1 text-xs leading-normal ${
                      isRoot ? 'text-slate-300' : 'text-slate-500'
                    }`}
                  >
                    {node.subtitle}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Floating Legend inside Canvas */}
        <div className="absolute bottom-3 right-3 left-3 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
          <div className="px-3 py-1.5 rounded-lg bg-white/90 backdrop-blur-xs border border-slate-200 text-xs text-slate-600 flex items-center gap-3 shadow-xs">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-900 inline-block" />
              <span>المركز (1)</span>
            </span>
            <span>·</span>
            <span className="flex items-center gap-1.5">
              <GitCommit className="w-3.5 h-3.5 text-emerald-700" />
              <span>إجمالي العقد: {nodes.length}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
