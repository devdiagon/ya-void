import { Card, CardContent, IconButton, Menu, MenuItem, Skeleton } from '@mui/material';
import { hexToGlow, hexToRgba } from '@renderer/utils';
import { EllipsisVerticalIcon, LucideProps, SquarePenIcon, Trash2Icon } from 'lucide-react';
import { cloneElement, KeyboardEvent, ReactElement, useState } from 'react';

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
  // Menu dropdown state
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Container click event
  const isClickable = Boolean(onNavigate) && !loading;

  const handleCardKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!onNavigate || loading) {
      return;
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onNavigate();
    }
  };

  // Clickable container with pointer class
  const cardClass = isClickable ? 'rounded-2xl cursor-pointer' : 'rounded-2xl';

  // Prepare the icon with the desired color
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
      <div
        onClick={isClickable ? onNavigate : undefined}
        onKeyDown={handleCardKeyDown}
        role={isClickable ? 'button' : undefined}
        tabIndex={isClickable ? 0 : undefined}
        className={cardClass}
      >
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
              </>
            ) : (
              <>
                <span className="text-md font-semibold text-gray-900">{title}</span>
                <span className="text-sm text-gray-500">{subtitle}</span>
              </>
            )}
          </div>

          {/*Action Section*/}
          <div className="flex flex-col items-end gap-2">
            {loading ? (
              <Skeleton variant="circular" width={32} height={32} />
            ) : (
              <>
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMenuClick(e);
                  }}
                  size="small"
                >
                  <EllipsisVerticalIcon size={24} />
                </IconButton>
                <Menu
                  id="basic-menu"
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleMenuClose}
                  slotProps={{
                    list: {
                      'aria-labelledby': 'basic-button'
                    },
                    root: {
                      onClick: (e: React.MouseEvent) => e.stopPropagation()
                    }
                  }}
                >
                  {onEdit && (
                    <MenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMenuClose();
                        onEdit();
                      }}
                      sx={{
                        '&:hover': {
                          backgroundColor: hexToRgba('#50a2ff', 0.1)
                        }
                      }}
                    >
                      <MenuItemSlot
                        icon={<SquarePenIcon size={16} />}
                        label="Editar"
                        color="#50a2ff"
                      />
                    </MenuItem>
                  )}
                  {onDelete && (
                    <MenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMenuClose();
                        onDelete();
                      }}
                      sx={{
                        '&:hover': {
                          backgroundColor: hexToRgba('#ef4444', 0.1)
                        }
                      }}
                    >
                      <MenuItemSlot
                        icon={<Trash2Icon size={16} />}
                        label="Eliminar"
                        color="#ef4444"
                      />
                    </MenuItem>
                  )}
                </Menu>
              </>
            )}
          </div>
        </CardContent>
      </div>
    </Card>
  );
};

// Helper component for menu item
const MenuItemSlot = ({
  icon,
  label,
  color
}: {
  icon: ReactElement<LucideProps>;
  label: string;
  color?: string;
}) => (
  <span className="flex items-center gap-2" style={{ color }}>
    {cloneElement(icon, { size: 16, color: color ?? 'currentColor' })}
    <span>{label}</span>
  </span>
);
