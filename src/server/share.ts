import { createServerFn } from '@tanstack/react-start'

export const helloFn = createServerFn({ method: "POST" })
  .handler(async () => {
    return { hello: "world" }
  })
