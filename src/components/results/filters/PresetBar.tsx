// src/components/results/filters/PresetBar.tsx
import React, { useState } from 'react';
import { Select, MenuItem, IconButton, Tooltip, Dialog, DialogTitle,
         DialogContent, DialogActions, Button, TextField } from '@mui/material';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

import type { PresetDefinition } from '../../../mocks/presets.mock';
import type { AdmetFilters } from '../../../types/filters';

interface PresetBarProps {
  allPresets: PresetDefinition[];
  activePresetId: string;
  stagedFilters: AdmetFilters;
  onSelectPreset: (preset: PresetDefinition) => void;   // carrega no staged
  onSavePreset: (label: string, filters: AdmetFilters) => void;
  onDeletePreset: (id: string) => void;
}

export const PresetBar = ({
  allPresets,
  activePresetId,
  stagedFilters,
  onSelectPreset,
  onSavePreset,
  onDeletePreset,
}: PresetBarProps) => {
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [newPresetLabel, setNewPresetLabel] = useState('');

  const activePreset = allPresets.find(p => p.id === activePresetId);

  const handleSelect = (id: string) => {
    const preset = allPresets.find(p => p.id === id);
    if (preset) onSelectPreset(preset);
  };

  const handleSaveConfirm = () => {
    if (newPresetLabel.trim()) {
      onSavePreset(newPresetLabel, stagedFilters);
      setNewPresetLabel('');
      setSaveDialogOpen(false);
    }
  };

  return (
    <>
      <div className="flex items-center gap-2 mx-2 mt-4 mb-6">
        <Select
          value={activePresetId}
          onChange={e => handleSelect(e.target.value)}
          size="small"
          IconComponent={props => (
            <KeyboardArrowDownIcon {...props} className={`${props.className} text-gray-400`} />
          )}
          className="bg-white font-inter text-sm"
          sx={{
            flex: 1,
            borderRadius: '10px',
            boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)',
            '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e2e8f0', borderRadius: '10px' },
            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#cbd5e1' },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#3b82f6', borderWidth: '1px',
              boxShadow: '0 0 0 3px rgba(59,130,246,0.15)',
            },
            '& .MuiSelect-select': { paddingY: '8.5px', fontWeight: 600, color: '#1e293b' },
          }}
          MenuProps={{
            PaperProps: {
              sx: {
                mt: 1, borderRadius: '12px',
                boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)',
                border: '1px solid #f1f5f9',
                '& .MuiMenuItem-root': {
                  fontFamily: 'Inter, sans-serif', fontSize: '0.875rem',
                  color: '#475569', borderRadius: '6px', mx: '8px', my: '4px',
                  '&:hover': { backgroundColor: '#f0f9ff', color: '#0284c7' },
                  '&.Mui-selected': { backgroundColor: '#bae6fd', color: '#0369a1', fontWeight: 700 },
                  '&.Mui-selected:hover': { backgroundColor: '#bae6fd' },
                },
              },
            },
          }}
        >
          {allPresets.map(preset => (
            <MenuItem key={preset.id} value={preset.id}>
              <div className="flex items-center justify-between w-full gap-2">
                <span>{preset.label}</span>
                {!preset.isBuiltIn && (
                  <span
                    role="button"
                    className="text-gray-400 hover:text-red-500 transition-colors p-0.5 rounded"
                    onClick={e => {
                      e.stopPropagation();
                      onDeletePreset(preset.id);
                    }}
                  >
                    <DeleteOutlineIcon sx={{ fontSize: 14 }} />
                  </span>
                )}
              </div>
            </MenuItem>
          ))}
        </Select>

        <Tooltip title="Salvar configuração atual como preset" placement="top">
          <IconButton
            onClick={() => setSaveDialogOpen(true)}
            className="bg-white border border-gray-200 rounded-[10px] hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-all shadow-sm"
            sx={{ width: 40, height: 40 }}
          >
            <SaveOutlinedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </div>

      {/* Dialog de salvar preset */}
      <Dialog
        open={saveDialogOpen}
        onClose={() => setSaveDialogOpen(false)}
        PaperProps={{ sx: { borderRadius: '16px', padding: '8px', minWidth: '320px' } }}
      >
        <DialogTitle sx={{ fontFamily: 'Nunito Sans', fontWeight: 800, fontSize: '1rem', pb: 1 }}>
          Salvar como preset
        </DialogTitle>
        <DialogContent sx={{ pb: 1 }}>
          <TextField
            autoFocus
            fullWidth
            size="small"
            label="Nome do preset"
            value={newPresetLabel}
            onChange={e => setNewPresetLabel(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSaveConfirm()}
            sx={{ mt: 1, '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <Button
            onClick={() => setSaveDialogOpen(false)}
            variant="text"
            className="normal-case font-inter text-gray-500"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSaveConfirm}
            variant="contained"
            disabled={!newPresetLabel.trim()}
            className="normal-case font-inter bg-blue-600 hover:bg-blue-700 rounded-lg"
            sx={{ boxShadow: 'none', '&:hover': { boxShadow: 'none' } }}
          >
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};