import React, { memo, useCallback, useEffect } from "react"
import * as THREE from 'three'
import * as Orbitcontrols from 'three-orbit-controls'
import LoadingWrappr from '@/components/Loading'
import Gui from '@/components/Gui'
import { getContainer, sleep } from '@/utils'
import './index.less'
import { Fragment } from "react"

const OrbitcontrolsConstructor = Orbitcontrols(THREE)

export default LoadingWrappr(memo((props: any) => {

  const initThree = useCallback(async () => {
    const container = document.querySelector('#three-base')
    if(container) {
      const animate = () => {
        requestAnimationFrame(animate)
        cube.rotation.x += 0.01
        cube.rotation.y += 0.01
        renderer.render(scene, camera)
      }
      const { width: containerWidth, height: containerHeight } = container.getBoundingClientRect()
      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(75, containerWidth / containerHeight, 0.1, 1000)
      camera.position.set(0, 0, 5)
      camera.lookAt(scene.position)
      let orbitControls = new OrbitcontrolsConstructor(camera)
      const geometry = new THREE.BoxGeometry()
      const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } )
      const cube = new THREE.Mesh( geometry, material )
      scene.add( cube )
      orbitControls.autoRotate = false
      const renderer = new THREE.WebGLRenderer()
      renderer.setSize(containerWidth, containerHeight)
      container.appendChild( renderer.domElement )
      animate()
    }
  }, [])

  useEffect(() => {
    props.loadend ? props.loadend(initThree) : initThree()
  }, [])
  
  return (
    <Fragment>
      <div id="three-base"></div>
    </Fragment>
  )
  
}))