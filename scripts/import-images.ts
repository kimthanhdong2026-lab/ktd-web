#!/usr/bin/env ts-node
/**
 * CLI tool to batch upload product images to Supabase
 * Usage: npm run import:images -- --input ./images-batch1/ [--dry-run] [--force]
 *
 * Folder structure expected:
 *   📁 images-batch1/
 *     📁 122001/
 *       ├─ 01-front.jpg
 *       ├─ 02-side.jpg
 *       └─ ...
 *     📁 MF-INOXCUT/
 *       └─ ...
 */

import fs from 'fs-extra'
import path from 'path'
import sharp from 'sharp'
import { program } from 'commander'
import chalk from 'chalk'
import cliProgress from 'cli-progress'
import { createSupabaseServerClient } from '../lib/supabase'
import { formatFileSize } from '../lib/utils'

interface ImportOptions {
  input: string
  dryRun?: boolean
  force?: boolean
}

interface ImageFile {
  partNumber: string
  filePath: string
  fileName: string
  order: number
  altVi: string
}

const VIEW_LABELS_VI = [
  'Mặt trước',
  'Mặt bên',
  'Góc 45°',
  'Chi tiết cơ cấu',
  'Đang sử dụng',
]

async function optimizeImage(inputPath: string): Promise<{ buffer: Buffer; size: number }> {
  const metadata = await sharp(inputPath).metadata()

  if (!metadata.width || !metadata.height) {
    throw new Error(`Cannot read image dimensions from ${inputPath}`)
  }

  let transformer = sharp(inputPath)

  // Resize if needed (target: 1600×1200)
  if (metadata.width > 1600 || metadata.height > 1200) {
    transformer = transformer.resize(1600, 1200, {
      fit: 'inside',
      withoutEnlargement: true,
    })
  }

  // Convert to WebP for smaller size
  const buffer = await transformer.webp({ quality: 85 }).toBuffer()
  return { buffer, size: buffer.length }
}

async function collectImages(inputDir: string): Promise<ImageFile[]> {
  const images: ImageFile[] = []
  const folders = await fs.readdir(inputDir)

  for (const folder of folders) {
    const folderPath = path.join(inputDir, folder)
    const stat = await fs.stat(folderPath)

    if (!stat.isDirectory()) continue

    const partNumber = folder // e.g., "122001", "MF-INOXCUT"
    const files = await fs.readdir(folderPath)
    const imageFiles = files
      .filter((f) => /\.(jpg|jpeg|png|webp)$/i.test(f))
      .sort()

    imageFiles.forEach((fileName, index) => {
      images.push({
        partNumber,
        filePath: path.join(folderPath, fileName),
        fileName,
        order: index + 1,
        altVi: VIEW_LABELS_VI[index] || `Ảnh ${index + 1}`,
      })
    })
  }

  return images
}

