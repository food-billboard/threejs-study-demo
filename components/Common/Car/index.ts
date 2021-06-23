import * as THREE from 'three'

export class Car {

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
    const car = new THREE.Object3D()

    // 1. 手写几何体的每个顶点坐标 
    let vertices = [
      // 底部
      new THREE.Vector3(3, 0, 3), // 下标0
      new THREE.Vector3(3, 0, -3), // 下标1
      new THREE.Vector3(-3, 0, 3), // 下标2
      new THREE.Vector3(-3, 0, -3), // 下标3
      // 上部
      new THREE.Vector3(2, 5, 2), // 下标6
      new THREE.Vector3(2, 5, -2), // 下标7
      new THREE.Vector3(-2, 5, 2), // 下标8
      new THREE.Vector3(-2, 5, -2), // 下标9
    ]; //顶点坐标，一共8个顶点

    THREE.CullFace

    let faces = [
      // 底部2个三角形
      new THREE.Face(0, 1, 2),
      new THREE.Face3(3, 2, 1),
      // 每个面的 3个三角形
      // 1.
      new THREE.Face3(6, 2, 0),
      new THREE.Face3(0, 4, 6),
      new THREE.Face3(11, 2, 6),
      // 2.
      new THREE.Face3(0, 1, 7),
      new THREE.Face3(7, 4, 0),
      new THREE.Face3(8, 7, 1),
      // 3.
      new THREE.Face3(1, 3, 9),
      new THREE.Face3(9, 8, 1),
      new THREE.Face3(3, 5, 9),
      // 4.
      new THREE.Face3(10, 3, 2),
      new THREE.Face3(11, 10, 2),
      new THREE.Face3(10, 5, 3),
      // 顶部4个三角形
      new THREE.Face3(6, 10, 11),
      new THREE.Face3(7, 8, 9),
      new THREE.Face3(6, 7, 10),
      new THREE.Face3(7, 9, 10),
      // 两个剖面 三角形
      new THREE.Face3(7, 6, 4),
      new THREE.Face3(10, 9, 5)
    ]; //顶点索引，每一个面都会根据顶点索引的顺序去绘制线条
    let globalGeometry_bottom = new THREE.BufferGeometry()
    globalGeometry_bottom.vertices = vertices;
    globalGeometry_bottom.faces = faces;
    globalGeometry_bottom.computeFaceNormals(); //计算法向量，会对光照产生影响
    let _material = new THREE.MeshPhongMaterial({
      color: "rgb(120, 120, 120)"
    });
    let globalFinancialCenter = new THREE.Mesh(globalGeometry_bottom, _material);

    return car
  }

}