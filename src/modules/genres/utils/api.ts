export const getParam = <T>(param: T | T[]): T =>
  Array.isArray(param) ? param[0] : param