async function uploadImages(images: ImageFile[], options: ImportOptions) {
  const supabase = createSupabaseServerClient()
  const progressBar = new cliProgress.SingleBar(
    {
      format: 'Progress |{bar}| {percentage}% || {value}/{total} images',
      barCompleteChar: '█',
      barIncompleteChar: '░',
    },
    cliProgress.Presets.shades_classic
  )

  if (!options.dryRun) {
    progressBar.start(images.length, 0)
  }

  const results = {
    uploaded: 0,
    skipped: 0,
    failed: 0,
    errors: [] as string[],
  }

  for (const image of images) {
    try {
      // Check if product exists
      const { data: product } = await supabase
        .from('products')
        .select('id')
        .eq('part_number', image.partNumber)
        .single()

      if (!product) {
        results.skipped++
        results.errors.push(`Product ${image.partNumber} not found`)
        if (!options.dryRun) progressBar.increment()
        continue
      }

      if (options.dryRun) {
        // Preview mode: just calculate size
        const fileSize = await fs.stat(image.filePath).then((s) => s.size)
        results.uploaded++
        console.log(
          chalk.green(`  ✓ ${image.partNumber}: ${image.fileName}`) +
          chalk.gray(` (${formatFileSize(fileSize)})`)
        )
      } else {
        // Upload mode: optimize, upload to Supabase
        const { buffer, size } = await optimizeImage(image.filePath)

        // Upload to Supabase Storage
        const fileName = `${image.partNumber}-${image.order}-${path.parse(image.fileName).name}.webp`
        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(`${image.partNumber}/${fileName}`, buffer, { upsert: options.force })

        if (uploadError) {
          results.failed++
          results.errors.push(`Upload failed: ${image.partNumber}/${fileName} - ${uploadError.message}`)
          progressBar.increment()
          continue
        }

        // Get public URL
        const { data } = supabase.storage.from('product-images').getPublicUrl(`${image.partNumber}/${fileName}`)
        const imageUrl = data.publicUrl

        // Check if image already exists
        const { data: existingImage } = await supabase
          .from('product_images')
          .select('id')
          .eq('product_id', product.id)
          .eq('order', image.order)
          .maybeSingle()

        if (existingImage && !options.force) {
          results.skipped++
          results.errors.push(`Image already exists: ${image.partNumber} order ${image.order}`)
          progressBar.increment()
          continue
        }

        // Insert or update image record
        if (existingImage) {
          const { error: updateError } = await supabase
            .from('product_images')
            .update({ image_url: imageUrl, alt_vi: image.altVi })
            .eq('id', existingImage.id)
          if (updateError) throw updateError
        } else {
          const { error: insertError } = await supabase.from('product_images').insert({
            product_id: product.id,
            image_url: imageUrl,
            order: image.order,
            alt_vi: image.altVi,
          })
          if (insertError) throw insertError
        }

        results.uploaded++
        progressBar.increment()
      }
    } catch (error) {
      results.failed++
      results.errors.push(`${image.partNumber}/${image.fileName}: ${error instanceof Error ? error.message : String(error)}`)
      if (!options.dryRun) progressBar.increment()
    }
  }

  if (!options.dryRun) {
    progressBar.stop()
  }

  return results
}

async function main() {
  program
    .option('-i, --input <path>', 'Input folder path')
    .option('--dry-run', 'Preview changes without uploading')
    .option('--force', 'Overwrite existing images')
    .parse()

  const options = program.opts<ImportOptions>()

  if (!options.input) {
    console.error(chalk.red('❌ Missing required option: --input'))
    process.exit(1)
  }

  const inputDir = path.resolve(options.input)
  const inputExists = await fs.pathExists(inputDir)

  if (!inputExists) {
    console.error(chalk.red(`❌ Input directory not found: ${inputDir}`))
    process.exit(1)
  }

  try {
    console.log(chalk.blue('🖼️  Importing product images...'))
    console.log(chalk.gray(`   Input: ${inputDir}`))
    if (options.dryRun) console.log(chalk.yellow('   Mode: DRY RUN (preview only)'))
    console.log('')

    const images = await collectImages(inputDir)
    if (images.length === 0) {
      console.log(chalk.yellow('⚠️  No images found in input directory'))
      process.exit(0)
    }

    // Group by part number for summary
    const grouped = new Map<string, typeof images>()
    images.forEach((img) => {
      if (!grouped.has(img.partNumber)) grouped.set(img.partNumber, [])
      grouped.get(img.partNumber)!.push(img)
    })

    console.log(chalk.cyan(`Found ${images.length} images in ${grouped.size} products:`))
    grouped.forEach((imgs, part) => {
      console.log(chalk.gray(`  • ${part}: ${imgs.length} image(s)`))
    })
    console.log('')

    const results = await uploadImages(images, options)

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
      console.log(chalk.green('\n✅ All images uploaded successfully!'))
    }

    process.exit(results.failed > 0 ? 1 : 0)
  } catch (error) {
    console.error(chalk.red('❌ Import failed:'), error)
    process.exit(1)
  }
}

main()
