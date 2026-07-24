-- DropForeignKey
ALTER TABLE "Project" DROP CONSTRAINT "Project_providerId_fkey";

-- DropIndex
DROP INDEX "AIProjectPlan_userId_idx";

-- AlterTable
ALTER TABLE "Project" ALTER COLUMN "providerId" DROP DEFAULT;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
