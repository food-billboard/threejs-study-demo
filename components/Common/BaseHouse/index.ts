import * as THREE from 'three'
import TWEEN from '@tweenjs/tween.js'
import Base, { TAnimationQueue } from '../Base'
import { loadImage } from '@/utils'

export class BaseHouse extends Base {

  private doorMesh!: THREE.Group
  private doorState = {
    close: true,
    loading: false  
  }

  private windowLeftMesh!: THREE.Object3D
  private windowRightMesh!: THREE.Object3D
  private windowLeftState = {
    close: true,
    loading: false  
  }
  private windowRightState = {
    close: true,
    loading: false 
  }

  public eventBinding = (objects: THREE.Intersection[]) => {
    return this.baseEventBinding(objects, [this.doorMesh, this.windowLeftMesh, this.windowRightMesh], [(object) => {
      this.animationStateChange(this.doorMesh, {
        callback: this.changeDoorState,
        update: true 
      })
    }, () => {
      this.animationStateChange(this.windowLeftMesh, {
        callback: this.changeWindowLeftState,
        update: true 
      })
    }, () => {
      this.animationStateChange(this.windowRightMesh, {
        callback: this.changeWindowRightState,
        update: true 
      })
    }])
  }

  //正面墙
  private frontWall = ([x, y, z]: number[]) => {
    const group = new THREE.Group()

    //窗户
    const window = this.createWindow()
    window.position.set(3, 9, 1)
    group.add(window)

    //门
    const doorThing = this.createDoor()
    doorThing.position.set(-2, 4.5, 0)
    doorThing.name = '门'
    group.add(doorThing)

    //绘制整体形状
    const shape = new THREE.Shape()   
    shape.moveTo(0, 0)
    shape.lineTo(-8, 0)
    shape.lineTo(-8, 12)
    shape.lineTo(8, 12)
    shape.lineTo(8, 0)

    //用Path类绘制窗户形状
    const _window = new THREE.Path()   
    _window.moveTo(2, 8)
    _window.lineTo(2, 10)
    _window.lineTo(4, 10)
    _window.lineTo(4, 8)
    //将窗户形状加入到shape.holes数组，就会从当前形状减去窗户形状。
    shape.holes.push(_window)   
  
    //用Path类绘制门的形状
    const door = new THREE.Path()   
    door.moveTo(-4, .5)
    door.lineTo(-4, 8.5)
    door.lineTo(0, 8.5)
    door.lineTo(0, .5)
    //将门的形状加入到shape.holes数组
    shape.holes.push(door)    
  
    const extrudeSettings = { 
      amount: .01,  
      bevelSegments: 1, 
      steps: 1, 
      bevelSize: 0, 
      bevelThickness: 1 
    }
  
    const geometry = new THREE.ExtrudeGeometry( shape, extrudeSettings )
    const material = new THREE.MeshBasicMaterial( { color: 0xF5DEB3 } );
    const mesh = new THREE.Mesh( geometry, material )
    group.add(mesh)
    group.position.set(x, y, z)
    return group
  }

  //后墙
  private frontEndWall = ([x, y, z]: number[]) => {
    //绘制整体形状
    const shape = new THREE.Shape()   
    shape.moveTo(0, 0)
    shape.lineTo(-8, 0)
    shape.lineTo(-8, 12)
    shape.lineTo(8, 12)
    shape.lineTo(8, 0)  
  
    const extrudeSettings = { 
      amount: .01,  
      bevelSegments: 1, 
      steps: 1, 
      bevelSize: 0, 
      bevelThickness: 1 
    }
  
    const geometry = new THREE.ExtrudeGeometry( shape, extrudeSettings )
    const material = new THREE.MeshBasicMaterial( { color: 0xF5DEB3 } );
    const mesh = new THREE.Mesh( geometry, material )
    mesh.position.set(x, y, z)
    mesh.scale.setZ(.3)
    return mesh
  }

  //地板
  private createFloor = ([x, y, z]: number[]) => {
    const floorTexture = new THREE.TextureLoader().load(loadImage('/images/basehouse/floor.jpeg'))
    floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping
    floorTexture.repeat.set(25, 25)
    floorTexture.anisotropy = 16
    const floorMaterial = new THREE.MeshBasicMaterial({ 
      map: floorTexture,
      side: THREE.DoubleSide
    })
    const geometry = new THREE.PlaneGeometry( 12, 16 );
    // const material = new THREE.MeshBasicMaterial( {color: 0xFFFAF0, side: THREE.DoubleSide} );
    const plane = new THREE.Mesh( geometry, floorMaterial )
    plane.position.set(x, y, z)
    plane.rotateZ(Math.PI * .5)
    plane.rotateY(Math.PI * .5)
    return plane
  }

