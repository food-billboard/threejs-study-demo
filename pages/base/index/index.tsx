import React, { Component, Fragment } from "react"
import * as THREE from 'three'
import * as Orbitcontrols from 'three-orbit-controls'
import { DatNumber } from 'react-dat-gui'
import TWEEN from '@tweenjs/tween.js'
import { getContainer } from '@/utils'
import LoadingWrappr from '@/components/Loading'
import { TREE, Desk, Car, BaseHouse, Football, Laptop, PhotoFrame } from '@/components/Common'
import { mouseEventRaycaster } from '@/components/Common/utils'
import { getMouseAxes } from '@/components/Common/utils'
import './index.less'

const OrbitcontrolsConstructor = Orbitcontrols(THREE)

function createRenderer() {
  const renderer = new THREE.WebGLRenderer()
  renderer.setPixelRatio(window.devicePixelRatio)
  
}

class Base extends Component<any> {

  state = {
    value: {
      x: 0,
      y: 0,
      z: 0
    }
  }

  private intersections: any[] = []

  componentDidMount = () => {
    this.props.loadend ? this.props.loadend(this.initThree) : this.initThree()
  }

  onChange = (update: any, value: any) => {
    const { value: defaultValue } = this.state 
    const [ [key, data] ] = Object.entries(value)
    console.log(`rotate${key.toUpperCase()}`)
    this.setState({
      value: {
        ...defaultValue,
        ...value
      }
    }, update)
    this.tree[`rotate${key.toUpperCase()}`]?.((data as number) * Math.PI)
  }

  renderGui = (Wrapper: any, update: any) => {
    const { value } = this.state 
    return (
      <Wrapper
        value={value}
        onChange={(value: any) => {
          this.onChange(update, value)
        }}
      >
        <DatNumber path='x' label='X轴?' min={-2} max={2} step={0.01} />
        <DatNumber path='y' label='Y轴?' min={-2} max={2} step={0.01} />
        <DatNumber path='z' label='Z轴?' min={-2} max={2} step={0.01} />
      </Wrapper>
    )
  }

  animationCar = (car: THREE.Object3D) => {
    if(car.position.x < 30 && this.direction) {
      car.position.x += 0.02
    }else if(car.position.x >= 30) {
      this.direction = false 
    }
    if(car.position.x > -30 && !this.direction) {
      car.position.x -= 0.02
    }else if(car.position.x <= -30) {
      this.direction = true 
    }
  }

  tree: any 
  direction = true 
  camera!: THREE.Camera
  house!: THREE.Object3D

  fogColor = 0xcce0ff

  initThree = async () => {
    const { container, width: containerWidth, height: containerHeight } = getContainer('#three-base')
    if(container) {
      const animate = () => {
        requestAnimationFrame(animate)
        cube.rotation.x += 0.01
        cube.rotation.y += 0.01
        // this.animationCar(car)
        TWEEN.update()
        baseHouse.animate()
        this.props.stats.update()
        renderer.render(scene, camera)
      }
      const scene = new THREE.Scene()
      scene.background = new THREE.Color(0x111111)
      const camera = new THREE.PerspectiveCamera(75, containerWidth! / containerHeight!, 0.1, 1000)
      camera.position.set(0, 15, 10)
      camera.lookAt(scene.position)
      this.camera = camera
      let orbitControls = new OrbitcontrolsConstructor(camera, container)

      const abbientLight = new THREE.AmbientLight( 0xf1f1f1 ); // soft white light
      scene.add( abbientLight );

      //雾化
      scene.fog = new THREE.Fog(this.fogColor, 10, 3000)

      //创建光源
      const light = new THREE.DirectionalLight( 0xFFFFFF, 1 );
      light.position.set( 0, 1, 0 ); //default; light shining from top
      light.castShadow = true; // default false
      scene.add( light )

      //Set up shadow properties for the light
      light.shadow.mapSize.width = 512; // default
      light.shadow.mapSize.height = 512; // default
      light.shadow.camera.near = 0.5; // default
      light.shadow.camera.far = 500; // default

      const geometry = new THREE.BoxBufferGeometry()
      const material = new THREE.MeshPhongMaterial( { color: 0xff4499 } )
      const cube = new THREE.Mesh( geometry, material )
      cube.name = '1111'
      cube.position.set(0, 0, 0)
      THREE.PlaneGeometry
      scene.add( cube )

      //草地
      const grassGeometry = new THREE.PlaneGeometry(100, 100)
      const grassTexture = new THREE.TextureLoader().load('/images/base/grass.jpeg')
      grassTexture.wrapS = grassTexture.wrapT = THREE.RepeatWrapping
      grassTexture.repeat.set(2, 2)
      const grassMaterial = new THREE.MeshBasicMaterial({
        map: grassTexture,
        side: THREE.DoubleSide
      })
      const grass = new THREE.Mesh(grassGeometry, grassMaterial)
      grass.rotateX(Math.PI * -.5)
      scene.add(grass)

      //树
      const tree = (new TREE('square')).create()
      tree.position.set(4, 1, -2)
      tree.scale.set(2, 2, 2)
      tree.name = '树'
      scene.add(tree)

      //桌子
      const desk = (new Desk("rgb(205,133,63)")).create()
      desk.position.set(10, .25, 3)
      desk.scale.set(0.6, .6, .6)
      desk.name = '桌子'
      scene.add(desk)

      //车
      const car = (new Car("rgb(205,133,63)")).create()
      car.position.set(0, .5, 2)
      car.name = '车'
      scene.add(car)

      //房子
      const baseHouse = (new BaseHouse())
      const baseHouseObj = baseHouse.create()
      baseHouseObj.position.set(-2, -.8, -2)
      baseHouseObj.scale.set(.3, .3, .3)
      baseHouseObj.name = '房子'
      this.house = baseHouseObj
      this.intersections.push(baseHouse)
      scene.add(baseHouseObj)

      //足球
      const football = new Football()
      const footballObj = football.create()
      footballObj.position.set(-2, 0, 5)
      footballObj.scale.set(.1, .1, .1)
      scene.add(footballObj)

      //笔记本电脑
      const laptop = new Laptop()
      const laptopObj = laptop.create()
      laptopObj.position.set(-4, 0, 5)
      scene.add(laptopObj)
      //相框
      const photoFrame = new PhotoFrame()
      const photoFrameObj = photoFrame.create()
      photoFrameObj.position.set(3, 3, 3)
      scene.add(photoFrameObj)

      //坐标系
      const axesHelper = new THREE.AxesHelper( 100 )
      axesHelper.name = '坐标系'
      scene.add(axesHelper)

      //网格
      const gridHelper = new THREE.GridHelper( 100, 100 );
      gridHelper.name = '网格'
      scene.add( gridHelper )

      orbitControls.autoRotate = false
      const renderer = new THREE.WebGLRenderer()
      renderer.setSize(containerWidth!, containerHeight!)
      renderer.setClearColor(this.fogColor)
      container.appendChild( renderer.domElement )
      container.appendChild(this.props.stats.dom)

      this.eventBinding(container)

      animate()
    }
  }

  eventBinding = (container: Element) => {
    container.addEventListener('click', mouseEventRaycaster(this.camera, [[this.house], true], (objects) => {
      this.intersections.forEach(item => {
        item?.eventBinding?.(objects)
      })
    }, container), false)
  }

  render = () => {
    return (
      <Fragment>
        <div id="three-base"></div>
      </Fragment>
    )
  }

}

export default LoadingWrappr()(Base)