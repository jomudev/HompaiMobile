export default class Reminder {

  constructor(description, importanceLevel) {
    this.description = description;
    this.importanceLevel = importanceLevel;
    this.checked = false;
  }

  check() {
    this.checked = true;
  }

  uncheck() {
    this.checked = false;
  }

}

class importanceLevel {
  construct(description, level, color) {
    this.description = description;
    this.level = level;
    this.color = color,
  }
}


