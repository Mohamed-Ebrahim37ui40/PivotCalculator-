/**
 * PivotCalc - Biro Equation Calculations
 * All formulas derived from the reference Excel (معادلة بيرو)
 */

const PI = Math.PI;
const FEDDAN_FACTOR = 4200; // π R² / 4200 = feddan

/**
 * Radius (meters) from area in feddan
 * R = √(Area × 4200 / π)
 */
export function radiusFromArea(areaFeddan) {
  if (!areaFeddan || areaFeddan <= 0) return 0;
  return Math.sqrt((areaFeddan * FEDDAN_FACTOR) / PI);
}

/**
 * Area in feddan from radius in meters
 * A = π R² / 4200
 */
export function areaFromRadius(radiusM) {
  if (!radiusM || radiusM <= 0) return 0;
  return (PI * radiusM * radiusM) / FEDDAN_FACTOR;
}

/**
 * Cumulative area at distance D from center (Biro formula from Excel)
 * θ = degrees(asin(D / R))
 * H = (2 * θ * TotalArea / 360) + (cos(radians(θ)) * R * D / 4200)
 * Note: formula naturally maxes at TotalArea/2 when D = R (as in reference Excel)
 */
export function cumulativeAreaAtDistance(D, R, totalArea) {
  if (D <= 0 || R <= 0) return 0;
  const ratio = Math.min(Math.max(D / R, 0), 1);
  const thetaDeg = (Math.asin(ratio) * 180) / PI;
  const cosTheta = Math.cos((thetaDeg * PI) / 180);
  const H =
    (2 * thetaDeg * totalArea) / 360 + (cosTheta * R * D) / FEDDAN_FACTOR;
  return Math.max(0, H);
}

/**
 * Area of a ring/section between inner distance Di and outer Do
 */
export function sectionArea(Di, Do, R, totalArea) {
  const outer = cumulativeAreaAtDistance(Do, R, totalArea);
  const inner = cumulativeAreaAtDistance(Di, R, totalArea);
  return Math.max(0, outer - inner);
}

/**
 * Brand definitions (from attached reference image)
 * commonLength in meters, spanWidth default 1.8 m
 */
export const BRANDS = {
  zimmatic: {
    id: 'zimmatic',
    nameAr: 'زيماتيك (Zimmatic)',
    nameEn: 'Zimmatic',
    minLength: 41,
    maxLength: 64,
    commonLength: 54, // 178 ft
    spanWidth: 1.8,
    descriptionAr: 'معروفة بالمتانة والاعتماد عليها في المساحات الكبيرة',
    descriptionEn: 'Known for durability and reliability on large areas',
  },
  valley: {
    id: 'valley',
    nameAr: 'فالي (Valley)',
    nameEn: 'Valley',
    minLength: 38,
    maxLength: 64,
    commonLength: 52, // 170 ft
    spanWidth: 1.8,
    descriptionAr: 'مناسبة للظروف الصعبة والتضاريس المختلفة',
    descriptionEn: 'Suitable for difficult conditions and varied terrain',
  },
  western: {
    id: 'western',
    nameAr: 'ويسترن (Western)',
    nameEn: 'Western',
    minLength: 50,
    maxLength: 60,
    commonLength: 55,
    spanWidth: 1.8,
    descriptionAr: 'تصميم عملي واقتصادي مناسب للعديد من التطبيقات الزراعية',
    descriptionEn: 'Practical and economical design for many agricultural applications',
  },
  custom: {
    id: 'custom',
    nameAr: 'اختيار آخر',
    nameEn: 'Custom Selection',
    minLength: 30,
    maxLength: 70,
    commonLength: 54,
    spanWidth: 1.8,
    descriptionAr: 'إدخال يدوي لأطوال الأبراج وعدد الجرر',
    descriptionEn: 'Manual entry for tower lengths and span counts',
  },
};

/**
 * Calculate full pivot wheels data
 * @param {number} areaFeddan - Total pivot area in feddan
 * @param {number} towerLength - Length of each tower/span group in meters
 * @param {number} spanWidth - Width of one span (جرة) in meters (default 1.8)
 * @param {number[]|null} customSpans - Optional array of span counts per wheel (for custom mode)
 * @param {number[]|null} customLengths - Optional array of tower lengths (for custom mode)
 */
