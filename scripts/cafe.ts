import { parseArgs } from 'node:util'
import * as fs from 'node:fs/promises'
import * as path from 'node:path'
import { CafeSchema } from '../src/lib/schema/cafe'
import { template } from '../src/lib/schema/template'

async function validate() {
  const contentDir = path.join(process.cwd(), 'content', 'cafes')
  let hasErrors = false

  try {
    const files = await fs.readdir(contentDir)
    const jsonFiles = files.filter(f => f.endsWith('.json'))

    console.log(`Validating ${jsonFiles.length} cafés...`)

    for (const file of jsonFiles) {
      const filePath = path.join(contentDir, file)
      const content = await fs.readFile(filePath, 'utf-8')
      
      try {
        const data = JSON.parse(content)
        const result = CafeSchema.safeParse(data)
        
        if (!result.success) {
          hasErrors = true
          console.error(`\n❌ Error in ${file}:`)
          if (result.error && result.error.errors) {
            result.error.errors.forEach(err => {
              console.error(`  - ${err.path.join('.')}: ${err.message}`)
            })
          } else {
             console.error(`  - ${result.error}`)
          }
        }
      } catch (e) {
        hasErrors = true
        console.error(`\n❌ Exception while processing ${file}:`)
        console.error(e)
      }
    }
  } catch (e) {
    console.error('Could not read content directory')
    process.exit(1)
  }

  if (hasErrors) {
    console.error('\n💥 Validation failed!')
    process.exit(1)
  }

  console.log('\n✨ All cafés valid!')
}

async function create(id: string) {
  if (!id || !/^[a-z0-9-]+$/.test(id)) {
    console.error('Please provide a valid slug (lowercase alphanumeric with hyphens)')
    console.error('Usage: pnpm cafe:new <slug>')
    process.exit(1)
  }

  const filePath = path.join(process.cwd(), 'content', 'cafes', `${id}.json`)
  
  try {
    await fs.access(filePath)
    console.error(`File ${id}.json already exists!`)
    process.exit(1)
  } catch {
    const newCafe = {
      ...template,
      id,
      slug: id,
      addedAt: new Date().toISOString()
    }
    
    await fs.writeFile(filePath, JSON.stringify(newCafe, null, 2))
    console.log(`✨ Created new draft café at content/cafes/${id}.json`)
  }
}

const args = process.argv.slice(2)
const command = args[0]

if (command === 'validate') {
  validate()
} else if (command === 'new') {
  create(args[1])
} else {
  console.log('Available commands: validate, new <slug>')
}
