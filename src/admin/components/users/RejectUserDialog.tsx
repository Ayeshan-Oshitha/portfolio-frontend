import { useState } from "react";
import Button from "@/admin/components/ui/Button";
import Modal from "@/admin/components/ui/Modal";
import Textarea from "@/admin/components/ui/Textarea";
import type { AdminUser } from "@/admin/types";

interface RejectUserDialogProps {
  readonly target: AdminUser | null;
  readonly onConfirm: (reason: string) => void;
  readonly onCancel: () => void;
  readonly loading?: boolean;
}

/** A reason is required by the API, so this replaces `ConfirmDialog` for rejection. */
export default function RejectUserDialog({
  target,
  onConfirm,
  onCancel,
  loading = false,
}: RejectUserDialogProps) {
  const [reason, setReason] = useState("");
  const [touched, setTouched] = useState(false);
  const trimmed = reason.trim();

  function handleClose() {
    if (loading) return;
    setReason("");
    setTouched(false);
    onCancel();
  }

  function handleConfirm() {
    setTouched(true);
    if (!trimmed) return;
    onConfirm(trimmed);
  }

  return (
    <Modal
      open={target !== null}
      onClose={handleClose}
      title="Reject account"
      size="sm"
      footer={
        <>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleConfirm}
            loading={loading}
          >
            Reject
          </Button>
        </>
      }
    >
      <p className="text-sm text-text-secondary mb-5">
        {target
          ? `Reject ${target.firstName} ${target.lastName} (${target.email})? A reason is required and is visible to the applicant.`
          : ""}
      </p>

      <Textarea
        label="Reason"
        required
        rows={3}
        value={reason}
        onChange={(event) => setReason(event.target.value)}
        error={touched && !trimmed ? "A reason is required." : undefined}
      />
    </Modal>
  );
}
