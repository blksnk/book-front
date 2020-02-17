import axios from "axios";
const api = process.env.VUE_APP_API_URL;

export async function fetch(cat, format, formatFunction) {
  let url;
  switch (cat) {
    case "dev":
      url = "/dev-works";
      break;
    case "design":
      url = "/design-works";
      break;
    case "photo": {
      url = "/photo-collections";
      break;
    }
    case "exp": {
      url = "/experiments";
      break;
    }
  }
  return new Promise((resolve, reject) => {
    axios
      .get(api + url)
      .then(res => {
        if (!format) {
          return resolve(res.data);
        }
        if (formatFunction && formatFunction instanceof Function) {
          return resolve(formatFunction(res.data));
        }
        if (format && !formatFunction) {
          return resolve(formatDefault(res.data));
        }
      })
      .catch(e => {
        console.error(e);
        reject(e);
      });
  });
}

export function formatDefault(data) {
  const formatted = data.map(item => {
    let n = item;
    if (item.thumbnail) {
      n.thumbnail = formatMediaUrl(item.thumbnail);
    }
    if (item.photos) {
      n.photos = item.photos.map(photo => formatMediaUrl(photo));
    }
    if (item.images) {
      n.images = item.images.map(image => formatMediaUrl(image));
    }
    if (item.image1) {
      n.image1 = formatMediaUrl(item.image1);
    }
    if (item.image2) {
      n.image2 = formatMediaUrl(item.image2);
    }
    if (item.image3) {
      n.image3 = formatMediaUrl(item.image3);
    }
    return n;
  });
  return formatted;
}

export function formatMediaUrl(media) {
  return {
    ...media,
    url: api + media.url
  };
}
