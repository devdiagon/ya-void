import { Card, CardActionArea, CardContent, IconButton, Skeleton } from '@mui/material';
import { hexToGlow, hexToRgba } from '@renderer/utils';
import { ChevronRightIcon, LucideProps, PencilIcon, Trash2Icon } from 'lucide-react';
import { cloneElement, ReactElement } from 'react';
import { OutlineButton } from '../Button';

interface ListCardProps {
  title: string;
  subtitle: string;
  icon: ReactElement<LucideProps>;
  iconBgColor?: string;
  loading?: boolean;
  onNavigate?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const ListCard = ({
  title,
  subtitle,
  icon,
  iconBgColor,
  loading,
  onNavigate,
  onEdit,
  onDelete
}: ListCardProps) => {
  const coloredIcon = cloneElement(icon, {
    color: iconBgColor ?? 'currentColor'
  });

  return (
    <Card
      className="w-full rounded-2xl shadow-sm"
      sx={{
        border: '1px solid transparent',
        '&:hover': iconBgColor
          ? {
              borderColor: iconBgColor,
              boxShadow: hexToGlow(iconBgColor)
            }
          : undefined
      }}
    >
      <CardActionArea disabled={loading} onClick={onNavigate} className="rounded-2xl" disableRipple>
        <CardContent className="flex items-center gap-4 p-4">
          {/*Icon Section*/}
          {loading ? (
            <Skeleton variant="rounded" width={48} height={48} className="rounded-xl" />
          ) : (
            <div
              className="flex h-12 w-12 items-center justify-center rounded-xl border border-transparent"
              style={{
                backgroundColor: iconBgColor ? hexToRgba(iconBgColor, 0.1) : 'rgba(0,0,0,0.05)'
              }}
            >
              {coloredIcon}
            </div>
          )}

          {/*Content Section*/}
          <div className="flex flex-1 flex-col text-left">
            {loading ? (
              <>
                <Skeleton variant="text" width="60%" height={18} />
                <Skeleton variant="text" width="40%" height={14} />
                <div className="flex items-center gap-4 pt-2">
                  <Skeleton variant="rectangular" width={60} height={28} className="rounded" />
                  <Skeleton variant="rectangular" width={60} height={28} className="rounded" />
                </div>
              </>
            ) : (
              <>
                <span className="text-md font-semibold text-gray-900">{title}</span>
                <span className="text-sm text-gray-500">{subtitle}</span>
                <div className="flex items-center gap-4 pt-2">
                  {onEdit && (
                    <OutlineButton
                      ariaLabel="Editar"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit();
                      }}
                      size="sm"
                      icon={<PencilIcon size={16} />}
                      className="border-none"
                    >
                      Editar
                    </OutlineButton>
                  )}

                  {onDelete && (
                    <OutlineButton
                      ariaLabel="Eliminar"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete();
                      }}
                      size="sm"
                      icon={<Trash2Icon size={16} />}
                      className="border-none"
                      variant="danger"
                    >
                      Eliminar
                    </OutlineButton>
                  )}
                </div>
              </>
            )}
          </div>

          {/*Action Section*/}
          <div className="flex flex-col items-end gap-2">
            {loading ? (
              <Skeleton variant="circular" width={32} height={32} />
            ) : (
              <IconButton onClick={onNavigate} size="small">
                <ChevronRightIcon size={24} />
              </IconButton>
            )}
          </div>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};
