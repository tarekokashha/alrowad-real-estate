import { getUnits, getSoldRecords, getInventorySource } from "../lib/cms";

/** Read-only check that the pages would see CMS data, not the design set. */
const source = await getInventorySource();
const units = await getUnits();
const sold = await getSoldRecords();

console.log("inventory source :", source);
console.log("units returned   :", units.length);
console.log("sold returned    :", sold.length);
console.log("");
for (const u of units.slice(0, 3)) {
  console.log(`  ${u.code}  ${u.titleAr} — ${u.areaAr}`);
  console.log(`     price ${u.price}  size ${u.size}  legal ${u.legalStatus}`);
  console.log(`     priceChecked ${u.priceCheckedAr}   visited ${u.visitedAr}`);
  console.log(`     image ${u.image}`);
}
process.exit(0);
