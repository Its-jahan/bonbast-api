import type { ComponentType } from 'react';

interface StatCardProps {
  icon: ComponentType<{ size?: number; variant?: string; color?: string; className?: string }>;
  label: string;
  value: string;
  color: string;
}

export function StatCard({ icon: Icon, label, value, color }: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.08)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.12)] transition-all">
      <div className="flex items-center gap-3">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${color}`}>
          <Icon size={22} variant="Bold" color="currentColor" />
        </div>
        <div>
          <p className="text-xs text-[#787774] mb-1">{label}</p>
          <p className="text-lg font-semibold text-[#37352f]">{value}</p>
        </div>
      </div>
    </div>
  );
}
