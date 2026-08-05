import { parseArgs } from 'node:util'
import { getCafes } from '../src/lib/content/load'

async function checkEmbeds() {
  const cafes = getCafes()
  let hasErrors = false
  
  console.log(`Checking embeds for ${cafes.length} cafes...`)

  for (const cafe of cafes) {
    if (cafe.media && cafe.media.length > 0) {
      for (const ig of cafe.media) {
        if (!ig.url.includes('instagram.com')) {
          console.error(`❌ Cafe ${cafe.id} has invalid media URL: ${ig.url}`)
          hasErrors = true
        }
      }
    }
  }

  if (hasErrors) {
    process.exit(1)
  }
  
  console.log('✅ All embeds look good!')
}

async function run() {
  const { positionals } = parseArgs({
    args: process.argv.slice(2),
    allowPositionals: true,
  })

  const command = positionals[0]

  if (command === 'check-embeds') {
    await checkEmbeds()
  } else {
    console.error('Unknown command')
    process.exit(1)
  }
}

run().catch((err: any) => {
  console.error(err)
  process.exit(1)
})
