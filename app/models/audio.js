import { createAction } from '../utils'
import { loadAudioCategory } from '../services/audio'

// NavigationActions
// loadAudioById

export default {
  namespace: 'audio',
  state: {
    fetching: false,
    loaded: false,
    list: [],
  },
  // subscriptions: {

  // },
  reducers: {
    loadcategoryStart(state, { payload }) {
      return { ...state, ...payload }
    },
    loadcategoryEnd(state, { payload }) {
      return { ...state, ...payload }
    },
  },
  effects: {
    * loadcategory({ payload }, { put, call }) {
      yield put(
        createAction('loadcategoryStart')({
          fetching: true,
        }),
      )
      const categorys = yield call(loadAudioCategory)
      yield put(
        createAction('loadcategoryEnd')({
          list: categorys,
          fetching: false,
          loaded: true,
        }),
      )
    //   const login = yield call(authService.login, payload)
      // const login = false
      // if (login) {
      //   yield put(
      //     NavigationActions.reset({
      //       index: 0,
      //       actions: [NavigationActions.navigate({ routeName: 'Main' })],
      //     }),
      //   )
      // }
    },
  },
}
