import clsx from 'clsx'

import { ChangeType } from '../hooks/useCorrectionGenreQuery'

export const getChangeColor = (type: ChangeType): string => {
  switch (type) {
    case 'created':
      return 'bg-green-600'
    case 'edited':
      return 'bg-blue-600'
  }
}

export const getTopbarText = (changes: ChangeType | undefined): string => {
  switch (changes) {
    case undefined:
      return 'Unchanged'
    case 'created':
      return 'Created'
    case 'edited':
      return 'Edited'
  }
}

export const getTopbarColor = (changes: ChangeType | undefined) => {
  switch (changes) {
    case undefined:
      return 'bg-white text-stone-400'
    case 'created':
    case 'edited':
      return clsx(getChangeColor(changes), 'text-white')
  }
}
