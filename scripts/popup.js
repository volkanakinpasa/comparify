chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {});

function create_UUID() {
  var dt = new Date().getTime();
  var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (
    c
  ) {
    var r = (dt + Math.random() * 16) % 16 | 0;
    dt = Math.floor(dt / 16);
    return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
  return uuid;
}

function start() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, "", (response) => {
      if (response === "ok") {
        var url = tabs[0].url.toLowerCase();
        const title = tabs[0].title;
        const id = url.split("/")[6];
        const model = {
          title,
          productId: id || create_UUID(),
          id: create_UUID(),
          url,
        };

        const storageString = localStorage.getItem("list");
        let list = [];
        try {
          const storageList = JSON.parse(storageString);

          if (storageList !== null && storageList !== undefined) {
            list = storageList;
          }
        } catch {
        } finally {
          list.push(model);
          localStorage.setItem("list", JSON.stringify(list));
          chrome.tabs.create({ url: "options.html" });
        }
      } else {
        alert("You are not allowed to use this extension on this page");
      }
    });
  });
}

window.addEventListener("DOMContentLoaded", (event) => {
  start();
});
