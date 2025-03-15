let userPreferences = {
  blockedSites: [],
  dailyLimit: 8 * 60 * 60 * 1000, // 8 hours in milliseconds
};

chrome.storage.sync.get(["blockedSites", "dailyLimit"], (data) => {
  if (data.blockedSites) userPreferences.blockedSites = data.blockedSites;
  if (data.dailyLimit) userPreferences.dailyLimit = data.dailyLimit;
});

let activeTab = null;
let startTime = Date.now();

chrome.tabs.onActivated.addListener((activeInfo) => {
  if (activeTab) {
    const endTime = Date.now();
    const timeSpent = endTime - startTime;
    logTime(activeTab.url, timeSpent);
  }
  activeTab = activeInfo.tabId;
  startTime = Date.now();
});

chrome.webNavigation.onBeforeNavigate.addListener((details) => {
  const url = new URL(details.url);
  if (userPreferences.blockedSites.includes(url.hostname)) {
    chrome.tabs.update(details.tabId, { url: "blocked.html" });
  }
});

function logTime(url, timeSpent) {
  const domain = new URL(url).hostname;
  chrome.storage.local.get([domain], (data) => {
    const totalTime = (data[domain] || 0) + timeSpent;
    chrome.storage.local.set({ [domain]: totalTime });
  });
}