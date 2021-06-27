
export function getMouseAxes(event: any) {
  return {
    x: ( event.clientX / window.innerWidth ) * 2 - 1,
    y: - ( event.clientY / window.innerHeight ) * 2 + 1
  }
}