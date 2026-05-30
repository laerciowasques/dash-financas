import { spawn, execSync } from 'child_process'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(__dirname, '..')

function killPort(port) {
  if (process.platform !== 'win32') return

  try {
    const output = execSync(`netstat -ano | findstr :${port}`, { encoding: 'utf8' })
    const pids = new Set()

    for (const line of output.split('\n')) {
      if (!line.includes('LISTENING')) continue
      const pid = line.trim().split(/\s+/).at(-1)
      if (pid && pid !== '0') pids.add(pid)
    }

    for (const pid of pids) {
      try {
        execSync(`taskkill /PID ${pid} /F`, { stdio: 'ignore' })
      } catch {
        // process may already be gone
      }
    }
  } catch {
    // port is free
  }
}

function getDevCwd() {
  if (process.platform !== 'win32') {
    return projectRoot
  }

  const drive = 'Z:'
  try {
    execSync(`subst ${drive} /D`, { stdio: 'ignore' })
  } catch {
    // drive may not be mapped yet
  }

  execSync(`subst ${drive} "${projectRoot}"`, { stdio: 'inherit' })
  return `${drive}\\`
}

killPort(3000)
killPort(3001)

try {
  execSync('if not exist "C:\\dev\\webpack-cache" mkdir "C:\\dev\\webpack-cache"', { stdio: 'ignore' })
} catch {
  // ignore
}

const cwd = getDevCwd()

const child = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'dev', '--webpack'], {
  cwd,
  stdio: 'inherit',
})

child.on('exit', (code) => {
  process.exit(code ?? 0)
})
