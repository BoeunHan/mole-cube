declare module "badwords-ko" {
  export default class Filter {
    constructor(options?: any);
    isProfane(text: string): boolean;
    addWords(...words: string[]): void;
  }
}
