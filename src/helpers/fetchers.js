import axios from "axios";

export async function fetch(cat, formatFunction) {
  const url = getCatUrl(cat);
  return new Promise((resolve, reject) => {
    axios
      .get(process.env.VUE_APP_API_URL + url)
      .then(res => {
        if (formatFunction) {
          console.log("formatFunction");
          return resolve(formatFunction(res.data));
        } else {
          return resolve(res.data);
        }
      })
      .catch(e => {
        console.error(e);
        reject(e);
      });
  });
}

function getCatUrl(cat) {
  switch (cat) {
    case "dev":
      return "/dev-works";
    case "design":
      return "/design-works";
    case "photo": {
      return "/photo-collections";
    }
    case "exp": {
      return "/experiments";
    }
  }
}

export function formatIntoRows(data) {
  const rows = data.reduce(function(result, value, index, array) {
    if (index % 2 === 0) result.push(array.slice(index, index + 2));
    return result;
  }, []);
  return rows;
}

export function loadImg(src, el, callback) {
  const img = document.createElement("img");
  const onload = () => {
    el.src = img.src;
    if (callback) {
      callback();
    }
  };
  const fallback = () => {
    img.onload = onload;
    img.src = src;
  };
  if (img.decode) {
    img.src = src;
    img
      .decode()
      .then(onload)
      .catch(fallback);
  } else {
    fallback();
  }
}

export async function fetchAll() {
  const data = await Promise.all([
    fetch("dev", false),
    fetch("design", false),
    fetch("photo", false)
  ]);
  const [dev, design, photo] = data;
  return { dev, design, photo };
}
