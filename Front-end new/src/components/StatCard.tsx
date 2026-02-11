import type { ComponentType } from 'react';

interface StatCardProps {
  icon: ComponentType<{ size?: number; variant?: string; color?: string; className?: string }>;
  label: string;
  value: string;
  unit: string;
  color: string;
}

export function StatCard({ icon: Icon, label, value, unit, color }: StatCardProps) {
  return (
    <div className={`bg-gradient-to-br ${color} rounded-3xl p-8 shadow-2xl shadow-black/20 border border-white/10`}>
      <div className="flex items-start justify-between mb-6">
        <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
          <Icon size={28} variant="Bold" color="#ffffff" />
        </div>
      </div>
      <div>
        <p className="text-sm text-white/80 mb-2 font-medium">{label}</p>
        <p className="text-3xl font-bold text-white mb-1">{value}</p>
        <p className="text-sm text-white/60">{unit}</p>
      </div>
    </div>
  );
}
