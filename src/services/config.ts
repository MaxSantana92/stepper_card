export const API_BASE_URL = "https://api.stepper-card.local";
export const API_TIMEOUT_MS = 8000;

// Manual testing aid for the demo simulator: flip to `true` to verify the
// error toast without touching the network. Has zero effect on the automated
// test suite — tests configure their own mock adapter per case and never read
// this flag.
export const SIMULATE_CARDS_FETCH_FAILURE = true;
