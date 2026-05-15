// src/components/predict/WarningModal.tsx
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Typography } from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

interface WarningModalProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export const WarningModal = ({ open, onCancel, onConfirm }: WarningModalProps) => (
  <Dialog open={open} onClose={onCancel} PaperProps={{ sx: { borderRadius: 4, p: 1, minWidth: { xs: '90vw', sm: '420px' } } }}>
    <DialogTitle sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', pb: 1, pt: 4 }}>
      <div className="bg-red-50 text-red-500 p-4 rounded-full mb-4">
        <WarningAmberIcon sx={{ fontSize: 48 }} />
      </div>
      <Typography variant="h5" sx={{ fontFamily: 'Nunito Sans', fontWeight: 800, color: '#0f172a' }}>
        Descartar resultados?
      </Typography>
    </DialogTitle>
    <DialogContent sx={{ textAlign: 'center', pb: 4 }}>
      <DialogContentText sx={{ fontFamily: 'Inter', color: '#64748b' }}>
        Todos os <strong>filtros</strong> e <strong>cálculos</strong> serão perdidos. Deseja iniciar uma nova predição?
      </DialogContentText>
    </DialogContent>
    <DialogActions sx={{ justifyContent: 'center', gap: 2, px: 3, pb: 3 }}>
      <Button onClick={onCancel} variant="outlined" sx={{ borderRadius: 2, color: '#64748b', borderColor: '#e2e8f0', textTransform: 'none', fontWeight: 600 }}>
        Cancelar
      </Button>
      <Button onClick={onConfirm} variant="contained" color="error" sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 800 }}>
        Sim, descartar
      </Button>
    </DialogActions>
  </Dialog>
);