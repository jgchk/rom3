import styled from '@emotion/styled'
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
    <Container>
      {tab === Tab.EDIT && (
        <TextArea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{ flex: 1, resize: 'none' }}
        />
      )}
      {tab === Tab.VIEW && (
        <MarkdownContainer>
          <ReactMarkdown>{value}</ReactMarkdown>
        </MarkdownContainer>
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
    </Container>
  )
}

export default MarkdownEditor

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 300px;
  overflow: auto;
  resize: both;
`

const TextArea = styled.textarea`
  flex: 1;
  resize: none;
`

const MarkdownContainer = styled.div`
  flex: 1;
  overflow: auto;
`
