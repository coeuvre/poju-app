import UiStore from './Ui'

export default class RootStore {
  constructor () {
    this.ui = new UiStore()
  }
}
