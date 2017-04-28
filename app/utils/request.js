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
  const requrl = `http://princekin.vicp.io:90${urlPrefix}${url}`
  return new Promise((resolve, reject) => {
    fetch(requrl, {
      method,
      body,
    })
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
