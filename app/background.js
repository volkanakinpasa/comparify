const getList = () => {
  const storageString = localStorage.getItem('list');
  try {
    const storageList = JSON.parse(storageString);
    if (storageList !== null && storageList !== undefined) {
      return storageList;
    }
    return [];
  } catch {
    return [];
  }
};

function setBadgeText(text) {
  chrome.browserAction.setBadgeText({ text });
}

function clearBadge() {
  chrome.browserAction.setBadgeText({ text: '' });
}

const openOptionsPage = () => {
  chrome.tabs.create({ url: 'options.html' });
};

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  switch (message.type) {
    case 'setBadgeText':
      setBadgeText(message.text);
      break;
    case 'clearBadge':
      clearBadge();
      break;
    case 'openOptionsPage':
      openOptionsPage();
      break;
  }
});

chrome.runtime.onInstalled.addListener(function (details) {
  if (details.reason == 'install') {
    openOptionsPage();
  }
});
