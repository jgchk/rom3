export type LocationUiState = {
  city: string
  region: string
  country: string
}

export const makeLocation = (): LocationUiState => ({
  city: '',
  region: '',
  country: '',
})

export const hashLocation = (location: LocationUiState) =>
  `${location.city}_${location.region}_${location.country}`

export const locationIsEmpty = (location: LocationUiState) =>
  location.city.length === 0 &&
  location.region.length === 0 &&
  location.country.length === 0

export const locationNotEmpty = (location: LocationUiState) =>
  !locationIsEmpty(location)
