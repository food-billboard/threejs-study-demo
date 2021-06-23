import * as THREE from 'three'

export class Desk {

  private color 

  constructor(color: string | number ) {
    this.color = color 
  }

  //桌子腿
  private createLeg = ([x, y, z]: number[]) => {
    const baseGeometry = new THREE.BoxGeometry( .3, 1, .3 )
    const baseMaterial = new THREE.MeshPhongMaterial( {color: this.color} )
    const leg = new THREE.Mesh( baseGeometry, baseMaterial )
    leg.position.set(x, y, z)
    return leg
  }

  //横杠
  private createRog = ([x, y, z]: number[]) => {
    const baseGeometry = new THREE.CylinderGeometry( .1, .1, 2, 100 )
    const baseMaterial = new THREE.MeshPhongMaterial( {color: this.color} )
    const rog = new THREE.Mesh( baseGeometry, baseMaterial )
    rog.position.set(x, y, z)
    rog.rotateX(Math.PI * 0.5)
    return rog
  }

  create = () => {
    const desk = new THREE.Object3D()

    //桌子腿
    var legs = [
      [ -2, 0, 1 ],
      [ 0.5, 0, 1 ],
      [ 0.5, 0, -1 ],
      [ -2, 0, -1 ]
    ]
    legs.forEach(item => {
      const leg = this.createLeg(item)
      desk.add(leg)
    })

    //横杠
    var rogs = [
      [ -2, 0.25, 0 ],
      [ 0.5, 0.25, 0 ],
    ]
    rogs.forEach(item => {
      const rog = this.createRog(item)
      desk.add(rog)
    })

    //桌面
    const baseGeometry = new THREE.BoxGeometry( 3, 0.1, 3 )
    const baseMaterial = new THREE.MeshPhongMaterial( {color: this.color} )
    const deskface = new THREE.Mesh( baseGeometry, baseMaterial )
    deskface.position.set(-0.7, 0.5, 0) 
    desk.add(deskface)

    return desk
  }

}