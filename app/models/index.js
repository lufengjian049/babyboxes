import audioModel from './audio'
import setting from './setting'
// import router from './router'

export function registerModels(app) {
  app.model(audioModel)
  app.model(setting)
//   app.model(router)
}
