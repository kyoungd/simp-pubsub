import axios from 'axios';

function makeBearToken(token) {
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
}

async function getOne(url, jwt) {
  const result = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${jwt}`
    }
  });
  return result.data;
}

async function dataFetch(url, token = null) {
  if (!token)
    return axios
      .get(url)
      .then((res) => res.data)
      .catch((err) => console.log(err));
  const bearerToken = makeBearToken(token);
  return axios
    .get(url, bearerToken)
    .then((res) => res.data)
    .catch((err) => console.log(err));
}

async function dataPost(url, token, data) {
  return axios
    .post(url, data, makeBearToken(token))
    .then((res) => res.data)
    .catch((err) => console.log(err));
}

async function dataPut(url, token, data) {
  return axios
    .put(url, data, makeBearToken(token))
    .then((res) => res.data)
    .catch((err) => console.log(err));
}

export { dataFetch, dataPost, dataPut, getOne };
