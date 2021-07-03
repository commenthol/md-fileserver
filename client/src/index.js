// default styles
import 'normalize.css'
import 'katex/dist/katex.min.css'
import 'markdown-it-admon/styles/admonition.css'
import '../css/github.css'
import '../css/screen.css'
import '../css/print.css'

import { createConnection } from './reload'
import { aTargetBlank } from './aTargetBlank'

createConnection()
aTargetBlank()
