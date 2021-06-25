import * as THREE from 'three'
import { Object3D } from 'three'

export class Car {

  private color 

  constructor(color: string | number= 0xFF4500) {
    this.color = color 
  }

  //车灯
  private createLight = ([x, y, z]: number[]) => {
    const geometry = new THREE.CylinderGeometry( .1, .1, .05, 32 );
    const material = new THREE.MeshBasicMaterial( {color: 0xffffdd} );
    const cylinder = new THREE.Mesh( geometry, material );
    cylinder.position.set(x, y, z)
    cylinder.rotateZ(Math.PI * .5)
    return cylinder
  }

  //轮子
  private createWheel = ([x, y, z]: number[]) => {
    const wheel = new Object3D()
    const baseGeometry = new THREE.CylinderGeometry( .3, .3, .1, 100 )
    const baseMaterial = new THREE.MeshPhongMaterial( {color: 0xA9A9A9} )
    const wrapper = new THREE.Mesh( baseGeometry, baseMaterial )

    const geometry = new THREE.RingGeometry( .05, .2, 32 )
    const material = new THREE.MeshBasicMaterial( { color: 0x000000, side: THREE.DoubleSide } );
    const circle = new THREE.Mesh( geometry, material )
    const circleFront = new THREE.Mesh( geometry, material )
    circle.rotateX(Math.PI * .5)
    circleFront.rotateX(Math.PI * .5)
    circle.position.set(0, -.06, 0)
    circleFront.position.set(0, .06, 0)

    wheel.rotateX(Math.PI * 0.5)
    wheel.add(wrapper)
    wheel.position.set(x, y, z)
    wheel.add(circle)
    wheel.add(circleFront)
    return wheel
  }

  //侧面窗户
  private createSideWindow = ([x, y, z, rotateX, rotateY]: number[]) => {
    const shape = new THREE.Shape();

    shape.moveTo( 0, -.3 );
    shape.lineTo(-.5, -.3)
    shape.lineTo(-.5, .3)
    shape.lineTo(.2, .3)
    shape.lineTo(.5, -.3)
    shape.lineTo(0, -.3)

    const geometry = new THREE.ShapeGeometry( shape );
    const material = new THREE.MeshBasicMaterial( { color: 0x000000, side: THREE.DoubleSide } );
    const mesh = new THREE.Mesh( geometry, material )
    mesh.rotateY(Math.PI * rotateY)
    mesh.rotateX(Math.PI * rotateX)
    mesh.position.set(x, y, z)

    return mesh 
  }

  //正面窗户
  private createFrontWindow = ([x, y, z, rotateX, rotateY]: number[]) => {
    const shape = new THREE.Shape();

    shape.moveTo( 0, -.3 );
    shape.lineTo(-.5, -.3)
    shape.lineTo(-.4, .3)
    shape.lineTo(.4, .3)
    shape.lineTo(.5, -.3)
    shape.lineTo(0, -.3)

    const geometry = new THREE.ShapeGeometry( shape );
    const material = new THREE.MeshBasicMaterial( { color: 0x000000, side: THREE.DoubleSide } );
    const mesh = new THREE.Mesh( geometry, material )
    mesh.rotateY(Math.PI * rotateY)
    mesh.rotateX(Math.PI * rotateX)
    mesh.position.set(x, y, z)

    return mesh 
  }

  //底座
  private createBase = () => {
    const geometry = new THREE.BoxGeometry( 3, .3, 1.5 )
    const material = new THREE.MeshPhongMaterial( {color: this.color} );
    const cube = new THREE.Mesh( geometry, material )
    cube.position.set(0, .25, 0)
    return cube 
  }

  //天线
  private createAirWire = ([x, y, z]: number[]) => {
    const curve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3( -10, 0, 0 ),
      new THREE.Vector3( 20, 15, 0 ),
      new THREE.Vector3( 10, 0, 0 )
    );
    