  //侧面墙
  private sideWall = ([x, y, z]: number[]) => {
    const shape = new THREE.Shape();

    shape.moveTo( 6, 0 );
    shape.lineTo( -6, 0 );
    shape.lineTo(-6, 12)
    shape.lineTo(0, 14)
    shape.lineTo(6, 12)
    shape.lineTo(6, 0)
  
    const extrudeSettings = {  //Extrude配置，具体可以修改参数调试各种效果
      amount: .01,  
      bevelSegments: 1, 
      steps: 1, 
      bevelSize: 0, 
      bevelThickness: 1 
    }
    //根据二维形状和Extrude配置生成ExtrudeGeometry
    const geometry = new THREE.ExtrudeGeometry( shape, extrudeSettings ) 
    const material = new THREE.MeshBasicMaterial( { color: 0xF5DEB3 } );
    const mesh = new THREE.Mesh( geometry, material )
    mesh.position.set(x, y, z)
    mesh.scale.setZ(.5)
    return mesh
  }

  //房顶
  private createRoof = ([x, y, z]: number[]) => {
    //导入贴图
    const roofTexture = new THREE.TextureLoader().load(loadImage('/images/basehouse/roof.jpeg'))
    roofTexture.wrapS = roofTexture.wrapT = THREE.RepeatWrapping
    roofTexture.repeat.set( 2, 2 )
    const materials = []    //创建一个6项的材质数组，three.js会自动将每一项贴一个面
    const colorMaterial = new THREE.MeshLambertMaterial({ color: 'grey' })
    const textureMaterial = new THREE.MeshLambertMaterial({ map: roofTexture })
    for(let i=0; i<6; i++){
      materials.push(colorMaterial)   
    }

    const roof = new THREE.Object3D()
    const geometry = new THREE.BoxGeometry( 18, 10, .4 )
    const frontCube = new THREE.Mesh( geometry, [
      ...materials.slice(0, 4),
      textureMaterial,
      ...materials.slice(0, -5),
    ] )
    const frontEndCube = new THREE.Mesh( geometry, [
      ...materials.slice(0, -1),
      textureMaterial
    ] )
    frontCube.rotateX(Math.PI * -.4)
    frontEndCube.rotateX(Math.PI * .4)
    frontCube.position.set(0, 0, 4.7)
    frontEndCube.position.set(0, 0, -4.7)
    roof.add(frontCube)
    roof.add(frontEndCube)
    roof.position.set(x, y, z)
    return roof 
  }

  //门
  private createDoor = () => {
    const door = new THREE.Group()

    //门框
    const frame = new THREE.Shape()
    const frameTexture = new THREE.TextureLoader().load(loadImage('/images/basehouse/roof.jpeg'))
    frameTexture.wrapS = frameTexture.wrapT = THREE.RepeatWrapping
    frameTexture.repeat.set( 2, 2 )

    frame.moveTo(2, -4)
    frame.lineTo(-2, -4)
    frame.lineTo(-2, 4)
    frame.lineTo(2, 4)

    const hole = new THREE.Path()
    hole.moveTo(1.8, -3.8)
    hole.lineTo(-1.8, -3.8)
    hole.lineTo(-1.8, 3.8)
    hole.lineTo(1.8, 3.8)

    frame.holes.push(hole)

    const frameGeometry = new THREE.ExtrudeGeometry(frame, {
      steps: 1,
      depth: 0,
      bevelEnabled: true,
      bevelThickness: 1,
      bevelSize: 0,
      bevelOffset: 0,
      bevelSegments: 1
    })
    const frameMaterial = new THREE.MeshBasicMaterial( { map: frameTexture, side: THREE.DoubleSide } )
    const mesh = new THREE.Mesh( frameGeometry, frameMaterial )

    door.add(mesh)

    //门
    const doorGroup = new THREE.Group()
    //门把手
    const doorHolderGeometry = new THREE.CylinderGeometry(.3, .3, 1, 32)
    const doorHolderMaterial = new THREE.MeshBasicMaterial({ color: 0xA0522D })
    const doorHolder = new THREE.Mesh(doorHolderGeometry, doorHolderMaterial)
    doorHolder.rotateX(Math.PI * .5)
    doorHolder.position.x = -1
    //门板
    const doorBoardGeometry = new THREE.BoxGeometry(3.6, 7.6, .5)
    const doorBoard = new THREE.Mesh(doorBoardGeometry, frameMaterial)
    doorGroup.add(doorHolder)
    doorGroup.add(doorBoard)
    const doorGroupWrapper = new THREE.Group()
    doorGroup.position.x = -1.8
    doorGroupWrapper.castShadow = true 
    doorGroupWrapper.add(doorGroup)
    doorGroupWrapper.position.x = 1.8
    this.doorMesh = doorGroupWrapper

    door.add(doorGroupWrapper)

    return door 

  }

