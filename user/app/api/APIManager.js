/**
 * created by Akshay Chavda
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
  responseError,
  requestHeader = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
) {
  console.log('request', JSON.stringify(body));
  console.log('request', url);

  fetch(url, {
    method: 'POST',
    headers: requestHeader,
    body: JSON.stringify(body),
  })
    .then(errorHandler)
    .then(response => response.json())
    .then(data => {
      console.log('POST Success:', data);
      responseSuccess(data);
    })
    .catch(error => {
      responseError(error);
      console.error('POST Error:', error);
    });
}

export async function apiPostFormData(
  url,
  body,
  responseSuccess,
  responseError,
  requestHeader = {
    'Content-Type': 'multipart/form-data',
    'Accept': 'application/json'
  },
) {
  console.log('request', JSON.stringify(body));
  fetch(url, {
    method: 'POST',
    headers: requestHeader,
    body: body,
  })
    .then(errorHandler)
    .then(response =>  response.json())
    .then(data => {
      console.log('FORM DATA POST Success:', data);
      
      responseSuccess(data);
   
    })
    .catch(error => {
      responseError(error);
      console.error('FORM DATA POST Error:', error);
    });
}

export async function apiGet(
  url,
  success,
  responseError,
  requestHeader = {'Content-Type': 'application/json',
  'Accept': 'application/json'
},
) {
  fetch(url, {
    method: 'GET',
    headers: requestHeader,
  })
    .then(errorHandler)
    .then(response => response.json())
    .then(data => {
      console.log('GET Success:', data);  
      success(data);
    })
    .catch(error => {
      responseError(error);
      console.error('GET Error:', error);
    });
}

//Error Handler
/**
 *
 * @param {errorHandler} response Generic function to handle error occur in api
 */
const errorHandler = response => {
  console.log('Response ==>', response);
  if (response.status == 1 || response.status == 200) {
    return Promise.resolve(response);
  } else {
    var error = new Error(response.statusText || response.status);
    error.response = response;
    console.log("error",error.response)
    return Promise.reject(error);
  }
};
