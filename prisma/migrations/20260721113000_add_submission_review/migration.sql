-- AlterEnum
ALTER TYPE "SubmissionStatus" ADD VALUE 'PENDING_REVIEW';
ALTER TYPE "SubmissionStatus" ADD VALUE 'REVISION_REQUIRED';

-- AlterTable
ALTER TABLE "Submission" ADD COLUMN "feedback" TEXT;
ALTER TABLE "Submission" ADD COLUMN "approvedAt" TIMESTAMP(3);
ALTER TABLE "Submission" ADD COLUMN "reviewedAt" TIMESTAMP(3);
ALTER TABLE "Submission" ADD COLUMN "reviewedBy" TEXT;
