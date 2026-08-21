import Button from "@/portfolio/components/ui/Button";
import Alert from "@/admin/components/ui/Alert";
import Modal from "@/admin/components/ui/Modal";

interface ConfirmDialogProps {
  readonly open: boolean;
  readonly title: string;
  readonly message: string;
  readonly confirmLabel?: string;
  readonly onConfirm: () => void;
  readonly onCancel: () => void;
  readonly loading?: boolean;
  /** Shown inside the dialog so a refused action keeps its context. */
  readonly error?: string | null;
}

/** Replaces `window.confirm` for destructive admin actions. */
export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Delete",
  onConfirm,
  onCancel,
  loading = false,
  error,
}: ConfirmDialogProps) {
  return (
    <Modal
      open={open}
      onClose={loading ? () => {} : onCancel}
      title={title}
      size="sm"
      footer={
        <>
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={onConfirm}
            loading={loading}
          >
            {confirmLabel}
          </Button>
        </>
      }
    >
      <p className="text-sm text-text-secondary">{message}</p>
      {error && <Alert className="mt-5">{error}</Alert>}
    </Modal>
  );
}
