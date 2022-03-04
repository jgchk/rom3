-- CreateTable
CREATE TABLE "Trend" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "shortDesc" TEXT NOT NULL,
    "longDesc" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "TrendName" (
    "trendId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    PRIMARY KEY ("trendId", "name"),
    CONSTRAINT "TrendName_trendId_fkey" FOREIGN KEY ("trendId") REFERENCES "Trend" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_TrendTrendParents" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    FOREIGN KEY ("A") REFERENCES "Trend" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("B") REFERENCES "Trend" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_TrendStyleParents" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    FOREIGN KEY ("A") REFERENCES "Trend" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("B") REFERENCES "Trend" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_TrendTrendInfluences" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    FOREIGN KEY ("A") REFERENCES "Trend" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("B") REFERENCES "Trend" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_TrendStyleInfluences" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    FOREIGN KEY ("A") REFERENCES "Trend" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("B") REFERENCES "Trend" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_TrendTrendParents_AB_unique" ON "_TrendTrendParents"("A", "B");

-- CreateIndex
CREATE INDEX "_TrendTrendParents_B_index" ON "_TrendTrendParents"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_TrendStyleParents_AB_unique" ON "_TrendStyleParents"("A", "B");

-- CreateIndex
CREATE INDEX "_TrendStyleParents_B_index" ON "_TrendStyleParents"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_TrendTrendInfluences_AB_unique" ON "_TrendTrendInfluences"("A", "B");

-- CreateIndex
CREATE INDEX "_TrendTrendInfluences_B_index" ON "_TrendTrendInfluences"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_TrendStyleInfluences_AB_unique" ON "_TrendStyleInfluences"("A", "B");

-- CreateIndex
CREATE INDEX "_TrendStyleInfluences_B_index" ON "_TrendStyleInfluences"("B");
