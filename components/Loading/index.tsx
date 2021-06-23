import React, { Component, ComponentType, createRef } from 'react'
import { Spin } from 'antd'
import Stats from 'stats.js'
import Gui from '../Gui'
import { sleep } from '@/utils'


interface WithLoadingProps {
  loadLoading: (callback?: any) => Promise<void> 
}

export default function Wrapper<T extends object=any>(options: any={}){
  return function(CusComponent: ComponentType<T>) {
    return class extends Component<T & WithLoadingProps> {

      componentDidMount = () => {
        const stats = new Stats()
        stats.dom.style.position = 'absolute'
        stats.dom.style.top = '0px'
        this.setState({
          stats
        })
      }
  
      childRef = createRef<any>()
  
      state = {
        loading: true,
        stats: null 
      }
  
      loadLoading = async (callback?: () => any) => {
        await sleep()
        this.setState({
          loading: false,
        }, callback)
      }
  
      renderGui = () => {
        return this.childRef.current?.renderGui?.(Gui, this.forceUpdate.bind(this)) || ''
      }
    
      render() {
  
        const { loading, stats } = this.state 
  
        return (
          <div style={{width: '100%', height: '100%', position: 'relative'}}>
            <CusComponent ref={this.childRef} stats={stats} loadend={this.loadLoading} {...this.props} />
            <Spin 
              spinning={loading} 
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)'
              }} 
              size="large"
            />
            {
              this.renderGui()
            }
          </div>
        )
      }
  
    }
  }
}