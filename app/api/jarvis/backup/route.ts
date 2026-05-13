import { NextResponse } from "next/server"

const GITHUB_TOKEN = process.env.GITHUB_TOKEN
const REPO = "Casellelol/JARVIS-brain"

const BRAIN_FILES = [
  "conversation-log.md",
  "jarvis-memory.md",
  "jarvis-summary.md",
  "jarvis-upgrades.md",
  "jarvis-self-model.md",
  "maximus-brain.md",
  "empire-changelog.md",
  "empire.json",
]

async function fetchFileRaw(path: string): Promise<{ content: string; sha: string } | null> {
  try {
    const res = await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`, {
      headers: { Authorization: `token ${GITHUB_TOKEN}`, Accept: "application/vnd.github.v3+json" },
    })
    if (!res.ok) return null
    const data = await res.json() as { content: string; sha: string }
    return { content: Buffer.from(data.content, "base64").toString("utf-8"), sha: data.sha }
  } catch { return null }
}

async function getOrCreateBackupsIndex(): Promise<{ index: string[]; sha: string }> {
  try {
    const res = await fetch(`https://api.github.com/repos/${REPO}/contents/backups/index.json`, {
      headers: { Authorization: `token ${GITHUB_TOKEN}`, Accept: "application/vnd.github.v3+json" },
    })
    if (res.ok) {
      const data = await res.json() as { content: string; sha: string }
      const index = JSON.parse(Buffer.from(data.content, "base64").toString("utf-8")) as string[]
      return { index, sha: data.sha }
    }
  } catch {}
  return { index: [], sha: "" }
}

async function deleteOldBackup(filename: string) {
  try {
    const res = await fetch(`https://api.github.com/repos/${REPO}/contents/backups/${filename}`, {
      headers: { Authorization: `token ${GITHUB_TOKEN}`, Accept: "application/vnd.github.v3+json" },
    })
    if (!res.ok) return
    const data = await res.json() as { sha: string }
    await fetch(`https://api.github.com/repos/${REPO}/contents/backups/${filename}`, {
      method: "DELETE",
      headers: { Authorization: `token ${GITHUB_TOKEN}`, "Content-Type": "application/json" },
      body: JSON.stringify({ message: `Delete old backup: ${filename}`, sha: data.sha }),
    })
  } catch {}
}

async function writeToGitHub(path: string, content: string, sha?: string) {
  const body: Record<string, unknown> = {
    message: `Backup: ${path}`,
    content: Buffer.from(content).toString("base64"),
  }
  if (sha) body.sha = sha
  await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`, {
    method: "PUT",
    headers: { Authorization: `token ${GITHUB_TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
}

export async function GET() {
  try {
    const timestamp = new Date().toISOString()
    const dateKey = timestamp.slice(0, 10)
    const backupFilename = `${dateKey}.json`

    // Fetch all brain files in parallel
    const results = await Promise.all(
      BRAIN_FILES.map(async f => ({ file: f, data: await fetchFileRaw(f) }))
    )

    const backedUp: string[] = []
    const backupPayload: Record<string, string> = { _timestamp: timestamp }

    for (const { file, data } of results) {
      if (data) {
        backupPayload[file] = data.content
        backedUp.push(file)
      }
    }

    // Write backup file to GitHub
    await writeToGitHub(`backups/${backupFilename}`, JSON.stringify(backupPayload, null, 2))

    // Update index and prune old backups (keep last 7)
    const { index, sha: indexSha } = await getOrCreateBackupsIndex()
    const updatedIndex = [...new Set([...index, backupFilename])].sort().reverse()

    if (updatedIndex.length > 7) {
      const toDelete = updatedIndex.splice(7)
      for (const old of toDelete) {
        await deleteOldBackup(old)
      }
    }

    await writeToGitHub(
      "backups/index.json",
      JSON.stringify(updatedIndex, null, 2),
      indexSha || undefined
    )

    return NextResponse.json({ backed_up: backedUp, timestamp, backup_file: backupFilename })
  } catch (err) {
    console.error("[backup] Error:", err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
