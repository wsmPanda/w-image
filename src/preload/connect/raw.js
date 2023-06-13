import { toRaw } from "vue"

export function toRawData(v) {
  let data = toRaw(v)
  if (data && typeof v === "object") {
    for (let code in data) {
      data[code] = toRaw(data[code])
    }
  }
  return data
}
