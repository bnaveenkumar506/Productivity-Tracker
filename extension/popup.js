document.getElementById("viewReport").addEventListener("click", () => {
  chrome.tabs.create({ url: "http://localhost:3000/report" });
});

document.getElementById("blockSite").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const url = new URL(tabs[0].url);
    chrome.storage.sync.get(["blockedSites"], (data) => {
      const blockedSites = data.blockedSites || [];
      blockedSites.push(url.hostname);
      chrome.storage.sync.set({ blockedSites });
    });
  });
});