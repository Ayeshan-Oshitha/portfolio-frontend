import Badge from "@/portfolio/components/ui/Badge";
import Card from "@/admin/components/ui/Card";
import useAuth from "@/admin/context/useAuth";
import { formatDate, roleLabel, statusLabel } from "@/admin/utils/format";

export default function DashboardPage() {
  const { user } = useAuth();

  if (!user) return null;

  const details = [
    { label: "Email", value: user.email },
    { label: "Member since", value: formatDate(user.createdAt) },
    { label: "Last sign-in", value: formatDate(user.lastLoginAt) },
  ];

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-text-primary mb-1">
        Welcome back, {user.firstName}.
      </h1>
      <p className="text-sm text-text-muted mb-8">
        You are signed in to the portfolio CMS.
      </p>

      <Card>
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <Badge variant="subtle">{roleLabel(user.role)}</Badge>
          <Badge variant="outline">{statusLabel(user.status)}</Badge>
        </div>

        <dl className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {details.map(({ label, value }) => (
            <div key={label}>
              <dt className="text-[10px] font-semibold tracking-widest uppercase text-text-muted mb-1">
                {label}
              </dt>
              <dd className="text-sm text-text-primary break-words">{value}</dd>
            </div>
          ))}
        </dl>
      </Card>
    </div>
  );
}
