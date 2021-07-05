import React from "react"
import {
  HomeOutlined,
  AppstoreOutlined
} from '@ant-design/icons'

export type TRouter = Partial<{
  path: string 
  icon: React.ReactNode  
  title: string 
  routes: TRouter[]
  hideInMenu: boolean 
}>

const router: TRouter[] = [
  {
    path: '/home',
    icon: <HomeOutlined />,
    title: '主页',
    routes: [
      {
        path: '/home/subhome',
        title: '子页面',
        icon: <HomeOutlined />,
        hideInMenu: true 
      }
    ]
  },
  {
    path: '/base',
    icon: <AppstoreOutlined />,
    title: '基础3d',
    routes: [
      {
        path: '/base/index',
        title: '基础场景'
      },
      {
        path: '/base/laptop',
        title: '笔记本电脑'
      }
    ]
  }
]

export default router