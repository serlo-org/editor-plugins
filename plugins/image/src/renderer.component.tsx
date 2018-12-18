import { css } from 'emotion'
import * as React from 'react'

import { ImageRendererProps } from './types'

export class ImageRenderer extends React.Component<ImageRendererProps> {
  render() {
    const { state, readOnly } = this.props
    const { src, description, href, target, rel } = state
    const Image = (
      <img
        className={css({
          maxWidth: '100%'
        })}
        src={src}
        alt={description}
      />
    )
    return (
      <div>
        {href && readOnly ? (
          <a href={href} target={target} rel={rel}>
            {Image}
          </a>
        ) : (
          Image
        )}
      </div>
    )
  }
}