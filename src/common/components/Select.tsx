import { Key } from 'react'

export type SelectProps<
  K extends Key,
  V extends string | number | readonly string[],
  L
> = {
  options: { key: K; value: V; label: L }[]
  value: V
  onChange: (value: V) => void
  className?: string
}

const Select = <
  K extends Key,
  V extends string | number | readonly string[],
  L
>({
  options,
  value,
  onChange,
  className,
}: SelectProps<K, V, L>) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value as V)}
    className={className}
  >
    {options.map(({ key, value, label }) => (
      <option key={key} value={value}>
        {label}
      </option>
    ))}
  </select>
)

export default Select
