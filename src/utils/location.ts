import { LocationInput } from './create'

export const hashLocation = (location: LocationInput) =>
  `${location.city}_${location.region}_${location.country}`

export const locationIsEmpty = (location: LocationInput) =>
  location.city.length === 0 &&
  location.region.length === 0 &&
  location.country.length === 0

export const locationNotEmpty = (location: LocationInput) =>
  !locationIsEmpty(location)
