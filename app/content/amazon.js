const getProductIdAmazon = (pathName) => {
  const urlMatch = pathName.match(/dp\/([a-zA-Z0-9_]*)/);
  if (urlMatch && urlMatch.length > 1 && urlMatch[1] != '') {
    return urlMatch[1];
  } else {
    return null;
  }
};

const validObjectOnAmazon = (e) => {
  try {
    const model = getModelObjectOnAmazon(e);
    if (!model) return false;
    else return true;
  } catch (err) {
    return false;
  }
};

const readPriceOnAmazon = () => {
  let price = '';
  try {
    const div =
      document.getElementById('price_inside_buybox') ||
      document.getElementById('buyNew_noncbb') ||
      document.getElementById('priceblock_ourprice');
    if (div && div.innerText) {
      price = div.innerText;
    }
  } catch (err) {}

  return price;
};

const getModelObjectOnAmazon = (e) => {
  var uri = new URL(e.target.URL);
  const title = e.target.title;

  const productId = getProductIdAmazon(uri.pathname);
  if (!productId) return null;

  const price = readPriceOnAmazon();

  const model = {
    title,
    productId: productId,
    id: create_UUID(),
    url: uri.toString(),
    domain: e.target.domain,
    price,
  };

  try {
    model.imageUrl = document
      .getElementById('imgTagWrapperId')
      .getElementsByTagName('img')[0].src;
  } catch {}
  return model;
};
