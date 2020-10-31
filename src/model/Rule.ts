export class Rule {
  title: string;
  param: string | number;
  text: string;
  operator: any;
  static active: boolean = false;

  constructor(
    title: string,
    param: number | string,
    text: string,
    operator: any
  ) {
    this.title = title;
    this.param = param;
    this.text = text;
    this.operator = operator;
  }

  static getActive(): boolean {
    return Rule.active;
  }
  static setActive(value: boolean): boolean {
    return Rule.active;
  }
}
