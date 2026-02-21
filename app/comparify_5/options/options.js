const getStorage = async (key) => {
  const all = await chrome.storage.sync.get();
  return all[key];
};

function compareBolCom(list) {
  const queryString = list
    .map((item) => 'product' + '=' + item.productId)
    .join('&');
  chrome.tabs.create({
    url: 'https://www.bol.com/nl/producten-vergelijken/' + '?' + queryString,
  });
}

function compareCoolBlue(list) {
  var products = list.map((item) => item.productId).join('/');
  chrome.tabs.create({
    url: 'https://www.coolblue.nl/vergelijken/' + products,
  });
}

async function compare(domain) {
  const list = await getStorage('list');

  switch (domain) {
    case 'www.bol.com':
      compareBolCom(list.filter((item) => item.domain === 'www.bol.com'));
      break;
    case 'www.coolblue.nl':
      compareCoolBlue(list.filter((item) => item.domain === 'www.coolblue.nl'));
      break;
  }
}

async function removeItem(id) {
  const list = await getStorage('list');

  const foundItem = list.find((item) => item.id === id);
  if (foundItem) {
    const filteredList = list.filter((item) => item.id !== id);

    chrome.storage.sync.set({ list: filteredList }, () => {
      chrome.runtime.sendMessage(
        {
          type: 'setBadgeText',
          text: filteredList.length === 0 ? '' : filteredList.length.toString(),
        },
        () => {}
      );
    });

    load();
  }
}

function groupBy(array, groupBy) {
  const obj = array?.reduce((acc, curr, index, array) => {
    var idx = curr[groupBy];
    if (!acc[idx]) {
      acc[idx] = array.filter((item) => item[groupBy] === idx);
    }
    return acc;
  }, {});

  return Object.keys(obj).map((i) => {
    return {
      domain: i,
      values: obj[i],
    };
  });
}

async function load() {
  const list = await getStorage('list');

  if (!list || list.length === 0) {
    const output = Mustache.render(
      document.getElementById('template').innerHTML,
      {
        list: {},
      }
    );
    document.getElementById('output').innerHTML = output;
  } else {
    if (!list?.length) return;

    let groupedList = groupBy(list, 'domain');
    groupedList = groupedList.map((item) => {
      item.show = true;
      if (item.domain.indexOf('amazon.') > -1) {
        item.show = false;
      }
      return item;
    });
    console.log(groupedList);

    const output = Mustache.render(
      document.getElementById('template').innerHTML,
      {
        list: groupedList,
      }
    );

    document.getElementById('output').innerHTML = output;

    attachListeners(list);
  }
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
      e.addEventListener('click', (e) => {
        console.log(e);
        compare(e.target.getAttribute('domain'));
      });
    });
}

function deleteAll() {
  chrome.storage.sync.set({ list: [] }, () => {
    chrome.runtime.sendMessage(
      {
        type: 'setBadgeText',
        text: list.length === 0 ? '' : list.length.toString(),
      },
      () => {}
    );
  });
}

window.addEventListener('DOMContentLoaded', (event) => {
  load();
});
