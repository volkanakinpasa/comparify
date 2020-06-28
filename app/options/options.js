(function (i, s, o, g, r, a, m) {
  i['GoogleAnalyticsObject'] = r;
  (i[r] =
    i[r] ||
    function () {
      (i[r].q = i[r].q || []).push(arguments);
    }),
    (i[r].l = 1 * new Date());
  (a = s.createElement(o)), (m = s.getElementsByTagName(o)[0]);
  a.async = 1;
  a.src = g;
  m.parentNode.insertBefore(a, m);
})(
  window,
  document,
  'script',
  'https://www.google-analytics.com/analytics.js',
  'ga'
);
ga('create', 'UA-3218083-17', 'auto');
ga('set', 'checkProtocolTask', function () {});
ga('send', 'pageview', '/options.html');

function compareBolCom(list) {
  var queryString = list
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

function compare(domain) {
  chrome.storage.sync.get(['list'], function (result) {
    const { list } = result;

    switch (domain) {
      case 'bol.com':
        compareBolCom(list.filter((item) => item.domain === 'bol.com'));
        break;
      case 'www.coolblue.nl':
        compareCoolBlue(
          list.filter((item) => item.domain === 'www.coolblue.nl')
        );
        break;
    }
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
  const obj = array.reduce((acc, curr, index, array) => {
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

function load() {
  chrome.storage.sync.get(['list'], function (result) {
    const { list } = result;
    if (!list || list.length === 0) {
      const output = Mustache.render(
        document.getElementById('template').innerHTML,
        {
          list: {},
        }
      );
      document.getElementById('output').innerHTML = output;
    } else {
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

      ga('send', 'event', {
        eventCategory: 'option',
        eventAction: 'load',
        eventLabel: 'list count',
        eventValue: list.length,
      });
    }
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
