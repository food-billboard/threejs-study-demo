import React, { memo, useCallback, useMemo } from 'react'
import DatGui, { DatBoolean, DatColor, DatNumber, DatString } from 'react-dat-gui'
import 'react-dat-gui/dist/index.css'

interface IProps<T=any> {
  children: React.ReactChildren
  value: T 
  onChange: (value: T) => void
}

export default memo((props: IProps) => {

  const { onChange, value, children } = useMemo(() => {
    return props 
  }, [props])

  const onUpdate = useCallback((newValue: any) => {
    onChange({
      ...value,
      ...newValue
    })
  }, [value])

  return (
    <DatGui data={value} onUpdate={onUpdate}>
      {children}
    </DatGui>
  )

})