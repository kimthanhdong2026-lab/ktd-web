#!/usr/bin/env ts-node
/**
 * Seed Supabase database with initial data from prototype buildData()
 * Usage: npm run seed
 */

import { createSupabaseServerClient } from '../lib/supabase'
import chalk from 'chalk'

const BRANDS = [
  { slug: 'morrisflex', name_vi: 'Morrisflex', name_en: 'Morrisflex', origin: 'Quốc tế', desc_vi: 'Mũi mài hợp kim cacbua vonfram' },
  { slug: 'martor', name_vi: 'Martor', name_en: 'Martor', origin: 'Đức', desc_vi: 'Dao an toàn, GS certified' },
  { slug: 'helical', name_vi: 'Helical', name_en: 'Helical', origin: 'Mỹ', desc_vi: 'Dao phay ngón hiệu suất cao' },
  { slug: 'corehog', name_vi: 'Corehog', name_en: 'Corehog', origin: 'Mỹ', desc_vi: 'Công cụ CNC cho composite, CFRP' },
  { slug: 'ata', name_vi: 'ATA Air Tools', name_en: 'ATA Air Tools', origin: 'Quốc tế', desc_vi: 'Máy mài, chà nhám khí nén' },
  { slug: 'bevel-tools', name_vi: 'Bevel Tools', name_en: 'Bevel Tools', origin: 'Quốc tế', desc_vi: 'Máy vát mép & bo tròn kim loại' },
  { slug: 'lenzkes', name_vi: 'Lenzkes', name_en: 'Lenzkes', origin: 'Đức', desc_vi: 'Kẹp khuôn, kẹp gá máy công cụ' },
  { slug: 'technomark', name_vi: 'Technomark', name_en: 'Technomark', origin: 'Pháp', desc_vi: 'Máy khắc dấu laser & chấm peen' },
  { slug: 'tschorn', name_vi: 'TSChorn', name_en: 'TSChorn', origin: 'Đức', desc_vi: 'Thiết bị đo, đầu dò 3D' },
  { slug: 'rocklinizer', name_vi: 'Rocklinizer', name_en: 'Rocklinizer', origin: 'Mỹ', desc_vi: 'Máy phủ cứng bề mặt khuôn' },
  { slug: 'fiam', name_vi: 'Fiam', name_en: 'Fiam', origin: 'Ý', desc_vi: 'Tua vít điện công nghiệp' },
  { slug: 'buchem', name_vi: 'Buchem', name_en: 'Buchem', origin: 'Đức', desc_vi: 'Hóa chất vệ sinh khuôn mẫu' },
  { slug: 'gruetzner', name_vi: 'Gruetzner', name_en: 'Gruetzner', origin: 'Đức', desc_vi: 'Hệ thống bôi trơn tự động' },
  { slug: 'diprofil', name_vi: 'Diprofil', name_en: 'Diprofil', origin: 'Thụy Điển', desc_vi: 'Máy đánh bóng khuôn' },
  { slug: 'rtc', name_vi: 'RTC', name_en: 'RTC', origin: 'Quốc tế', desc_vi: 'Khớp nối' },
  { slug: 'tecna', name_vi: 'Tecna', name_en: 'Tecna', origin: 'Ý', desc_vi: 'Pa lăng cân bằng' },
  { slug: 'roscamat', name_vi: 'Roscamat', name_en: 'Roscamat', origin: 'Tây Ban Nha', desc_vi: 'Máy taro cánh tay (M2–M36)' },
  { slug: '3arm', name_vi: '3ARM', name_en: '3ARM', origin: 'Quốc tế', desc_vi: 'Cánh tay công thái học' },
  { slug: 'sloky', name_vi: 'Sloky', name_en: 'Sloky', origin: 'Đài Loan', desc_vi: 'Tua vít lực chính xác' },
  { slug: 'hartner', name_vi: 'Hartner', name_en: 'Hartner', origin: 'Đức', desc_vi: 'Dụng cụ cắt gọt chính xác' },
  { slug: 'karnasch', name_vi: 'Karnasch', name_en: 'Karnasch', origin: 'Đức', desc_vi: 'Dụng cụ cắt gọt, mũi khoan chuyên dụng' },
]

const CATEGORIES = [
  { slug: 'cat-got', name_vi: 'Dụng cụ cắt gọt', name_en: 'Cutting Tools' },
  { slug: 'khi-nen', name_vi: 'Dụng cụ khí nén', name_en: 'Pneumatic Tools' },
  { slug: 'an-toan', name_vi: 'Dụng cụ an toàn', name_en: 'Safety Tools' },
  { slug: 'do-kiem', name_vi: 'Thiết bị đo & kiểm tra', name_en: 'Measuring & Testing Equipment' },
  { slug: 'nang-ha', name_vi: 'Thiết bị nâng hạ & công thái học', name_en: 'Lifting & Ergonomic Equipment' },
  { slug: 'kep-ga', name_vi: 'Kẹp, gá & khuôn mẫu', name_en: 'Clamps & Fixtures' },
  { slug: 'danh-dau', name_vi: 'Đánh dấu & truy xuất', name_en: 'Marking & Traceability' },
  { slug: 'hoa-chat', name_vi: 'Hóa chất & bôi trơn công nghiệp', name_en: 'Industrial Chemicals & Lubricants' },
  { slug: 'siet-luc', name_vi: 'Siết lực & taro', name_en: 'Torque & Threading' },
]

async function main() {
  const supabase = createSupabaseServerClient()

  try {
    console.log(chalk.blue('🌱 Seeding Supabase...'))

    // Clear existing data
    console.log(chalk.yellow('  Clearing existing data...'))
    await supabase.from('categories').delete().neq('id', 0)
    await supabase.from('brands').delete().neq('id', 0)

    // Seed categories
    console.log(chalk.yellow('  Inserting categories...'))
    const { error: catError } = await supabase
      .from('categories')
      .insert(
        CATEGORIES.map((c, idx) => ({
          ...c,
          icon: ['🔧', '💨', '🛡️', '📐', '🏗️', '🗜️', '🔖', '🧪', '⚙️'][idx],
          sort_order: idx,
        }))
      )

    if (catError) throw catError

    // Seed brands
    console.log(chalk.yellow('  Inserting brands...'))
    const { error: brandError } = await supabase
      .from('brands')
      .insert(
        BRANDS.map((b, idx) => ({
          ...b,
          sort_order: idx,
        }))
      )

    if (brandError) throw brandError

    console.log(chalk.green('✅ Seeding complete!'))
    console.log(chalk.gray(`   - ${CATEGORIES.length} categories added`))
    console.log(chalk.gray(`   - ${BRANDS.length} brands added`))
    process.exit(0)
  } catch (error) {
    console.error(chalk.red('❌ Seed failed:'), error)
    process.exit(1)
  }
}

main()
