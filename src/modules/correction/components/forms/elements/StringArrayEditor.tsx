import { deepEqual } from 'fast-equals'
import { FC, useEffect, useState } from 'react'

const StringArrayEditor: FC<{
  value: string[]
  onChange: (value: string[]) => void
}> = ({ value, onChange }) => {
  const [strVal, setStrVal] = useState(value.join(', '))

  useEffect(() => {
    const newValue = strVal.split(', ').map((s) => s.trim())
    if (!deepEqual(newValue, value)) {
      onChange(newValue)
    }
  }, [onChange, strVal, value])

  return (
    <input
      className='border border-stone-300 px-2 py-1'
      value={strVal}
      onChange={(e) => setStrVal(e.target.value)}
    />
  )
}

export default StringArrayEditor
