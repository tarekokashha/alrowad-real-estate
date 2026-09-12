"use client";

/**
 * The price column in the units list.
 *
 * The field's own hint under the input promises «اكتب 1950000 والنظام هو اللي
 * هينسّقها» — and the site does format it. The admin list did not: it printed
 * 1340000, 2010000, 4350000 as bare runs of digits, in the one view whose
 * whole job is scanning prices against each other. Seven digits with no
 * grouping is where a client misreads 1,340,000 as 13,400,000, and on this
 * site a wrong price is not a cosmetic bug.
 *
 * Formatted exactly as lib/format.tsx does it, for one reason: the number the
 * owner checks in the panel and the number the buyer reads on the listing
 * have to be the same string, or checking it proves nothing.
 */

// Western digits, Arabic-Egyptian grouping. `ar-EG` alone would render
// ١٬٣٤٠٬٠٠٠ — the `-u-nu-latn` extension is what forces 1,340,000, which is
// what Egyptian banking and every property portal use on a price.
const EGP = new Intl.NumberFormat("ar-EG-u-nu-latn", {
  maximumFractionDigits: 0,
});

export function PriceCell({ cellData }: { cellData?: number | null }) {
  if (cellData === null || cellData === undefined || Number.isNaN(cellData)) {
    // An empty price is a real state — a draft mid-entry. Say so rather than
    // rendering an empty cell that reads as a rendering failure.
    return <span style={{ opacity: 0.5 }}>لم يُحدَّد</span>;
  }

  // Digits and the currency abbreviation are bidi-neutral: inside this RTL
  // table the pound sign drifts to the wrong end of the number without the
  // isolation. <bdi> is the semantic fix, not a CSS override browsers may
  // ignore.
  return <bdi>{EGP.format(cellData)} ج.م</bdi>;
}

export default PriceCell;
