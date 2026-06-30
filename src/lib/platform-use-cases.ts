export const PLATFORM_USE_CASES = [
  {
    id: "restaurants",
    title: "Restaurants and nights out",
    description:
      "Tell Mr. Red what you like and what you are willing to spend. Get a short list with a clear pick and why, not fifty tabs of reviews.",
    image: "/platform/restaurants.jpg",
    imageAlt: "Warm restaurant table ready for dinner",
    signal: "green" as const,
  },
  {
    id: "travel",
    title: "Hotels and flights",
    description:
      "Compare options on your budget. Mr. Red weighs location, value, and fine print so you book once and move on.",
    image: "/platform/travel.jpg",
    imageAlt: "Hotel resort with pool at sunset",
    signal: "amber" as const,
  },
  {
    id: "business-research",
    title: "Business and investment research",
    description:
      "Before you wire money or sign a term sheet, get a deep read on the company, the market, and what your deck might be missing.",
    image: "/platform/business-research.jpg",
    imageAlt: "Analyst reviewing business charts on a laptop",
    signal: "red" as const,
  },
  {
    id: "vendor",
    title: "Vendor and supplier checks",
    description:
      "Stress test pitches and contracts. Mr. Red pulls facts the sales deck skipped and flags what needs a second look.",
    image: "/platform/vendor.jpg",
    imageAlt: "Warehouse logistics and supply chain operations",
    signal: "amber" as const,
  },
  {
    id: "people",
    title: "People you hire or partner with",
    description:
      "Vet hires, contractors, and partners. References, patterns, and trust signals in plain language before you commit.",
    image: "/platform/people.jpg",
    imageAlt: "Team collaborating in a modern office",
    signal: "green" as const,
  },
  {
    id: "investment",
    title: "Products and purchases",
    description:
      "From enterprise software to gear for home, get spec level research and a single verdict on whether it is worth your money.",
    image: "/platform/investment.jpg",
    imageAlt: "Financial charts on a trading display",
    signal: "green" as const,
  },
] as const;
