import { DownloadIcon } from 'lucide-react';
import { OutlineButton } from './OutlineButton';
import { useState } from 'react';
import { Menu, MenuItem } from '@mui/material';
import { hexToRgba } from '@renderer/utils/colorUtils';

interface ExportButtonProps {
  onPDFDownload?: () => void;
  onExcelDownload?: () => void;
}

export const ExportButton = ({ onPDFDownload, onExcelDownload }: ExportButtonProps) => {
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
      <OutlineButton
        size="sm"
        variant="info"
        icon={<DownloadIcon size={16} />}
        onClick={handleMenuClick}
      >
        Exportar
      </OutlineButton>
      <Menu
        id="export-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        slotProps={{
          list: {
            'aria-labelledby': 'basic-button'
          }
        }}
      >
        {onPDFDownload && (
          <MenuItem
            onClick={() => {
              handleMenuClose();
              onPDFDownload();
            }}
            sx={{
              '&:hover': {
                backgroundColor: hexToRgba('#0092b8', 0.1)
              }
            }}
          >
            <span className="flex items-center gap-2 text-sm" style={{ color: '#0092b8' }}>
              <span>PDF</span>
            </span>
          </MenuItem>
        )}
        {onExcelDownload && (
          <MenuItem
            onClick={() => {
              handleMenuClose();
              onExcelDownload();
            }}
            sx={{
              '&:hover': {
                backgroundColor: hexToRgba('#0092b8', 0.1)
              }
            }}
          >
            <span className="flex items-center gap-2 text-sm" style={{ color: '#0092b8' }}>
              <span>Excel</span>
            </span>
          </MenuItem>
        )}
      </Menu>
    </>
  );
};
