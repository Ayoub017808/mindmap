import React from 'react';
import {
  Compass,
  Users,
  Heart,
  Sparkles,
  TrendingUp,
  Building2,
  GraduationCap,
  ShieldCheck,
  Cpu,
  Award,
  Leaf,
  Sprout,
  MapPin,
  Waves,
  Sun,
  Zap,
  Flame,
  Globe,
  Activity,
  Briefcase,
  BookOpen,
  Lock,
  Lightbulb,
  Target,
  Rocket,
  Star,
} from 'lucide-react';

export const AVAILABLE_ICONS: { name: string; label: string }[] = [
  { name: 'Compass', label: 'بوصلة الرؤية' },
  { name: 'GraduationCap', label: 'تعليم ومسارات' },
  { name: 'TrendingUp', label: 'نمو واقتصاد' },
  { name: 'Leaf', label: 'بيئة واستدامة' },
  { name: 'Cpu', label: 'تقنية وذكاء' },
  { name: 'ShieldCheck', label: 'أمن وحوكمة' },
  { name: 'Building2', label: 'مشاريع ومدن' },
  { name: 'Users', label: 'مجتمع وتطوع' },
  { name: 'Sun', label: 'طاقة متجددة' },
  { name: 'Lightbulb', label: 'فكرة وابتكار' },
  { name: 'Target', label: 'هدف استراتيجي' },
  { name: 'Award', label: 'تميز وإنجاز' },
  { name: 'BookOpen', label: 'معرفة ودرس' },
  { name: 'Rocket', label: 'طموح ومستقبل' },
];

interface NodeIconProps {
  name: string;
  className?: string;
}

export const NodeIcon: React.FC<NodeIconProps> = ({ name, className = 'w-4 h-4' }) => {
  switch (name) {
    case 'Compass':
      return <Compass className={className} />;
    case 'Users':
      return <Users className={className} />;
    case 'Heart':
      return <Heart className={className} />;
    case 'Sparkles':
      return <Sparkles className={className} />;
    case 'TrendingUp':
      return <TrendingUp className={className} />;
    case 'Building2':
      return <Building2 className={className} />;
    case 'GraduationCap':
      return <GraduationCap className={className} />;
    case 'ShieldCheck':
      return <ShieldCheck className={className} />;
    case 'Cpu':
      return <Cpu className={className} />;
    case 'Award':
      return <Award className={className} />;
    case 'Leaf':
      return <Leaf className={className} />;
    case 'Sprout':
      return <Sprout className={className} />;
    case 'MapPin':
      return <MapPin className={className} />;
    case 'Waves':
      return <Waves className={className} />;
    case 'Sun':
      return <Sun className={className} />;
    case 'Zap':
      return <Zap className={className} />;
    case 'Flame':
      return <Flame className={className} />;
    case 'Globe':
      return <Globe className={className} />;
    case 'Activity':
      return <Activity className={className} />;
    case 'Briefcase':
      return <Briefcase className={className} />;
    case 'BookOpen':
      return <BookOpen className={className} />;
    case 'Lock':
      return <Lock className={className} />;
    case 'Lightbulb':
      return <Lightbulb className={className} />;
    case 'Target':
      return <Target className={className} />;
    case 'Rocket':
      return <Rocket className={className} />;
    case 'Star':
      return <Star className={className} />;
    default:
      return <Lightbulb className={className} />;
  }
};
