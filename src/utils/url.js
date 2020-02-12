/**
 * Saves contents to URL string for sharing
 */

export function encodeURLString (data) {
  const string = btoa(JSON.stringify(data))
  return string
}

export function decodeURLString (string) {
  const data = JSON.parse(atob(string))
  return data
}
