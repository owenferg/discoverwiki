mapboxgl.accessToken = "pk.eyJ1Ijoib3dlbmZlcmciLCJhIjoiY21uaHp6a3Z5MDg5NjJwb2RrdTVpbDhxbCJ9.i_URRCdviydaQxvfgjhVfw";

// app config
const DISCOVER_RADIUS_MILES = 0.1;
const FOG_TRAIL_RADIUS_MILES = DISCOVER_RADIUS_MILES;
const FOG_TRAIL_DEDUPE_MILES = 0.055;
const MAX_FOG_TRAIL_SAMPLES = 6000;
const ARTICLE_REFRESH_DISTANCE_MILES = 0.08;
const MAX_LOCKED_MARKERS = 20;
const STORAGE_KEY = "discoverwiki-state-v1";
const TUTORIAL_STORAGE_KEY = "discoverwiki-tutorial-complete-v1";
const WIKIRANK_PROXY_PATH = "/api/wikirank";
const WIKIRANK_QUERY_LANG = "en";
// WikiRank returns result.en.popularity === 100 for essentially every English article; comparable popularity comes from summing other editions.
const WIKIRANK_POPULARITY_METRIC = "intl-sum-v1";
const WIKIRANK_PARALLEL = 3;
const GEOLOCATION_FAST_OPTIONS = { enableHighAccuracy: true, timeout: 12000, maximumAge: 60000 };
const GEOLOCATION_FALLBACK_OPTIONS = { enableHighAccuracy: false, timeout: 25000, maximumAge: 300000 };
const GEOLOCATION_WATCH_OPTIONS = { enableHighAccuracy: true, maximumAge: 30000 };
const LOCATION_RETRY_INTERVAL_MS = 15000;
const LOCATION_HELP_DELAY_MS = 15000;
const defaultCenter = [-74.006, 40.7128];

// folder icons
const FOLDER_ICON_OPTIONS = [
  { key: "star", className: "bi-star-fill", label: "Star" },
  { key: "heart", className: "bi-heart-fill", label: "Heart" },
  { key: "book", className: "bi-book-fill", label: "Book" },
  { key: "map", className: "bi-geo-alt-fill", label: "Map pin" },
  { key: "globe", className: "bi-globe-americas", label: "Globe" },
  { key: "trophy", className: "bi-trophy-fill", label: "Trophy" },
  { key: "pin", className: "bi-pin-map-fill", label: "Pin" },
];

/** `data-folder-id` value for the “All articles” chip (not a real folder). */
const COLLECTION_ALL_FOLDER_ID = "__all__";

// article categories
const CATEGORY_DEFINITIONS = [
  { key: "people", label: "People", color: "#D4A017", keywords: ["births", "deaths", "people", "person", "biographies", "actors", "artists", "writers", "politicians", "mayors", "governors", "architects", "musicians", "athletes"] },
  { key: "geography", label: "Places", color: "#2D9CDB", keywords: ["geography", "places", "cities", "city", "towns", "villages", "boroughs", "neighborhoods", "districts", "countries", "states", "continents", "counties", "streets", "avenues", "squares", "plazas", "parks", "bridges", "buildings", "landmarks", "towers", "halls"] },
  { key: "history", label: "History", color: "#C96D16", keywords: ["history", "historical", "wars", "battle", "century", "historic", "archaeology", "heritage", "establishments", "national register", "landmarks preservation"] },
  { key: "nature", label: "Nature", color: "#2E9D61", keywords: ["nature", "flora", "fauna", "species", "ecology", "environment", "climate", "weather", "forest", "lake", "ocean", "geology", "rivers", "mountains"] },
  { key: "science", label: "Science", color: "#4C6FFF", keywords: ["science", "physics", "chemistry", "biology", "mathematics", "astronomy", "medicine", "research", "climatology"] },
  { key: "technology", label: "Technology", color: "#7C58D6", keywords: ["technology", "engineering", "software", "computing", "internet", "machines", "electronics", "transport", "railway", "subway", "airport"] },
  { key: "culture", label: "Culture", color: "#DB4EA2", keywords: ["art", "arts", "music", "film", "television", "literature", "books", "theatre", "theater", "architecture", "museums", "festival", "monuments", "memorials"] },
  { key: "society", label: "Society", color: "#F97316", keywords: ["society", "education", "schools", "universities", "government", "law", "business", "companies", "religion", "civic", "courts", "churches"] },
  { key: "sports", label: "Sports", color: "#E74C3C", keywords: ["sports", "athletes", "teams", "football", "baseball", "basketball", "soccer", "olympics", "tennis", "stadiums", "arenas"] },
  { key: "other", label: "Other", color: "#7B8794", keywords: [] },
];

// dom refs
const refs = {
  appViewport: document.getElementById("appViewport"),
  appShell: document.getElementById("appShell"),
  titleScreen: document.getElementById("titleScreen"),
  appTabs: document.getElementById("appTabs"),
  discoverButton: document.getElementById("discoverButton"),
  viewCollectionButton: document.getElementById("viewCollectionButton"),
  titleNotice: document.getElementById("titleNotice"),
  titleLocationLoading: document.getElementById("titleLocationLoading"),
  titleLocationLoadingText: document.getElementById("titleLocationLoadingText"),
  statusPill: document.querySelector(".discover-status-pill"),
  statusText: document.getElementById("statusText"),
  devModeButton: document.getElementById("devModeButton"),
  nearbyTabBadge: document.getElementById("nearbyTabBadge"),
  collectionCount: document.getElementById("collectionCount"),
  strengthCount: document.getElementById("strengthCount"),
  insightInfoButton: document.getElementById("insightInfoButton"),
  popularityTotalCount: document.getElementById("popularityTotalCount"),
  popularityInfoButton: document.getElementById("popularityInfoButton"),
  articleList: document.getElementById("articleList"),
  collectionList: document.getElementById("collectionList"),
  folderList: document.getElementById("folderList"),
  folderIconPicker: document.getElementById("folderIconPicker"),
  folderNameInput: document.getElementById("folderNameInput"),
  createFolderButton: document.getElementById("createFolderButton"),
  collectionSort: document.getElementById("collectionSort"),
  refreshButton: document.getElementById("refreshButton"),
  recenterButton: document.getElementById("recenterButton"),
  mapSearchForm: document.getElementById("mapSearchForm"),
  mapSearchInput: document.getElementById("mapSearchInput"),
  tabButtons: Array.from(document.querySelectorAll("[data-tab]")),
  exploreView: document.getElementById("exploreView"),
  collectionView: document.getElementById("collectionView"),
  modalShell: document.getElementById("articleModal"),
  modalBadge: document.getElementById("modalBadge"),
  modalHeading: document.getElementById("modalHeading"),
  modalImage: document.getElementById("modalImage"),
  modalImageFallback: document.getElementById("modalImageFallback"),
  modalCategory: document.getElementById("modalCategory"),
  modalQuality: document.getElementById("modalQuality"),
  modalPopularity: document.getElementById("modalPopularity"),
  modalDate: document.getElementById("modalDate"),
  modalLocation: document.getElementById("modalLocation"),
  modalSummary: document.getElementById("modalSummary"),
  modalLink: document.getElementById("modalLink"),
  modalCloseButton: document.getElementById("modalCloseButton"),
  fogOverlay: document.getElementById("fogOverlay"),
  tutorialOverlay: document.getElementById("tutorialOverlay"),
  tutorialBackdrop: document.getElementById("tutorialBackdrop"),
  tutorialScrims: Array.from(document.querySelectorAll(".tutorial-scrim")),
  tutorialHighlight: document.getElementById("tutorialHighlight"),
  tutorialCard: document.getElementById("tutorialCard"),
  tutorialTitle: document.getElementById("tutorialTitle"),
  tutorialBody: document.getElementById("tutorialBody"),
  tutorialButton: document.getElementById("tutorialButton"),
};

// app state
const appState = loadState();
const uiState = {
  activeTab: "title",
  collectionScope: "all",
  activeFolderId: "favorites",
  collectionSort: "date-desc",
  nearbyArticles: [],
  currentCenter: [...defaultCenter],
  lastArticleCenter: null,
  isLoadingArticles: false,
  hasLiveLocation: false,
  awaitingLocationFix: false,
  locationTroubleShown: false,
  devMode: false,
  devFogTrailRecording: false,
  selectedFolderIcon: "star",
  expandedCollectionIds: new Set(),
  modalPageId: null,
  modalMode: "detail",
  tutorial: {
    active: false,
    step: "idle",
    targetPageId: null,
    unlockedPageId: null,
    waitingForArticles: false,
  },
  wikiRankRequests: new Set(),
  wikiRankQueue: [],
  wikiRankQueueSet: new Set(),
  wikiRankInflight: 0,
  locationRequests: new Set(),
};

// map setup
const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/light-v11",
  center: defaultCenter,
  zoom: 15.4,
  pitchWithRotate: false,
  dragRotate: false,
});

map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), "top-right");

const articlePopup = new mapboxgl.Popup({ closeButton: false, closeOnClick: false, offset: 16 });
let userLocationMarker = null;
let locationWatchId = null;
let locationRetryTimer = null;
let locationHelpTimer = null;
let mapIsReady = false;
let mapLayersInitialized = false;

// app startup
setupStaticUi();
renderFolderIconPicker();
renderAll();
requestMissingMetadataForArticles(getUnlockedArticles());
refreshMissingCategoriesForUnlockedArticles();

map.on("load", () => {
  mapIsReady = true;
  ensureMapLayers();
  renderMapData();
  renderFogOverlay();
});
map.on("move", renderFogOverlay);
map.on("zoom", renderFogOverlay);
map.on("resize", renderFogOverlay);
map.on("click", handleDevMapClick);

setupViewportResizeObserver();

function setupViewportResizeObserver() {
  const root = refs.appViewport;
  if (!root || typeof ResizeObserver === "undefined") return;
  const ro = new ResizeObserver(() => {
    if (!mapIsReady) return;
    map.resize();
    renderFogOverlay();
  });
  ro.observe(root);
}

// static events
function setupStaticUi() {
  refs.discoverButton?.addEventListener("click", enterDiscoverView);
  refs.viewCollectionButton?.addEventListener("click", () => {
    if (!getUnlockedArticles().length) return showTitleNotice("Unlock an article in Discover before viewing your collection.");
    enterCollectionViewFromTitle();
  });
  refs.refreshButton?.addEventListener("click", () => locateAndLoadArticles({ forceRefresh: true, recenter: true }));
  refs.insightInfoButton?.addEventListener("click", showInsightInfo);
  refs.popularityInfoButton?.addEventListener("click", showPopularityInfo);
  refs.recenterButton?.addEventListener("click", () => {
    map.flyTo({ center: uiState.currentCenter, zoom: 15.8, essential: true });
  });
  refs.mapSearchForm?.addEventListener("submit", handleMapSearch);

  refs.tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      if (button.dataset.tab === "collection" && !getUnlockedArticles().length) {
        setStatus("Unlock an article before opening your collection.", "error");
        return;
      }
      showAppView(button.dataset.tab === "collection" ? "collection" : "discover");
    });
  });

  refs.collectionSort?.addEventListener("change", () => {
    uiState.collectionSort = refs.collectionSort.value;
    renderCollectionView();
  });

  refs.createFolderButton?.addEventListener("click", createFolderFromInput);
  refs.folderNameInput?.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      createFolderFromInput();
    }
  });

  refs.articleList?.addEventListener("click", (event) => {
    const actionTarget = event.target.closest("[data-action]");
    const card = event.target.closest(".article-card[data-pageid]");
    if (actionTarget) return handleExploreAction(actionTarget.dataset.action, actionTarget.dataset.pageid);
    if (card && !event.target.closest("a")) handleExploreCardActivate(card.dataset.pageid);
  });

  refs.articleList?.addEventListener("keydown", (event) => {
    const card = event.target.closest(".article-card[data-pageid]");
    if (!card) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleExploreCardActivate(card.dataset.pageid);
    }
  });

  refs.collectionList?.addEventListener("click", (event) => {
    const actionTarget = event.target.closest("[data-action]");
    if (actionTarget) return handleCollectionAction(actionTarget.dataset.action, actionTarget.dataset.pageid, actionTarget.dataset.folderId);
  });

  refs.folderList?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-folder-id]");
    if (!button) return;
    const folderId = button.dataset.folderId;
    if (folderId === COLLECTION_ALL_FOLDER_ID) {
      uiState.collectionScope = "all";
    } else {
      uiState.collectionScope = "folders";
      uiState.activeFolderId = folderId;
    }
    uiState.activeTab = "collection";
    renderAll();
  });

  refs.modalCloseButton?.addEventListener("click", closeModal);
  refs.modalShell?.addEventListener("click", (event) => {
    if (event.target.dataset.closeModal === "true") closeModal();
  });
  refs.tutorialButton?.addEventListener("click", handleTutorialButtonClick);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && uiState.modalPageId) closeModal();
  });
}

