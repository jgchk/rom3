import clsx from 'clsx'
import { Key } from 'react'

export type SelectProps<
  K extends Key,
  V extends string | number | readonly string[],
  L
> = {
  id?: string
  options: { key: K; value: V; label: L }[]
  value: V
  onChange: (value: V) => void
  className?: string
  tabIndex?: number
}

const Select = <
  K extends Key,
  V extends string | number | readonly string[],
  L
>({
  id,
  options,
  value,
  onChange,
  className,
  ...props
}: SelectProps<K, V, L>) => (
  <select
    id={id}
    value={value}
    onChange={(e) => onChange(e.target.value as V)}
    className={clsx(
      'bg-white bg-arrow-down bg-no-repeat bg-[95%_center] bg-[length:18px] appearance-none shadow-sm border border-stone-300 pl-2 pr-6 py-1 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition',
      className
    )}
    {...props}
  >
    {options.map(({ key, value, label }) => (
      <option key={key} value={value}>
        {label}
      </option>
    ))}
  </select>
)

export default Select
