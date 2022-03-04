-- CreateTable
CREATE TABLE "Scene" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "shortDesc" TEXT NOT NULL,
    "longDesc" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "SceneName" (
    "sceneId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    PRIMARY KEY ("sceneId", "name"),
    CONSTRAINT "SceneName_sceneId_fkey" FOREIGN KEY ("sceneId") REFERENCES "Scene" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_SceneInfluences" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    FOREIGN KEY ("A") REFERENCES "Scene" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY ("B") REFERENCES "Scene" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_SceneInfluences_AB_unique" ON "_SceneInfluences"("A", "B");

-- CreateIndex
CREATE INDEX "_SceneInfluences_B_index" ON "_SceneInfluences"("B");
