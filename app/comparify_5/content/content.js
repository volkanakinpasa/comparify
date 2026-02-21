const getStorage = async (key) => {
  const all = await chrome.storage.sync.get();
  return all[key];
};

const injectIconToDom = (e) => {
  const isValidProduct = validObject(e);
  if (!isValidProduct) return;

  var div = document.createElement('div');
  div.id = 'comparify';
  div.className = 'compare-extension';

  var button = document.createElement('button');
  button.id = 'compare-button';
  button.className = 'compare-button';
  button.onclick = function () {
    addToCompareList(e);
    return false;
  };

  const imageElement = document.createElement('img');
  imageElement.id = 'compare-image';
  imageElement.className = 'compare-image';
  imageElement.src = chrome.runtime.getURL('images/128.png');
  imageElement.title = 'Compare';
  button.appendChild(imageElement);
  div.appendChild(button);
  document.body.appendChild(div);
};

const getModelObjectFromPage = (e) => {
  const domain = e.target.domain;
  if (domain.indexOf('bol.com') > -1) {
    return getModelObjectOnBolCom(e);
  } else if (domain.indexOf('coolblue.nl') > -1) {
    return getModelObjectOnCoolBlue(e);
  } else if (domain.indexOf('amazon.') > -1) {
    return getModelObjectOnAmazon(e);
  }
};

const validObject = (e) => {
  const domain = e.target.domain;
  if (domain.indexOf('bol.com') > -1) {
    return validObjectOnBolCom(e);
  } else if (domain.indexOf('coolblue.nl') > -1) {
    return validObjectOnCoolBlue(e);
  } else if (domain.indexOf('amazon.') > -1) {
    return validObjectOnAmazon(e);
  }
};

const addToCompareList = async (e) => {
  const model = getModelObjectFromPage(e);
  const { productId } = model;

  const storageList = await getStorage('list');

  let list = [];
  try {
    if (storageList !== null && storageList !== undefined) {
      list = storageList;
    }
  } catch {
    list = [];
  }

  list = list.filter((i) => i.productId !== productId);
  list.push(model);

  chrome.storage.sync.set({ list }, () => {
    chrome.runtime.sendMessage(
      {
        type: 'setBadgeText',
        text: list.length === 0 ? '' : list.length.toString(),
      },
      () => {}
    );
    disableButton(e);
    setTimeout(
      () => chrome.runtime.sendMessage({ type: 'openOptionsPage' }, () => {}),
      100
    );
  });
};

const disableButton = (e) => {
  document
    .getElementById('comparify')
    .classList.add('compare-extension-disabled');
};

chrome.runtime.onMessage.addListener((message, sender, callback) => {
  const { tab } = message;
  switch (message.type) {
    case 'disableButton':
      disableButton(tab);
      break;
  }

  callback();
});
function onLoad(e) {
  injectIconToDom(e);
}
window.addEventListener('load', onLoad, false);
