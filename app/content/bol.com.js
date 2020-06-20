const validObjectOnBolCom = (e) => {
  try {
    const model = getModelObjectOnBolCom(e);
    if (!model || !model.productId || isNaN(model.productId)) return false;
    else return true;
  } catch (err) {
    return false;
  }
};

const readPriceOnBolCom = () => {
  let price = '';
  try {
    const div = document.getElementsByClassName('promo-price')[0];
    if (div && div.innerText) {
      price = div.innerText;
      price = price.split('\n')[0];
    }
  } catch (err) {}

  return price;
};

const getModelObjectOnBolCom = (e) => {
  var uri = new URL(e.target.URL);
  const title = e.target.title;
  //const productId = uri.pathname.match(/dp\/([a-zA-Z0-9_]*)/);
  const productId = uri.pathname.match(/(\d)+/)[0];
  const price = readPriceOnBolCom();

  const model = {
    title,
    productId: productId,
    id: create_UUID(),
    url: uri.toString(),
    domain: e.target.domain,
    price,
  };

  try {
    let imageUrl = document.getElementsByClassName('js_product_img')[0];
    if (!imageUrl) {
      imageUrl = document.getElementsByClassName('book__cover')[0];
      if (imageUrl) {
        imageUrl = imageUrl.children[0];
      }
    }

    model.imageUrl = imageUrl.src;
    model.title = document.getElementsByClassName(
      'js_product_img'
    )[0].attributes['title'].value;
  } catch {}
  return model;
};
