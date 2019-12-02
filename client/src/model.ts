export default class Model {
    constructor() {
      this.musicOn = true;
    }
   
    set musicOn(value) {
      this.musicOn = value;
    }
   
    get musicOn() {
      return this.musicOn;
    }
}