#!/usr/bin/env ts-node
/**
 * CLI tool to batch upload product catalog PDFs
 * Usage: npm run import:catalogs -- --input ./catalogs.csv [--dry-run]
 *
 * CSV Format:
 *   part_number,brand,series,pdf_file,pdf_size_mb,pages
 *   122001,martor,SECUPRO,./catalogs/SECUPRO-Series.pdf,4.2,18
 */

import fs from 'fs-extra'
import path from 'path'
import { program } from 'commander'
import chalk from 'chalk'
import { parse } from 'csv-parse/sync'
import { createSupabaseServerClient } from '../lib/supabase'
import { formatFileSize } from '../lib/utils'

interface CatalogRow {
  part_number: string
  brand: string
  series: string
  pdf_file: string
  pdf_size_mb?: string
  pages?: string
}

interface ImportOptions {
  input: string
  dryRun?: boolean
  force?: boolean
}

async function uploadCatalogs(catalogRows: CatalogRow[], options: ImportOptions) {
  const supabase = createSupabaseServerClient()
  const results = {
    uploaded: 0,
    skipped: 0,
    failed: 0,
    errors: [] as string[],
  }

  for (const row of catalogRows) {
    try {
      // Check if product exists
      const { data: product } = await supabase
        .from('products')
        .select('id')
        .eq('part_number', row.part_number)
        .single()

      if (!product) {
        results.skipped++
        results.errors.push(`Product ${row.part_number} not found`)
        continue
      }

      const pdfPath = path.resolve(row.pdf_file)
      const pdfExists = await fs.pathExists(pdfPath)

      if (!pdfExists) {
        results.failed++
        results.errors.push(`PDF file not found: ${pdfPath}`)
        continue
      }

      const pdfStats = await fs.stat(pdfPath)
      const fileName = `${row.brand}-${row.series}.pdf`

      if (options.dryRun) {
        results.uploaded++
        console.log(
          chalk.green(`  ✓ ${row.part_number}: ${fileName}`) +
          chalk.gray(` (${formatFileSize(pdfStats.size)})`)
        )
      } else {
        // Upload to Supabase Storage
        const buffer = await fs.readFile(pdfPath)
        const { error: uploadError } = await supabase.storage
          .from('catalogs')
          .upload(`${row.brand}/${fileName}`, buffer, { upsert: options.force })

        if (uploadError) {
          results.failed++
          results.errors.push(`Upload failed: ${fileName} - ${uploadError.message}`)
          continue
        }

        // Get public URL
        const { data } = supabase.storage.from('catalogs').getPublicUrl(`${row.brand}/${fileName}`)
        const fileUrl = data.publicUrl

        // Check if catalog already exists
        const { data: existingCatalog } = await supabase
          .from('catalog_pdfs')
          .select('id')
          .eq('product_id', product.id)
          .maybeSingle()

        // Insert or update catalog record
        if (existingCatalog && !options.force) {
          results.skipped++
          results.errors.push(`Catalog already exists for product ${row.part_number}`)
          continue
        }

        if (existingCatalog) {
          const { error: updateError } = await supabase
            .from('catalog_pdfs')
            .update({
              file_url: fileUrl,
              file_name: fileName,
              file_size_bytes: pdfStats.size,
              page_count: parseInt(row.pages || '0') || null,
            })
            .eq('id', existingCatalog.id)
          if (updateError) throw updateError
        } else {
          const { error: insertError } = await supabase.from('catalog_pdfs').insert({
            product_id: product.id,
            file_url: fileUrl,
            file_name: fileName,
            file_size_bytes: pdfStats.size,
            page_count: parseInt(row.pages || '0') || null,
          })
          if (insertError) throw insertError
        }

        results.uploaded++
      }
    } catch (error) {
      results.failed++
      results.errors.push(`${row.part_number}: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  return results
}

async function main() {
  program
    .option('-i, --input <path>', 'Input CSV file path')
    .option('--dry-run', 'Preview changes without uploading')
    .option('--force', 'Overwrite existing catalogs')
    .parse()

  const options = program.opts<ImportOptions>()

  if (!options.input) {
    console.error(chalk.red('❌ Missing required option: --input'))
    process.exit(1)
  }

  const inputPath = path.resolve(options.input)
  const fileExists = await fs.pathExists(inputPath)

  if (!fileExists) {
    console.error(chalk.red(`❌ Input file not found: ${inputPath}`))
    process.exit(1)
  }

  try {
    console.log(chalk.blue('📄 Importing catalog PDFs...'))
    console.log(chalk.gray(`   Input: ${inputPath}`))
    if (options.dryRun) console.log(chalk.yellow('   Mode: DRY RUN (preview only)'))
    console.log('')

    const csvContent = await fs.readFile(inputPath, 'utf-8')
    const rows = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    }) as CatalogRow[]

    if (rows.length === 0) {
      console.log(chalk.yellow('⚠️  No rows found in CSV file'))
      process.exit(0)
    }

    console.log(chalk.cyan(`Found ${rows.length} catalog entries`))
    console.log('')

    const results = await uploadCatalogs(rows, options)

    console.log('')
    console.log(chalk.cyan('📊 Results:'))
    console.log(chalk.green(`   ✓ Uploaded: ${results.uploaded}`))
    console.log(chalk.yellow(`   ⚠ Skipped: ${results.skipped}`))
    console.log(chalk.red(`   ✗ Failed: ${results.failed}`))

    if (results.errors.length > 0) {
      console.log(chalk.red('\n❌ Errors:'))
      results.errors.forEach((err) => {
        console.log(chalk.red(`   • ${err}`))
      })
    }

    if (options.dryRun) {
      console.log(chalk.green('\n✅ Dry run complete. Run without --dry-run to upload.'))
    } else if (results.failed === 0) {
      console.log(chalk.green('\n✅ All catalogs uploaded successfully!'))
    }

    process.exit(results.failed > 0 ? 1 : 0)
  } catch (error) {
    console.error(chalk.red('❌ Import failed:'), error)
    process.exit(1)
  }
}

main()
