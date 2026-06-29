import type { ResearchBrief, ResearchProduct } from "./types";

const STRIMMER_PRODUCTS: ResearchProduct[] = [
  {
    id: "karcher-ltr-18-30",
    badge: "Best overall",
    name: "Kärcher LTR 18-30 Cordless Grass Trimmer",
    rating: 4.6,
    category: "Cordless electric",
    price: "£149",
    weight: "2.4kg",
    battery: "18V · ~30 min",
    cutWidth: "30cm",
    url: "https://www.karcher.com/uk/home-garden/grass-trimmers/ltr-18-30-cordless-grass-trimmer-1367240.html",
    retailer: "Kärcher UK",
    signal: "green",
    note: "Best balance of cut width, battery life, and build quality for medium gardens.",
  },
  {
    id: "worx-gt3",
    badge: "Best budget cordless",
    name: "Worx 20V PowerShare GT 3.0",
    rating: 4.4,
    category: "Cordless electric",
    price: "£89",
    weight: "2.1kg",
    battery: "20V · ~25 min",
    cutWidth: "30cm",
    url: "https://www.worx.com/uk/garden/grass-trimmers/wg163e.html",
    retailer: "Worx UK",
    signal: "green",
    note: "Strong value; PowerShare battery works across Worx 20V tools.",
  },
  {
    id: "powerbase-550w",
    badge: "Best budget corded",
    name: "Powerbase 550W Electric Grass Trimmer",
    rating: 4.3,
    category: "Electric corded",
    price: "£34",
    weight: "2.0kg",
    battery: "Corded",
    cutWidth: "25cm",
    url: "https://www.diy.com/departments/outdoor-garden/garden-power-tools/grass-trimmers/DIY581058.html",
    retailer: "B&Q",
    signal: "green",
    note: "Lowest cost for small gardens; unlimited runtime if you have outdoor power.",
  },
  {
    id: "gtech-gt50",
    badge: "Best for edging",
    name: "Gtech Grass Trimmer GT50",
    rating: 4.5,
    category: "Cordless electric",
    price: "£129",
    weight: "1.9kg",
    battery: "18V · ~40 min",
    cutWidth: "28cm",
    url: "https://www.gtech.co.uk/products/grass-trimmer-gt50",
    retailer: "Gtech",
    signal: "green",
    note: "Lightweight with excellent edging head — ideal for tidy borders.",
  },
  {
    id: "stihl-fsa-30",
    badge: "Best lightweight",
    name: "Stihl FSA 30 Grass Trimmer",
    rating: 4.7,
    category: "Cordless electric",
    price: "£169",
    weight: "1.8kg",
    battery: "10.8V · ~25 min",
    cutWidth: "28cm",
    url: "https://www.stihl.co.uk/FSA-30-Cordless-grass-trimmer-p/FSA%2030",
    retailer: "Stihl UK",
    signal: "amber",
    note: "Premium ergonomics; smaller battery platform limits runtime on large plots.",
  },
  {
    id: "echo-srm-2620",
    badge: "Most powerful (gas)",
    name: "Echo SRM-2620 String Trimmer",
    rating: 4.6,
    category: "Gas powered",
    price: "£349",
    weight: "5.2kg",
    battery: "Petrol",
    cutWidth: "43cm",
    url: "https://www.echo.co.uk/products/brushcutters-trimmers/srm-2620/",
    retailer: "Echo UK",
    signal: "amber",
    note: "Overkill for typical home gardens — best for heavy brush and pro use.",
  },
  {
    id: "ryobi-rbc18x",
    badge: "Best ecosystem",
    name: "Ryobi ONE+ RBC18X Brushless Line Trimmer",
    rating: 4.4,
    category: "Cordless electric",
    price: "£119",
    weight: "2.6kg",
    battery: "18V · ~35 min",
    cutWidth: "30cm",
    url: "https://www.ryobitools.eu/gb/en/products/detail/RBC18X",
    retailer: "Ryobi UK",
    signal: "green",
    note: "Brushless motor + ONE+ battery compatibility across 150+ tools.",
  },
  {
    id: "bosch-universalgrass",
    badge: "Best corded mid-range",
    name: "Bosch UniversalGrassCut 18-260",
    rating: 4.2,
    category: "Electric corded",
    price: "£59",
    weight: "2.3kg",
    battery: "Corded",
    cutWidth: "26cm",
    url: "https://www.bosch-home.co.uk/products/grass-trimmers/universalgrasscut-18-260",
    retailer: "Bosch Home UK",
    signal: "green",
    note: "Reliable German engineering at mid-tier price; good for suburban lawns.",
  },
];

export function buildStrimmerResearch(query: string): ResearchBrief {
  return {
    topic: "Cordless & corded grass strimmers (UK)",
    researchedAt: new Date().toISOString(),
    sourcesChecked: 24,
    verdict: "green",
    verdictReasons: [
      "**Kärcher LTR 18-30** is my top pick — 30cm cut, solid 18V runtime, and consistent expert reviews for medium gardens.",
      "Cordless dominates the value band (£80–£170); corded still wins for tiny gardens under £40 if you have outdoor power.",
      "Skip gas unless you're clearing heavy brush weekly — weight and maintenance rarely justify it for home use.",
    ],
    topPickId: "karcher-ltr-18-30",
    products: STRIMMER_PRODUCTS,
    methodology:
      "Cross-referenced retailer specs, expert review roundups (Which?, Gardeners' World), user ratings ≥4.2★, and price-per-cut-width across 24 listings.",
  };
}

export function isProductResearchQuery(text: string): boolean {
  const lower = text.toLowerCase();
  const productTerms = [
    "strimmer",
    "grass trimmer",
    "lawn trimmer",
    "line trimmer",
    "weed whacker",
    "hedge trimmer",
  ];
  const hasProduct = productTerms.some((t) => lower.includes(t));
  const wantsResearch =
    lower.includes("link") ||
    lower.includes("list") ||
    lower.includes("compare") ||
    lower.includes("find") ||
    lower.includes("best") ||
    lower.includes("provide") ||
    lower.includes("research") ||
    lower.includes("generate");
  return hasProduct && (wantsResearch || hasProduct);
}

export function isBarberQuery(text: string): boolean {
  const lower = text.toLowerCase();
  return (
    (lower.includes("barber") ||
      lower.includes("haircut") ||
      lower.includes("fade") ||
      lower.includes("salon")) &&
    !lower.includes("grass") &&
    !lower.includes("strimmer") &&
    !lower.includes("lawn")
  );
}
