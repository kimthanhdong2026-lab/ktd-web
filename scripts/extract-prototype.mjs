// Pulls the readable design source out of a Claude Design "standalone" export.
// The export inlines every asset as a JSON map of uuid -> {mime, compressed, data(base64)};
// the page template itself is stored under the __bundler/template script tag.
import { readFileSync, writeFileSync } from 'fs'
import { gunzipSync } from 'zlib'

const [input, outDir] = process.argv.slice(2)
const html = readFileSync(input, 'utf8')

function scriptBody(type) {
  const open = `<script type="${type}">`
  const i = html.indexOf(open)
  if (i < 0) return null
  const start = i + open.length
  const end = html.indexOf('</script>', start)
  return html.slice(start, end)
}

// 1. The page template (HTML markup of the design)
const tpl = scriptBody('__bundler/template')
if (tpl) {
  let text = tpl
  try {
    text = JSON.parse(tpl)
  } catch {
    /* already plain */
  }
  writeFileSync(`${outDir}/template.html`, text)
  console.log('template.html', text.length, 'chars')
}

// 2. Every embedded JS asset, gunzipped
const res = scriptBody('__bundler/ext_resources')
if (res) {
  const map = JSON.parse(res)
  let n = 0
  for (const [uuid, entry] of Object.entries(map)) {
    if (!String(entry.mime).includes('javascript')) continue
    const raw = Buffer.from(entry.data, 'base64')
    const code = entry.compressed ? gunzipSync(raw).toString('utf8') : raw.toString('utf8')
    writeFileSync(`${outDir}/js-${String(n).padStart(2, '0')}.js`, code)
    console.log(`js-${String(n).padStart(2, '0')}.js`, code.length, 'chars', uuid)
    n++
  }
}
