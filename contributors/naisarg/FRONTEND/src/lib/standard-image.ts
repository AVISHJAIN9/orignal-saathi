/**
 * Standard Product Imagery Strategy
 * 
 * Maps standard categories and standard numbers to high-quality, editorial product
 * photography with warm cream backgrounds and navy blue borders.
 * Uses local project assets only. Never invents certification logos or marks.
 */

export function getStandardProductImage(
  standardNumber?: string,
  categoryKey?: string,
  title?: string,
): string {
  const num = standardNumber ? standardNumber.replace(/\s+/g, "").toUpperCase() : "";
  const t = title ? title.toLowerCase() : "";
  const cat = (categoryKey || "").toLowerCase();

  // 1. Household electrical appliances (IS 302)
  if (
    num.includes("302") ||
    cat === "appliances" ||
    (t.includes("appliance") && (t.includes("electrical") || t.includes("safety")))
  ) {
    return "/images/products/appliances.png";
  }

  // 2. Gold jewellery & hallmarking (IS 1417)
  if (
    num.includes("1417") ||
    cat === "gold" ||
    t.includes("gold") ||
    t.includes("jewellery") ||
    t.includes("hallmark")
  ) {
    return "/images/products/gold-jewellery.png";
  }

  // 3. Pressure cookers (IS 2347)
  if (
    num.includes("2347") ||
    cat === "cookers" ||
    t.includes("pressure cooker") ||
    t.includes("cooker")
  ) {
    return "/images/products/pressure-cooker.png";
  }

  // 4. Protective helmets (IS 4151)
  if (
    num.includes("4151") ||
    cat === "helmets" ||
    t.includes("helmet")
  ) {
    return "/images/products/helmets.jpg";
  }

  // 5. Packaged drinking / mineral water (IS 14543, IS 13428, IS 10500)
  if (
    num.includes("14543") ||
    num.includes("13428") ||
    num.includes("10500") ||
    cat === "water" ||
    cat === "water-res" ||
    t.includes("drinking water") ||
    t.includes("mineral water")
  ) {
    return "/images/products/water.jpg";
  }

  // 6. Safety of toys (IS 9873)
  if (
    num.includes("9873") ||
    cat === "toys" ||
    t.includes("toy")
  ) {
    return "/images/products/toys.jpg";
  }

  // Neutral editorial fallback for all other industrial/technical standards
  return "/images/products/standard-fallback.jpg";
}
