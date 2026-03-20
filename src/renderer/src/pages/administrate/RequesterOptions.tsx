import { Menu, MenuItem } from '@mui/material';
import { IconButton } from '@renderer/components';
import { Requester } from '@renderer/types';
import { hexToRgba } from '@renderer/utils';
import { EllipsisVerticalIcon, LucideProps, SquarePenIcon, UserMinusIcon } from 'lucide-react';
import { cloneElement, ReactElement, useState } from 'react';

interface RequesterOptionsProps {
  requester: Requester;
  onEdit: (requester: Requester) => void;
  onRemove: (requesterId: number) => void;
}

export const RequesterOptions = ({ requester, onEdit, onRemove }: RequesterOptionsProps) => {
  // Menu dropdown state
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton
        icon={<EllipsisVerticalIcon size={24} />}
        onClick={(e) => {
          handleMenuClick(e);
        }}
        size="sm"
        ariaLabel="Opciones"
        rounded={true}
      />
      <Menu
        id={`Sub_menu_req_${requester.id}`}
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        slotProps={{
          list: {
            'aria-labelledby': 'basic-button'
          }
        }}
      >
        <MenuItem
          onClick={() => {
            handleMenuClose();
            onEdit(requester);
          }}
          sx={{
            '&:hover': {
              backgroundColor: hexToRgba('#50a2ff', 0.1)
            }
          }}
        >
          <MenuItemSlot icon={<SquarePenIcon size={16} />} label="Editar" color="#50a2ff" />
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleMenuClose();
            onRemove(requester.id);
          }}
          sx={{
            '&:hover': {
              backgroundColor: hexToRgba('#ef4444', 0.1)
            }
          }}
        >
          <MenuItemSlot icon={<UserMinusIcon size={16} />} label="Quitar" color="#ef4444" />
        </MenuItem>
      </Menu>
    </>
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
