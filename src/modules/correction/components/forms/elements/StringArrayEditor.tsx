import { deepEqual } from 'fast-equals'
import { FC, useEffect, useState } from 'react'

import Input, { InputProps } from '../../../../../common/components/Input'

export type StringArrayEditorProps = Omit<InputProps, 'value' | 'onChange'> & {
  value: string[]
  onChange: (value: string[]) => void
}

const StringArrayEditor: FC<StringArrayEditorProps> = ({
  value,
  onChange,
  ...props
}) => {
  const [strVal, setStrVal] = useState(value.join(', '))

  useEffect(() => {
    const newValue = strVal.split(', ').map((s) => s.trim())
    if (!deepEqual(newValue, value)) {
      onChange(newValue)
    }
  }, [onChange, strVal, value])

  return (
    <Input
      value={strVal}
      onChange={(e) => setStrVal(e.target.value)}
      {...props}
    />
  )
}

export default StringArrayEditor
