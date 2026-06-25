/** Set DEMO_DATA=true in .env.local to load presentation sample data */
export function isDemoDataEnabled() {
  return process.env.DEMO_DATA === "true";
}
