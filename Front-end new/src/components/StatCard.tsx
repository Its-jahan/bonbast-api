import type { ComponentType } from 'react';

interface StatCardProps {
  icon: ComponentType<{ size?: number; variant?: string; color?: string; className?: string }>;
  label: string;
  value: string;
  color: string;
}

export function StatCard({ icon: Icon, label, value, color }: StatCardProps) {
  return (
    <div className="bg-white rounded-lg border border-[#e9e9e7] p-4 hover:border-[#d3d3d1] transition-all">
      <div className="flex items-center gap-3">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${color}`}>
          <Icon size={18} variant="Bold" color="currentColor" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
          <p className="text-base font-semibold text-[#37352f]">{value}</p>
        </div>
      </div>
    </div>
  );
}
