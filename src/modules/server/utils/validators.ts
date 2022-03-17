import { InfluenceType } from '@prisma/client'
import { z } from 'zod'

export const BaseGenreInput = z.object({
  name: z.string().min(1),
  shortDesc: z.string().min(1),
  longDesc: z.string().min(1),
  alternateNames: z.array(z.string().min(1)),
})

export const IdsInput = z.array(z.number())

export const LocationsInput = z.array(
  z
    .object({ city: z.string(), region: z.string(), country: z.string() })
    .refine(
      (val) =>
        val.city.length > 0 || val.region.length > 0 || val.country.length > 0,
      { message: "Location can't be empty" }
    )
)

export const CulturesInput = z.array(z.string().min(1))

export const InfluenceTypeInput = z.union([
  z.literal(InfluenceType.HISTORICAL),
  z.literal(InfluenceType.SONIC),
])

export const StyleInfluencesInput = z.array(
  z.object({ id: z.number(), type: InfluenceTypeInput })
)
