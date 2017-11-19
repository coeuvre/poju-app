import UiStore from './ui'

export default class RootStore {
  constructor () {
    this.ui = new UiStore()
  }
}
