import clsx from 'clsx'
import { FC, useState } from 'react'
import ReactMarkdown from 'react-markdown'

enum Tab {
  EDIT,
  VIEW,
}

const MarkdownEditor: FC<{
  value: string
  onChange: (value: string) => void
}> = ({ value, onChange }) => {
  const [tab, setTab] = useState<Tab>(Tab.EDIT)

  return (
    <div className='flex flex-col h-72 overflow-auto resize border border-gray-300'>
      {tab === Tab.EDIT && (
        <textarea
          className='flex-1 resize-none'
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{ flex: 1, resize: 'none' }}
        />
      )}
      {tab === Tab.VIEW && (
        <div className='flex-1 overflow-auto'>
          <ReactMarkdown>{value}</ReactMarkdown>
        </div>
      )}
      <div className='border-t border-gray-200 flex'>
        <button
          className={clsx(
            'border-r border-gray-200 px-2 py-1 uppercase text-xs text-gray-400 hover:bg-gray-100',
            tab === Tab.EDIT ? 'font-bold' : 'font-medium'
          )}
          type='button'
          onClick={() => setTab(Tab.EDIT)}
        >
          Edit
        </button>
        <button
          className={clsx(
            'border-r border-gray-200 px-2 py-1 uppercase text-xs text-gray-400 hover:bg-gray-100',
            tab === Tab.VIEW ? 'font-bold' : 'font-medium'
          )}
          type='button'
          onClick={() => setTab(Tab.VIEW)}
        >
          View
        </button>
      </div>
    </div>
  )
}

export default MarkdownEditor
