import { notFound } from "next/navigation";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const statusVariant = {
  pending: "outline",
  reviewed: "secondary",
  accepted: "default",
  rejected: "destructive",
};

export default async function ApplicationDetailPage({ params }) {
  const { id } = params;

  const application = await prisma.application.findUnique({
    where: { id },
    include: {
      job: true,
    },
  });

  if (!application) {
    notFound();
  }

  return (
    <div className="animate-in space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Application details
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Submitted on{" "}
            {new Date(application.createdAt).toLocaleString(undefined, {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            variant={statusVariant[application.status] ?? "outline"}
            className="capitalize"
          >
            {application.status}
          </Badge>
          <Button asChild variant="outline" size="sm">
            <Link href="/dashboard/applications">Back to applications</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Applicant</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div>
              <p className="font-medium">{application.userName}</p>
              <p className="text-muted-foreground">{application.userEmail}</p>
            </div>
            <div className="pt-2">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">
                User ID
              </p>
              <p className="font-mono text-xs break-all">
                {application.userId}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Job</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div>
              <p className="font-medium">
                {application.job?.title ?? "Job no longer available"}
              </p>
              {application.job?.company && (
                <p className="text-muted-foreground">
                  {application.job.company}
                  {application.job.location
                    ? ` • ${application.job.location}`
                    : ""}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Cover letter</CardTitle>
        </CardHeader>
        <CardContent>
          {application.coverLetter ? (
            <p className="whitespace-pre-line text-sm leading-relaxed">
              {application.coverLetter}
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">
              This applicant did not include a cover letter.
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>CV</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between gap-4">
          {application.cvUrl ? (
            <>
              <p className="text-sm text-muted-foreground truncate">
                {application.cvUrl}
              </p>
              <Button asChild size="sm">
                <a
                  href={application.cvUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Open CV
                </a>
              </Button>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              No CV was uploaded for this application.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

