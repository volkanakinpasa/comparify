setTimeout(() => {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.runtime.sendMessage({ type: 'openOptionsPage' });
  });
}, 100);
