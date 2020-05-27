let url = "https://www.bol.com/nl/producten-vergelijken/";

function compare() {
  const list = JSON.parse(localStorage.getItem("list"));
  var query = list.map((item) => "product" + "=" + item.productId).join("&");
  chrome.tabs.create({ url: url + "?" + query });
}

function removeItem(id) {
  const list = JSON.parse(localStorage.getItem("list"));
  const foundItem = list.find((item) => item.id === id);
  if (foundItem) {
    const filteredList = list.filter((item) => item.id !== id);
    localStorage.setItem("list", JSON.stringify(filteredList));
    load();
  }
}
// // Restores select box and checkbox state using the preferences
// // stored in chrome.storage.
// function restore_options() {
//   // Use default value color = 'red' and likesColor = true.
//   chrome.storage.sync.get({
//     favoriteColor: 'red',
//     likesColor: true
//   }, function(items) {
//     document.getElementById('color').value = items.favoriteColor;
//     document.getElementById('like').checked = items.likesColor;
//   });
// }
// document.addEventListener('DOMContentLoaded', restore_options);

//document.getElementById("list").innerHTML = list;

function load() {
  document.getElementById("list").innerHTML = "";
  const list = JSON.parse(localStorage.getItem("list"));

  const output = Mustache.render(
    document.getElementById("template").innerHTML,
    {
      title: "hellooo",
      list,
    }
  );

  document.getElementById("output").innerHTML = output;

  attachListeners();
}

function attachListeners() {
  const list = JSON.parse(localStorage.getItem("list"));
  for (i = 0; i < list.length; i++) {
    document
      .getElementById("btn-remove-" + list[i].id)
      .addEventListener("click", (e) => {
        removeItem(e.target.id.replace("btn-remove-", ""));
      });
  }
}

load();

Array.prototype.slice
  .call(document.getElementsByClassName("btn-compare-all"))
  .map((e) => {
    e.addEventListener("click", compare);
  });
