/**
 * Genric function to make api calls with method post
 * @param {apiPost} url  API end point to call
 * @param {apiPost} responseSuccess  Call-back function to get success response from api call
 * @param {apiPost} responseErr  Call-back function to get error response from api call
 * @param {apiPost} requestHeader  Request header to be send to api
 * @param {apiPost} body data to be send through api
 */
export async function apiPost(
  url,
  body,
  responseSuccess,
  responseErr,
  requestHeader = {
    "Content-Type": "application/json",
    'Accept': 'application/json'
  }
) {
  console.log("request", JSON.stringify(body));
  fetch(url, {
    method: "POST",
    headers: requestHeader,
    body: JSON.stringify(body)
  })
    .then(errorHandler)
    .then(response => response.json())
    .then(json => responseSuccess(json))
    .catch(err => responseErr(err));
}

/**
 * Genric function to make api calls with method get
 * @param {apiGet} url  API end point to call
 * @param {apiGet} responseSuccess  Call-back function to get success response from api call
 * @param {apiGet} responseErr  Call-back function to get error response from api call
 * @param {apiGet} requestHeader  Request header to be send to api
 */
export async function apiGet(
  url,
  responseSuccess,
  responseErr,
  requestHeader = {
    "Content-Type": "application/json",
    'Accept': 'application/json'
  }
) {
  fetch(url, {
    method: "GET",
    headers: requestHeader
  })
    .then(errorHandler)
    .then(response => response.json())
    .then(json => responseSuccess(json))
    .catch(err => responseErr(err));
}

/**
 * Genric function to make api calls with method delete
 * @param {apiDelete} url  API end point to call
 * @param {apiDelete} responseSuccess  Call-back function to get success response from api call
 * @param {apiDelete} responseErr  Call-back function to get error response from api call
 * @param {apiDelete} requestHeader  Request header to be send to api
 */
export function apiDelete(
  url,
  responseSuccess,
  responseErr,
  requestHeader = {
    "Content-Type": "application/json",
    'Accept': 'application/json'
  }
) {
  fetch(url, {
    method: "DELETE",
    headers: requestHeader
  })
    .then(errorHandler)
    .then(response => (response.status == 204 ? response : response.json()))
    .then(json => responseSuccess(json))
    .catch(err => responseErr(err));
}

//Error Handler
/**
 *
 * @param {errorHandler} response Generic function to handle error occur in api
 */
const errorHandler = response => {
  console.log("Response ==>",response);
  if (
    (response.status >= 200 && response.status < 300) ||
    response.status == 401 ||
    response.status == 400
  ) {
    if (response.status == 204) {
      response.body = { success: "Saved" };
    }
    return Promise.resolve(response);
  } else {

    var error = new Error(response.statusText || response.status);
    error.response = response;
    console.log("err",error.response)
    return Promise.reject(error);  
  }
};

export async function apiPostQs(
  url,
  body,
  responseSuccess,
  responseErr,
  requestHeader = {}
) {
  console.log("request", JSON.stringify(body));
  fetch(url, {
    method: "POST",
    body: body,
    headers: {
      Accept: "application/json",
      "Content-Type": "multipart/form-data"
    }
  })
    .then(errorHandler)
    .then(response => response.json())
    .then(json => responseSuccess(json))
    .catch(err => responseErr(err));
}
