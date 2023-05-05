export default class StringSanitizer {
  static sanitize(s: string) {
    return s.replaceAll(/@[^ ]*@/gi, '?').replaceAll(/%i:[^ ]*%/gi, '')
  }
}
