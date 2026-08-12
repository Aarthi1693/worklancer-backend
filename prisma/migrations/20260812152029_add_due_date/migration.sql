-- AlterEnum
ALTER TYPE "NotificationType" ADD VALUE 'SUBMISSION';

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "dueDate" TIMESTAMP(3);
