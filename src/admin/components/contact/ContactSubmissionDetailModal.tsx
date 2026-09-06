import { useState } from "react";
import type {
  AdminContactSubmission,
  ContactSubmissionStatus,
} from "@/admin/types";
import { useUpdateContactSubmission } from "@/admin/hooks/useContactSubmissions";
import { toErrorMessage } from "@/admin/api/ApiError";
import useToast from "@/admin/context/useToast";
import {
  contactBudgetRangeLabel,
  contactStatusLabel,
  formatDate,
} from "@/admin/utils/format";
import { Badge, Button, Modal, Select, Textarea } from "@/admin/components/ui";

const STATUS_OPTIONS: readonly { value: ContactSubmissionStatus; label: string }[] =
  ["new", "read", "replied", "archived", "spam"].map((value) => ({
    value: value as ContactSubmissionStatus,
    label: contactStatusLabel(value as ContactSubmissionStatus),
  }));

interface ContactSubmissionDetailModalProps {
  readonly submission: AdminContactSubmission | null;
  readonly onClose: () => void;
}

/** View + triage a single enquiry: status and internal notes only — nothing here can rewrite what the visitor sent. */
export default function ContactSubmissionDetailModal({
  submission,
  onClose,
}: ContactSubmissionDetailModalProps) {
  const toast = useToast();
  const updateMutation = useUpdateContactSubmission();

  const [status, setStatus] = useState<ContactSubmissionStatus>(
    submission?.status ?? "new",
  );
  const [adminNotes, setAdminNotes] = useState(submission?.adminNotes ?? "");
  const [lastLoadedId, setLastLoadedId] = useState<string | null>(null);

  // Re-seed local edit state whenever a different submission opens, without a
  // `useEffect` — Modal unmounts nothing on close, so the fields would
  // otherwise keep showing the previous row's draft.
  if (submission && submission.id !== lastLoadedId) {
    setLastLoadedId(submission.id);
    setStatus(submission.status);
    setAdminNotes(submission.adminNotes ?? "");
  }

  if (!submission) return null;

  const dirty =
    status !== submission.status ||
    adminNotes !== (submission.adminNotes ?? "");

  async function handleSave() {
    if (!submission) return;

    try {
      await updateMutation.mutateAsync({
        id: submission.id,
        body: { status, adminNotes: adminNotes || undefined },
      });
      toast.success("Submission updated.");
      onClose();
    } catch (cause) {
      toast.error(toErrorMessage(cause));
    }
  }

  return (
    <Modal
      open={submission !== null}
      onClose={onClose}
      title={submission.name}
      description={submission.email}
      size="lg"
      footer={
        <>
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleSave}
            disabled={!dirty}
            loading={updateMutation.isPending}
          >
            Save
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
          <Field label="Phone" value={submission.phone} />
          <Field label="Company" value={submission.company} />
          <Field
            label="Service"
            value={submission.serviceName ?? "General enquiry"}
          />
          <Field
            label="Budget"
            value={
              submission.budgetRange
                ? contactBudgetRangeLabel(submission.budgetRange)
                : undefined
            }
          />
          <Field label="Site" value={submission.site} />
          <Field label="Submitted" value={formatDate(submission.createdAt)} />
          {submission.repliedAt && (
            <Field label="Replied" value={formatDate(submission.repliedAt)} />
          )}
          <Field label="IP address" value={submission.submitterIp} />
        </div>

        <div>
          <span className="mb-1.5 block text-xs font-semibold tracking-wide text-text-muted uppercase">
            {submission.subject ?? "Message"}
          </span>
          <p className="rounded-lg border border-border-subtle bg-surface-800 p-4 text-sm leading-relaxed whitespace-pre-wrap text-text-primary">
            {submission.message}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Select
            fieldSize="md"
            label="Status"
            options={STATUS_OPTIONS}
            value={status}
            onChange={(event) =>
              setStatus(event.target.value as ContactSubmissionStatus)
            }
          />
          {submission.status === "spam" && (
            <div className="flex items-end">
              <Badge tone="danger">Flagged as spam by the honeypot</Badge>
            </div>
          )}
        </div>

        <Textarea
          label="Internal notes"
          value={adminNotes}
          onChange={(event) => setAdminNotes(event.target.value)}
          rows={4}
          hint="Never visible to the submitter."
        />
      </div>
    </Modal>
  );
}

function Field({ label, value }: { readonly label: string; readonly value?: string }) {
  return (
    <div>
      <span className="block text-xs font-semibold tracking-wide text-text-muted uppercase">
        {label}
      </span>
      <span className="block text-text-primary">{value ?? "—"}</span>
    </div>
  );
}
