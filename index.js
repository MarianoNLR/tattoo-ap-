import { createApp } from './app.js'

import { TattooModel } from './models/tattoo.js'
import { UserModel } from './models/users.js'

createApp({ tattooModel: TattooModel, userModel: UserModel })
