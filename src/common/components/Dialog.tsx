import styled from '@emotion/styled'
import { FC } from 'react'
import { createPortal } from 'react-dom'

const Dialog: FC = ({ children }) =>
  createPortal(
    <Mask>
      <DialogContainer>{children}</DialogContainer>
    </Mask>,
    document.body
  )

export default Dialog

const Mask = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
  background: rgb(0 0 0 / 25%);
`

const DialogContainer = styled.div`
  background: white;
`
