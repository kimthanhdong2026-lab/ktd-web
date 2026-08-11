#!/usr/bin/env ts-node
/**
 * CLI tool to batch update product text fields (names, descriptions, specs)
 * Usage: npm run import:text -- --input ./products-data.xlsx [--dry-run]
 *
 * Excel Format:
 *   part_number, name_vi, name_en, short_desc_vi, short_desc_en, full_desc_vi, full_desc_en, series, origin, specs_json
 */

import fs from 'fs-extra'
import path from 'path'
import { program } from 'commander'
import chalk from 'chalk'
import { read, utils } from 'xlsx'
import { createSupabaseServerClient } from '../lib/supabase'

interface ProductRow {
  part_number: string
  name_vi?: string
  name_en?: string
  short_desc_vi?: string
  short_desc_en?: string
  full_desc_vi?: string
  full_desc_en?: string
  series?: string
  origin?: string
  specs_json?: string
  applications_json?: string
}

interface ImportOptions {
  input: string
  dryRun?: boolean
}

async function updateProducts(productRows: ProductRow[], options: ImportOptions) {
  const supabase = createSupabaseServerClient()
  const results = {
    updated: 0,
    skipped: 0,
    failed: 0,
    errors: [] as string[],
  }

  for (const row of productRows) {
    try {
      if (!row.part_number) {
        results.skipped++
        results.errors.push('Row missing part_number')
        continue
      }

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

      // Parse specs and applications
      let specsJson: Record<string, string> | null = null
      let applicationsJson: string[] | null = null

      if (row.specs_json) {
        try {
          specsJson = typeof row.specs_json === 'string' ? JSON.parse(row.specs_json) : row.specs_json
        } catch {
          results.errors.push(`Invalid specs JSON for ${row.part_number}`)
        }
      }

      if (row.applications_json) {
        try {
          applicationsJson = typeof row.applications_json === 'string'
            ? JSON.parse(row.applications_json)
            : row.applications_json
        } catch {
          results.errors.push(`Invalid applications JSON for ${row.part_number}`)
        }
      }

      const updateData = {
        ...(row.name_vi && { name_vi: row.name_vi }),
        ...(row.name_en && { name_en: row.name_en }),
        ...(row.short_desc_vi && { short_desc_vi: row.short_desc_vi }),
        ...(row.short_desc_en && { short_desc_en: row.short_desc_en }),
        ...(row.full_desc_vi && { full_desc_vi: row.full_desc_vi }),
        ...(row.full_desc_en && { full_desc_en: row.full_desc_en }),
        ...(row.series && { series_name: row.series }),
        ...(row.origin && { origin: row.origin }),
        ...(specsJson && { specs_json: specsJson }),
        ...(applicationsJson && { applications_json: applicationsJson }),
        updated_at: new Date().toISOString(),
      }

      if (Object.keys(updateData).length <= 1) {
        // Only updated_at, skip
        results.skipped++
        continue
      }

      if (options.dryRun) {
        console.log(chalk.green(`  ✓ ${row.part_number}: would update`))
        results.updated++
      } else {
        const { error } = await supabase
          .from('products')
          .update(updateData)
          .eq('id', product.id)

        if (error) {
          results.failed++
          results.errors.push(`Update failed for ${row.part_number}: ${error.message}`)
        } else {
          results.updated++
        }
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
    .option('-i, --input <path>', 'Input Excel file path')
    .option('--dry-run', 'Preview changes without updating')
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
    console.log(chalk.blue('📝 Importing product text data...'))
    console.log(chalk.gray(`   Input: ${inputPath}`))
    if (options.dryRun) console.log(chalk.yellow('   Mode: DRY RUN (preview only)'))
    console.log('')

    // Read Excel file
    const workbook = read(inputPath)
    const sheetName = workbook.SheetNames[0]
    if (!sheetName) {
      console.error(chalk.red('❌ No sheets found in Excel file'))
      process.exit(1)
    }

    const rows = utils.sheet_to_json<ProductRow>(workbook.Sheets[sheetName])

    if (rows.length === 0) {
      console.log(chalk.yellow('⚠️  No rows found in Excel file'))
      process.exit(0)
    }

    console.log(chalk.cyan(`Found ${rows.length} product rows`))
    console.log('')

    const results = await updateProducts(rows, options)

    console.log('')
    console.log(chalk.cyan('📊 Results:'))
    console.log(chalk.green(`   ✓ Updated: ${results.updated}`))
    console.log(chalk.yellow(`   ⚠ Skipped: ${results.skipped}`))
    console.log(chalk.red(`   ✗ Failed: ${results.failed}`))

    if (results.errors.length > 0) {
      console.log(chalk.red('\n❌ Errors:'))
      results.errors.slice(0, 10).forEach((err) => {
        console.log(chalk.red(`   • ${err}`))
      })
      if (results.errors.length > 10) {
        console.log(chalk.red(`   ... and ${results.errors.length - 10} more errors`))
      }
    }

    if (options.dryRun) {
      console.log(chalk.green('\n✅ Dry run complete. Run without --dry-run to apply changes.'))
    } else if (results.failed === 0) {
      console.log(chalk.green('\n✅ All products updated successfully!'))
    }

    process.exit(results.failed > 0 ? 1 : 0)
  } catch (error) {
    console.error(chalk.red('❌ Import failed:'), error)
    process.exit(1)
  }
}

main()
