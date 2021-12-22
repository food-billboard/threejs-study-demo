import React, { useImperativeHandle, forwardRef, Fragment, memo, useCallback, useEffect, useMemo, useState } from "react"
import * as THREE from 'three'
import * as Orbitcontrols from 'three-orbit-controls'
import { DatNumber } from 'react-dat-gui'
import TWEEN from '@tweenjs/tween.js'
import { getContainer } from '@/utils'
import LoadingWrapper from '@/components/Loading'
import { Laptop } from '@/components/Common'
import { mouseEventRaycaster } from '@/components/Common/utils'
import { getMouseAxes } from '@/components/Common/utils'
import style from './index.module.css'

const OrbitcontrolsConstructor = Orbitcontrols(THREE)

const LapTop  = memo(forwardRef((props: any, ref: any) => {

  const [ camera, setCamera ] = useState<THREE.Camera>()
  const [ intersections, setIntersections ] = useState<any[]>([])

  const { stats, loadend } = useMemo(() => {
    return props 
  }, [props])

  const eventBinding = useCallback((container: Element) => {
    if(camera) {
      // container.addEventListener('click', mouseEventRaycaster(camera, [[this.house], true], (objects) => {
      //   intersections.forEach(item => {
      //     item?.eventBinding?.(objects)
      //   })
      // }, container), false)
    }
  }, [camera])

  const initThree = useCallback(async () => {
    const { container, width: containerWidth, height: containerHeight } = getContainer('#three-base-laptop')
    if(container) {
      const animate = () => {
        requestAnimationFrame(animate)
        TWEEN.update()
        // stats && stats.update()
        renderer.render(scene, camera)
      }
      const scene = new THREE.Scene()
      scene.background = new THREE.Color(0x111111)
      const camera = new THREE.PerspectiveCamera(75, containerWidth! / containerHeight!, 0.1, 1000)
      camera.position.set(0, 15, 10)
      camera.lookAt(scene.position)
      setCamera(camera)
      let orbitControls = new OrbitcontrolsConstructor(camera, container)

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

      //笔记本电脑
      const laptop = new Laptop()
      const laptopObj = laptop.create()
      laptopObj.position.set(-4, 0, 5)
      scene.add(laptopObj)

      //坐标系
      const axesHelper = new THREE.AxesHelper( 100 )
      axesHelper.name = '坐标系'
      scene.add(axesHelper)

      //网格
      const gridHelper = new THREE.GridHelper( 10, 10 );
      gridHelper.name = '网格'
      scene.add( gridHelper )

      orbitControls.autoRotate = false
      const renderer = new THREE.WebGLRenderer()
      renderer.setSize(containerWidth!, containerHeight!)
      container.appendChild( renderer.domElement )
      stats && container.appendChild(stats.dom)

      eventBinding(container)

      animate()
    }
  }, [stats, eventBinding])

  const renderGui = useCallback((Wrapper: any, update: any) => {

    return (
      <Wrapper
        // value={value}
        // onChange={(value: any) => {
        //   this.onChange(update, value)
        // }}
      >
        <DatNumber path='x' label='X轴?' min={-2} max={2} step={0.01} />
        <DatNumber path='y' label='Y轴?' min={-2} max={2} step={0.01} />
        <DatNumber path='z' label='Z轴?' min={-2} max={2} step={0.01} />
      </Wrapper>
    )
  }, [])

  useImperativeHandle(ref, () => ({
    renderGui
  }), [])

  useEffect(() => {
    loadend ? loadend(initThree) : initThree()
  }, [])

  return (
    <div id="three-base-laptop" className={style["three-base-laptop"]}></div>
  )

}))

export default LoadingWrapper()(LapTop)