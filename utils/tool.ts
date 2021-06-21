import { WRAPPER_MAIN_ID } from './constants'

export function getContainer() {
  const container = document.querySelector(`#${WRAPPER_MAIN_ID}`)
  return container
}

export async function sleep(time=2000) {
  return new Promise((resolve) => setTimeout(resolve, time))
}