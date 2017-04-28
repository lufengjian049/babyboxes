import request from '../utils/request'

const audioRequest = request('/audio/')

export function loadAudioCategory() {
  return audioRequest('categorylist')
}

export function loadAudioById(id) {
  return audioRequest('audiolistbyid', 'post', { id })
}
