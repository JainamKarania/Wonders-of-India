import { Dialog, DialogContent } from "@mui/material";

const ModalWrapper = ({ open, onClose, children }) => (
  <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
    <DialogContent className="rounded-3xl p-6 bg-white">
      {children}
    </DialogContent>
  </Dialog>
);

export default ModalWrapper;
