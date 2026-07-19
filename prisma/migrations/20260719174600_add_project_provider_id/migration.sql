-- AlterTable
ALTER TABLE "Project" ADD COLUMN "providerId" TEXT NOT NULL DEFAULT '09bbb5ff-b01d-4893-933e-70b610681365';

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
