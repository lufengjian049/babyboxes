import { createAction } from '../utils'
// import { loadAudioCategory, addAudioCategory} from '../services/audio'
import * as audioService from '../services/audio'

// NavigationActions
// loadAudioById

export default {
  namespace: 'audio',
  state: {
    // TODO: 如何在外层router 触发actions
    showAudioListMask: false,
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
    toggleAudioListMask(state) {
      return { ...state, showAudioListMask: !state.showAudioListMask }
    },
    // 添加分类
    appendcategoryStart(state, { payload }) {
      return { ...state, ...payload }
    },
    appendcategoryEnd(state, { payload }) {
      const { fetching, loaded, addedcategory } = payload
      return { ...state, list: [addedcategory, ...state.list], fetching, loaded }
    },
    // 删除分类
    delcategoryEnd(state, { payload }) {
      const lastlist = state.list.filter((item) => item.id !== payload.id)
      return { ...state, list: [...lastlist] }
    },
  },
  effects: {
    * loadcategory({ payload }, { put, call }) {
      yield put(
        createAction('loadcategoryStart')({
          fetching: true,
        }),
      )
      const categorys = yield call(audioService.loadAudioCategory)
      yield put(
        createAction('loadcategoryEnd')({
          list: categorys,
          fetching: false,
          loaded: true,
        }),
      )
    },
    * addcategory({ payload }, { put, call }) {
      yield put(
        createAction('appendcategoryStart')({
          fetching: true,
          loaded: false,
        }),
      )
      const { name } = payload
      const addedcategory = yield call(audioService.addAudioCategory, name)
      yield put(
        createAction('appendcategoryEnd')({
          addedcategory,
          fetching: false,
          loaded: true,
        }),
      )
    },
    * delcategory({ payload }, { put, call }) {
      const { id } = payload
      const delcount = yield call(audioService.delAudioCategory, id)
      if(delcount > 0)
        yield put(
          createAction('delcategoryEnd')({
            id
          }),
        )
    },
  },
}
