import * as THREE from 'three'
import Base, { TOptions } from '../Base'

export class Stairway extends Base {

  constructor(options={}, sort: number[]) {
    super(options)
    this.sort = sort 
  }

  private readonly stairWidth: number = 10 
  private readonly stairHeight: number = 10 
  private readonly stairDept: number = 10 
  private sort: number[] = []

  //单梯
  private createStair = () => {

  }

  //中间踏板
  private createSupport = () => {

  }

  public create = () => {

    const group = new THREE.Group()

    //单梯
    const stair = this.createStair()

    return group 

  }

}