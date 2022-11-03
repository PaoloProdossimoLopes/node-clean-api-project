import { Express, Router } from 'express'
import fastGlobe from 'fast-glob'

export default (app: Express): void => {
  const router = Router()
  app.use('/api', router)
  const routesFiles = fastGlobe.sync('**/src/main/routes/**routes.ts')

  routesFiles.map(async function (file) {
    const imported = await import(`../../../${file}`)
    const routes = imported.default
    routes(router)
  })
}
