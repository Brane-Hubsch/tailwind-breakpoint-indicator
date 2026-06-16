import { execFileSync } from 'node:child_process'
import { cpSync, mkdirSync, rmSync, renameSync } from 'node:fs'

rmSync('dist', { force: true, recursive: true })

execFileSync('npx', ['tsc', '-p', 'tsconfig.esm.json'], {
  stdio: 'inherit',
})
execFileSync('npx', ['tsc', '-p', 'tsconfig.cjs.json'], {
  stdio: 'inherit',
})

mkdirSync('dist', { recursive: true })
cpSync('dist/esm/index.js', 'dist/index.js')
cpSync('dist/esm/index.d.ts', 'dist/index.d.ts')
renameSync('dist/cjs/index.js', 'dist/index.cjs')
rmSync('dist/esm', { force: true, recursive: true })
rmSync('dist/cjs', { force: true, recursive: true })
