import { merge } from 'lodash'
import * as THREE from 'three'

export type TOptions = {

}

function isTarget(origin: THREE.Object3D, target: THREE.Intersection): boolean {
  if(Array.isArray(origin.children) && origin.children.length) return origin.children.some(item => isTarget(item, target))
  return origin.uuid === target.object.uuid
}

export type TAnimationQueue = {
  update: boolean 
  callback: (object: TAnimationQueue["object"], close: () => void) => void 
  object: THREE.Object3D | THREE.Mesh 
}

export default class Base {

  constructor(options: TOptions={}) {

  }

  public baseEventBinding = (objects: THREE.Intersection[], meshs: THREE.Object3D[], callbacks: ((object: THREE.Intersection) => void)[]) => {
    return objects.some(object => {
      return meshs.some((mesh, index) => {
        const isEqual = isTarget(mesh, object)
        isEqual && callbacks[index]?.(object)
        return isEqual
      })
    })
  }

  //animation
  private _animationQueue: TAnimationQueue[] = []
  public get animationQueue() {
    return this._animationQueue
  }
  private set animationQueue(newValue: TAnimationQueue[]) {
    this._animationQueue = newValue
  }
  private is(target: TAnimationQueue["object"], origin: TAnimationQueue["object"]) {
    return target.uuid == origin.uuid
  }
  public animationEnqueue = (...animation: TAnimationQueue[]) => {
    this.animationQueue = [
      ...this.animationQueue,
      ...animation
    ]
    return this.animationQueue
  }
  public animationDequeue = (...animation: TAnimationQueue[]) => {
    if(animation.length) return this.animationQueue = []
    return this.animationQueue = this.animationQueue.filter(item => {
      return animation.every(animate => animate.object.uuid != item.object.uuid)
    })
  }
  public animationStateChange = (object: TAnimationQueue["object"], state: Partial<Omit<TAnimationQueue, "object">>, create: boolean=true) => {
    let exists = false 
    this.animationQueue = this.animationQueue.map(animate => {
      if(this.is(object, animate.object)) {
        exists = true 
        return merge({}, animate, state)
      }
      return animate
    })
    if(create && !exists) {
      this.animationQueue = merge([], this.animationQueue, [(merge({ object }, state) as TAnimationQueue)])
    }
  }
  public animate = () => {
    const animationQueue = this.animationQueue
    animationQueue.forEach(animate => {
      if(animate.update) {
        animate.callback(animate.object, () => {
          animate.update = false 
        })
      }
    })
  }
  

}