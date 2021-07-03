import * as THREE from 'three'
import Base from '../Base'

//开关机
//折叠

export class Laptop extends Base {

  private readonly baseWidth = 5
  private readonly baseHeight = 5 
  private readonly baseDept = 5 
  
  private readonly screenPadding = 2  

  //底座
  private createBase = () => {
    const base = new THREE.Group()

    //按钮
    const radius = this.baseWidth / 15
    const buttonGeometry = new THREE.CylinderGeometry(radius, radius, .1)
    const buttonMaterial = new THREE.MeshPhongMaterial({
      color: 0x111111
    })
    const button = new THREE.Mesh(buttonGeometry, buttonMaterial)

    //底盘
    const baseTabGeometry = new THREE.BoxGeometry(this.baseWidth, this.baseHeight, this.baseDept)
    const baseTabMaterial = new THREE.MeshBasicMaterial({
      color: 0x030303
    })
    const baseTab = new THREE.Mesh(baseTabGeometry, baseTabMaterial)


    base.add(baseTab, button)

    return base 
  }

  //屏幕
  private createScreen = () => {
    const screen = new THREE.Group()

    return screen
  }

  public create = () => {
    const laptop = new THREE.Group()

    const base = this.createBase()
    const screen = this.createScreen()

    laptop.add(base, screen)

    return laptop
  }

}