import { Card, CardContent, IconButton } from '@mui/material';
import { hexToRgba } from '@renderer/utils';
import { ChevronRightIcon, LucideProps } from 'lucide-react';
import { cloneElement, ReactElement } from 'react';

interface ListCardProps {
  title: string;
  subtitle: string;
  icon: ReactElement<LucideProps>;
  iconBgColor?: string;
  onNavigate?: () => void;
}

export const ListCard = ({ title, subtitle, icon, iconBgColor, onNavigate }: ListCardProps) => {
  const coloredIcon = cloneElement(icon, {
    color: iconBgColor ?? 'currentColor'
  });

  return (
    <Card className="w-full rounded-2xl shadow-sm">
      <CardContent className="flex items-center gap-4 p-4">
        <div
          className="flex h-12 w-12 items-center justify-center rounded-xl border border-transparent"
          style={{
            backgroundColor: iconBgColor ? hexToRgba(iconBgColor, 0.1) : 'rgba(0,0,0,0.05)'
          }}
        >
          {coloredIcon}
        </div>

        <div className="flex flex-1 flex-col text-left">
          <span className="text-md font-semibold text-gray-900">{title}</span>
          <span className="text-sm text-gray-500">{subtitle}</span>
        </div>

        <div className="flex flex-col items-end gap-2">
          <IconButton onClick={onNavigate} size="small">
            <ChevronRightIcon size={24} />
          </IconButton>
        </div>
      </CardContent>
    </Card>
  );
};
