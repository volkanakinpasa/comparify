let url = 'https://www.bol.com/nl/producten-vergelijken/';

function compare() {
  chrome.storage.sync.get(['list'], function (result) {
    const { list } = result;
    var queryString = list
      .map((item) => 'product' + '=' + item.productId)
      .join('&');
    chrome.tabs.create({ url: url + '?' + queryString });
  });
}

function removeItem(id) {
  chrome.storage.sync.get(['list'], function (result) {
    const { list } = result;
    const foundItem = list.find((item) => item.id === id);
    if (foundItem) {
      const filteredList = list.filter((item) => item.id !== id);

      chrome.storage.sync.set({ list: filteredList }, () => {
        chrome.runtime.sendMessage(
          {
            type: 'setBadgeText',
            text:
              filteredList.length === 0 ? '' : filteredList.length.toString(),
          },
          () => {}
        );
      });

      load();
    }
  });
}

function groupBy(array, groupBy) {
  return array.reduce((acc, curr, index, array) => {
    var idx = curr[groupBy];
    if (!acc[idx]) {
      acc[idx] = array.filter((item) => item[groupBy] === idx);
    }
    return acc;
  }, {});
}

function load() {
  chrome.storage.sync.get(['list'], function (result) {
    const { list } = result;
    if (!list || list.length === 0) return;

    // call
    const groupedList = groupBy(list, 'domain');
    console.log(groupedList);

    const output = Mustache.render(
      document.getElementById('template').innerHTML,
      {
        title: 'hellooo',
        list,
      }
    );

    document.getElementById('output').innerHTML = output;

    attachListeners(list);
  });
}

function attachListeners(list) {
  // const list = JSON.parse(localStorage.getItem('list'));
  if (!list || list === null || list.length === 0) return;
  for (i = 0; i < list.length; i++) {
    document
      .getElementById('btn-remove-' + list[i].id)
      .addEventListener('click', (e) => {
        removeItem(e.target.id.replace('btn-remove-', ''));
      });
  }

  Array.prototype.slice
    .call(document.getElementsByClassName('btn-compare-all'))
    .map((e) => {
      e.addEventListener('click', compare);
    });
}

load();
