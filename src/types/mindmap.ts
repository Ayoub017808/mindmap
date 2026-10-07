export type NodeShape = 'rounded' | 'circle' | 'diamond' | 'capsule';
export type ConnectionStyle = 'bezier' | 'step' | 'straight';
export type NodeLevel = 'root' | 'main' | 'sub';

export interface MindNode {
  id: string;
  label: string;
  subtitle?: string;
  description?: string;
  parentId: string | null;
  x: number;
  y: number;
  color: string;
  shape: NodeShape;
  level: NodeLevel;
  iconName: string;
  completed?: boolean;
  collapsed?: boolean;
}

export interface MindMapPreset {
  id: string;
  title: string;
  category: string;
  summary: string;
  realWorldContext: string;
  visionAlignment: string;
  nodes: MindNode[];
}

export interface LessonStep {
  stepNumber: number;
  title: string;
  concept: string;
  explanation: string;
  saudiExample: string;
  ruleOfThumb: string;
  interactiveActionLabel: string;
  actionType: 'load-vision' | 'add-main-branch' | 'apply-colors' | 'auto-radial' | 'evaluate';
}

export interface ExerciseChallenge {
  id: string;
  title: string;
  difficulty: 'مبتدئ' | 'متوسط' | 'متقدم';
  scenario: string;
  goal: string;
  requiredMainBranches: number;
  requiredSubNodes: number;
  suggestedKeywords: string[];
  starterNodes: MindNode[];
}
