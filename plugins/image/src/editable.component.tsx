import { faImages } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { renderIntoSidebar } from '@splish-me/editor-ui/lib/plugin-sidebar.component'
import Textfield from '@splish-me/editor-ui/lib/sidebar-elements/textfield'
import Textarea from '@splish-me/editor-ui/lib/sidebar-elements/textarea'
import Checkbox from '@splish-me/editor-ui/lib/sidebar-elements/checkbox'
import { css } from 'emotion'
import * as React from 'react'

import { ImageRenderer } from './renderer.component'
import {
  Config,
  ImageComponentProps,
  ImageLoaded,
  ImageUploaded
} from './types'
import { Upload } from './upload.component'

type ImageComponentState = {
  imagePreview?: ImageLoaded
}

export const createImageComponent = (config: Config) => {
  return class ImageComponent extends React.Component<
    ImageComponentProps,
    ImageComponentState
  > {
    state: ImageComponentState

    constructor(props: ImageComponentProps) {
      super(props)
      this.state = {}
    }

    handleChange = (name: string) => (
      event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
    ) => {
      const change = { [name]: event.target.value }
      this.props.onChange(change)
    }

    handleTargetChange(event: React.ChangeEvent<HTMLInputElement>) {
      if (event.target.checked) {
        this.props.onChange({
          target: '_blank',
          // noopener is safer but not supported in IE, so noreferrer adds some security
          rel: 'noreferrer noopener'
        })
      } else {
        this.props.onChange({
          target: null,
          rel: null
        })
      }
    }

    handleImageLoaded = (image: ImageLoaded) => {
      this.setState({ imagePreview: image })
    }

    handleImageUploaded = (resp: ImageUploaded) => {
      this.setState({ imagePreview: undefined })
      this.props.onChange({ src: resp.url })
    }

    render() {
      const { readOnly, focused } = this.props
      const { src, description, href, target } = this.props.state

      return (
        <React.Fragment>
          {focused
            ? renderIntoSidebar(
                <React.Fragment>
                  <Textfield
                    placeholder="http://example.com/image.png"
                    label="Image location (url)"
                    value={src}
                    type="text"
                    onChange={this.handleChange('src')}
                  />
                  <br />
                  <Upload
                    config={config.upload}
                    onImageLoaded={this.handleImageLoaded}
                    onImageUploaded={this.handleImageUploaded}
                  />
                  <br />
                  <Textarea
                    placeholder="Gib hier eine Bildbeschreibung ein"
                    label="Image description"
                    value={description}
                    onChange={this.handleChange('description')}
                  />
                  <br />
                  <Textfield
                    placeholder="http://example.com"
                    label="Link location (url)"
                    type="text"
                    value={href}
                    onChange={this.handleChange('href')}
                  />
                  {href ? (
                    <React.Fragment>
                      <br />
                      <Checkbox
                        value={target === '_blank'}
                        label="Open in new window"
                        onChange={this.handleTargetChange}
                      />
                    </React.Fragment>
                  ) : null}
                </React.Fragment>
              )
            : null}
          {src || this.state.imagePreview ? (
            <ImageRenderer
              state={{
                ...this.props.state,
                src: this.state.imagePreview
                  ? this.state.imagePreview.dataUrl
                  : src
              }}
              readOnly={readOnly}
            />
          ) : (
            <div>
              <div
                className={css({
                  position: 'relative',
                  width: '100%',
                  textAlign: 'center'
                })}
              >
                <FontAwesomeIcon icon={faImages} size="5x" />
              </div>
            </div>
          )}
        </React.Fragment>
      )
    }
  }
}
