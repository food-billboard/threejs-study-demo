import * as THREE from 'three'
import Base, { TOptions } from '../Base'
import { IMAGE_FALLBACK, loadImage } from '@/utils'

export class PhotoFrame extends Base {

  constructor(options: TOptions={}, image?: string) {
    super(options)
    image && (this.image = image)
  }

  private readonly containerWidth = 10
  private readonly containerHeight = 10 
  private readonly frameWidth = 1
  private image: string = IMAGE_FALLBACK

  //镜片
  private createWindow = () => {
    const width = this.containerWidth - this.frameWidth * 2
    const height = this.containerHeight - this.frameWidth * 2
    const geometry = new THREE.BoxGeometry( width, height, .01 );
    const windowMaterial = new THREE.MeshPhysicalMaterial( {
      //颜色贴图。默认为null。纹理贴图颜色由漫反射颜色.color调节。
      map: null,
      color: 0xcfcfcf,
      //材质与金属的相似度。非金属材质，如木材或石材，使用0.0，金属使用1.0，通常没有中间值。 默认值为0.0。0.0到1.0之间的值可用于生锈金属的外观。如果还提供了metalnessMap，则两个值相乘。
      metalness: 0,
      //材质的粗糙程度。0.0表示平滑的镜面反射，1.0表示完全漫反射。默认值为1.0。如果还提供roughnessMap，则两个值相乘。
      roughness: 0,
      opacity: 0.6,
      transparent: true,
      //通过乘以环境贴图的颜色来缩放环境贴图的效果。
      envMapIntensity: 10,
      premultipliedAlpha: true
    })
    const cube = new THREE.Mesh( geometry, windowMaterial )
    return cube 
  }

  //框
  private createFrame = () => {
    const group = new THREE.Group()
    const shape = new THREE.Shape()
    const left = this.containerWidth / 2
    const top = this.containerHeight / 2
    shape.moveTo(-left, -top)
    shape.lineTo(-left, top)
    shape.lineTo(left, top)
    shape.lineTo(left, -top)

    const frameLeft = left - this.frameWidth
    const frameTop = top - this.frameWidth
    const path = new THREE.Path()
    path.moveTo(-frameLeft, -frameTop)
    path.lineTo(-frameLeft, frameTop)
    path.lineTo(frameLeft, frameTop)
    path.lineTo(frameLeft, -frameTop)

    shape.holes.push(path)

    const bgTexture = new THREE.TextureLoader().load(loadImage('/images/basehouse/floor.jpeg'))
    bgTexture.wrapS = bgTexture.wrapT = THREE.RepeatWrapping
    bgTexture.repeat.set(2, 2)
    const frame = new THREE.ExtrudeGeometry(shape, {
      steps: 1,
      depth: 0,
      bevelEnabled: true,
      bevelThickness: 1,
      bevelSize: 0,
      bevelOffset: 0,
      bevelSegments: 1
    })
    const bgMaterial = new THREE.MeshPhysicalMaterial({
      map: bgTexture,
      roughness: 0,
      side: THREE.DoubleSide
    })
    const mesh = new THREE.Mesh(frame, bgMaterial)
    group.add(mesh)

    //背景
    const geometry = new THREE.PlaneGeometry( this.containerWidth, this.containerHeight )
    const plane = new THREE.Mesh( geometry, bgMaterial )
    plane.position.z = -1 

    group.add(plane)

    //镜片
    const glass = this.createWindow()
    glass.position.z = 1

    group.add(glass)

    return group
  }

  //图片
  private createPhoto = () => {
    const geometry = new THREE.PlaneGeometry( this.containerWidth, this.containerHeight )
    const texture = new THREE.TextureLoader().load(this.image)
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping
    texture.repeat.set(1, 1)
    const material = new THREE.MeshBasicMaterial({
      map: texture
    })
    const plane = new THREE.Mesh( geometry, material )
    return plane
  }

  public create = () => {
    const photo = new THREE.Group()

    const frame = this.createFrame()
    photo.add(frame)

    const photoImage = this.createPhoto()
    photo.add(photoImage)

    return photo
  }

}