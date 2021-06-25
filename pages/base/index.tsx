import React, { Component, memo, useCallback, useEffect } from "react"
import * as THREE from 'three'
import * as Orbitcontrols from 'three-orbit-controls'
import LoadingWrappr from '@/components/Loading'
import { DatBoolean, DatColor, DatNumber, DatString } from 'react-dat-gui'
import { getContainer, sleep } from '@/utils'
import { TREE, Desk, Car, BaseHoouse } from '@/components/Common'
import './index.less'
import { Fragment } from "react"

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

  tree: any 
  direction = true 

  initThree = async () => {
    const { container, width: containerWidth, height: containerHeight } = getContainer('#three-base')
    if(container) {
      const animate = () => {
        requestAnimationFrame(animate)
        cube.rotation.x += 0.01
        cube.rotation.y += 0.01
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
        this.props.stats.update()
        renderer.render(scene, camera)
      }
      const scene = new THREE.Scene()
      scene.background = new THREE.Color(0x111111)
      const camera = new THREE.PerspectiveCamera(75, containerWidth! / containerHeight!, 0.1, 1000)
      camera.position.set(-10, 2, 10)
      camera.lookAt(scene.position)
      let orbitControls = new OrbitcontrolsConstructor(camera, container)

      const abbientLight = new THREE.AmbientLight( 0xf1f1f1 ); // soft white light
      scene.add( abbientLight );

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

      const geometry = new THREE.BoxGeometry()
      const material = new THREE.MeshPhongMaterial( { color: 0xff4499 } )
      const cube = new THREE.Mesh( geometry, material )
      cube.position.set(1, 1, 0)
      THREE.PlaneGeometry
      scene.add( cube )

      //树
      const tree = (new TREE('square')).create()
      tree.position.set(4, 1, -2)
      tree.scale.set(2, 2, 2)
      scene.add(tree)

      //桌子
      const desk = (new Desk("rgb(205,133,63)")).create()
      desk.position.set(10, .25, 3)
      desk.scale.set(0.6, .6, .6)
      scene.add(desk)

      //车
      const car = (new Car("rgb(205,133,63)")).create()
      car.position.set(0, .5, 2)
      scene.add(car)

      //房子
      const baseHouse = (new BaseHoouse()).create()
      baseHouse.position.set(-2, -.8, -2)
      baseHouse.scale.set(.3, .3, .3)
      scene.add(baseHouse)

      //坐标系
      const axesHelper = new THREE.AxesHelper( 100 )
      scene.add(axesHelper)

      //网格
      const gridHelper = new THREE.GridHelper( 100, 100 );
      scene.add( gridHelper )

      orbitControls.autoRotate = false
      const renderer = new THREE.WebGLRenderer()
      renderer.setSize(containerWidth!, containerHeight!)
      container.appendChild( renderer.domElement )
      container.appendChild(this.props.stats.dom)
      animate()
    }
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