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
    <div className='flex flex-col h-72 overflow-auto resize'>
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
      <div>
        <button
          type='button'
          onClick={() => setTab(Tab.EDIT)}
          disabled={tab === Tab.EDIT}
        >
          Edit
        </button>
        <button
          type='button'
          onClick={() => setTab(Tab.VIEW)}
          disabled={tab === Tab.VIEW}
        >
          View
        </button>
      </div>
    </div>
  )
}

export default MarkdownEditor
