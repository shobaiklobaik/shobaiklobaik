
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
    "Content-Type": "application/json"
  }
) {
  console.log("========== REQUEST URL ==========", url);
  console.log("========== REQUEST PARAMS ==========", JSON.stringify(body));

  fetch(url, {
    method: "POST",
    headers: requestHeader,
    body: JSON.stringify(body)
  })
    .then(errorHandler)
    .then(response => response.json())
    .then(responseFetched => checkAPIStatus(responseFetched))
    .then(responseProcessed =>
      responseSuccess(responseProcessed.data, responseProcessed.message)
    )
    .catch(err => responseErr(err));
    // .catch(err => alert("this is Error call"));
}

export async function apiPostFileUpload(
  url,
  body,
  imageURI,
  responseSuccess,
  responseErr,
  requestHeader = {
    "Content-Type": "multipart/form-data"
  }
) {
  // console.log("request apiPostNormal", JSON.stringify(body));
  console.log("request header", JSON.stringify(requestHeader));

  let formdata = new FormData();

  if (imageURI) {
    // debugLog("imageURI ::: ", JSON.stringify(imageURI))
    // debugLog("length ::: ", imageURI.length)
  }

  Object.keys(body || {}).map(keyToCheck => {
    console.log("KEY TO CHECK :::::::::::: ", keyToCheck)
    console.log("BODY [KEY TO CHECK] :::::::::::: ", body[keyToCheck])
    formdata.append(keyToCheck, body[keyToCheck])
  })

  if (imageURI != undefined && imageURI != null) {

    console.log("imageURI inside IF condition")

    // const uriParts = imageURI.fileName ? imageURI.fileName.split(".") : imageURI.uri.split(".")
    if (imageURI.uri != undefined && imageURI.uri != null) {

      // const uriParts = imageURI.fileName ? imageURI.fileName.split(".") : imageURI.uri.split(".")

    formdata.append("image", {
      uri: imageURI.uri,
      name: imageURI.fileName || Math.round(new Date().getTime() / 1000),
      // type: `image/${uriParts[uriParts.length - 1]}`
      type: `image/${imageURI.fileName}`
    });


    console.log("name ::: ", imageURI.fileName || Math.round(new Date().getTime() / 1000))
  }
  }

  console.log("========== REQUEST URL ==========", url)
  console.log("========== REQUEST ==========", formdata)

  // Object.keys(body || {}).map(keyToCheck => {
  //   console.log("KEY TO CHECK :::::::::::: ", keyToCheck)
  //   console.log("BODY [KEY TO CHECK] :::::::::::: ", body[keyToCheck])
  //   formdata.append(keyToCheck, body[keyToCheck])
  // })

  fetch(url, {
    method: "POST",
    body: formdata,
    headers: requestHeader
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
    "Content-Type": "application/json"
  }
) {
  console.log("url::::::::::: ",url)
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
    "Content-Type": "application/json"
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
  // alert("response")
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

const checkAPIStatus = reponseFetched => {
  console.log("========== reponseFetched ==========", reponseFetched);
  console.log("========== reponseFetched ==========", reponseFetched.status);
  let status = reponseFetched.status || false;

  // alert("status Alert")

  if (reponseFetched.status == 1) {
    console.log("Check status if", status)
    return Promise.resolve({
      data: reponseFetched || {},
      message: reponseFetched.message || ""
    });
  } else if (reponseFetched.status == 0) {
    console.log("Check status if", status)
    return Promise.resolve({
      data: reponseFetched || {},
      message: reponseFetched.message || ""
    });
  } else {
    console.log("Check status else", status)
    return Promise.reject({
      data: reponseFetched || {},
      message: reponseFetched.message || ""
    });
  }
};
