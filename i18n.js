/**
 * PivotCalc - Internationalization (AR / EN)
 */

export const translations = {
  ar: {
    appName: 'PivotCalc',
    appSubtitle: 'حاسبة البيفوت الزراعي',
    // Top bar
    ayahTitle: 'آية',
    aboutTitle: 'عن التطبيق',
    themeToggle: 'تبديل الوضع',
    langToggle: 'English',
    ideaTitle: 'فكرة البرنامج',
    // Ayah
    ayahText: `بسم الله الرحمن الرحيم
فَأَمَّا الزَّبَدُ فَيَذْهَبُ جُفَاءً ۖ وَأَمَّا مَا يَنفَعُ النَّاسَ فَيَمْكُثُ فِي الْأَرْضِ ۚ
صدق الله العظيم`,
    // Idea
    ideaText: `برنامج PivotCalc مصمم لحساب توزيع العجلات والمساحات في أنظمة الري المحوري (Pivot Irrigation) بدقة عالية اعتمادًا على معادلة بيرو.
يساعد المهندسين والمزارعين على:
• حساب عدد الجرر والعجلات تلقائيًا من مساحة البيفوت
• توزيع المساحات على كل عجلة بدقة
• حساب معدلات الزراعة والحصاد
• تخطيط احتياجات التقاوي والنقل
جميع المعادلات مبنية على معادلة بيرو المرجعية.`,
    // About
    aboutText: `PivotCalc هو تطبيق ويب احترافي (PWA) يعمل بالكامل دون اتصال بالإنترنت.

الإمكانيات:
• حساب نصف قطر البيفوت من المساحة (أو العكس) باستخدام معادلة بيرو
• توزيع تلقائي لعدد الجرر على العجلات حسب ماركة البيفوت
• حساب مساحة كل عجلة بدقة باستخدام الصيغة المثلثية (arcsin)
• دعم ماركات: زيماتيك، فالي، ويسترن، بالإضافة إلى الإدخال اليدوي
• حساب معدل الزراعة (طن/فدان) ومعدل الحصاد
• تخطيط احتياجات الزراعة والحصاد وعدد سيارات النقل

المعادلات الرئيسية:
1. نصف القطر R = √(المساحة × 4200 / π)
2. المساحة = π × R² / 4200
3. المساحة التراكمية عند مسافة D:
   θ = degrees(asin(D/R))
   H = (2×θ×المساحة/360) + (cos(θ)×R×D/4200)
4. مساحة العجلة = الفرق بين المساحات التراكمية

تصميم: مهندس محمد إبراهيم (فرمينو)`,
    // Main UI
    tabArea: 'حساب المساحة',
    tabPlanting: 'معدل الزراعة',
    tabHarvest: 'معدل الحصاد',
    tabNeeds: 'احتياجات الزراعة والحصاد',
    pivotArea: 'مساحة البيفوت (فدان)',
    totalSpans: 'إجمالي عدد الجرر',
    brandSelect: 'ماركة البيفوت',
    autoFill: 'ملء تلقائي',
    clear: 'مسح',
    wheelNum: 'رقم العجلة',
    spanCount: 'عدد الجرر',
    wheelArea: 'المساحة (فدان)',
    totalAreaLabel: 'المساحة الإجمالية',
    radiusLabel: 'نصف القطر (م)',
    numTowersLabel: 'عدد الأبراج',
    // Custom page
    customTitle: 'اختيار آخر - تعديل يدوي',
    customSpans: 'عدد الجرر',
    customLengths: 'طول البرج (م)',
    saveContinue: 'حفظ ومتابعة',
    back: 'رجوع',
    // Tab 2
    avgJumboWeight: 'متوسط وزن الجامبو (كجم)',
    totalJumbos: 'إجمالي عدد الجامبوهات',
    totalSeedTons: 'إجمالي كمية التقاوي (طن)',
    plantingRate: 'معدل الزراعة (طن/فدان)',
    // Tab 3
    harvestedJumbos: 'عدد الجامبوهات المحصودة',
    harvestRate: 'معدل الحصاد (جامبو/فدان)',
    // Tab 4
    plantingNeeds: 'احتياجات الزراعة',
    harvestNeeds: 'احتياجات الحصاد',
    avgWeightTons: 'متوسط وزن الجامبو (طن)',
    areaFeddan: 'المساحة (فدان)',
    rateTonsFeddan: 'معدل الزراعة (طن/فدان)',
    numJumbosNeeded: 'عدد الجامبوهات للمساحة',
    quantityTons: 'الكمية (طن)',
    rateJumbosFeddan: 'معدل الحصاد (جامبو/فدان)',
    truckCapacity: 'حمولة سيارة النقل (جامبو)',
    numTrucks: 'عدد السيارات',
    // Footer
    designedBy: 'تصميم مهندس محمد إبراهيم (فرمينو)',
    equationsNote: 'جميع المعادلات مبنية على معادلة بيرو',
    contact: 'التواصل',
    // Misc
    close: 'إغلاق',
    installApp: 'تثبيت التطبيق',
  },
  en: {
    appName: 'PivotCalc',
    appSubtitle: 'Agricultural Pivot Calculator',
    ayahTitle: 'Verse',
    aboutTitle: 'About',
    themeToggle: 'Toggle Theme',
    langToggle: 'العربية',
    ideaTitle: 'App Concept',
    ayahText: `In the name of Allah, the Most Gracious, the Most Merciful
As for the foam, it vanishes, cast off; but as for that which benefits the people, it remains on the earth.
Truly, Allah has spoken the truth.`,
    ideaText: `PivotCalc is designed to accurately calculate wheel distribution and areas in center-pivot irrigation systems using the Biro equation.
It helps engineers and farmers to:
• Automatically calculate spans and wheels from pivot area
• Accurately distribute areas across each wheel
• Calculate planting and harvest rates
• Plan seed and transport needs
All equations are based on the reference Biro equation.`,
    aboutText: `PivotCalc is a professional Progressive Web App (PWA) that works fully offline.

Features:
• Calculate pivot radius from area (or vice versa) using the Biro equation
• Automatic distribution of spans across wheels by pivot brand
• Precise area calculation per wheel using the trigonometric (arcsin) formula
• Support for brands: Zimmatic, Valley, Western, plus manual entry
• Planting rate (ton/feddan) and harvest rate calculations
• Planning of planting/harvest needs and number of transport trucks

Main equations:
1. Radius R = √(Area × 4200 / π)
2. Area = π × R² / 4200
3. Cumulative area at distance D:
   θ = degrees(asin(D/R))
   H = (2×θ×Area/360) + (cos(θ)×R×D/4200)
4. Wheel area = difference of cumulative areas

Design: Eng. Mohamed Ibrahim (Firmino)`,
    tabArea: 'Area Calculation',
    tabPlanting: 'Planting Rate',
    tabHarvest: 'Harvest Rate',
    tabNeeds: 'Planting & Harvest Needs',
    pivotArea: 'Pivot Area (feddan)',
    totalSpans: 'Total Spans',
    brandSelect: 'Pivot Brand',
    autoFill: 'Auto Fill',
    clear: 'Clear',
    wheelNum: 'Wheel #',
    spanCount: 'Spans',
    wheelArea: 'Area (feddan)',
    totalAreaLabel: 'Total Area',
    radiusLabel: 'Radius (m)',
    numTowersLabel: 'Number of Towers',
    customTitle: 'Custom Selection - Manual Edit',
    customSpans: 'Span Count',
    customLengths: 'Tower Length (m)',
    saveContinue: 'Save & Continue',
    back: 'Back',
    avgJumboWeight: 'Avg. Jumbo Weight (kg)',
    totalJumbos: 'Total Jumbos',
    totalSeedTons: 'Total Seed Quantity (ton)',
    plantingRate: 'Planting Rate (ton/feddan)',
    harvestedJumbos: 'Harvested Jumbos',
    harvestRate: 'Harvest Rate (jumbo/feddan)',
    plantingNeeds: 'Planting Needs',
    harvestNeeds: 'Harvest Needs',
    avgWeightTons: 'Avg. Jumbo Weight (ton)',
    areaFeddan: 'Area (feddan)',
    rateTonsFeddan: 'Planting Rate (ton/feddan)',
    numJumbosNeeded: 'Jumbos for Area',
    quantityTons: 'Quantity (ton)',
    rateJumbosFeddan: 'Harvest Rate (jumbo/feddan)',
    truckCapacity: 'Truck Capacity (jumbos)',
    numTrucks: 'Number of Trucks',
    designedBy: 'Designed by Eng. Mohamed Ibrahim (Firmino)',
    equationsNote: 'All equations based on the Biro equation',
    contact: 'Contact',
    close: 'Close',
    installApp: 'Install App',
  },
};

export function t(key, lang = 'ar') {
  return translations[lang]?.[key] ?? translations.ar[key] ?? key;
}
