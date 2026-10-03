import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/ProductCard";
import { BrandGroupFilter } from "@/components/brands/BrandGroupFilter";
import { NhanXuatXu } from "@/components/brands/NhanXuatXu";
import {
  IconCheck,
  IconGear,
  IconLayers,
  IconShield,
} from "@/components/Icons";
import {
  getBrandCategories,
  getBrandPage,
  getBrandPages,
  browseProducts,
} from "@/lib/db";
import {
  DEFAULT_LOCALE,
  LOCALES,
  dict,
  href,
  isLocale,
  type Locale,
} from "@/lib/i18n";

interface PageProps {
  params: { slug: string; lang: string };
  searchParams?: { nhom?: string };
}

export async function generateStaticParams() {
  const brands = await getBrandPages();
  return LOCALES.flatMap((lang) => brands.map((b) => ({ lang, slug: b.slug })));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const lang: Locale = isLocale(params.lang) ? params.lang : DEFAULT_LOCALE;
  const b = await getBrandPage(params.slug, lang);
  if (!b) return {};
  return {
    title: `${b.name} — ${dict(lang).brandPage.from(b.origin)}`,
    description: b.intro.slice(0, 160),
    alternates: {
      canonical: href(`/thuong-hieu/${params.slug}`, lang),
      languages: {
        "vi-VN": `/thuong-hieu/${params.slug}`,
        "en-US": `/en/thuong-hieu/${params.slug}`,
      },
    },
  };
}

