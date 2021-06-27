import React, { Component, memo, useCallback, useEffect } from "react"
import * as THREE from 'three'
import * as Orbitcontrols from 'three-orbit-controls'
import LoadingWrappr from '@/components/Loading'
import { DatBoolean, DatColor, DatNumber, DatString } from 'react-dat-gui'
import { getContainer, sleep } from '@/utils'
import { TREE, Desk, Car, BaseHouse } from '@/components/Common'
import { getMouseAxes } from '@/components/Common/utils'
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
    // document.querySelector('#three-base')?.addEventListener('click', )
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


  mouse = new THREE.Vector3(1, 1, 0)
  raycaster: THREE.Raycaster = new THREE.Raycaster(this.mouse)
  update = (camera: any, mesh: THREE.Mesh) => {
    this.raycaster.setFromCamera( this.mouse, camera )

    const intersection = this.raycaster.intersectObject( mesh )
    if ( intersection.length > 0 ) {
      
      console.log(11111)
    }
  }

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
        // baseHouse.update(camera)
        // this.update(camera, cube)
        this.props.stats.update()
        renderer.render(scene, camera)
      }
      const scene = new THREE.Scene()
      scene.background = new THREE.Color(0x111111)
      const camera = new THREE.PerspectiveCamera(75, containerWidth! / containerHeight!, 0.1, 1000)
      camera.position.set(0, 0, 10)
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

      const geometry = new THREE.BoxBufferGeometry()
      const material = new THREE.MeshPhongMaterial( { color: 0xff4499 } )
      const cube = new THREE.Mesh( geometry, material )
      cube.name = '1111'
      cube.position.set(0, 0, 0)
      THREE.PlaneGeometry
      scene.add( cube )

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
      scene.add(baseHouseObj)

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
      container.appendChild( renderer.domElement )
      container.appendChild(this.props.stats.dom)

      // baseHouse.eventBinding(container)
      container.addEventListener('click', (event: any) => {
        // const { x, y } = getMouseAxes(event)
        // this.mouse.x = x 
        // this.mouse.y = y 
        // event.preventDefault();

        var raycaster = new THREE.Raycaster();
        var mouse = new THREE.Vector3();
        // mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        // mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
        mouse.x =
        ((event.clientX - container.getBoundingClientRect().left) /
          container.offsetWidth) *
          2 -
        1 // 标准设备横坐标
        // 这里的mainCanvas是个dom元素,getBoundingClientRectangle会返回当前元素的视口大小.
        mouse.y =
          -(
            (event.clientY - container.getBoundingClientRect().top) /
            container.offsetHeight
          ) *
            2 +
          1 // 标准设备纵坐标
        mouse.z = 0.5
    
        raycaster.setFromCamera( mouse, camera );
        console.log(mouse, window.innerWidth, window.innerHeight, container.clientWidth, container.clientHeight, 3333)

        var intersects = raycaster.intersectObject( cube );
        if(intersects.length>0){
            // alert("点击了热点"+intersects[0].object.detail.title);
            console.log(222222, mouse, intersects.filter(item => !(item.object instanceof THREE.GridHelper) && !(item.object instanceof THREE.AxesHelper)), scene.children, 222)
        }
        // console.log(cube.geometry, cube.geometry)
      })

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