// saved state
function loadState() {
  const emptyState = { unlockedArticles: {}, folders: [], fogTrailSamples: [] };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return ensureSystemFolders(emptyState);
    const parsed = JSON.parse(raw);
    const unlockedArticles = Object.fromEntries(
      Object.entries(parsed?.unlockedArticles ?? {}).map(([pageid, article]) => [String(pageid), normalizeUnlockedArticle(article)])
    );
    return ensureSystemFolders({
      unlockedArticles,
      folders: Array.isArray(parsed?.folders) ? parsed.folders.map(normalizeFolder).filter(Boolean) : [],
      fogTrailSamples: parsed?.fogTrailSamples,
    });
  } catch (error) {
    console.error("Failed to load state", error);
    return ensureSystemFolders(emptyState);
  }
}

// folder state
function normalizeFolder(folder) {
  if (!folder || typeof folder !== "object") return null;
  return {
    id: String(folder.id || `folder-${Date.now()}`),
    name: String(folder.name || "Folder").trim() || "Folder",
    iconKey: FOLDER_ICON_OPTIONS.some((option) => option.key === folder.iconKey) ? folder.iconKey : "star",
    system: Boolean(folder.system),
  };
}

function normalizeFogTrailSamples(raw) {
  if (!Array.isArray(raw)) return [];
  const out = [];
  for (const entry of raw) {
    let lng;
    let lat;
    if (Array.isArray(entry) && entry.length >= 2) {
      lng = Number(entry[0]);
      lat = Number(entry[1]);
    } else if (entry && typeof entry === "object") {
      lng = Number(entry.lng ?? entry.longitude);
      lat = Number(entry.lat ?? entry.latitude);
    }
    if (Number.isFinite(lng) && Number.isFinite(lat)) out.push({ lng, lat });
  }
  return out.length > MAX_FOG_TRAIL_SAMPLES ? out.slice(out.length - MAX_FOG_TRAIL_SAMPLES) : out;
}

function ensureSystemFolders(state) {
  const favorites = { id: "favorites", name: "Favorites", iconKey: "heart", system: true };
  const folders = Array.isArray(state.folders) ? state.folders.filter(Boolean).filter((folder) => folder.id !== "favorites") : [];
  return {
    unlockedArticles: state.unlockedArticles ?? {},
    folders: [favorites, ...folders],
    fogTrailSamples: normalizeFogTrailSamples(state.fogTrailSamples),
  };
}

// article state
function normalizeUnlockedArticle(article) {
  const category = getCategoryDefinition(article?.categoryKey);
  const popularityMetricOk = article?.popularityMetric === WIKIRANK_POPULARITY_METRIC;

  let popularity =
    popularityMetricOk && Number.isFinite(article?.popularity) ? Math.max(0, Math.round(article.popularity)) : null;

  let popularityStatus;
  if (!popularityMetricOk) {
    popularityStatus = article?.popularityStatus === "loading" ? "loading" : "idle";
  } else if (article?.popularityStatus === "error") {
    popularityStatus = "error";
  } else if (Number.isFinite(popularity)) {
    popularityStatus = "ready";
  } else if (article?.popularityStatus === "loading") {
    popularityStatus = "loading";
  } else {
    popularityStatus = "idle";
  }

  return {
    pageid: String(article?.pageid ?? ""),
    title: String(article?.title ?? "Unknown article"),
    summary: String(article?.summary ?? "No article excerpt available."),
    thumbnail: String(article?.thumbnail ?? ""),
    url: String(article?.url ?? "#"),
    coordinates: normalizeCoordinates(article?.coordinates),
    discoveredAt: new Date(article?.discoveredAt ?? Date.now()).toISOString(),
    isFavorite: Boolean(article?.isFavorite),
    folderIds: Array.isArray(article?.folderIds) ? article.folderIds.map(String) : [],
    quality: Number.isFinite(article?.quality) ? Math.max(1, Math.round(article.quality)) : null,
    qualityStatus: article?.qualityStatus === "error" ? "error" : Number.isFinite(article?.quality) ? "ready" : article?.qualityStatus === "loading" ? "loading" : "idle",
    popularity,
    popularityStatus,
    popularityMetric: popularityMetricOk ? WIKIRANK_POPULARITY_METRIC : null,
    location: normalizeLocation(article?.location),
    categoryKey: category.key,
    categoryLabel: String(article?.categoryLabel || category.label),
    categoryColor: String(article?.categoryColor || category.color),
  };
}

function normalizeCoordinates(value) {
  if (Array.isArray(value) && value.length === 2 && Number.isFinite(Number(value[0])) && Number.isFinite(Number(value[1]))) {
    return [Number(value[0]), Number(value[1])];
  }
  return [...defaultCenter];
}

function normalizeLocation(location) {
  if (!location || typeof location !== "object") return null;
  return {
    city: String(location.city || "").trim(),
    region: String(location.region || "").trim(),
    country: String(location.country || "").trim(),
    continent: String(location.continent || "").trim(),
  };
}

function persistState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
}

// metadata helpers
function getCategoryDefinition(key) {
  return CATEGORY_DEFINITIONS.find((entry) => entry.key === key) || CATEGORY_DEFINITIONS[CATEGORY_DEFINITIONS.length - 1];
}

function normalizeCategoryTitle(title) {
  return String(title || "").replace(/^Category:/i, "").toLowerCase().trim();
}

function isMaintenanceCategory(name) {
  // skip wikipedia cleanup categories before scoring
  return [
    "all articles",
    "all wikipedia",
    "articles containing",
    "articles needing",
    "articles to be",
    "articles using",
    "articles with",
    "cs1",
    "commons category",
    "coordinates on wikidata",
    "pages using",
    "pages with",
    "short description",
    "use american english",
    "use dmy dates",
    "use mdy dates",
    "webarchive",
    "wikipedia articles",
  ].some((phrase) => name.includes(phrase));
}

function getCleanCategoryNames(page) {
  return (page?.categoryTitles ?? page?.categories?.map((entry) => entry.title) ?? [])
    .map(normalizeCategoryTitle)
    .filter((name) => name && !isMaintenanceCategory(name));
}

function scoreCategoryDefinition(definition, categoryNames, fallbackText) {
  return definition.keywords.reduce((score, keyword) => {
    const normalizedKeyword = keyword.toLowerCase();
    const categoryHits = categoryNames.filter((name) => name.includes(normalizedKeyword)).length;
    const fallbackHit = fallbackText.includes(normalizedKeyword) ? 1 : 0;
    return score + categoryHits * 3 + fallbackHit;
  }, 0);
}

function inferCategory(page) {
  const categoryNames = getCleanCategoryNames(page);
  const fallbackText = `${page?.title || ""} ${page?.extract || ""}`.toLowerCase();
  let bestCategory = CATEGORY_DEFINITIONS[CATEGORY_DEFINITIONS.length - 1];
  let bestScore = 0;

  for (const definition of CATEGORY_DEFINITIONS) {
    if (definition.key === "other") continue;
    const score = scoreCategoryDefinition(definition, categoryNames, fallbackText);
    if (score > bestScore) {
      bestCategory = definition;
      bestScore = score;
    }
  }

  return bestCategory;
}

// location helpers
function getCurrentPosition(options = {}) {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) return reject(new Error("Geolocation is not supported by this browser."));
    navigator.geolocation.getCurrentPosition(resolve, reject, options);
  });
}

function createLocationTimeoutError(message) {
  const error = new Error(message);
  error.code = 3;
  return error;
}

function withAppTimeout(promise, timeoutMs, message) {
  // firefox can leave geolocation pending
  let timeoutId;
  const timeout = new Promise((_, reject) => {
    timeoutId = window.setTimeout(() => reject(createLocationTimeoutError(message)), timeoutMs);
  });
  return Promise.race([promise, timeout]).finally(() => window.clearTimeout(timeoutId));
}

async function getBestCurrentPosition() {
  try {
    // prefer gps when it resolves quickly
    return await withAppTimeout(
      getCurrentPosition(GEOLOCATION_FAST_OPTIONS),
      GEOLOCATION_FAST_OPTIONS.timeout + 3000,
      "High-accuracy location did not resolve."
    );
  } catch (error) {
    if (error?.code === 1) throw error;
    // fall back to cached or network location
    console.warn("High-accuracy location timed out or failed; retrying with a cached/network position.", error);
    setStatus("Still locating you...", "loading");
    return withAppTimeout(
      getCurrentPosition(GEOLOCATION_FALLBACK_OPTIONS),
      GEOLOCATION_FALLBACK_OPTIONS.timeout + 5000,
      "Fallback location did not resolve."
    );
  }
}

function getLocationFailureMessage(error) {
  if (error?.code === 1) return "Location access is required to use Discover. Please enable location for this site and try again.";
  if (error?.code === 3) return "We could not get a location fix before the browser timed out. Make sure device location services are on, then try again near a window or outside.";
  return "Discover needs your location to find nearby articles. Please check location services and try again.";
}

function getLocationWaitingMessage() {
  return "Location is allowed, but we are still waiting for a GPS fix. Keep this page open and make sure device location services are on.";
}

