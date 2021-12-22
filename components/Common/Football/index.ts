import * as THREE from 'three'
import Base from '../Base'
import { loadImage } from '@/utils'

export class Football extends Base {

  private readonly radius = 5 

  public create = () => {
    const geometry = new THREE.SphereGeometry(this.radius, 32, 32)
    const texture = new THREE.TextureLoader().load(loadImage("/images/football/football.png"))
    // texture.wrapS = texture.wrapT = THREE.RepeatWrapping
    // texture.repeat.set(2, 2)
    const material = new THREE.MeshBasicMaterial({
      map: texture
    })
    const mesh = new THREE.Mesh(geometry, material)

    return mesh 
  }

}