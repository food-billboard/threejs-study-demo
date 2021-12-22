import { pick } from 'lodash'
import { WRAPPER_MAIN_ID, PUBLIC_RUNTIME_PREFIX } from './constants'

type returnType = {
  container: Element | null 
} & DOMRect

export function getContainer(wrapper?: string): returnType {
  const container = document.querySelector(wrapper || `#${WRAPPER_MAIN_ID}`)
  return {
    container,
    ...pick(container?.getBoundingClientRect() || {}, ["bottom", "height", "left", "right", "top", "width", "x", "y"])
  } as returnType
}

export async function sleep(time=2000) {
  return new Promise((resolve) => setTimeout(resolve, time))
}

export function loadImage(src: string) {
  console.log(process.env.NODE_ENV)
  return process.env.NODE_ENV === 'development' ? src : PUBLIC_RUNTIME_PREFIX + src 
}