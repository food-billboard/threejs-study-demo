import React, { useCallback, useEffect, useMemo, useState } from 'react'
import Router from 'next/router'
import { Layout as AntLayout, Menu } from 'antd'
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from '@ant-design/icons'
import router, { TRouter } from '@/config/router'
import { WRAPPER_MAIN_ID } from '@/constants'
import './index.less'

const { Header, Sider, Content } = AntLayout

const Layout = ({ children }: { children: React.ReactChildren }) => {

  const [ collapsed, setCollapsed ] = useState<boolean>(false)
  const [ openKeys, setOpenKeys ] = useState<string[]>([])
  const [ selectKeys, setSelectkeys ] = useState<string[]>(['/home'])

  const toggle = useCallback(() => {
    setCollapsed(!collapsed)
  }, [collapsed])

  const initMenuSelect = useCallback((path?: string) => {
    const { asPath } = Router
    const pathList = (path || asPath).split('/').filter(item => !!item).map(item => `/${item}`)
    if(!pathList.length) {
      setSelectkeys(['/home'])
    }else {
      setOpenKeys(pathList.slice(0, -1))
      setSelectkeys(pathList.slice(-1))
    }
  }, [])

  const onRouterPush = useCallback(({ item, key, keyPath, domEvent }) => {
    initMenuSelect(key)
    return Router.push(key)
  }, [initMenuSelect])

  const MenuList = useMemo(() => {
    const renderList = (router: TRouter[]) => {
      return router.filter(item => !item.hideInMenu).map((item, index) => {
        const { path, routes, title, icon } = item 
        let newRoutes = []
        if(Array.isArray(routes)) {
          newRoutes = routes.filter(item => !item.hideInMenu)
          if(!!newRoutes.length) return (
            <Menu.SubMenu
              key={path}
              // icon={<icon />}
              title={title}
            >
              {renderList(newRoutes)}
            </Menu.SubMenu>
          )
        }
        return (
          <Menu.Item
            key={path}
            icon={icon}
          >
            {title}
          </Menu.Item>
        )
      })
    }
    return renderList(router)
  }, [])

  useEffect(() => {
    const { asPath } = Router
    if(asPath === '/') {
      Router.push('/home')
    }
    initMenuSelect()
  }, [initMenuSelect])

  return (
    <AntLayout
      style={{
        height: '100vh'
      }}
    >
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="logo" />
        <Menu 
          theme="dark" 
          mode="inline" 
          onClick={onRouterPush}
          openKeys={openKeys}
          selectedKeys={selectKeys}
        >
          {
            MenuList
          }
        </Menu>
      </Sider>
      <AntLayout className="site-layout">
        <Header className="site-layout-background-header" style={{ padding: 0 }}>
          {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
            className: 'trigger',
            onClick: toggle,
          })}
        </Header>
        <Content
          className="site-layout-background"
          id={WRAPPER_MAIN_ID}
          style={{
            margin: '24px 16px',
            minHeight: 280,
            height: 'calc(100vh - 64px)',
            overflow: 'auto'
          }}
        >
          {children}
        </Content>
      </AntLayout>
    </AntLayout>
  )

}

export default Layout