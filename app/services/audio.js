import request from '../utils/request'

const audioRequest = request('/audio/')

export function loadAudioCategory() {
  return audioRequest('categorylist')
}

export function loadAudioById(id) {
  return audioRequest('audiolistbyid', 'post', { id })
}

export function addAudioCategory(name) {
  return audioRequest('addcategory', 'post', { name })
}

export function delAudioCategory(id) {
  return audioRequest(id, 'delete')
}