  //窗户
  private createWindow = () => {

    const windows = new THREE.Group()

    const frameWrapper = new THREE.Object3D()
    const shape = new THREE.Shape()
    const frameTexture = new THREE.TextureLoader().load(loadImage('/images/basehouse/roof.jpeg'))
    frameTexture.wrapS = frameTexture.wrapT = THREE.RepeatWrapping
    frameTexture.repeat.set( 2, 2 )

    shape.moveTo(-1, 0);
    shape.lineTo(-1, 2)
    shape.lineTo(0, 2)
    shape.lineTo(0, 0)

    const path = new THREE.Path()
    path.moveTo(-.9, .1)
    path.lineTo(-.9, 1.9)
    path.lineTo(-.1, 1.9)
    path.lineTo(-.1, .1)

    shape.holes.push(path)
    
    const frame = new THREE.ExtrudeGeometry(shape, {
      steps: 1,
      depth: 0,
      bevelEnabled: true,
      bevelThickness: 1,
      bevelSize: 0,
      bevelOffset: 0,
      bevelSegments: 1
    })
    const frameMaterial = new THREE.MeshBasicMaterial( { map: frameTexture, side: THREE.DoubleSide } )
    const mesh = new THREE.Mesh( frame, frameMaterial )
    mesh.position.set(.5, -1, 0)
    mesh.scale.setZ(1.2)
    frameWrapper.add(mesh)

    const geometry = new THREE.BoxGeometry( .8, 1.8, .01 );
    const windowMaterial = new THREE.MeshPhysicalMaterial( {
      //颜色贴图。默认为null。纹理贴图颜色由漫反射颜色.color调节。
      map: null,
      color: 0xcfcfcf,
      //材质与金属的相似度。非金属材质，如木材或石材，使用0.0，金属使用1.0，通常没有中间值。 默认值为0.0。0.0到1.0之间的值可用于生锈金属的外观。如果还提供了metalnessMap，则两个值相乘。
      metalness: 0,
      //材质的粗糙程度。0.0表示平滑的镜面反射，1.0表示完全漫反射。默认值为1.0。如果还提供roughnessMap，则两个值相乘。
      roughness: 0,
      opacity: 0.45,
      transparent: true,
      //通过乘以环境贴图的颜色来缩放环境贴图的效果。
      envMapIntensity: 10,
      premultipliedAlpha: true
    })
    const cube = new THREE.Mesh( geometry, windowMaterial )
    cube.position.set(0, 0, 0)
    frameWrapper.add(cube)
    frameWrapper.scale.z = .1

    const beside = frameWrapper.clone()

    //动画
    const frameGroup = new THREE.Group()
    frameGroup.add(frameWrapper)
    frameWrapper.position.set(.5, 0, 0)
    frameGroup.position.set(-1, 0, 0)
    const besideGroup = new THREE.Group()
    besideGroup.add(beside)
    beside.position.set(-.5, 0, 0)
    besideGroup.position.set(1, 0, 0)

    this.windowLeftMesh = frameGroup
    this.windowRightMesh = besideGroup
    windows.add(frameGroup)
    windows.add(besideGroup)

    //底座
    const lampstandGeometry = new THREE.BoxGeometry(2.4, 0.2, 1.5)
    const lampstandMaterial = new THREE.MeshBasicMaterial({ color: 0x777777 })
    const lampstand = new THREE.Mesh(lampstandGeometry, lampstandMaterial)
    lampstand.position.set(0, -1, .75)
    windows.add(lampstand)

    return windows
  }

