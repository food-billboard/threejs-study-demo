import React, { useMemo, Component, useEffect, useState, useCallback } from 'react'
import { Spin } from 'antd'
import { sleep } from '@/utils'

export default function Wrapper<T>(CusComponent: any){
  return (props: T) => {

    const [ loading, setLoading ] = useState<boolean>(true)
  
    const { ...nextProps } = useMemo(() => {
      return props 
    }, [props])
  
    const loadLoading = useCallback(async (callback?: () => any) => {
      await sleep()
      setLoading(false)
      callback && callback()
    }, [])
  
    return (
      <div style={{width: '100%', height: '100%', position: 'relative'}}>
        <CusComponent loadend={loadLoading} {...nextProps} />
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
      </div>
    )
  
  }
}