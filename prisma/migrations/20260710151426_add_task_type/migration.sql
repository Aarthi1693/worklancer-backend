-- CreateEnum
CREATE TYPE "TaskType" AS ENUM ('DIGITAL', 'FIELD');

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "taskType" "TaskType" NOT NULL DEFAULT 'DIGITAL';

-- AlterTable
ALTER TABLE "Submission" ADD COLUMN     "completionDate" TIMESTAMP(3),
ADD COLUMN     "imageUrls" TEXT,
ADD COLUMN     "location" TEXT,
ADD COLUMN     "reportFile" TEXT,
ALTER COLUMN "githubLink" DROP NOT NULL;
