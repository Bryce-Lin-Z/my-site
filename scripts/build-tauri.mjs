import { execSync } from 'node:child_process'
import { renameSync, existsSync, rmSync, readdirSync } from 'node:fs'

// app/api/lc-search reads live request params, which `output: 'export'` can't
// support. It's unneeded for the desktop build (search goes over
// lib/lc-search-client.ts instead), so hide it from routing for this build
// only, using Next's private-folder convention (a leading `_` opts a folder
// out of routing). Always restore it afterward, even if the build fails.
const REAL = 'app/api'
const HIDDEN = 'app/_api'

let renamed = false
try {
  if (existsSync(REAL)) {
    renameSync(REAL, HIDDEN)
    renamed = true
  }
  execSync('cross-env BUILD_TARGET=tauri next build', { stdio: 'inherit' })
} finally {
  if (renamed && existsSync(HIDDEN)) {
    renameSync(HIDDEN, REAL)
  }
}

// The desktop app is scoped to the leetcode feature only — drop the rest of
// the site's routes from the exported output (out/_next has the shared JS/CSS
// chunks every route depends on, so it stays).
for (const dir of ['out/about', 'out/blog', 'out/projects', 'out/404', 'out/_not-found', 'out/downloads']) {
  rmSync(dir, { recursive: true, force: true })
}
for (const file of ['out/index.html', 'out/index.txt', 'out/404.html']) {
  rmSync(file, { force: true })
}
if (existsSync('out')) {
  for (const file of readdirSync('out')) {
    if (file.startsWith('__next.') && !file.includes('leetcode')) {
      rmSync(`out/${file}`, { force: true })
    }
  }
}
