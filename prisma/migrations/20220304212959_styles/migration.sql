-- CreateTable
CREATE TABLE "Style" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "shortDesc" TEXT NOT NULL,
    "longDesc" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "StyleName" (
    "styleId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    PRIMARY KEY ("styleId", "name"),
    CONSTRAINT "StyleName_styleId_fkey" FOREIGN KEY ("styleId") REFERENCES "Style" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_StyleParents" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    FOREIGN KEY ("A") REFERENCES "Style" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("B") REFERENCES "Style" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_StyleInfluences" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    FOREIGN KEY ("A") REFERENCES "Style" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("B") REFERENCES "Style" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_StyleParents_AB_unique" ON "_StyleParents"("A", "B");

-- CreateIndex
CREATE INDEX "_StyleParents_B_index" ON "_StyleParents"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_StyleInfluences_AB_unique" ON "_StyleInfluences"("A", "B");

-- CreateIndex
CREATE INDEX "_StyleInfluences_B_index" ON "_StyleInfluences"("B");
