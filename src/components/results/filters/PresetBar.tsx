// src/components/results/filters/PresetBar.tsx
import  { useMemo, useState } from 'react';
import { 
  Select, MenuItem, IconButton, Tooltip, Dialog, DialogTitle,
  DialogContent, DialogContentText, DialogActions, Button, TextField
} from '@mui/material';

// Ícones
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import BookmarkAddOutlinedIcon from '@mui/icons-material/BookmarkAddOutlined';
import CloseIcon from '@mui/icons-material/Close';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import TuneIcon from '@mui/icons-material/Tune';

import type { PresetDefinition } from '../../../mocks/presets.mock';
import type { AdmetFilters } from '../../../types/filters';

interface PresetBarProps {
  allPresets: PresetDefinition[];
  activePresetId: string;
  stagedFilters: AdmetFilters;
  onSelectPreset: (preset: PresetDefinition) => void;
  onSavePreset: (label: string, filters: AdmetFilters) => void;
  // Nova prop recomendada para atualizar um preset existente (sobrescrever)
  onUpdatePreset?: (id: string, filters: AdmetFilters) => void; 
  onDeletePreset: (id: string) => void;
}

export const PresetBar = ({
  allPresets,
  activePresetId,
  stagedFilters,
  onSelectPreset,
  onSavePreset,
  onUpdatePreset,
  onDeletePreset,
}: PresetBarProps) => {
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [newPresetLabel, setNewPresetLabel] = useState('');

  const activePreset = allPresets.find(p => p.id === activePresetId);

  // 1. A LÓGICA DE ESTADO "DIRTY" (Sujo/Modificado)
  // Comparamos os filtros atuais com os filtros salvos no preset ativo
  const isModified = useMemo(() => {
    if (!activePreset) return false;
    return JSON.stringify(activePreset.filters) !== JSON.stringify(stagedFilters);
  }, [activePreset, stagedFilters]);

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

  const handleUpdateCurrent = () => {
    if (activePreset && onUpdatePreset) {
      onUpdatePreset(activePreset.id, stagedFilters);
    } else {
      // Fallback caso não tenha a função de update: salva com o mesmo nome
      onSavePreset(activePreset?.label || 'Atualizado', stagedFilters);
    }
  };

  return (
    <>
      <div className="flex items-center gap-2 mx-3 mt-4 mb-6">
        
        {/* DROPDOWN DE PRESETS */}
        <Select
          value={activePresetId}
          onChange={e => handleSelect(e.target.value)}
          size="small"
          IconComponent={props => <KeyboardArrowDownIcon {...props} className={`${props.className} text-slate-400`} />}
          className="bg-white font-inter text-sm"
          renderValue={(selected) => {
            const selectedPreset = allPresets.find(p => p.id === selected);
            return (
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-800">{selectedPreset?.label}</span>
                {/* Indicador Visual de que o preset foi alterado */}
                {isModified && (
                  <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-100/50 text-amber-700 text-[10px] font-bold uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                    Modificado
                  </span>
                )}
              </div>
            );
          }}
          sx={{
            flex: 1,
            borderRadius: '10px',
            boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)',
            '& .MuiOutlinedInput-notchedOutline': { 
              // Se modificado, a borda do select fica sutilmente laranja
              borderColor: isModified ? '#fcd34d' : '#e2e8f0', 
              borderRadius: '10px',
              transition: 'border-color 0.3s ease'
            },
            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: isModified ? '#fbbf24' : '#cbd5e1' },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#3b82f6', borderWidth: '1px',
              boxShadow: '0 0 0 3px rgba(59,130,246,0.15)',
            },
            '& .MuiSelect-select': { paddingY: '8.5px' },
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
            <MenuItem 
              key={preset.id} 
              value={preset.id}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between', 
                minWidth: '260px', 
                py: 1.2, // Um pouco mais de respiro vertical
                px: 2,
                borderRadius: '8px', // Bordas mais arredondadas (menos quadradão)
                mx: '8px',
                my: '4px',
                // Hover da linha que afeta o botão de excluir
                
              }}
            >
              {/* O Tooltip resolve o problema de textos longos cortados */}
                <span className="truncate pr-4 font-inter text-[13.5px] font-medium text-slate-700 tracking-tight block flex-1 cursor-default">
                  {preset.label}
                </span>

              {!preset.isBuiltIn && (
                <IconButton
                  size="small"
                  className="delete-btn" 
                  onClick={e => {
                    e.stopPropagation(); 
                    onDeletePreset(preset.id);
                  }}
                  onMouseDown={e => {
                    e.stopPropagation(); 
                  }}
                  title="Excluir predefinição"
                  sx={{
                    opacity: 0.45, // AGORA ESTÁ SEMPRE VISÍVEL (Sutil)
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    color: '#000000', // Cinza médio
                    padding: '5px',
                    marginRight: '-4px', 
                    '&:hover ': {
                  opacity: 1,
                  backgroundColor: '#ffe4e6', 
                  color: '#e11d48', 
                }
                  }}
                >
                  <CloseIcon sx={{ fontSize: 16 }} />
                </IconButton>
              )}
            </MenuItem>
          ))}
        </Select>

        {/* BOTÕES DE AÇÃO LÓGICA */}

        {/* Botão de Atualizar (Sobrescrever) - Só aparece se estiver modificado e NÃO for nativo do sistema */}
        {isModified && !activePreset?.isBuiltIn && (
          <Tooltip title="Atualizar predefinição atual" placement="top">
            <IconButton
              onClick={handleUpdateCurrent}
              className="bg-amber-50 border border-amber-200 rounded-[10px] text-amber-600 hover:bg-amber-100 hover:border-amber-300 transition-all shadow-sm"
              sx={{ width: 40, height: 40 }}
            >
              <SaveOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}

        {/* Botão de Salvar Como Novo (Sempre aparece) */}
        <Tooltip title="Salvar como nova predefinição" placement="top">
          <IconButton
            onClick={() => setSaveDialogOpen(true)}
            className="bg-white border border-slate-200 rounded-[10px] text-slate-500 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-all shadow-sm"
            sx={{ width: 40, height: 40 }}
          >
            <BookmarkAddOutlinedIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </div>

      {/* ======================================================================= */}
      {/* DIALOG DE SALVAR PRESET (Versão Premium)                                */}
      {/* ======================================================================= */}
      <Dialog
        open={saveDialogOpen}
        onClose={() => setSaveDialogOpen(false)}
        slotProps={{
          backdrop: { sx: { backdropFilter: 'blur(2px)', backgroundColor: 'rgba(15, 23, 42, 0.3)' } }
        }}
        PaperProps={{ 
          sx: { 
            borderRadius: '20px', 
            p: 1, 
            minWidth: { xs: '90vw', sm: '400px' },
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          } 
        }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5, pb: 1, pt: 3 }}>
          <div className="bg-blue-50 text-blue-600 p-2 rounded-xl">
            <TuneIcon fontSize="small" />
          </div>
          <span className="font-nunito_sans font-extrabold text-[1.1rem] text-slate-800">
            Salvar Predefinição
          </span>
        </DialogTitle>
        
        <DialogContent sx={{ pb: 2 }}>
          <DialogContentText sx={{ fontFamily: 'Inter', color: '#64748b', fontSize: '0.85rem', mb: 3 }}>
            Dê um nome a este conjunto de filtros para utilizá-lo rapidamente em análises futuras.
          </DialogContentText>
          <TextField
            autoFocus
            fullWidth
            placeholder="Ex: Alvos para SNC (Penetração BBB)"
            value={newPresetLabel}
            onChange={e => setNewPresetLabel(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSaveConfirm()}
            sx={{ 
              '& .MuiOutlinedInput-root': { 
                borderRadius: '12px',
                fontFamily: 'Inter',
                backgroundColor: '#f8fafc',
                '& fieldset': { borderColor: '#e2e8f0' },
                '&:hover fieldset': { borderColor: '#cbd5e1' },
                '&.Mui-focused fieldset': { borderColor: '#3b82f6', borderWidth: '2px' },
              } 
            }}
          />
        </DialogContent>
        
        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button
            onClick={() => setSaveDialogOpen(false)}
            variant="text"
            disableElevation
            sx={{
              fontFamily: 'Inter', fontWeight: 600, textTransform: 'none',
              color: '#64748b', borderRadius: '10px', px: 3,
              '&:hover': { backgroundColor: '#f1f5f9' }
            }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSaveConfirm}
            variant="contained"
            disabled={!newPresetLabel.trim()}
            disableElevation
            sx={{
              fontFamily: 'Nunito Sans', fontWeight: 800, textTransform: 'none',
              backgroundColor: '#2563eb', color: 'white', borderRadius: '10px', px: 4,
              '&:hover': { backgroundColor: '#1d4ed8' },
              '&.Mui-disabled': { backgroundColor: '#e2e8f0', color: '#94a3b8' }
            }}
          >
            Salvar Filtros
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};