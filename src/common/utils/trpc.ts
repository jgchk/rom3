import {
  createReactQueryHooks,
  createTRPCClient,
  CreateTRPCClientOptions,
  TRPCClientErrorLike,
  UseTRPCQueryOptions,
} from '@trpc/react'
import type {
  inferProcedureInput,
  inferProcedureOutput,
  inferSubscriptionOutput,
} from '@trpc/server'
import superjson from 'superjson'

import type { AppRouter } from '../../modules/server/routers/_app'
import { isBrowser } from './ssr'

export const trpcPath = '/api/trpc'
export const trpcUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}/api/trpc`
  : 'http://127.0.0.1:3000/api/trpc'
export const trpcOptions: CreateTRPCClientOptions<AppRouter> = {
  ...(isBrowser ? { url: trpcPath } : { url: trpcUrl }),
  transformer: superjson,
}

export const trpc = createReactQueryHooks<AppRouter>()
export const trpcClient = createTRPCClient<AppRouter>(trpcOptions)

export default trpc

export type TQuery = keyof AppRouter['_def']['queries']
export type TMutation = keyof AppRouter['_def']['mutations']
export type TSubscription = keyof AppRouter['_def']['subscriptions']
export type TError = TRPCClientErrorLike<AppRouter>

export type InferQueryOptions<TRouteKey extends TQuery> = UseTRPCQueryOptions<
  TRouteKey,
  InferQueryInput<TRouteKey>,
  InferQueryOutput<TRouteKey>,
  TError
>

export type InferQueryOutput<TRouteKey extends TQuery> = inferProcedureOutput<
  AppRouter['_def']['queries'][TRouteKey]
>
export type InferQueryInput<TRouteKey extends TQuery> = inferProcedureInput<
  AppRouter['_def']['queries'][TRouteKey]
>

export type InferMutationOutput<TRouteKey extends TMutation> =
  inferProcedureOutput<AppRouter['_def']['mutations'][TRouteKey]>
export type InferMutationInput<TRouteKey extends TMutation> =
  inferProcedureInput<AppRouter['_def']['mutations'][TRouteKey]>

export type InferSubscriptionOutput<TRouteKey extends TSubscription> =
  inferProcedureOutput<AppRouter['_def']['subscriptions'][TRouteKey]>
export type InferAsyncSubscriptionOutput<TRouteKey extends TSubscription> =
  inferSubscriptionOutput<AppRouter, TRouteKey>
export type InferSubscriptionInput<TRouteKey extends TSubscription> =
  inferProcedureInput<AppRouter['_def']['subscriptions'][TRouteKey]>
