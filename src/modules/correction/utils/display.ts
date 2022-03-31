import clsx from 'clsx'

import { ChangeType } from '../hooks/useCorrectionGenreQuery'

export const getChangeBackgroundColor = (
  type: ChangeType | undefined
): string => {
  switch (type) {
    case 'created':
      return 'bg-green-600'
    case 'edited':
      return 'bg-blue-600'
    case 'deleted':
      return 'bg-red-600'
    case undefined:
      return 'bg-white'
  }
}

export const getChangeTextColor = (type: ChangeType | undefined): string => {
  switch (type) {
    case 'created':
      return 'text-green-700'
    case 'edited':
      return 'text-blue-700'
    case 'deleted':
      return 'text-red-700'
    case undefined:
      return 'text-stone-500'
  }
}

export const getChangeBorderColor = (type: ChangeType | undefined): string => {
  switch (type) {
    case 'created':
      return 'border-green-600'
    case 'edited':
      return 'border-blue-600'
    case 'deleted':
      return 'border-red-600'
    case undefined:
      return 'border-stone-400'
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
    case 'deleted':
      return 'Deleted'
  }
}

export const getTopbarColor = (changes: ChangeType | undefined) => {
  switch (changes) {
    case undefined:
      return clsx(getChangeBackgroundColor(changes), 'text-stone-400')
    case 'created':
    case 'edited':
    case 'deleted':
      return clsx(getChangeBackgroundColor(changes), 'text-white')
  }
}
