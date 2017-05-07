// import fetch from 'dva/fetch'

function checkstatus(response) {
  if (response.errcode === 0) {
    return response
  }
  const error = new Error(response.errmsg)
  error.response = response
  return error
}

const request = (urlPrefix) => (url, method = 'get', body) => {
  // const requrl = `http://localhost:8090${urlPrefix}${url}`
  const requrl = `http://princekin.vicp.io:90${urlPrefix}${url}`
  return new Promise((resolve, reject) => {
    const fetchPromise = method !== 'post' ? fetch(requrl,{method}) : fetch(requrl, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
    fetchPromise.then(response => response.json())
    .then(checkstatus)
    .then(response => {
      resolve(response.data)
    })
    .catch(error => {
      reject(error)
    })
  })
}

export default request
