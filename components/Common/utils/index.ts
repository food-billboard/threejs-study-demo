import * as THREE from 'three'

export function getMouseAxes(event: any, container?: Element) {
  const { left, top } = container?.getBoundingClientRect() || { left: 0, top: 0 }
  const clientX = event.clientX
  const clientY = event.clientY 
  const containerWidth = container?.clientWidth || window.innerWidth
  const containerHeight = container?.clientHeight || window.innerHeight
  return {
    x: ( (clientX - left) / containerWidth ) * 2 - 1,
    y: - ( (clientY - top) / containerHeight ) * 2 + 1
  }
}

export function mouseEventRaycaster(camera: THREE.Camera, intersect: [
  objects: THREE.Object3D[],
  ...args: any[]
], onIntersect: (objects: THREE.Intersection[]) => void, container?: Element) {
  return function(event: any) {
    const { x, y } = getMouseAxes(event, container)
    const mouse = new THREE.Vector2()
    mouse.x = x 
    mouse.y = y 
    event.preventDefault()
  
    const raycaster = new THREE.Raycaster()
    raycaster.setFromCamera( mouse, camera )
  
    const intersects = raycaster.intersectObjects(...intersect)
    if(intersects.length > 0) {
      onIntersect(intersects)
    }
  }
}