  //开关门
  public changeDoorState: TAnimationQueue["callback"] = (object, close) => {
    if(this.doorState.loading) return 
    this.doorState.loading = true 
    if(!this.doorState.close) {
      const tween = new TWEEN.Tween({
        y: -Math.PI * .5
      })
      .to({ y: 0 }, 1000) 
      .easing(TWEEN.Easing.Quadratic.Out) // Use an easing function to make the animation smooth.
      .onUpdate(({ y }) => {
        object.rotation.y = y
      })
      .onComplete(() => {
        close()
        this.doorState.loading = false
        this.doorState.close = true 
      })
      .start()
    }else {
      const tween = new TWEEN.Tween({
        y: 0
      })
      .to({ y: -Math.PI * .5 }, 1000) 
      .easing(TWEEN.Easing.Quadratic.Out) // Use an easing function to make the animation smooth.
      .onUpdate(({ y }) => {
        object.rotation.y = y
      })
      .onComplete(() => {
        close()
        this.doorState.loading = false
        this.doorState.close = false 
      })
      .start()
    }

  }

  //左侧开关窗
  public changeWindowLeftState: TAnimationQueue["callback"] = (object, close) => {
    if(this.windowLeftState.loading) return 
      this.windowLeftState.loading = true 
      if(!this.windowLeftState.close) {
        const tween = new TWEEN.Tween({
          y: Math.PI * .5
        })
        .to({ y: 0 }, 1000) 
        .easing(TWEEN.Easing.Quadratic.Out) // Use an easing function to make the animation smooth.
        .onUpdate(({ y }) => {
          object.rotation.y = y
        })
        .onComplete(() => {
          close()
          this.windowLeftState.loading = false
          this.windowLeftState.close = true 
        })
        .start()
      }else {
        const tween = new TWEEN.Tween({
          y: 0
        })
        .to({ y: Math.PI * .5 }, 1000) 
        .easing(TWEEN.Easing.Quadratic.Out) // Use an easing function to make the animation smooth.
        .onUpdate(({ y }) => {
          object.rotation.y = y
        })
        .onComplete(() => {
          close()
          this.windowLeftState.loading = false
          this.windowLeftState.close = false 
        })
        .start()
      }
  }

  //右侧开关窗
  public changeWindowRightState: TAnimationQueue["callback"] = (object, close) => {
    if(this.doorState.loading) return 
      this.doorState.loading = true 
      if(!this.doorState.close) {
        const tween = new TWEEN.Tween({
          y: -Math.PI * .5
        })
        .to({ y: 0 }, 1000) 
        .easing(TWEEN.Easing.Quadratic.Out) // Use an easing function to make the animation smooth.
        .onUpdate(({ y }) => {
          object.rotation.y = y
        })
        .onComplete(() => {
          close()
          this.doorState.loading = false
          this.doorState.close = true 
        })
        .start()
      }else {
        const tween = new TWEEN.Tween({
          y: 0
        })
        .to({ y: -Math.PI * .5 }, 1000) 
        .easing(TWEEN.Easing.Quadratic.Out) // Use an easing function to make the animation smooth.
        .onUpdate(({ y }) => {
          object.rotation.y = y
        })
        .onComplete(() => {
          close()
          this.doorState.loading = false
          this.doorState.close = false 
        })
        .start()
      }
  }

  public create = () => {

    const house = new THREE.Object3D()

    //地板
    const floor = this.createFloor([
      -5,
      2.9, 
      0
    ])
    house.add(floor)

    //正面墙
    const frontWall = this.frontWall([
      -5,
      3,
      6
    ])

    //后面墙
    const frontEndWall = this.frontEndWall([
      -5,
      3, 
      -6
    ])
    house.add(frontWall)
    house.add(frontEndWall) 

    //侧面墙
    const sideWalls = [
      [
        -12.5,
        3,
        0
      ],
      [
        2.5,
        3,
        0
      ]
    ]
    sideWalls.forEach(item => {
      const wall = this.sideWall(item)
      wall.rotateY(Math.PI * .5)
      house.add(wall)
    })

    //屋顶
    const roof = this.createRoof([
      -5,
      15.7, 
      0
    ])
    house.add(roof)

    return house 

  }

}