import { storiesOf } from '@storybook/react'
import * as React from 'react'
import { renderToString } from 'react-dom/server'

import { renderEditable, renderHTMLRenderer } from '../.storybook/helpers'
import { content } from './content'

const otherContent = JSON.parse(
  '{"cells":[{"rows":[{"cells":[{"size":12,"rows":[{"cells":[{"content":{"plugin":{"name":"ory/editor/core/content/slate"},"state":{"importFromHtml":"<p>Im Mathematik-Bereich von Serlo findest du <strong>450 Artikel, 20 Kurse, 20 Videos und 3600 Aufgaben</strong> mit Musterlösungen zur Schulmathematik - komplett <strong>kostenlos, werbefrei und frei lizensiert.</strong></p>\\n<p>Wie bei der Wikipedia können auf Serlo alle Nutzer*innen die Inhalte bearbeiten. Serlo ist die erste demokratische Lernseite des Internets und du kannst helfen, diese mit aufzubauen! Mehr dazu erfährst du im <a href=\\"/19852\\">Mathe Community Portal</a>.</p>\\n<h2 id=\\"themawhlen\\">Thema wählen</h2>"}}}]}]}]},{"cells":[{"size":4,"rows":[{"cells":[{"content":{"plugin":{"name":"ory/editor/core/content/image"},"state":{"alt":"Zahlen und Größen Icon","src":"https://assets.serlo.org/legacy/5475e80e72671_27863c20ebcc7fa7979a056a9ed1d1440cc941a8.png","href":"/1385"}}}]},{"cells":[{"content":{"plugin":{"name":"ory/editor/core/content/slate"},"state":{"importFromHtml":"<ul>\\n<li><a href=\\"/1386\\">Grundrechenarten</a></li>\\n<li><a href=\\"/1389\\">Bruchrechnen und Dezimalzahlen</a></li>\\n<li><a href=\\"/1377\\">Prozent- und Zinsrechnung</a></li>\\n<li><a href=\\"/1385\\">… 6 weitere</a></li>\\n</ul>"}}}]}]},{"size":4,"rows":[{"cells":[{"content":{"plugin":{"name":"ory/editor/core/content/image"},"state":{"alt":"Terme und Gleichungen Icon","src":"https://assets.serlo.org/legacy/5475e937dc82f_48af416b2e667d8c28b3e39f7f4117b511c063e5.png","href":"/1390"}}}]},{"cells":[{"content":{"plugin":{"name":"ory/editor/core/content/slate"},"state":{"importFromHtml":"<ul>\\n<li><a href=\\"/1331\\">Terme und Variablen</a></li>\\n<li><a href=\\"/1371\\">Gleichungen</a></li>\\n<li><a href=\\"/1328\\">Potenzen, Wurzeln und Logarithmen</a></li>\\n<li><a href=\\"/1390\\">… 2 weitere</a></li>\\n</ul>"}}}]}]},{"size":4,"rows":[{"cells":[{"content":{"plugin":{"name":"ory/editor/core/content/image"},"state":{"alt":"Geometrie Icon","src":"https://assets.serlo.org/legacy/5475e95d7476a_a96732c0d156b8f14322274a781ca598bd09512d.png","href":"/1288"}}}]},{"cells":[{"content":{"plugin":{"name":"ory/editor/core/content/slate"},"state":{"importFromHtml":"<ul>\\n<li><a href=\\"/1394\\">Dreiecke, andere n-Ecke und Kreise</a></li>\\n<li><a href=\\"/1381\\">Satzgruppe des Pythagoras</a></li>\\n<li><a href=\\"/1383\\">Sinus, Cosinus und Tangens</a></li>\\n<li><a href=\\"/1288\\">… 7 weitere</a></li>\\n</ul>"}}}]}]}]},{"cells":[{"size":12,"rows":[{"cells":[{"content":{"plugin":{"name":"ory/editor/core/content/slate"},"state":{"importFromHtml":"<hr />"}}}]}]}]},{"cells":[{"size":4,"rows":[{"cells":[{"content":{"plugin":{"name":"ory/editor/core/content/image"},"state":{"alt":"Funktionen Icon","src":"https://assets.serlo.org/legacy/5475e9af81bbc_4094b279cbdee70dc2afbcd7101a16f37e16c426.png","href":"/1289"}}}]},{"cells":[{"content":{"plugin":{"name":"ory/editor/core/content/slate"},"state":{"importFromHtml":"<ul>\\n<li><a href=\\"/1302\\">Funktionsbegriff</a></li>\\n<li><a href=\\"/1304\\">Ableitung von Funktionen</a></li>\\n<li><a href=\\"/1306\\">Integral und Flächenberechnung</a></li>\\n<li><a href=\\"/1289\\">… 9 weitere</a></li>\\n</ul>"}}}]}]},{"size":4,"rows":[{"cells":[{"content":{"plugin":{"name":"ory/editor/core/content/image"},"state":{"alt":"Stochastik Icon","src":"https://assets.serlo.org/legacy/5475e9d252de1_d84e989cb5233819c3f302ca997915a108b7c98b.png","href":"/1290"}}}]},{"cells":[{"content":{"plugin":{"name":"ory/editor/core/content/slate"},"state":{"importFromHtml":"<ul>\\n<li><a href=\\"/1344\\">Kombinatorik</a></li>\\n<li><a href=\\"/22842\\">Bedingte Wahrscheinlichkeit</a></li>\\n<li><a href=\\"/1439\\">Zufallsgrößen</a></li>\\n<li><a href=\\"/1290\\">… 5 weitere</a></li>\\n</ul>"}}}]}]},{"size":4,"rows":[{"cells":[{"content":{"plugin":{"name":"ory/editor/core/content/image"},"state":{"alt":"Sonstiges Icon","src":"https://assets.serlo.org/legacy/5475e9f3c9a62_b2dd8942f5e0ce5744e76db2df50f0e7102abf98.png","href":"/1397"}}}]},{"cells":[{"content":{"plugin":{"name":"ory/editor/core/content/slate"},"state":{"importFromHtml":"<ul>\\n<li><a href=\\"/1440\\">Mengenlehre und Logik</a></li>\\n<li><a href=\\"/24713\\">Zahlensysteme</a></li>\\n<li><a href=\\"/1356\\">Knobelaufgaben</a></li>\\n<li><a href=\\"/1397\\">… 7 weitere</a></li>\\n</ul>"}}}]}]}]},{"cells":[{"size":12,"rows":[{"cells":[{"content":{"plugin":{"name":"ory/editor/core/content/slate"},"state":{"importFromHtml":"<h2 id=\\"entdeckeserlo\\">Entdecke Serlo</h2>\\n<p>Serlo bietet dir verschiedene Möglichkeiten zum Lernen. Hier findest du ausgesuchte Artikel, Kurse, Videos und Aufgaben.</p>"}}}]}]}]},{"cells":[{"size":4,"rows":[{"cells":[{"content":{"plugin":{"name":"ory/editor/core/content/slate"},"state":{"importFromHtml":"<h3 id=\\"artikel\\">Artikel</h3>\\n<p><a href=\\"/1855\\">Parabel</a></p>\\n<p><a href=\\"/1949\\">Dreieck</a></p>\\n<p><a href=\\"/1721\\">Baumdiagramm</a></p>\\n<p><a href=\\"/1615\\">Asymptote berechnen</a></p>"}}}]}]},{"size":4,"rows":[{"cells":[{"content":{"plugin":{"name":"ory/editor/core/content/slate"},"state":{"importFromHtml":"<h3 id=\\"kurse\\">Kurse</h3>\\n<p><a href=\\"/18807\\">Parabeln - Verschieben  \\nund Stauchen</a></p>\\n<p><a href=\\"/18758\\">Einführung zu quadratischer  \\nErgänzung</a></p>"}}}]}]},{"size":4,"rows":[{"cells":[{"content":{"plugin":{"name":"ory/editor/core/content/slate"},"state":{"importFromHtml":"<h3 id=\\"videos\\">Videos</h3>\\n<p><a href=\\"/32321\\">Schriftliche Addition</a></p>"}}}]}]}]},{"cells":[{"size":12,"rows":[{"cells":[{"content":{"plugin":{"name":"ory/editor/core/content/slate"},"state":{"importFromHtml":"<h3 id=\\"aufgaben\\">Aufgaben</h3>\\n<hr />"}}}]},{"cells":[{"content":{"plugin":{"name":"serlo/content/injection"},"state":{"alt":"","src":"/29637"}}}]},{"cells":[{"content":{"plugin":{"name":"ory/editor/core/content/slate"},"state":{"importFromHtml":"<hr />"}}}]},{"cells":[{"content":{"plugin":{"name":"serlo/content/injection"},"state":{"alt":"","src":"/13917"}}}]},{"cells":[{"content":{"plugin":{"name":"ory/editor/core/content/slate"},"state":{"importFromHtml":"<hr />"}}}]},{"cells":[{"content":{"plugin":{"name":"serlo/content/injection"},"state":{"alt":"","src":"/4107"}}}]}]}]}]}]}'
)

storiesOf('Example', module)
  .add('Editable (Mathe)', () => renderEditable(otherContent))
  .add('Renderer (Mathe)', () => {
    return renderHTMLRenderer(otherContent)
  })
  .add('Editable', () => renderEditable(content))
  .add('Renderer', () => renderHTMLRenderer(content))