/** Một trong ba khối nội dung: icon tròn, tiêu đề, danh sách có dấu tích. */
function KhoiDanhSach({
  Icon,
  tieuDe,
  muc,
}: {
  Icon: (p: { className?: string }) => JSX.Element;
  tieuDe: string;
  muc: string[];
}) {
  if (!muc.length) return null;
  return (
    <div className="rounded-2xl border border-hairline bg-white p-6 md:p-7">
      <div className="mb-5 flex items-center gap-3">
        <span className="flex h-11 w-11 flex-none items-center justify-center rounded-xl bg-ktd-50 text-ktd-600">
          <Icon className="h-6 w-6" />
        </span>
        <h2 className="font-display text-[18px] font-bold text-ktd-600">
          {tieuDe}
        </h2>
      </div>
      <ul className="space-y-3">
        {muc.map((m) => (
          <li
            key={m}
            className="flex gap-3 text-[16px] leading-relaxed text-ink-700"
          >
            <IconCheck className="mt-[5px] h-[15px] w-[15px] flex-none text-ktd-600" />
            <span>{m}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default async function BrandPage({ params, searchParams }: PageProps) {
  const lang: Locale = isLocale(params.lang) ? params.lang : DEFAULT_LOCALE;
  const t = dict(lang);
  const path = (p: string) => href(p, lang);

  const b = await getBrandPage(params.slug, lang);
  if (!b) notFound();

  // Chỉ những nhóm hãng này thực sự có hàng — yêu cầu của Mr Nam. Quan hệ
  // hãng ↔ nhóm không ai khai báo, nó rơi ra từ việc gắn sản phẩm.
  const nhoms = await getBrandCategories(b.slug, lang);
  const dangChon =
    searchParams?.nhom && nhoms.some((n) => n.slug === searchParams.nhom)
      ? searchParams.nhom
      : undefined;

  // Chưa chọn nhóm nào thì hiện toàn bộ sản phẩm của hãng.
  const kq = await browseProducts({
    brands: [b.slug],
    categories: dangChon ? [dangChon] : [],
    limit: 200,
    lang,
  });

  return (
    /*
     * Cả trang nằm trên MỘT nền sáng liền mạch.
     *
     * Bản trước cắt trang thành ba dải nền khác hẳn nhau — xanh đậm, trắng, xám
     * — nên đọc tới đâu lại vấp một đường ranh giới tới đó. Bản demo của Ban
     * Giám đốc là một dải sáng chạy suốt từ trái sang phải, nên ở đây dùng đúng
     * một nền và phân tách các phần bằng khoảng trắng với thẻ trắng, không bằng
     * cách đổi màu nền.
     */
    <div className="bg-white">
      {/*
       * PHẦN ĐẦU — một dải liền, chữ bên trái loang dần sang ảnh bên phải.
       *
       * Ảnh tràn hẳn ra mép phải màn hình chứ KHÔNG nằm trong thẻ bo góc. Bản
       * trước đặt ảnh trong thẻ nên giữa đoạn giới thiệu và ảnh có một khoảng
       * trống rồi mới tới viền bo — nhìn ra hai mảnh rời ghép lại, đúng cái Ban
       * Giám đốc chê. Ở đây ảnh phủ kín nửa phải, mép trái loang dần về nền.
       *
       * Bề rộng: ảnh chiếm 52% MÀN HÌNH, cột chữ chiếm 44% KHUNG NỘI DUNG (tối
       * đa 1360px). Khung hẹp hơn màn hình nên hai phần không bao giờ chồng lên
       * nhau, kể cả ở màn 1920px.
       */}
      <section className="relative overflow-hidden bg-[#EEF4F9]">
        {b.banner && (
          <div className="absolute inset-y-0 right-0 hidden w-[52%] nav:block">
            <Image
              src={b.banner}
              alt=""
              width={1200}
              height={900}
              priority
              className="h-full w-full object-cover object-center"
            />
            {/* Vệt loang: cắt thẳng thì mép trái ảnh thành một đường kẻ dọc rất
                gắt ngay cạnh đoạn chữ. */}
            <span
              aria-hidden="true"
              className="absolute inset-y-0 left-0 w-44 bg-gradient-to-r from-[#EEF4F9] via-[#EEF4F9]/70 to-transparent"
            />
          </div>
        )}

        {/* pt nhỏ và nav sát xuống: logo được đẩy lên gần đầu dải, không còn
            lơ lửng giữa khoảng trống như bản trước. */}
        <div className="container-ktd relative pb-10 pt-4 md:pb-14">
          <nav className="mb-4 text-[14px] text-ink-600">
            <Link href={path("/thuong-hieu")} className="hover:text-ktd-600">
              {t.brandPage.navLabel}
            </Link>
            <span className="mx-2 text-ink-300">/</span>
            <span className="font-medium text-ink-900">{b.name}</span>
          </nav>

          <div className="nav:max-w-[44%]">
            {/* Dùng logo GỐC trong public/ chứ không dùng bản trên kho ảnh.
                Bản trên kho đã đóng vào khung 320×128 cho dải logo trang chủ
                đều nhau — ở đây nó thành hình nhỏ xíu giữa nhiều khoảng trắng.
                Bản gốc giữ đúng tỉ lệ thật của từng logo. */}
            {b.logo ? (
              <Image
                src={`/assets/brands/${b.slug}.webp`}
                alt={b.name}
                width={320}
                height={320}
                priority
                className="mb-5 h-[72px] w-auto max-w-[300px] object-contain object-left md:h-[88px] md:max-w-[430px]"
              />
            ) : (
              <h1 className="mb-5 font-display text-h1 text-ink-900">
                {b.name}
              </h1>
            )}

            <div className="mb-5">
              <NhanXuatXu xuatXu={b.origin} nhan={t.brandPage.from(b.origin)} />
            </div>

            <p className="text-[17px] leading-[1.75] text-ink-700">{b.intro}</p>
          </div>
        </div>

        {/* Màn hẹp: ảnh xuống dưới chữ, vẫn tràn hết bề ngang. */}
        {b.banner && (
          <Image
            src={b.banner}
            alt=""
            width={1200}
            height={900}
            className="h-[240px] w-full object-cover sm:h-[320px] nav:hidden"
          />
        )}
      </section>

      {/*
       * Từ đây xuống mới là dải chuyển màu.
       *
       * Trước đây cả trang dùng một dải chuyển màu chạy từ đỉnh, nên vệt loang
       * ở mép trái ảnh — vốn tô một màu phẳng #EEF4F9 — lệch dần so với nền
       * phía sau và để lộ một vệt dọc. Nay phần đầu dùng đúng màu phẳng đó,
       * dải chuyển màu bắt đầu ngay dưới và cũng từ #EEF4F9 nên nối liền.
       */}
      <div className="bg-gradient-to-b from-[#EEF4F9] via-surface to-white">
        {/* ----------------------------------------------------- ba khối nội dung */}
        <section className="container-ktd py-12 md:py-14">
          <div className="grid gap-5 md:grid-cols-3">
            <KhoiDanhSach
              Icon={IconLayers}
              tieuDe={t.brandPage.dongSp}
              muc={b.dongSp}
            />
            <KhoiDanhSach
              Icon={IconShield}
              tieuDe={t.brandPage.noiBat}
              muc={b.noiBat}
            />
            <KhoiDanhSach
              Icon={IconGear}
              tieuDe={t.brandPage.ungDung}
              muc={b.ungDung}
            />
          </div>
        </section>

        {/* -------------------------------------------------------------- sản phẩm */}
        <section className="container-ktd pb-16 md:pb-20">
          <h2 className="mb-1.5 font-display text-h2 text-ktd-600">
            {t.brandPage.productsHeading(b.name)}
          </h2>
          {/* Gạch chân ngắn dưới tiêu đề, như bản demo */}
          <span
            aria-hidden="true"
            className="mb-5 block h-[3px] w-20 rounded bg-ktd-600"
          />
          <p className="mb-7 text-[16px] text-ink-600">
            {t.brandPage.count(kq.total)}
          </p>

          {nhoms.length > 1 && (
            <BrandGroupFilter
              nhoms={nhoms}
              dangChon={dangChon}
              nhanTatCa={t.brandPage.filterAll}
              nhan={t.brandPage.filterLabel}
            />
          )}

          {kq.items.length ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {kq.items.map((p) => (
                <ProductCard key={p.part} product={p} />
              ))}
            </div>
          ) : (
            <p className="rounded-2xl border border-hairline bg-white px-5 py-16 text-center text-[16px] text-ink-600">
              {t.brandPage.empty}
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
