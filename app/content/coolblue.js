const validObjectOnCoolBlue = (e) => {
  try {
    const model = getModelObjectOnCoolBlue(e);
    if (!model || !model.productId || isNaN(model.productId)) return false;
    else return true;
  } catch (err) {
    return false;
  }
};

const readPriceOnCoolBlue = () => {
  try {
    return document
      .getElementsByClassName('sales-price__current')[0]
      .innerText.match('([0-9]+(.[0-9]{2})?)')[0];
  } catch (err) {
    return '';
  }
};

const getModelObjectOnCoolBlue = (e) => {
  var url = e.target.URL;
  const title = e.target.title;
  const productId = url.split('/')[4];
  const price = readPriceOnCoolBlue();

  const model = {
    title,
    productId: productId,
    id: create_UUID(),
    url,
    domain: e.target.domain,
    price,
  };

  try {
    model.imageUrl = document.getElementsByClassName(
      'product-media-gallery__item-image'
    )[0].src;
    model.title = document.getElementsByClassName(
      'js-product-name'
    )[0].children[0].children[0].innerText;
  } catch {}
  return model;
};
