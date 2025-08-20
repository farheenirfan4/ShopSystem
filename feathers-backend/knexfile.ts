// For more information about this file see https://dove.feathersjs.com/guides/cli/databases.html
import { app } from './src/app'
const config = app.get('postgresql')
module.exports = config