function waitForDelay(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

// location retry
function clearLocationRetry() {
  if (locationRetryTimer === null) return;
  window.clearTimeout(locationRetryTimer);
  locationRetryTimer = null;
}

function clearLocationHelpTimer() {
  if (locationHelpTimer === null) return;
  window.clearTimeout(locationHelpTimer);
  locationHelpTimer = null;
}

function scheduleLocationHelp() {
  // show a clear message if gps is slow
  clearLocationHelpTimer();
  locationHelpTimer = window.setTimeout(() => {
    locationHelpTimer = null;
    if (uiState.activeTab !== "discover" || uiState.hasLiveLocation) return;
    showLocationTroublePopup();
  }, LOCATION_HELP_DELAY_MS);
}

function scheduleLocationRetry() {
  // keep trying after timeout without blocking the map
  if (locationRetryTimer !== null || uiState.activeTab !== "discover" || uiState.hasLiveLocation) return;
  locationRetryTimer = window.setTimeout(() => {
    locationRetryTimer = null;
    retryLocationFetch();
  }, LOCATION_RETRY_INTERVAL_MS);
}

async function retryLocationFetch() {
  if (uiState.activeTab !== "discover" || uiState.hasLiveLocation) return;

  // retry uses the same fast then fallback strategy
  console.info("Retrying geolocation request.");
  setStatus("Still waiting for your location...", "loading");
  scheduleLocationHelp();
  try {
    const position = await getBestCurrentPosition();
    await applyLocationPosition(position, { forceRefresh: true, recenter: true });
    startLocationTracking();
  } catch (error) {
    if (error?.code === 1) {
      handleLocationError(error);
      return;
    }
    console.warn("Location retry did not receive a fix yet.", error);
    setStatus(getLocationWaitingMessage(), "loading");
    scheduleLocationRetry();
  }
}

async function waitForInitialLocationOnTitle() {
  while (uiState.activeTab === "title" && uiState.awaitingLocationFix) {
    try {
      // stay on title until a real position exists
      return await getBestCurrentPosition();
    } catch (error) {
      if (error?.code === 1) throw error;
      console.warn("Initial location is still pending; staying on the title screen.", error);
      setTitleLocationLoading(true, "Still finding your location...");
      await waitForDelay(LOCATION_RETRY_INTERVAL_MS);
    }
  }
  return null;
}

// discover entry
async function enterDiscoverView() {
  if (!navigator.geolocation) {
    showTitleScreen("Discover needs location access, but this browser does not support geolocation.");
    return;
  }

  console.info("Discover clicked; starting geolocation.", {
    protocol: window.location.protocol,
    host: window.location.host,
    hasGeolocation: Boolean(navigator.geolocation),
  });
  if (navigator.permissions?.query) {
    navigator.permissions.query({ name: "geolocation" }).then(
      (permission) => console.info("Geolocation permission state:", permission.state),
      (error) => console.warn("Could not read geolocation permission state.", error)
    );
  }
  clearTitleNotice();
  refs.discoverButton.disabled = true;
  if (refs.viewCollectionButton) refs.viewCollectionButton.disabled = true;
  setTitleLocationLoading(true);
  uiState.locationTroubleShown = false;
  uiState.awaitingLocationFix = true;

  try {
    const position = await waitForInitialLocationOnTitle();
    if (!position) return;
    // first fix opens discover and starts the tour
    showAppView("discover");
    setStatus("Loading your location...", "loading");
    await applyLocationPosition(position, { forceRefresh: true, recenter: true });
    startLocationTracking();
    if (shouldStartTutorial()) startTutorial();
  } catch (error) {
    if (error?.code === 1) {
      console.error(error);
      showTitleScreen(getLocationFailureMessage(error));
      return;
    }
    console.warn("Initial location request stopped.", error);
    showTitleScreen(getLocationFailureMessage(error));
  } finally {
    setTitleLocationLoading(false);
    refs.discoverButton.disabled = false;
    if (refs.viewCollectionButton) refs.viewCollectionButton.disabled = !getUnlockedArticles().length;
  }
}

async function enterCollectionViewFromTitle() {
  if (!navigator.geolocation) {
    showTitleScreen("Collection needs location access, but this browser does not support geolocation.");
    return;
  }

  clearTitleNotice();
  refs.discoverButton.disabled = true;
  if (refs.viewCollectionButton) refs.viewCollectionButton.disabled = true;
  setTitleLocationLoading(true);
  uiState.locationTroubleShown = false;
  uiState.awaitingLocationFix = true;

  try {
    const position = await waitForInitialLocationOnTitle();
    if (!position) return;
    // collection still needs live location for nearby alerts
    showAppView("collection");
    await applyLocationPosition(position, { forceRefresh: true, recenter: true });
    startLocationTracking();
  } catch (error) {
    if (error?.code === 1) {
      console.error(error);
      showTitleScreen(getLocationFailureMessage(error));
      return;
    }
    console.warn("Initial collection location request stopped.", error);
    showTitleScreen(getLocationFailureMessage(error));
  } finally {
    setTitleLocationLoading(false);
    refs.discoverButton.disabled = false;
    if (refs.viewCollectionButton) refs.viewCollectionButton.disabled = !getUnlockedArticles().length;
  }
}

function startLocationTracking() {
  if (uiState.devMode) return;
  if (!navigator.geolocation) {
    handleLocationError(new Error("Geolocation is not supported by this browser."));
    return;
  }
  if (locationWatchId !== null) return;

  // one watcher keeps distance checks live
  console.info("Starting watchPosition.", GEOLOCATION_WATCH_OPTIONS);
  locationWatchId = navigator.geolocation.watchPosition(handleLocationUpdate, handleLocationError, GEOLOCATION_WATCH_OPTIONS);
  console.info("watchPosition started with id:", locationWatchId);
}

function positionToCenter(position) {
  return [position.coords.longitude, position.coords.latitude];
}

// page status
function setStatus(message, state = "loading") {
  refs.statusText.textContent = message;
  refs.statusText.className = `status-text ${state}`;
  refs.statusPill?.classList.toggle("is-hidden", uiState.activeTab === "discover" && state === "success" && !uiState.devMode);
}

function showLocationTroublePopup() {
  if (uiState.locationTroubleShown || uiState.hasLiveLocation) return;
  if (uiState.tutorial.active && !uiState.tutorial.waitingForArticles) {
    scheduleLocationHelp();
    return;
  }
  uiState.locationTroubleShown = true;
  showTutorial({
    title: "Location trouble",
    body: "<p>We are having trouble finding your location, please make sure you have location permissions set for this site</p>",
    buttonText: "OK",
    onButton: hideTutorial,
  });
}

// tutorial flow
let tutorialButtonAction = null;

function hasCompletedTutorial() {
  return localStorage.getItem(TUTORIAL_STORAGE_KEY) === "true";
}

function markTutorialComplete() {
  localStorage.setItem(TUTORIAL_STORAGE_KEY, "true");
}

function shouldStartTutorial() {
  return !hasCompletedTutorial() && !uiState.tutorial.active;
}

function handleTutorialButtonClick() {
  if (typeof tutorialButtonAction === "function") tutorialButtonAction();
}

function hideTutorial() {
  tutorialButtonAction = null;
  refs.tutorialOverlay?.classList.add("is-hidden");
  refs.tutorialOverlay?.setAttribute("aria-hidden", "true");
  clearTutorialSpotlight();
}

function clampTutorialPosition(left, top) {
  const card = refs.tutorialCard;
  const margin = 12;
  const width = card?.offsetWidth || Math.min(320, window.innerWidth - margin * 2);
  const height = card?.offsetHeight || 180;
  return {
    left: Math.max(margin, Math.min(left, window.innerWidth - width - margin)),
    top: Math.max(margin, Math.min(top, window.innerHeight - height - margin)),
  };
}

function getSpotlightRect({ target = null }) {
  if (target) {
    const rect = target.getBoundingClientRect();
    return {
      left: rect.left,
      top: rect.top,
      right: rect.right,
      bottom: rect.bottom,
      width: rect.width,
      height: rect.height,
      radius: window.getComputedStyle(target).borderRadius || "18px",
    };
  }
  return null;
}

function clearTutorialSpotlight() {
  refs.tutorialBackdrop?.classList.remove("is-hidden");
  refs.tutorialHighlight?.classList.add("is-hidden");
  refs.tutorialScrims.forEach((scrim) => scrim.classList.add("is-hidden"));
}

function setTutorialSpotlight(rect) {
  if (!rect) {
    clearTutorialSpotlight();
    return;
  }

  const pad = 0;
  const left = Math.max(0, rect.left - pad);
  const top = Math.max(0, rect.top - pad);
  const right = Math.min(window.innerWidth, rect.right + pad);
  const bottom = Math.min(window.innerHeight, rect.bottom + pad);
  const width = Math.max(0, right - left);
  const height = Math.max(0, bottom - top);

  refs.tutorialBackdrop?.classList.add("is-hidden");
  refs.tutorialScrims.forEach((scrim) => scrim.classList.add("is-hidden"));

  Object.assign(refs.tutorialHighlight.style, {
    left: `${left}px`,
    top: `${top}px`,
    width: `${width}px`,
    height: `${height}px`,
    borderRadius: rect.radius,
  });
  refs.tutorialHighlight.classList.remove("is-hidden");
}

function getTutorialCardPosition(rect, placement = "auto") {
  if (!rect) return clampTutorialPosition(window.innerWidth / 2 - 150, window.innerHeight / 2 - 90);
  const card = refs.tutorialCard;
  const width = card?.offsetWidth || Math.min(320, window.innerWidth - 24);
  const height = card?.offsetHeight || 180;
  const gap = 12;
  const centeredLeft = rect.left + rect.width / 2 - width / 2;
  const aboveTop = rect.top - height - gap;
  const belowTop = rect.bottom + gap;
  const sideLeft = rect.right + gap;

  if (placement === "above") return clampTutorialPosition(centeredLeft, aboveTop);
  if (placement === "right") return clampTutorialPosition(sideLeft, rect.top);
  if (belowTop + height > window.innerHeight - gap && aboveTop > gap) return clampTutorialPosition(centeredLeft, aboveTop);
  return clampTutorialPosition(centeredLeft, belowTop);
}

function getCoordinateTutorialPosition(coordinates) {
  if (!mapIsReady || !coordinates) return clampTutorialPosition(window.innerWidth / 2 - 150, window.innerHeight / 2 - 90);
  const point = map.project(coordinates);
  return clampTutorialPosition(point.x + 12, point.y - 80);
}

function scrollTutorialTargetIntoView(target) {
  if (!target?.scrollIntoView) return;
  target.scrollIntoView({ block: "center", inline: "nearest", behavior: "auto" });
}

function showTutorial({ title, body, buttonText = "Next", target = null, coordinates = null, placement = "auto", onButton = null }) {
  refs.tutorialTitle.textContent = title;
  refs.tutorialBody.innerHTML = body;
  if (buttonText === null) {
    refs.tutorialButton.classList.add("is-hidden");
    tutorialButtonAction = null;
  } else {
    refs.tutorialButton.textContent = buttonText;
    refs.tutorialButton.classList.remove("is-hidden");
    tutorialButtonAction = onButton || (() => {});
  }
  refs.tutorialOverlay.classList.remove("is-hidden");
  refs.tutorialOverlay.setAttribute("aria-hidden", "false");
  scrollTutorialTargetIntoView(target);

  requestAnimationFrame(() => {
    const rect = target ? getSpotlightRect({ target }) : null;
    setTutorialSpotlight(rect);
    const position = coordinates ? getCoordinateTutorialPosition(coordinates) : getTutorialCardPosition(rect, placement);
    refs.tutorialCard.style.left = `${position.left}px`;
    refs.tutorialCard.style.top = `${position.top}px`;
  });
}

function startTutorial() {
  uiState.tutorial.active = true;
  uiState.tutorial.step = "welcome";
  showTutorial({
    title: "Welcome to discoverWiki",
    body: "<p>discoverWiki is a game that helps you learn more about the world by finding Wikipedia articles near you.</p>",
    buttonText: "Let's start",
    onButton: () => {
      hideTutorial();
      showNearestArticleTutorial();
    },
  });
}

function reactivateTutorial() {
  localStorage.removeItem(TUTORIAL_STORAGE_KEY);
  Object.assign(uiState.tutorial, {
    active: false,
    step: "idle",
    targetPageId: null,
    unlockedPageId: null,
    waitingForArticles: false,
  });
  uiState.locationTroubleShown = false;
  hideTutorial();
  articlePopup.remove();

  // reuse the current location when available
  if (uiState.hasLiveLocation) {
    showAppView("discover");
    startTutorial();
  } else {
    showTitleScreen();
    enterDiscoverView();
  }
  console.info("tutorial reactivated");
}

window.reactivateTutorial = reactivateTutorial;

function getTutorialTargetArticle() {
  return uiState.nearbyArticles.find((article) => !article.unlocked) || uiState.nearbyArticles[0] || null;
}

function isTutorialUnlockException(article) {
  return uiState.tutorial.active && uiState.tutorial.step === "collect-nearest" && String(article?.pageid) === String(uiState.tutorial.targetPageId);
}

function canUnlockArticle(article) {
  return article.distanceMiles <= DISCOVER_RADIUS_MILES || isTutorialUnlockException(article);
}

function markerLegend() {
  return `
    <div class="tutorial-legend">
      <span><span class="tutorial-marker tutorial-marker--locked">?</span> too far</span>
      <span><span class="tutorial-marker tutorial-marker--unlockable">?</span> close enough</span>
      <span><span class="tutorial-marker tutorial-marker--unlocked"></span> collected</span>
    </div>
  `;
}

function showPopularityInfo() {
  showTutorial({
    title: "What is Popularity?",
    body: `
      <p>Popularity is your combined WikiRank popularity footprint across collected articles.</p>
      <p>The WikiRank API reports English popularity as a flat reference (100 for nearly every article), so DiscoverWiki instead sums WikiRank popularity from every <em>other</em> language edition linked for that topic — wider translation footprints score higher.</p>
      <p><a href="https://wikirank.net/" target="_blank" rel="noopener noreferrer">Learn more on WikiRank</a></p>
    `,
    buttonText: "OK",
    target: refs.popularityInfoButton?.closest(".stat-card"),
    onButton: hideTutorial,
  });
}

function showInsightInfo() {
  showTutorial({
    title: "What is Insight?",
    body: `
      <p>Insight is your total collection quality score.</p>
      <p>Each article gets a quality score from WikiRank, and Insight adds those scores together for every article you've collected.</p>
      <p><a href="https://wikirank.net/" target="_blank" rel="noopener noreferrer">Learn more on WikiRank</a></p>
    `,
    buttonText: "OK",
    target: refs.insightInfoButton?.closest(".stat-card"),
    onButton: hideTutorial,
  });
}

function showNearestArticleTutorial() {
  const article = getTutorialTargetArticle();
  if (!article) {
    uiState.tutorial.waitingForArticles = true;
    if (uiState.activeTab === "discover" && !uiState.hasLiveLocation) scheduleLocationHelp();
    showTutorial({
      title: "Finding nearby articles",
      body: `
        <p>We are loading nearby Wikipedia articles for your location!</p>
        <div class="tutorial-loading-spinner" aria-hidden="true"></div>
      `,
      buttonText: null,
    });
    return;
  }

  uiState.tutorial.waitingForArticles = false;
  uiState.tutorial.step = "collect-nearest";
  uiState.tutorial.targetPageId = String(article.pageid);
  renderMapData();
  map.flyTo({ center: article.coordinates, zoom: 16.2, essential: true });

  window.setTimeout(() => {
    showTutorial({
      title: "Collect nearby articles",
      coordinates: article.coordinates,
      body: `
        <p>You collect articles by going near their real location! You must be within about 0.1mi of the article to collect it.</p>
        ${markerLegend()}
        <p>Try collecting this nearby article by tapping the orange question mark!</p>
      `,
      buttonText: "Try it!",
      onButton: () => {
        hideTutorial();
        setStatus("Tap the orange question mark to collect it", "loading");
      },
    });
  }, 650);
}

function showMapControlTutorial(index = 0) {
  const steps = [
    {
      title: "Refresh nearby",
      body: "<p>Use refresh to reload nearby Wikipedia articles around your current location.</p>",
      target: refs.refreshButton,
      placement: "above",
    },
    {
      title: "Center yourself",
      body: "<p>Use this button to jump the map back to your location!</p>",
      target: refs.recenterButton,
      placement: "above",
    },
    {
      title: "Search the map",
      body: "<p>Search lets you zoom to a place without changing your real location.</p>",
      target: refs.mapSearchForm,
      placement: "above",
    },
  ];
  const step = steps[index];
  if (!step) return showCollectionTabTutorial();
  uiState.tutorial.step = `map-control-${index}`;
  showTutorial({
    ...step,
    buttonText: "Next",
    onButton: () => showMapControlTutorial(index + 1),
  });
}

function showCollectionTabTutorial() {
  uiState.tutorial.step = "collection-tab";
  const collectionTab = refs.tabButtons.find((button) => button.dataset.tab === "collection");
  showTutorial({
    title: "Your collection",
    body: "<p>You can view articles you've collected in the Collection tab here. Click to see the article you just collected!</p>",
    target: collectionTab,
    buttonText: "Open collection",
    onButton: () => {
      showAppView("collection");
      window.setTimeout(() => showCollectionControlTutorial(0), 150);
    },
  });
}

function showCollectionControlTutorial(index = 0) {
  const steps = [
    {
      title: "Sort articles",
      body: "<p>Sort your collection by date, quality, popularity, category, or location.</p>",
      target: refs.collectionSort,
    },
    {
      title: "Create folders",
      body: "<p>Folders let you organize collected articles your own way.</p>",
      target: document.querySelector(".folder-builder"),
    },
    {
      title: "Folders and favorites",
      body: "<p>Use <strong>All</strong> to see every collected article, or tap <strong>Favorites</strong> or a folder to filter the list.</p>",
      target: refs.folderList,
    },
  ];
  const step = steps[index];
  if (!step) return showCollectionArticleTutorial();
  uiState.tutorial.step = `collection-control-${index}`;
  showTutorial({
    ...step,
    buttonText: "Next",
    onButton: () => showCollectionControlTutorial(index + 1),
  });
}

function getTutorialArticleId() {
  return uiState.tutorial.unlockedPageId || Object.keys(appState.unlockedArticles)[0] || "";
}

function showCollectionArticleTutorial() {
  const pageid = getTutorialArticleId();
  const detailsButton = document.querySelector(`[data-pageid="${pageid}"] [data-action="toggle-expand"]`);
  uiState.tutorial.step = "show-details";
  showTutorial({
    title: "Expand an article",
    body: "<p>Tap the article row to see location, folders, Insight scores, and links.</p>",
    target: detailsButton,
    buttonText: "Next",
    onButton: () => {
      window.setTimeout(showShowOnMapTutorial, 150);
    },
  });
}

function showShowOnMapTutorial() {
  const pageid = getTutorialArticleId();
  if (pageid) {
    uiState.expandedCollectionIds.add(String(pageid));
    renderCollectionView();
  }
  const mapButton = document.querySelector(`[data-pageid="${pageid}"] [data-action="focus-map"]`);
  uiState.tutorial.step = "show-on-map";
  showTutorial({
    title: "Show on map",
    body: "<p>Show on map takes you back to where the article is on the map.</p>",
    target: mapButton,
    buttonText: "Finish tutorial",
    onButton: finishTutorial,
  });
}

function finishTutorial() {
  markTutorialComplete();
  uiState.tutorial.active = false;
  uiState.tutorial.step = "complete";
  hideTutorial();
}

// dev mode
function stopLocationTracking() {
  clearLocationRetry();
  clearLocationHelpTimer();
  if (locationWatchId === null || !navigator.geolocation) return;
  navigator.geolocation.clearWatch(locationWatchId);
  locationWatchId = null;
}

function activateDev(persistentFogRecording = false) {
  uiState.devMode = true;
  uiState.devFogTrailRecording = Boolean(persistentFogRecording);
  stopLocationTracking();
  refs.appShell?.classList.add("is-dev-mode");
  refs.devModeButton?.classList.remove("is-hidden");
  const fogHint = uiState.devFogTrailRecording ? " (persistent fog recording on)" : "";
  setStatus(`dev mode active${fogHint}`, "success");
  renderAll();
  console.info("dev mode active", { persistentFogRecording: uiState.devFogTrailRecording });
}

window.activateDev = activateDev;

function zoomForMaxDistanceMiles(maxMiles) {
  const referenceMiles = 0.2;
  const referenceZoom = 15.5;
  if (!Number.isFinite(maxMiles) || maxMiles <= 0) return referenceZoom;
  return Math.max(8.5, Math.min(17, referenceZoom - Math.log2(maxMiles / referenceMiles)));
}

function getDistanceMiles(start, end) {
  const earthRadiusMiles = 3958.8;
  const toRadians = (value) => (value * Math.PI) / 180;
  const deltaLat = toRadians(end[1] - start[1]);
  const deltaLng = toRadians(end[0] - start[0]);
  const lat1 = toRadians(start[1]);
  const lat2 = toRadians(end[1]);
  const a = Math.sin(deltaLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLng / 2) ** 2;
  return 2 * earthRadiusMiles * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function escapeHtml(value) {
  return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#39;");
}

function truncateText(text, maxLength = 260) {
  const compact = String(text || "").replace(/\s+/g, " ").trim();
  if (!compact) return "No article excerpt available.";
  if (compact.length <= maxLength) return compact;
  return `${compact.slice(0, maxLength).trimEnd()}...`;
}

function ensureTrailingEllipsis(text) {
  const preview = truncateText(text, 280);
  return preview.endsWith("...") ? preview : `${preview}...`;
}

function formatDistance(distanceMiles) {
  return distanceMiles < 0.1 ? `${Math.round(distanceMiles * 5280)} ft away` : `${distanceMiles.toFixed(1)} mi away`;
}

function formatDate(dateValue) {
  return new Date(dateValue).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

function cleanCountryName(value) {
  return String(value || "").replace(/\s*\(the\)$/i, "").replace(/\s*\(.*?\)$/g, "").trim();
}

// display helpers
function buildLocationLabel(location) {
  if (!location) return "Location loading...";
  return [location.city, location.region, location.country].filter(Boolean).join(", ") || location.continent || "Location unavailable";
}

function buildShortLocationValue(location, key) {
  return location?.[key] || "Unknown";
}

function maskTitle(title) {
  return [...String(title)].map((character) => (character === " " ? " " : "?")).join("");
}

// article lists
function getUnlockedArticles() {
  return Object.values(appState.unlockedArticles).sort((left, right) => new Date(right.discoveredAt) - new Date(left.discoveredAt));
}

function getUnlockedRecord(pageid) {
  return appState.unlockedArticles[String(pageid)] || null;
}

function decorateArticleWithState(article) {
  const unlocked = getUnlockedRecord(article.pageid);
  return unlocked ? { ...article, ...unlocked, distanceMiles: article.distanceMiles, unlocked: true } : { ...article, unlocked: false, lockedTitle: maskTitle(article.title) };
}

function updateNearbyArticlesFromState() {
  uiState.nearbyArticles = uiState.nearbyArticles.map(decorateArticleWithState);
}

async function refreshMissingCategoriesForUnlockedArticles() {
  const articles = getUnlockedArticles().filter((article) => article.categoryKey === "other");
  if (!articles.length) return;

  try {
    const categoriesByPage = await fetchWikipediaCategories(articles.map((article) => article.pageid));
    let didChange = false;

    articles.forEach((article) => {
      const category = inferCategory({
        ...article,
        categoryTitles: categoriesByPage.get(String(article.pageid)) ?? [],
      });
      if (category.key === "other") return;

      article.categoryKey = category.key;
      article.categoryLabel = category.label;
      article.categoryColor = category.color;
      didChange = true;
    });

    if (!didChange) return;
    persistState();
    updateNearbyArticlesFromState();
    renderAll();
  } catch (error) {
    console.warn("Saved article categories could not be refreshed.", error);
  }
}

// wiki api
async function fetchWikipediaCategories(pageIds) {
  if (!pageIds.length) return new Map();
  const categoriesByPage = new Map(pageIds.map((pageId) => [String(pageId), []]));
  const seenByPage = new Map(pageIds.map((pageId) => [String(pageId), new Set()]));
  let continueParams = {};

  for (let requestCount = 0; requestCount < 8; requestCount += 1) {
    const categoryUrl = new URL("https://en.wikipedia.org/w/api.php");
    categoryUrl.search = new URLSearchParams({
      action: "query",
      pageids: pageIds.join("|"),
      prop: "categories",
      cllimit: "max",
      format: "json",
      origin: "*",
      ...continueParams,
    }).toString();

    const response = await fetch(categoryUrl.toString());
    if (!response.ok) throw new Error(`Wikipedia category request failed with status ${response.status}`);
    const data = await response.json();
    const pages = data?.query?.pages ?? {};

    Object.values(pages).forEach((page) => {
      const pageId = String(page.pageid ?? "");
      const categories = categoriesByPage.get(pageId);
      const seen = seenByPage.get(pageId);
      if (!categories || !seen) return;

      (page.categories ?? []).forEach((category) => {
        const title = String(category.title || "");
        if (!title || seen.has(title)) return;
        seen.add(title);
        categories.push(title);
      });
    });

    if (!data?.continue?.clcontinue) break;
    continueParams = {
      continue: data.continue.continue ?? "",
      clcontinue: data.continue.clcontinue,
    };
  }

  return categoriesByPage;
}

async function fetchWikipediaArticles(center) {
  // geosearch finds nearby page ids
  const searchUrl = new URL("https://en.wikipedia.org/w/api.php");
  searchUrl.search = new URLSearchParams({ action: "query", list: "geosearch", gscoord: `${center[1]}|${center[0]}`, gsradius: "10000", gslimit: "40", format: "json", origin: "*" }).toString();
  const searchResponse = await fetch(searchUrl.toString());
  if (!searchResponse.ok) throw new Error(`Wikipedia search failed with status ${searchResponse.status}`);
  const searchData = await searchResponse.json();
  const searchResults = searchData?.query?.geosearch ?? [];
  const pageIds = searchResults.map((result) => result.pageid).filter(Boolean);
  if (!pageIds.length) return [];

  // second request gets details in one batch
  const detailUrl = new URL("https://en.wikipedia.org/w/api.php");
  detailUrl.search = new URLSearchParams({ action: "query", pageids: pageIds.join("|"), prop: "extracts|pageimages|info", exintro: "1", explaintext: "1", exsentences: "3", pithumbsize: "600", inprop: "url", format: "json", origin: "*" }).toString();
  const detailResponse = await fetch(detailUrl.toString());
  if (!detailResponse.ok) throw new Error(`Wikipedia detail request failed with status ${detailResponse.status}`);
  const detailData = await detailResponse.json();
  const pages = detailData?.query?.pages ?? {};
  let categoriesByPage = new Map();
  try {
    categoriesByPage = await fetchWikipediaCategories(pageIds);
  } catch (error) {
    console.warn("Wikipedia categories could not be loaded.", error);
  }

  return searchResults.map((result) => {
    const page = {
      ...(pages[String(result.pageid)] ?? {}),
      categoryTitles: categoriesByPage.get(String(result.pageid)) ?? [],
    };
    const category = inferCategory(page);
    const coordinates = [result.lon, result.lat];
    // distance is always from current user center
    return decorateArticleWithState({
      pageid: String(result.pageid),
      title: result.title,
      summary: truncateText(page.extract ?? ""),
      thumbnail: page.thumbnail?.source ?? "",
      url: page.fullurl ?? `https://en.wikipedia.org/?curid=${result.pageid}`,
      coordinates,
      distanceMiles: getDistanceMiles(center, coordinates),
      categoryKey: category.key,
      categoryLabel: category.label,
      categoryColor: category.color,
    });
  }).filter((article) => Number.isFinite(article.coordinates[0]) && Number.isFinite(article.coordinates[1]));
}

// main render
function renderAll() {
  renderTabs();
  renderHeaderStats();
  renderExploreArticles();
  renderCollectionView();
  renderFolderIconPicker();
  renderModal();
  renderMapData();
}

// screen routing
function showTitleNotice(message) {
  if (!refs.titleNotice) return;
  refs.titleNotice.textContent = message;
  refs.titleNotice.classList.remove("is-hidden");
}

function clearTitleNotice() {
  refs.titleNotice?.classList.add("is-hidden");
}

function setTitleLocationLoading(visible, message = "Finding your location...") {
  refs.titleLocationLoading?.classList.toggle("is-hidden", !visible);
  if (refs.titleLocationLoadingText) refs.titleLocationLoadingText.textContent = message;
}

function showTitleScreen(message = "") {
  uiState.activeTab = "title";
  uiState.hasLiveLocation = false;
  uiState.awaitingLocationFix = false;
  uiState.locationTroubleShown = false;
  // stop background location work on home
  stopLocationTracking();
  setTitleLocationLoading(false);
  refs.appShell?.classList.add("app-shell--title");
  renderTabs();
  if (message) showTitleNotice(message);
}

function showAppView(view) {
  clearTitleNotice();
  uiState.activeTab = view === "collection" ? "collection" : "discover";
  refs.appShell?.classList.remove("app-shell--title");
  renderTabs();
  if (uiState.activeTab === "collection") renderCollectionView();
  if (uiState.activeTab === "discover") {
    // mapbox needs a resize after hidden views show
    requestAnimationFrame(() => {
      map.resize();
      renderFogOverlay();
    });
  }
}

function renderTabs() {
  const hasCollection = getUnlockedArticles().length > 0;
  const nearbyCount = uiState.nearbyArticles.filter((article) => !article.unlocked && canUnlockArticle(article)).length;
  refs.tabButtons.forEach((button) => {
    // collection stays locked until first article
    const tab = button.dataset.tab === "collection" ? "collection" : "discover";
    button.classList.toggle("is-active", tab === uiState.activeTab);
    if (tab === "collection") button.disabled = !hasCollection;
  });
  if (refs.nearbyTabBadge) {
    refs.nearbyTabBadge.textContent = String(nearbyCount);
    refs.nearbyTabBadge.setAttribute("aria-label", `${nearbyCount} nearby articles`);
    refs.nearbyTabBadge.classList.toggle("is-hidden", uiState.activeTab !== "collection" || nearbyCount === 0);
  }
  refs.titleScreen?.classList.toggle("is-hidden", uiState.activeTab !== "title");
  refs.appTabs?.classList.toggle("is-hidden", uiState.activeTab === "title");
  refs.exploreView.classList.toggle("is-hidden", uiState.activeTab !== "discover");
  refs.collectionView.classList.toggle("is-hidden", uiState.activeTab !== "collection");
  if (uiState.activeTab !== "discover") refs.statusPill?.classList.add("is-hidden");
  if (refs.titleScreen) refs.titleScreen.hidden = uiState.activeTab !== "title";
  if (refs.appTabs) refs.appTabs.hidden = uiState.activeTab === "title";
  if (refs.exploreView) refs.exploreView.hidden = uiState.activeTab !== "discover";
  if (refs.collectionView) refs.collectionView.hidden = uiState.activeTab !== "collection";
  refs.devModeButton?.classList.toggle("is-hidden", !uiState.devMode || uiState.activeTab !== "discover");
}

// header stats
function renderHeaderStats() {
  const hasCollection = getUnlockedArticles().length > 0;
  // insight = sum of WikiRank quality; popularity stat = sum of international WikiRank popularity (excluding broken EN constant)
  refs.collectionCount.textContent = String(getUnlockedArticles().length);
  refs.strengthCount.textContent = String(getUnlockedArticles().reduce((sum, article) => sum + (Number.isFinite(article.quality) ? article.quality : 0), 0));
  if (refs.popularityTotalCount) {
    refs.popularityTotalCount.textContent = String(getUnlockedArticles().reduce((sum, article) => sum + (Number.isFinite(article.popularity) ? article.popularity : 0), 0));
  }
  if (refs.viewCollectionButton) {
    refs.viewCollectionButton.disabled = !hasCollection;
    refs.viewCollectionButton.title = hasCollection ? "" : "Unlock an article first";
  }
}

// article cards
function buildArticleMedia(article, locked) {
  if (!locked && article.thumbnail) return `<img src="${escapeHtml(article.thumbnail)}" alt="${escapeHtml(article.title)} preview" />`;
  return '<div class="article-card__placeholder"><i class="bi bi-question-lg" aria-hidden="true"></i></div>';
}

function buildPopularityLabel(article) {
  if (Number.isFinite(article.popularity)) return `Popularity ${article.popularity}`;
  if (article.popularityStatus === "loading") return "Popularity evaluating...";
  if (article.popularityStatus === "error") return "Popularity unavailable";
  return "Popularity pending";
}

function buildQualityLabel(article) {
  if (Number.isFinite(article.quality)) return `Quality ${article.quality}`;
  if (article.qualityStatus === "loading") return "Quality evaluating...";
  if (article.qualityStatus === "error") return "Quality unavailable";
  return "Quality pending";
}

function renderExploreArticles() {
  if (!refs.articleList) return;
  if (!uiState.nearbyArticles.length) {
    refs.articleList.innerHTML = '<p class="article-list__empty">No nearby articles found yet. Try refreshing your location or moving to a different area.</p>';
    return;
  }

  refs.articleList.innerHTML = uiState.nearbyArticles.slice().sort((left, right) => left.distanceMiles - right.distanceMiles).map((article) => {
    // locked cards hide names until in range
    const unlockable = !article.unlocked && canUnlockArticle(article);
    const cardClasses = ["article-card", article.unlocked ? "" : "article-card--locked", unlockable ? "article-card--unlockable" : ""].filter(Boolean).join(" ");
    const title = article.unlocked ? article.title : article.lockedTitle;
    const categoryChip = article.unlocked ? `<span class="meta-chip meta-chip--category" style="--chip-color: ${escapeHtml(article.categoryColor)}">${escapeHtml(article.categoryLabel)}</span>` : "";
    const qualityChip = article.unlocked ? `<span class="meta-chip">${escapeHtml(buildQualityLabel(article))}</span>` : "";
    const popularityChip = article.unlocked ? `<span class="meta-chip">${escapeHtml(buildPopularityLabel(article))}</span>` : "";
    const discoveredChip = article.unlocked ? `<span class="meta-chip"><i class="bi bi-calendar3" aria-hidden="true"></i>${escapeHtml(formatDate(article.discoveredAt))}</span>` : "";
    const primaryAction = article.unlocked
      ? `<button class="primary-button" type="button" data-action="details" data-pageid="${escapeHtml(article.pageid)}">View details</button>`
      : `<button class="primary-button" type="button" data-action="unlock" data-pageid="${escapeHtml(article.pageid)}" ${unlockable ? "" : "disabled"}>${unlockable ? "Unlock article" : "Move closer"}</button>`;
    const secondaryAction = article.unlocked
      ? `<a class="ghost-button" href="${escapeHtml(article.url)}" target="_blank" rel="noopener noreferrer">Open article</a>`
      : `<button class="ghost-button" type="button" data-action="focus" data-pageid="${escapeHtml(article.pageid)}">Show on map</button>`;
    const helper = article.unlocked ? "Collected article" : unlockable ? "Within range to unlock" : "Get within 0.1 mi to reveal it";

    return `
      <article class="${cardClasses}" data-pageid="${escapeHtml(article.pageid)}" tabindex="0" role="listitem">
        <div class="article-card__media">${buildArticleMedia(article, !article.unlocked)}</div>
        <div class="article-card__content">
          <div class="article-card__eyebrow">${escapeHtml(helper)}</div>
          <h2 class="article-card__title">${escapeHtml(title)}</h2>
          <div class="card-meta-row">
            <span class="meta-chip"><i class="bi bi-geo-alt" aria-hidden="true"></i>${escapeHtml(formatDistance(article.distanceMiles))}</span>
            ${categoryChip}
            ${qualityChip}
            ${popularityChip}
            ${discoveredChip}
          </div>
          <div class="card-action-row">${primaryAction}${secondaryAction}</div>
        </div>
      </article>
    `;
  }).join("");

  requestMissingMetadataForArticles(uiState.nearbyArticles.filter((article) => article.unlocked));
}

// collection render
function renderCollectionView() {
  if (!refs.collectionList || !refs.folderList) return;
  refs.collectionSort.value = uiState.collectionSort;

  // sort before folder filtering
  const sortedArticles = sortCollectionArticles(getUnlockedArticles());
  const filteredArticles = filterCollectionArticles(sortedArticles);

  // folders render as pills above the list (first chip: all articles)
  const allCount = getUnlockedArticles().length;
  const allPillActive = uiState.collectionScope === "all";
  const allPill = `
      <button class="folder-pill ${allPillActive ? "is-active" : ""}" type="button" data-folder-id="${escapeHtml(COLLECTION_ALL_FOLDER_ID)}"${allPillActive ? ' aria-current="true"' : ""}>
        <i class="bi bi-grid-3x3-gap" aria-hidden="true"></i>
        <span>All</span>
        <span class="folder-pill__count">${allCount}</span>
      </button>
    `;
  const folderPills = appState.folders.map((folder) => {
    const count = getFolderArticleCount(folder.id);
    const iconClass = getFolderIcon(folder.iconKey).className;
    const active = uiState.collectionScope === "folders" && uiState.activeFolderId === folder.id;
    return `
      <button class="folder-pill ${active ? "is-active" : ""}" type="button" data-folder-id="${escapeHtml(folder.id)}"${active ? ' aria-current="true"' : ""}>
        <i class="bi ${escapeHtml(iconClass)}" aria-hidden="true"></i>
        <span>${escapeHtml(folder.name)}</span>
        <span class="folder-pill__count">${count}</span>
      </button>
    `;
  }).join("");
  refs.folderList.innerHTML = allPill + folderPills;

  if (!sortedArticles.length) {
    refs.collectionList.innerHTML = '<p class="article-list__empty">Your collection is empty. Unlock nearby articles from Discover to start filling it in.</p>';
    return;
  }

  if (!filteredArticles.length) {
    refs.collectionList.innerHTML = '<p class="article-list__empty">There are no articles in this view yet. Favorite some finds or place them into folders.</p>';
    return;
  }

  refs.collectionList.innerHTML = filteredArticles.map((article) => {
    const expanded = uiState.expandedCollectionIds.has(article.pageid);
    const customFolders = appState.folders.filter((folder) => !folder.system);
    const devDeleteButton = uiState.devMode
      ? `<button class="ghost-button dev-delete-button" type="button" data-action="delete-article" data-pageid="${escapeHtml(article.pageid)}">Delete</button>`
      : "";
    const assignedCustomFolders = article.folderIds
      .map((folderId) => appState.folders.find((folder) => folder.id === folderId))
      .filter((folder) => folder && !folder.system);
    const folderIconsHtml = assignedCustomFolders.length
      ? `<span class="collection-item__folder-icons" aria-label="In folders: ${escapeHtml(assignedCustomFolders.map((f) => f.name).join(", "))}">${assignedCustomFolders
          .map(
            (folder) =>
              `<span class="collection-item__folder-icon" title="${escapeHtml(folder.name)}"><i class="bi ${escapeHtml(getFolderIcon(folder.iconKey).className)}" aria-hidden="true"></i></span>`
          )
          .join("")}</span>`
      : "";
    // assignments only show when details expand
    const assignments = customFolders.length
      ? customFolders.map((folder) => {
          const checked = article.folderIds.includes(folder.id) ? "checked" : "";
          return `
            <label class="folder-assignment" data-action="folder-toggle" data-folder-id="${escapeHtml(folder.id)}" data-pageid="${escapeHtml(article.pageid)}">
              <input type="checkbox" tabindex="-1" ${checked} />
              <i class="bi ${escapeHtml(getFolderIcon(folder.iconKey).className)}" aria-hidden="true"></i>
              <span>${escapeHtml(folder.name)}</span>
            </label>
          `;
        }).join("")
      : '';

    const titleClusterClass =
      "collection-item__title-cluster" + (assignedCustomFolders.length ? " collection-item__title-cluster--has-folders" : "");

    return `
      <article class="collection-item" data-pageid="${escapeHtml(article.pageid)}" role="listitem" style="--item-accent: ${escapeHtml(article.categoryColor)}">
        <div class="collection-item__bar">
          <button type="button" class="collection-item__toggle" data-action="toggle-expand" data-pageid="${escapeHtml(article.pageid)}" aria-expanded="${expanded ? "true" : "false"}" aria-controls="collection-expanded-${escapeHtml(article.pageid)}">
            <span class="${titleClusterClass}"><span class="collection-item__title">${escapeHtml(article.title)}</span>${folderIconsHtml}</span>
          </button>
          <button class="collection-item__favorite inline-icon-button ${article.isFavorite ? "is-active" : ""}" type="button" data-action="favorite-toggle" data-pageid="${escapeHtml(article.pageid)}" aria-label="${article.isFavorite ? "Remove from favorites" : "Add to favorites"}">
            <i class="bi ${article.isFavorite ? "bi-heart-fill" : "bi-heart"}" aria-hidden="true"></i>
          </button>
        </div>
        <div class="collection-item__expanded ${expanded ? "" : "is-hidden"}" id="collection-expanded-${escapeHtml(article.pageid)}" role="region"${expanded ? "" : " hidden"}>
          <div class="collection-item__location">
            <i class="bi bi-geo-alt-fill" aria-hidden="true"></i>
            <span>${escapeHtml(buildLocationLabel(article.location))}</span>
          </div>
          <div class="collection-item__scores">
            <span class="meta-chip meta-chip--category" style="--chip-color: ${escapeHtml(article.categoryColor)}">${escapeHtml(article.categoryLabel)}</span>
            <span class="meta-chip">${escapeHtml(buildQualityLabel(article))}</span>
            <span class="meta-chip">${escapeHtml(buildPopularityLabel(article))}</span>
          </div>
          <div class="collection-item__actions">
            <button type="button" class="ghost-button" data-action="focus-map" data-pageid="${escapeHtml(article.pageid)}">Show on map</button>
            <a class="ghost-button collection-item__article-link" href="${escapeHtml(article.url)}" target="_blank" rel="noopener noreferrer">View article</a>
            ${devDeleteButton}
          </div>
          ${assignments ? `<div class="folder-assignment-list">${assignments}</div>` : ""}
        </div>
      </article>
    `;
  }).join("");

  requestMissingMetadataForArticles(filteredArticles);
}

function getFolderIcon(iconKey) {
  return FOLDER_ICON_OPTIONS.find((option) => option.key === iconKey) || FOLDER_ICON_OPTIONS[0];
}

// folder ui
function renderFolderIconPicker() {
  if (!refs.folderIconPicker) return;
  refs.folderIconPicker.innerHTML = FOLDER_ICON_OPTIONS.map((option) => `
    <button class="folder-icon-button ${option.key === uiState.selectedFolderIcon ? "is-selected" : ""}" type="button" data-folder-icon="${escapeHtml(option.key)}" aria-label="${escapeHtml(option.label)}">
      <i class="bi ${escapeHtml(option.className)}" aria-hidden="true"></i>
    </button>
  `).join("");

  refs.folderIconPicker.querySelectorAll("[data-folder-icon]").forEach((button) => {
    button.addEventListener("click", () => {
      uiState.selectedFolderIcon = button.dataset.folderIcon;
      renderFolderIconPicker();
    });
  });
}

function createFolderFromInput() {
  const name = refs.folderNameInput?.value.trim();
  if (!name) return setStatus("Give the folder a name first.", "error");
  if (appState.folders.some((folder) => folder.name.toLowerCase() === name.toLowerCase())) return setStatus("That folder name already exists.", "error");

  const folder = { id: `folder-${Date.now().toString(36)}`, name, iconKey: uiState.selectedFolderIcon, system: false };
  appState.folders.push(folder);
  persistState();
  uiState.collectionScope = "folders";
  uiState.activeFolderId = folder.id;
  uiState.activeTab = "collection";
  refs.folderNameInput.value = "";
  setStatus(`Created folder ${name}.`, "success");
  renderAll();
}

function getFolderArticleCount(folderId) {
  return folderId === "favorites"
    ? getUnlockedArticles().filter((article) => article.isFavorite).length
    : getUnlockedArticles().filter((article) => article.folderIds.includes(folderId)).length;
}

// sorting
function sortCollectionArticles(articles) {
  return articles.slice().sort((left, right) => {
    switch (uiState.collectionSort) {
      case "date-asc":
        return new Date(left.discoveredAt) - new Date(right.discoveredAt);
      case "date-desc":
        return new Date(right.discoveredAt) - new Date(left.discoveredAt);
      case "quality-asc":
        return compareNumber(left.quality, right.quality, 1) || compareText(left.title, right.title);
      case "quality-desc":
        return compareNumber(left.quality, right.quality, -1) || compareText(left.title, right.title);
      case "popularity-asc":
        return compareNumber(left.popularity, right.popularity, 1) || compareText(left.title, right.title);
      case "popularity-desc":
        return compareNumber(left.popularity, right.popularity, -1) || compareText(left.title, right.title);
      case "category":
        return compareText(left.categoryLabel, right.categoryLabel) || compareText(left.title, right.title);
      case "city":
      case "region":
      case "country":
      case "continent":
        return compareText(buildShortLocationValue(left.location, uiState.collectionSort), buildShortLocationValue(right.location, uiState.collectionSort)) || compareText(left.title, right.title);
      default:
        return 0;
    }
  });
}

function compareNumber(left, right, direction) {
  const safeLeft = Number.isFinite(left) ? left : direction === -1 ? -1 : Number.POSITIVE_INFINITY;
  const safeRight = Number.isFinite(right) ? right : direction === -1 ? -1 : Number.POSITIVE_INFINITY;
  return direction === -1 ? safeRight - safeLeft : safeLeft - safeRight;
}

function compareText(left, right) {
  return String(left || "~").localeCompare(String(right || "~"), undefined, { sensitivity: "base" });
}

function filterCollectionArticles(articles) {
  if (uiState.collectionScope !== "folders") return articles;
  if ((uiState.activeFolderId || "favorites") === "favorites") return articles.filter((article) => article.isFavorite);
  return articles.filter((article) => article.folderIds.includes(uiState.activeFolderId));
}

function getArticleForDisplay(pageid) {
  return getUnlockedRecord(pageid) || uiState.nearbyArticles.find((article) => article.pageid === String(pageid)) || null;
}

// article actions
function handleExploreAction(action, pageid) {
  if (!pageid) return;
  if (action === "unlock") return handleExploreCardActivate(pageid);
  if (action === "details") {
    focusArticleOnMap(getArticleForDisplay(pageid));
    return showModal(pageid, "detail");
  }
  if (action === "focus") focusArticleOnMap(getArticleForDisplay(pageid), true);
}

function handleExploreCardActivate(pageid) {
  const article = uiState.nearbyArticles.find((entry) => entry.pageid === String(pageid));
  if (!article) return;
  if (article.unlocked) {
    // unlocked cards open details
    focusArticleOnMap(article);
    return showModal(pageid, "detail");
  }
  if (!canUnlockArticle(article)) {
    // locked cards must be nearby
    focusArticleOnMap(article, true);
    return setStatus(`You need to get within 0.1 mi to unlock this article. It is currently ${formatDistance(article.distanceMiles)}.`, "error");
  }
  unlockArticle(article);
}

function handleCollectionAction(action, pageid, folderId) {
  const article = getUnlockedRecord(pageid);
  if (!article && action !== "delete-article") return;

  if (action === "delete-article" && uiState.devMode) {
    delete appState.unlockedArticles[String(pageid)];
    uiState.expandedCollectionIds.delete(String(pageid));
    persistState();
    updateNearbyArticlesFromState();
    return renderAll();
  }

  if (action === "favorite-toggle") {
    article.isFavorite = !article.isFavorite;
    persistState();
    return renderAll();
  }

  if (action === "toggle-expand") {
    if (uiState.expandedCollectionIds.has(pageid)) uiState.expandedCollectionIds.delete(pageid);
    else uiState.expandedCollectionIds.add(pageid);
    return renderCollectionView();
  }

  if (action === "focus-map") {
    showAppView("discover");
    focusArticleOnMap(article);
    return showModal(pageid, "detail");
  }

  if (action === "folder-toggle" && folderId) {
    const nextIds = new Set(article.folderIds);
    if (nextIds.has(folderId)) nextIds.delete(folderId);
    else nextIds.add(folderId);
    article.folderIds = Array.from(nextIds);
    persistState();
    renderCollectionView();
  }
}

// modal
function showModal(pageid, mode = "detail") {
  const article = getUnlockedRecord(pageid);
  if (!article) return;
  uiState.modalPageId = String(pageid);
  uiState.modalMode = mode;
  renderModal();
}

function closeModal() {
  const closedPageId = uiState.modalPageId;
  const closedMode = uiState.modalMode;
  const shouldContinueTutorial = uiState.tutorial.active && (
    closedMode === "unlock" ||
    uiState.tutorial.step === "unlock-modal" ||
    String(closedPageId) === String(uiState.tutorial.unlockedPageId)
  );
  uiState.modalPageId = null;
  refs.modalShell.classList.add("is-hidden");
  refs.modalShell.hidden = true;
  refs.modalShell.setAttribute("aria-hidden", "true");
  if (shouldContinueTutorial) {
    uiState.tutorial.step = "map-controls";
    window.setTimeout(() => showMapControlTutorial(0), 150);
  }
}

function renderModal() {
  if (!uiState.modalPageId) {
    refs.modalShell.classList.add("is-hidden");
    refs.modalShell.setAttribute("aria-hidden", "true");
    return;
  }

  const article = getUnlockedRecord(uiState.modalPageId);
  if (!article) return closeModal();

  refs.modalShell.classList.remove("is-hidden");
  refs.modalShell.hidden = false;
  refs.modalShell.setAttribute("aria-hidden", "false");
  refs.modalBadge.textContent = uiState.modalMode === "unlock" ? "Unlocked!" : "Collected article";
  refs.modalHeading.textContent = article.title;
  refs.modalLink.href = article.url;
  refs.modalCategory.textContent = article.categoryLabel;
  refs.modalCategory.style.setProperty("--chip-color", article.categoryColor);
  refs.modalCategory.classList.add("meta-chip--category");
  refs.modalQuality.textContent = buildQualityLabel(article);
  if (refs.modalPopularity) refs.modalPopularity.textContent = buildPopularityLabel(article);
  refs.modalDate.textContent = `Discovered ${formatDate(article.discoveredAt)}`;
  refs.modalLocation.textContent = buildLocationLabel(article.location);
  refs.modalCategory.closest(".modal-meta")?.classList.add("is-hidden");

  if (uiState.modalMode === "unlock") {
    refs.modalSummary.textContent = ensureTrailingEllipsis(article.summary);
    refs.modalSummary.classList.remove("is-hidden");
  } else {
    refs.modalSummary.textContent = "";
    refs.modalSummary.classList.add("is-hidden");
  }

  const modalMedia = refs.modalImage.closest(".modal-media");
  if (article.thumbnail) {
    refs.modalImage.src = article.thumbnail;
    refs.modalImage.alt = `${article.title} preview`;
    modalMedia.classList.remove("is-hidden");
    refs.modalImage.classList.remove("is-hidden");
    refs.modalImageFallback.classList.add("is-hidden");
  } else {
    refs.modalImage.removeAttribute("src");
    modalMedia.classList.add("is-hidden");
    refs.modalImage.classList.add("is-hidden");
    refs.modalImageFallback.classList.remove("is-hidden");
  }
}

// unlock flow
async function unlockArticle(article) {
  if (getUnlockedRecord(article.pageid)) return showModal(article.pageid, "detail");

  // save revealed article locally
  const record = normalizeUnlockedArticle({
    pageid: article.pageid,
    title: article.title,
    summary: article.summary,
    thumbnail: article.thumbnail,
    url: article.url,
    coordinates: article.coordinates,
    discoveredAt: new Date().toISOString(),
    isFavorite: false,
    folderIds: [],
    qualityStatus: "loading",
    popularityStatus: "loading",
    categoryKey: article.categoryKey,
    categoryLabel: article.categoryLabel,
    categoryColor: article.categoryColor,
  });

  appState.unlockedArticles[record.pageid] = record;
  persistState();
  updateNearbyArticlesFromState();
  setStatus(`Unlocked ${article.title}!`, "success");
  renderAll();
  showModal(record.pageid, "unlock");
  if (uiState.tutorial.active && String(record.pageid) === String(uiState.tutorial.targetPageId)) {
    uiState.tutorial.step = "unlock-modal";
    uiState.tutorial.unlockedPageId = String(record.pageid);
  }
  focusArticleOnMap(record);
  // enrich WikiRank scores and place after unlock
  requestMissingMetadataForArticles([record]);
}

// article metadata
function wikiRankInternationalPopularitySum(result, queryLang) {
  let sum = 0;
  for (const [code, entry] of Object.entries(result)) {
    if (code === queryLang || !entry || typeof entry !== "object") continue;
    const p = entry.popularity;
    if (Number.isFinite(p)) sum += p;
  }
  return sum;
}

function enqueueWikiRankFetch(pageid) {
  const id = String(pageid);
  if (uiState.wikiRankRequests.has(id)) return;

  const record = getUnlockedRecord(id);
  if (!record) return;
  const needQuality = !Number.isFinite(record.quality) && record.qualityStatus !== "error";
  const needPopularity = !Number.isFinite(record.popularity) && record.popularityStatus !== "error";
  if (!needQuality && !needPopularity) return;

  if (uiState.wikiRankQueueSet.has(id)) return;
  uiState.wikiRankQueueSet.add(id);
  uiState.wikiRankQueue.push(id);
  pumpWikiRankQueue();
}

function pumpWikiRankQueue() {
  while (uiState.wikiRankInflight < WIKIRANK_PARALLEL && uiState.wikiRankQueue.length) {
    const id = uiState.wikiRankQueue.shift();
    uiState.wikiRankQueueSet.delete(id);
    uiState.wikiRankInflight++;
    fetchWikiRankForArticle(id)
      .catch(() => {})
      .finally(() => {
        uiState.wikiRankInflight--;
        pumpWikiRankQueue();
      });
  }
}

function requestMissingMetadataForArticles(articles) {
  articles.forEach((article) => {
    const record = getUnlockedRecord(article.pageid);
    if (!record) return;
    if (!record.location) fetchLocationForArticle(record.pageid);
    enqueueWikiRankFetch(record.pageid);
  });
}

async function fetchWikiRankForArticle(pageid) {
  const record = getUnlockedRecord(pageid);
  if (!record || uiState.wikiRankRequests.has(pageid)) return;

  const needQuality = !Number.isFinite(record.quality) && record.qualityStatus !== "error";
  const needPopularity = !Number.isFinite(record.popularity) && record.popularityStatus !== "error";
  if (!needQuality && !needPopularity) return;

  uiState.wikiRankRequests.add(pageid);
  if (needQuality) record.qualityStatus = "loading";
  if (needPopularity) record.popularityStatus = "loading";
  persistState();
  renderAll();

  try {
    const url = new URL(WIKIRANK_PROXY_PATH, window.location.href);
    url.search = new URLSearchParams({ name: record.title, lang: WIKIRANK_QUERY_LANG }).toString();
    const response = await fetch(url.toString());
    if (response.status === 404) {
      throw new Error("WikiRank proxy not found. Start DiscoverWiki with `python server.py`.");
    }
    if (!response.ok) throw new Error(`WikiRank request failed with status ${response.status}`);
    const data = await response.json();
    const resultObj = data?.result;
    const en = typeof resultObj === "object" && resultObj !== null ? resultObj.en : null;
    const q = en?.quality;

    if (needQuality) {
      if (Number.isFinite(q)) {
        record.quality = Math.max(1, Math.round(q));
        record.qualityStatus = "ready";
      } else {
        record.qualityStatus = "error";
      }
    }
    if (needPopularity) {
      if (typeof resultObj === "object" && resultObj !== null) {
        record.popularity = Math.max(0, Math.round(wikiRankInternationalPopularitySum(resultObj, WIKIRANK_QUERY_LANG)));
        record.popularityMetric = WIKIRANK_POPULARITY_METRIC;
        record.popularityStatus = "ready";
      } else {
        record.popularityStatus = "error";
      }
    }
  } catch (error) {
    console.error(`Failed to fetch WikiRank data for ${record.title}`, error);
    if (String(error?.message || "").includes("python server.py")) {
      setStatus("WikiRank needs the local proxy. Start the app with `python server.py`.", "error");
    }
    if (needQuality) record.qualityStatus = "error";
    if (needPopularity) record.popularityStatus = "error";
  } finally {
    uiState.wikiRankRequests.delete(pageid);
    persistState();
    renderAll();
  }
}

async function fetchLocationForArticle(pageid) {
  const record = getUnlockedRecord(pageid);
  if (!record || record.location || uiState.locationRequests.has(pageid)) return;

  uiState.locationRequests.add(pageid);
  try {
    // reverse geocode article coordinates
    const [longitude, latitude] = record.coordinates;
    const url = new URL("https://api.bigdatacloud.net/data/reverse-geocode-client");
    url.search = new URLSearchParams({ latitude: String(latitude), longitude: String(longitude), localityLanguage: "en" }).toString();
    const response = await fetch(url.toString());
    if (!response.ok) throw new Error(`Reverse geocode failed with status ${response.status}`);
    const data = await response.json();
    record.location = normalizeLocation({
      city: data.city || data.locality || "",
      region: data.principalSubdivision || "",
      country: cleanCountryName(data.countryName),
      continent: data.continent || "",
    });
    persistState();
    renderAll();
  } catch (error) {
    console.error(`Failed to reverse geocode ${record.title}`, error);
  } finally {
    uiState.locationRequests.delete(pageid);
  }
}

// user marker
function setUserLocationMarker(center) {
  if (userLocationMarker) userLocationMarker.remove();
  const markerElement = document.createElement("div");
  markerElement.className = "user-location-marker";
  markerElement.innerHTML = '<div class="user-location-marker__pulse"></div><div class="user-location-marker__dot"></div>';
  userLocationMarker = new mapboxgl.Marker({ element: markerElement, anchor: "center" }).setLngLat(center).addTo(map);
}

// live location
function updateNearbyArticleDistances(center) {
  uiState.nearbyArticles = uiState.nearbyArticles.map((article) => decorateArticleWithState({
    ...article,
    distanceMiles: getDistanceMiles(center, article.coordinates),
  }));
}

function shouldLoadArticlesForCenter(center, forceRefresh) {
  // avoid refetching on tiny gps drift
  if (forceRefresh || !uiState.lastArticleCenter || !uiState.nearbyArticles.length) return true;
  return getDistanceMiles(uiState.lastArticleCenter, center) >= ARTICLE_REFRESH_DISTANCE_MILES;
}

async function handleLocationUpdate(position) {
  if (uiState.devMode) return;
  console.info("watchPosition returned a location.", {
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
    accuracy: position.coords.accuracy,
  });
  try {
    // gps callbacks update distances first
    clearLocationRetry();
    clearLocationHelpTimer();
    await applyLocationPosition(position, { recenter: !uiState.hasLiveLocation });
  } catch (error) {
    console.error("Failed to update nearby articles for current location", error);
    setStatus("Location updated, but nearby articles could not refresh.", "error");
  }
}

async function applyLocationPosition(position, { forceRefresh = false, recenter = false } = {}) {
  const center = positionToCenter(position);
  const isInitialLocation = !uiState.hasLiveLocation;
  // first location uses jump instead of fly
  uiState.hasLiveLocation = true;
  uiState.awaitingLocationFix = false;
  clearLocationHelpTimer();
  uiState.currentCenter = center;
  recordFogTrailSample(center);
  setUserLocationMarker(center);
  updateNearbyArticleDistances(center);
  renderAll();

  if (recenter && isInitialLocation) {
    map.jumpTo({ center, zoom: 15.8 });
  }

  if (shouldLoadArticlesForCenter(center, forceRefresh)) {
    // refetch articles after meaningful movement
    await loadArticlesForCenter(center, false, { recenter, instant: isInitialLocation });
    return;
  }

  if (recenter && !isInitialLocation) map.flyTo({ center, zoom: 15.8, essential: true });
  setStatus("Location updated. Keep moving to discover more articles.", "success");
}

function handleLocationError(error) {
  if (error?.code === 1) {
    // permission denial returns home
    console.error(error);
    showTitleScreen(getLocationFailureMessage(error));
    return;
  }
  if (uiState.activeTab === "discover" && !uiState.hasLiveLocation) {
    // timeout waits on the map
    console.warn("Waiting for an initial location fix.", error);
    uiState.awaitingLocationFix = true;
    setStatus(getLocationWaitingMessage(), "loading");
    showLocationTroublePopup();
    scheduleLocationRetry();
    return;
  }
  if (error?.code === 3 && uiState.hasLiveLocation) {
    console.warn("Waiting for a fresh location update; using the last known position.", error);
    setStatus("Using your last known location while waiting for a fresh GPS fix.", "loading");
    return;
  }
  if (uiState.hasLiveLocation) {
    console.warn("Live location update failed; keeping the last known position.", error);
    setStatus("Live location paused. Check location permissions or signal.", "error");
    return;
  }
  console.warn("Location is still pending.", error);
  uiState.awaitingLocationFix = true;
  setStatus(getLocationWaitingMessage(), "loading");
  showLocationTroublePopup();
  scheduleLocationRetry();
}

async function locateAndLoadArticles(options = {}) {
  if (uiState.devMode) return useMapCenterAsLocation();
  let position;
  try {
    setStatus("Refreshing your live location...", "loading");
    scheduleLocationHelp();
    position = await getBestCurrentPosition();
  } catch (error) {
    if (error?.code !== 1 && uiState.activeTab === "discover") {
      console.warn("Manual location refresh is still waiting for a fix.", error);
      uiState.awaitingLocationFix = true;
      setStatus(getLocationWaitingMessage(), "loading");
      startLocationTracking();
      scheduleLocationRetry();
      return;
    }
    handleLocationError(error);
    return;
  }

  try {
    await applyLocationPosition(position, options);
  } catch (error) {
    console.error("Failed to refresh nearby articles", error);
    setStatus("Location updated, but nearby articles could not refresh.", "error");
  }
}

async function useMapCenterAsLocation() {
  const center = map.getCenter();
  // fake a position shaped object from map center
  const fallbackPosition = {
    coords: {
      longitude: center.lng,
      latitude: center.lat,
      accuracy: Number.POSITIVE_INFINITY,
    },
  };

  console.info("Using map center as dev location.", fallbackPosition.coords);
  setStatus("Using the map center for dev mode...", "loading");
  clearLocationRetry();
  clearLocationHelpTimer();
  try {
    await applyLocationPosition(fallbackPosition, { forceRefresh: true, recenter: false });
    startLocationTracking();
  } catch (error) {
    console.error("Failed to load articles for the dev map center.", error);
    setStatus("Could not load nearby articles for this map center.", "error");
  }
}

// map search
async function handleMapSearch(event) {
  event.preventDefault();
  const query = refs.mapSearchInput?.value.trim();
  if (!query) return;

  setStatus("Searching for that location...", "loading");
  try {
    // mapbox geocoder moves the map only
    const url = new URL(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json`);
    url.search = new URLSearchParams({
      access_token: mapboxgl.accessToken,
      limit: "1",
    }).toString();
    const response = await fetch(url.toString());
    if (!response.ok) throw new Error(`Mapbox search failed with status ${response.status}`);
    const data = await response.json();
    const feature = data?.features?.[0];
    if (!feature?.center) {
      setStatus("No matching location found.", "error");
      return;
    }
    map.flyTo({ center: feature.center, zoom: 15.2, essential: true });
    refs.mapSearchInput.blur();
    setStatus(`Zoomed to ${feature.place_name || query}.`, "success");
  } catch (error) {
    console.error(error);
    setStatus("Location search failed. Try a more specific place name.", "error");
  }
}

// nearby articles
async function loadArticlesForCenter(center, fallback, { recenter = true, instant = false } = {}) {
  if (uiState.isLoadingArticles) return;
  // guard against overlapping wiki requests
  uiState.isLoadingArticles = true;
  setStatus("Loading nearby Wikipedia articles...", "loading");
  articlePopup.remove();
  try {
    const articles = (await fetchWikipediaArticles(center)).sort((left, right) => left.distanceMiles - right.distanceMiles);
    uiState.nearbyArticles = articles;
    uiState.lastArticleCenter = [...center];
    renderAll();
    if (uiState.tutorial.active && uiState.tutorial.waitingForArticles) {
      showNearestArticleTutorial();
    }

    if (!articles.length) {
      if (recenter) {
        const moveOptions = { center, zoom: 15.2, essential: true };
        if (instant) map.jumpTo(moveOptions);
        else map.flyTo(moveOptions);
      }
      return setStatus(fallback ? "No nearby articles found in New York." : "No nearby articles found here.", "error");
    }

    const furthestMiles = articles[articles.length - 1].distanceMiles;
    if (recenter) {
      const moveOptions = { center, zoom: zoomForMaxDistanceMiles(Math.max(furthestMiles, 0.22)), essential: true };
      if (instant) map.jumpTo(moveOptions);
      else map.flyTo(moveOptions);
    }
    setStatus(fallback ? "Showing New York while location is unavailable." : "Live location is on. Click a nearby article to unlock it.", "success");
  } finally {
    uiState.isLoadingArticles = false;
  }
}

// map focus
function focusArticleOnMap(article, locked = false) {
  if (!article?.coordinates) return;
  map.flyTo({ center: article.coordinates, zoom: 16.2, essential: true });
  // deprecated mobile flow no longer uses map popups
  // openArticlePopup(article, { locked });
}

function buildPopupHtml(article, { locked = false } = {}) {
  const imageHtml = !locked && article.thumbnail
    ? `<img class="map-popup__image" src="${escapeHtml(article.thumbnail)}" alt="${escapeHtml(article.title)} preview" />`
    : '<div class="map-popup__placeholder"><i class="bi bi-question-lg" aria-hidden="true"></i></div>';
  const summary = locked ? "This article is still hidden." : article.summary;
  const helper = locked
    ? article.distanceMiles <= DISCOVER_RADIUS_MILES
      ? "Within range. Click to unlock."
      : `Too far to unlock. ${formatDistance(article.distanceMiles)}.`
    : Number.isFinite(article.distanceMiles)
      ? formatDistance(article.distanceMiles)
      : "Collected article";

  return `
    <article class="map-popup">
      ${imageHtml}
      <div class="map-popup__body">
        <h3 class="map-popup__title">${escapeHtml(locked ? maskTitle(article.title) : article.title)}</h3>
        <p class="map-popup__summary">${escapeHtml(summary)}</p>
        <p class="map-popup__helper">${escapeHtml(helper)}</p>
      </div>
    </article>
  `;
}

function openArticlePopup(article, options = {}) {
  articlePopup.setLngLat(article.coordinates).setHTML(buildPopupHtml(article, options)).addTo(map);
}

function articlesToGeoJSON(articles, mode) {
  // mapbox layers read simple feature props
  return {
    type: "FeatureCollection",
    features: articles.map((article) => ({
      type: "Feature",
      geometry: { type: "Point", coordinates: article.coordinates },
      properties: {
        pageid: article.pageid,
        color: article.categoryColor,
        unlockable: mode === "locked" ? canUnlockArticle(article) : false,
      },
    })),
  };
}

function getArticleFeaturesAtPoint(point) {
  if (!mapLayersInitialized) return [];
  return map.queryRenderedFeatures(point, {
    layers: ["locked-articles-circle", "locked-articles-label", "unlocked-articles-circle"],
  });
}

async function handleDevMapClick(event) {
  if (!uiState.devMode || uiState.activeTab !== "discover") return;
  if (getArticleFeaturesAtPoint(event.point).length) return;

  const fallbackPosition = {
    coords: {
      longitude: event.lngLat.lng,
      latitude: event.lngLat.lat,
      accuracy: 0,
    },
  };

  await applyLocationPosition(fallbackPosition, { forceRefresh: true, recenter: false });
}

// map layers
function ensureMapLayers() {
  if (!mapIsReady || mapLayersInitialized) return;

  // sources are updated after each render
  map.addSource("unlocked-articles", { type: "geojson", data: articlesToGeoJSON([], "unlocked") });
  map.addSource("locked-articles", { type: "geojson", data: articlesToGeoJSON([], "locked") });

  map.addLayer({
    id: "locked-articles-glow",
    type: "circle",
    source: "locked-articles",
    minzoom: 11.5,
    paint: {
      "circle-radius": ["interpolate", ["linear"], ["zoom"], 8, 11, 14, 18, 17, 24],
      "circle-color": ["case", ["boolean", ["get", "unlockable"], false], "#ff8f3d", "#b6b4b1"],
      "circle-opacity": ["case", ["boolean", ["get", "unlockable"], false], 0.42, 0.2],
      "circle-blur": 0.7,
    },
  });

  // locked articles draw as question marks
  map.addLayer({
    id: "locked-articles-circle",
    type: "circle",
    source: "locked-articles",
    minzoom: 11.5,
    paint: {
      "circle-radius": ["interpolate", ["linear"], ["zoom"], 8, 5, 14, 7, 17, 9],
      "circle-color": ["case", ["boolean", ["get", "unlockable"], false], "#ffe1c9", "#d4d0cc"],
      "circle-stroke-color": ["case", ["boolean", ["get", "unlockable"], false], "#f16622", "#8f8a84"],
      "circle-stroke-width": 1.5,
    },
  });

  // unlocked articles draw as category dots
  map.addLayer({
    id: "locked-articles-label",
    type: "symbol",
    source: "locked-articles",
    minzoom: 11.5,
    layout: {
      "text-field": "?",
      "text-size": ["interpolate", ["linear"], ["zoom"], 8, 13, 15, 16],
      "text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
      "text-allow-overlap": true,
      "text-ignore-placement": true,
    },
    paint: {
      "text-color": ["case", ["boolean", ["get", "unlockable"], false], "#9d4708", "#6d5c4a"],
    },
  });

  map.addLayer({
    id: "unlocked-articles-circle",
    type: "circle",
    source: "unlocked-articles",
    minzoom: 11.5,
    paint: {
      "circle-radius": ["interpolate", ["linear"], ["zoom"], 8, 4, 12, 7, 16, 10],
      "circle-color": ["get", "color"],
      "circle-stroke-color": "#ffffff",
      "circle-stroke-width": 1.7,
      "circle-opacity": 0.97,
    },
  });

  ["locked-articles-circle", "locked-articles-label", "unlocked-articles-circle"].forEach((layerId) => {
    map.on("mouseenter", layerId, () => {
      map.getCanvas().style.cursor = "pointer";
    });
    map.on("mouseleave", layerId, () => {
      map.getCanvas().style.cursor = "";
      // deprecated mobile flow no longer uses map popups
      // articlePopup.remove();
    });
  });

  // deprecated mobile flow no longer uses hover map popups
  // map.on("mousemove", "locked-articles-circle", handleLockedLayerHover);
  // map.on("mousemove", "locked-articles-label", handleLockedLayerHover);
  // map.on("mousemove", "unlocked-articles-circle", handleUnlockedLayerHover);
  map.on("click", "locked-articles-circle", handleLockedLayerClick);
  map.on("click", "locked-articles-label", handleLockedLayerClick);
  map.on("click", "unlocked-articles-circle", (event) => {
    const feature = event.features?.[0];
    const pageid = feature?.properties?.pageid;
    if (!pageid) return;
    showModal(pageid, "detail");
    focusArticleOnMap(getUnlockedRecord(pageid));
  });

  mapLayersInitialized = true;
}

function handleLockedLayerHover(event) {
  const pageid = event.features?.[0]?.properties?.pageid;
  const article = uiState.nearbyArticles.find((entry) => entry.pageid === String(pageid));
  // deprecated mobile flow no longer uses map popups
  // if (article) openArticlePopup(article, { locked: true });
}

function handleUnlockedLayerHover(event) {
  const pageid = event.features?.[0]?.properties?.pageid;
  const article = getUnlockedRecord(pageid);
  // deprecated mobile flow no longer uses map popups
  // if (article) openArticlePopup(article, { locked: false });
}

function handleLockedLayerClick(event) {
  const pageid = event.features?.[0]?.properties?.pageid;
  if (pageid) handleExploreCardActivate(pageid);
}

function renderMapData() {
  if (!mapIsReady || !map.getSource("unlocked-articles") || !map.getSource("locked-articles")) return;
  const unlockedArticles = getUnlockedArticles();
  // only nearest locked articles show
  const lockedArticles = uiState.nearbyArticles.filter((article) => !article.unlocked).sort((left, right) => left.distanceMiles - right.distanceMiles).slice(0, MAX_LOCKED_MARKERS);
  map.getSource("unlocked-articles").setData(articlesToGeoJSON(unlockedArticles, "unlocked"));
  map.getSource("locked-articles").setData(articlesToGeoJSON(lockedArticles, "locked"));
  renderFogOverlay();
}

function milesToPixelRadius(miles, coordinates) {
  // Real-world miles → screen pixels at current zoom (scales when zoom changes).
  const lat = coordinates[1];
  const lon = coordinates[0];
  const milesPerDegLat = 69.172;
  const milesPerDegLon = 69.172 * Math.max(Math.cos((lat * Math.PI) / 180), 0.15);
  const dLat = miles / milesPerDegLat;
  const dLon = miles / milesPerDegLon;
  const center = map.project(coordinates);
  const east = map.project([lon + dLon, lat]);
  const north = map.project([lon, lat + dLat]);
  const rx = Math.abs(east.x - center.x);
  const ry = Math.abs(north.y - center.y);
  return (rx + ry) / 2;
}

function pointIsNearViewport(point, width, height, padding) {
  return point.x >= -padding && point.x <= width + padding && point.y >= -padding && point.y <= height + padding;
}

function recordFogTrailSample(center) {
  if (uiState.devMode && !uiState.devFogTrailRecording) return;
  const lng = center[0];
  const lat = center[1];
  if (!Number.isFinite(lng) || !Number.isFinite(lat)) return;
  if (!Array.isArray(appState.fogTrailSamples)) appState.fogTrailSamples = [];

  const here = [lng, lat];
  const samples = appState.fogTrailSamples;
  if (samples.length) {
    const last = samples[samples.length - 1];
    if (getDistanceMiles(here, [last.lng, last.lat]) < FOG_TRAIL_DEDUPE_MILES) return;
  }
  const overlapsExisting = samples.some((s) => getDistanceMiles(here, [s.lng, s.lat]) < FOG_TRAIL_DEDUPE_MILES);
  if (overlapsExisting) return;

  samples.push({ lng, lat });
  if (samples.length > MAX_FOG_TRAIL_SAMPLES) {
    samples.splice(0, samples.length - MAX_FOG_TRAIL_SAMPLES);
  }
  persistState();
  if (mapIsReady) renderFogOverlay();
}

// fog overlay
function renderFogOverlay() {
  if (!mapIsReady || !refs.fogOverlay) return;
  const width = map.getContainer().clientWidth;
  const height = map.getContainer().clientHeight;
  if (!width || !height) return;
  const fogPadding = 240;

  const articleHoles = getUnlockedArticles()
    .map((article) => {
      const point = map.project(article.coordinates);
      const radiusPx = milesToPixelRadius(DISCOVER_RADIUS_MILES, article.coordinates);
      const radius = Math.max(3, radiusPx);
      if (!pointIsNearViewport(point, width, height, radius + fogPadding)) return null;
      return { point, radius };
    })
    .filter(Boolean);

  const trailHoles = (appState.fogTrailSamples ?? []).map((sample) => {
    const coordinates = [sample.lng, sample.lat];
    const point = map.project(coordinates);
    const radiusPx = milesToPixelRadius(FOG_TRAIL_RADIUS_MILES, coordinates);
    const radius = Math.max(3, radiusPx);
    if (!pointIsNearViewport(point, width, height, radius + fogPadding)) return null;
    return { point, radius };
  }).filter(Boolean);

  const holes = articleHoles.concat(trailHoles);

  const maxHoleRadius = holes.reduce((max, hole) => Math.max(max, hole.radius), 0);
  const blurStd = holes.length ? Math.min(26, Math.max(4, maxHoleRadius * 0.2)) : 12;

  const circles = holes
    .map(
      ({ point, radius }) =>
        `<circle cx="${point.x.toFixed(1)}" cy="${point.y.toFixed(1)}" r="${radius.toFixed(1)}" fill="black"></circle>`,
    )
    .join("");

  refs.fogOverlay.setAttribute("viewBox", `0 0 ${width} ${height}`);
  // white mask keeps fog black except cleared circles
  refs.fogOverlay.innerHTML = `
    <defs>
      <filter id="fogBlur" x="-100%" y="-100%" width="300%" height="300%">
        <feGaussianBlur stdDeviation="${blurStd.toFixed(2)}"></feGaussianBlur>
      </filter>
      <mask id="fogMask" x="${-fogPadding}" y="${-fogPadding}" width="${width + fogPadding * 2}" height="${height + fogPadding * 2}" maskUnits="userSpaceOnUse">
        <rect x="${-fogPadding}" y="${-fogPadding}" width="${width + fogPadding * 2}" height="${height + fogPadding * 2}" fill="white"></rect>
        <g filter="url(#fogBlur)">${circles}</g>
      </mask>
    </defs>
    <rect width="${width}" height="${height}" fill="rgba(11, 14, 22, 0.72)" mask="url(#fogMask)"></rect>
  `;
}
