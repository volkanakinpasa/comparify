//if "matches" pattern in manifest file has the domain. this script can be triggered. otherwise it won't be...

chrome.runtime.onMessage.addListener(function (message, sender, callback) {
  callback("ok");
});
