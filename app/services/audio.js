import request from '../utils/request'

const audioRequest = request('/audio/')

export function loadAudioCategory() {
  return audioRequest('categorylist')
}

export function loadAudioById(id) {
  return audioRequest('audiolistbyid', 'post', { id })
}

export function addCategory(name) {
  return audioRequest('addcategory', 'post', { name })
}

export function delCategory(id) {
  return audioRequest(id, 'delete')
}
