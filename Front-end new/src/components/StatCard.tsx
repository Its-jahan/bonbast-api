import type { ComponentType } from 'react';

interface StatCardProps {
  icon: ComponentType<{ size?: number; variant?: string; color?: string; className?: string }>;
  label: string;
  value: string;
  color: string;
}

export function StatCard({ icon: Icon, label, value, color }: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-[#e5e5e5] p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-4">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${color}`}>
          <Icon size={22} variant="Bold" color="currentColor" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground mb-1">{label}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
}
