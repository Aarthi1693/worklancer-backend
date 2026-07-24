-- CreateEnum
CREATE TYPE "PlanStatus" AS ENUM ('ACTIVE', 'ARCHIVED', 'IN_PROGRESS');

-- AlterTable
ALTER TABLE "AIProjectPlan" ADD COLUMN "status" "PlanStatus" NOT NULL DEFAULT 'ACTIVE';