    const points = curve.getPoints( 50 );
    const geometry = new THREE.BufferGeometry().setFromPoints( points );
    
    const material = new THREE.LineBasicMaterial( { color : 0x666666, linewidth: 50 } );
    
    // Create the final object to add to the scene
    const curveObject = new THREE.Line( geometry, material )

    return curveObject
  }

  //主体
  private createBody = () => {
    const body = new Object3D()
    const base = this.createBase()
    // const airWire = this.createAirWire([0, 0, 0])
    // body.add(airWire)
    body.add(base)
    const _baseBody = new Object3D()
    const geometry = new THREE.CylinderGeometry( 1.5, 2.1, 1, 4 );
    const material = new THREE.MeshPhongMaterial( {color: this.color} );
    const cylinder = new THREE.Mesh( geometry, material )
    cylinder.rotateY(0.25 * Math.PI)
    _baseBody.add(cylinder)
    _baseBody.position.set(0, .7, 0)
    _baseBody.scale.setZ(.5)
    body.add(_baseBody)
    return body 
  }

  create = () => {
    const car = new THREE.Object3D()

    // // 1. 手写几何体的每个顶点坐标 
    // let vertices = [
    //   // 底部
    //   new THREE.Vector3(3, 0, 3), // 下标0
    //   new THREE.Vector3(3, 0, -3), // 下标1
    //   new THREE.Vector3(-3, 0, 3), // 下标2
    //   new THREE.Vector3(-3, 0, -3), // 下标3
    //   // 上部
    //   new THREE.Vector3(2, 5, 2), // 下标6
    //   new THREE.Vector3(2, 5, -2), // 下标7
    //   new THREE.Vector3(-2, 5, 2), // 下标8
    //   new THREE.Vector3(-2, 5, -2), // 下标9
    // ]; //顶点坐标，一共8个顶点


    // const geometry = new THREE.CylinderGeometry( .5, .9, .6, 4 );
    // const material = new THREE.MeshBasicMaterial( {color: this.color} );
    // const cylinder = new THREE.Mesh( geometry, material )
    // cylinder.rotateY(0.25 * Math.PI)
    // car.add(cylinder) 

    const body = this.createBody()
    body.position.set(0, 0, 0)
    car.add(body)

    //轮子
    const wheels = [
      //左前
      [
        -1,
        0,
        .75
      ],
      //右前
      [
        1,
        0,
        .75
      ],
      //左后
      [
        -1,
        0,
        -.75
      ],
      //右后
      [
        1,
        0,
        -.75
      ]
    ]
    wheels.forEach((item, index) => {
      const wheel = this.createWheel(item)
      car.add(wheel)
    })

    //侧面窗户
    const sideSindows = [
      //左前
      [
        -.6, 
        .8,
        .65,
        .05, 
        1
      ],
      //右前
      [
        .6,
        .8,
        .65,
        -.05, 
        0
      ],
      //左后
      [
        -.6, 
        .8,
        -.65,
        -.05, 
        1
      ],
      //右后
      [
        .6,
        .8,
        -.65,
        .05,
        0
      ],
    ]
    sideSindows.forEach((item) => {
      const _window = this.createSideWindow(item)
      car.add(_window)
    })

    //正面窗户
    const frontWindows = [
      [
        1.26,
        .8,
        0,
        -.11, 
        .5
      ],
      [
        -1.26,
        .8,
        0,
        .11, 
        .5
      ]
    ]
    frontWindows.forEach((item) => {
      const _window = this.createFrontWindow(item)
      car.add(_window)
    })

    //车灯
    const lights = [
      [
        1.5,
        .25,
        -.3
      ],
      [
        1.5,
        .25,
        .3
      ],
      [
        -1.5,
        .25,
        -.3
      ],
      [
        -1.5,
        .25,
        .3
      ],
    ]
    lights.forEach((item) => {
      const light = this.createLight(item)
      car.add(light)
    })

    return car
  }

}