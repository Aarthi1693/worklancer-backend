-- CreateTable
CREATE TABLE "AIProjectPlan" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT,
    "projectType" TEXT,
    "budget" DOUBLE PRECISION,
    "deadline" TIMESTAMP(3),
    "requiredSkills" TEXT,
    "teamSize" INTEGER,
    "priority" TEXT,
    "planData" JSONB NOT NULL,
    "userId" TEXT NOT NULL,
    "projectId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AIProjectPlan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AIProjectPlan_userId_idx" ON "AIProjectPlan"("userId");

-- AddForeignKey
ALTER TABLE "AIProjectPlan" ADD CONSTRAINT "AIProjectPlan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AIProjectPlan" ADD CONSTRAINT "AIProjectPlan_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;
