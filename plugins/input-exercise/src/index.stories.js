import { createEditableIdentifier } from '@splish-me/editor-core/lib/editable.component'
import { storiesOf } from '@storybook/react'
import {
  createStateForContentPlugin,
  renderEditable,
  renderHTMLRenderer
} from '../../../.storybook/helpers'
import plugin from '.'

storiesOf('InputTextExercise', module)
  .add('Editable (initial state)', () => {
    const content = createStateForContentPlugin({ plugin })

    return renderEditable(content)
  })
  .add('Editable (w/ state)', () => {
    const content = createStateForContentPlugin({
      plugin,
      initialState: {
        type: 'Text',
        correctValue: '1',
        wrongAnswers: [
          {
            id: 1,
            value: '2',
            feedback: createEditableIdentifier()
          }
        ]
      }
    })

    return renderEditable(content)
  })
  .add('Renderer', () => {
    const content = createStateForContentPlugin({
      plugin,
      initialState: { alt: 'Dreiecke konstruieren', src: '1571395' }
    })

    return renderHTMLRenderer(content)
  })
