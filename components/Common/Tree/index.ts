import * as THREE from 'three'
import Base from '../Base'

export class TREE {

  type 

  constructor(type: 'circle' | 'square' | 'centrum') {
    this.type = type 
  }

  create = () => {
    const tree = new THREE.Object3D()

    //树干
    const baseGeometry = new THREE.CylinderGeometry( .3, .3, 1, 100 )
    const baseMaterial = new THREE.MeshPhongMaterial( {color: 0xD2691E} )
    const cylinder = new THREE.Mesh( baseGeometry, baseMaterial )
    tree.add(cylinder)

    //主体
    let geometryBody 
    switch(this.type) {
      case 'centrum': 
        geometryBody = new THREE.TetrahedronGeometry()
        break 
      case 'circle': 
        geometryBody = new THREE.SphereGeometry( 0.6, 100, 100 )
        break 
      case 'square':
      default: 
        geometryBody = new THREE.BoxGeometry(1, 1, 1)
        break 
    }
    const materialBody = new THREE.MeshPhongMaterial( {color: 0x228B22} )
    const centrum = new THREE.Mesh(geometryBody, materialBody)
    if(this.type === 'centrum') {
      centrum.rotateX(-Math.PI * 1.28)
      centrum.rotateY(Math.PI * 0.23)
      centrum.rotateZ(Math.PI * -0.04)
    }else if(this.type === 'circle') {

    }else if(this.type === 'square') {

    }
    centrum.position.set(0, 0.6, 0)
    tree.add(centrum)

    return tree
  }

}