export function calculateWheels(
  areaFeddan,
  towerLength = 54,
  spanWidth = 1.8,
  customSpans = null,
  customLengths = null
) {
  if (!areaFeddan || areaFeddan <= 0) {
    return {
      radius: 0,
      totalSpans: 0,
      numTowers: 0,
      wheels: [],
      totalArea: 0,
    };
  }

  const R = radiusFromArea(areaFeddan);
  const totalSpansExact = R / spanWidth;
  const totalSpans = Math.round(totalSpansExact);

  // Number of full towers (excluding overhang/end)
  // Dynamic: radius / tower length
  let numTowers;
  let spansPerTower;
  let wheels = [];

  if (customSpans && customSpans.length > 0) {
    // Custom mode: use provided span counts
    numTowers = customSpans.length;
    let cumulativeSpans = 0;
    let prevDist = 0;

    for (let i = 0; i < numTowers; i++) {
      const spans = Math.max(0, Math.round(customSpans[i] || 0));
      const length =
        customLengths && customLengths[i]
          ? customLengths[i]
          : spans * spanWidth;
      const outerDist = Math.min(prevDist + length, R);
      const area = sectionArea(prevDist, outerDist, R, areaFeddan);

      wheels.push({
        index: i + 1,
        spans,
        length: +length.toFixed(2),
        innerDist: +prevDist.toFixed(2),
        outerDist: +outerDist.toFixed(2),
        area: +area.toFixed(3),
      });

      cumulativeSpans += spans;
      prevDist = outerDist;
    }
  } else {
    // Automatic distribution matching Excel reference
    // spans per tower ≈ towerLength / spanWidth (e.g. 54/1.8 = 30)
    spansPerTower = Math.round(towerLength / spanWidth);
    if (spansPerTower < 1) spansPerTower = 30;

    const fullTowers = Math.floor(totalSpans / spansPerTower);
    let remaining = totalSpans - fullTowers * spansPerTower;

    // Build span list: full groups + remainder (last ≤ 31 preferred)
    const spanList = [];
    for (let i = 0; i < fullTowers; i++) spanList.push(spansPerTower);
    if (remaining > 0) {
      if (remaining > 31 && spanList.length > 0) {
        // split remainder into an extra tower if too large
        spanList.push(Math.floor(remaining / 2));
        spanList.push(remaining - Math.floor(remaining / 2));
      } else {
        spanList.push(remaining);
      }
    }
    if (spanList.length === 0) spanList.push(totalSpans || 1);

    numTowers = spanList.length;
    let prevDist = 0;

    for (let i = 0; i < numTowers; i++) {
      const spans = spanList[i];
      const length = spans * spanWidth;
      let outerDist = prevDist + length;
      // Last tower extends to full radius
      if (i === numTowers - 1) outerDist = R;
      outerDist = Math.min(outerDist, R);

      const area = sectionArea(prevDist, outerDist, R, areaFeddan);

      wheels.push({
        index: i + 1,
        spans,
        length: +(outerDist - prevDist).toFixed(2),
        innerDist: +prevDist.toFixed(2),
        outerDist: +outerDist.toFixed(2),
        area: +area.toFixed(3),
      });

      prevDist = outerDist;
    }
  }

  // Ensure minimum 9 rows display-wise is handled in UI
  const calculatedTotalArea = wheels.reduce((s, w) => s + w.area, 0);

  return {
    radius: +R.toFixed(2),
    totalSpans,
    numTowers: wheels.length,
    wheels,
    totalArea: +calculatedTotalArea.toFixed(3),
    spanWidth,
    towerLength,
  };
}

/**
 * Planting rate calculations (Tab 2)
 */
export function calcPlantingRate(numJumbos, avgWeightKg, totalAreaFeddan) {
  const totalSeedTons = (numJumbos * avgWeightKg) / 1000;
  const ratePerFeddan =
    totalAreaFeddan > 0 ? totalSeedTons / totalAreaFeddan : 0;
  return {
    totalSeedTons: +totalSeedTons.toFixed(3),
    ratePerFeddan: +ratePerFeddan.toFixed(3),
  };
}

/**
 * Harvest rate (Tab 3)
 */
export function calcHarvestRate(harvestedJumbos, totalAreaFeddan) {
  const rate = totalAreaFeddan > 0 ? harvestedJumbos / totalAreaFeddan : 0;
  return +rate.toFixed(3);
}

/**
 * Planting needs (Tab 4 - part 1)
 */
export function calcPlantingNeeds(avgWeightTons, areaFeddan, rateTonsPerFeddan) {
  const numJumbos =
    avgWeightTons > 0 ? (rateTonsPerFeddan * areaFeddan) / avgWeightTons : 0;
  const quantityTons = numJumbos * avgWeightTons;
  return {
    numJumbos: +numJumbos.toFixed(2),
    quantityTons: +quantityTons.toFixed(3),
  };
}

/**
 * Harvest needs (Tab 4 - part 2)
 */
export function calcHarvestNeeds(rateJumbosPerFeddan, areaFeddan, truckCapacity) {
  const numJumbos = rateJumbosPerFeddan * areaFeddan;
  const numTrucks = truckCapacity > 0 ? numJumbos / truckCapacity : 0;
  return {
    numJumbos: +numJumbos.toFixed(2),
    numTrucks: +numTrucks.toFixed(2),
  };
}
