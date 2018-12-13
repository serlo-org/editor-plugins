import * as React from 'react'
//@ts-ignore
import { Uploader, UploadField } from '@navjobs/upload'
import { UploadProps } from './types'
import Text from '@splish-me/editor-ui/lib/sidebar-elements/sidebartext'

enum FileError {
  TOO_MANY_FILES,
  NO_FILE_SELECTED,
  BAD_EXTENSION,
  FILE_TOO_BIG,
  UPLOAD_FAILED
}

export class Upload extends React.Component<UploadProps> {
  matchesAllowedExtensions(fileName: string) {
    const patternPart = this.props.config.allowedExtensions
      ? this.props.config.allowedExtensions.map(a => a.toLowerCase()).join('|')
      : ''
    const pattern = '(' + patternPart.replace(/\./g, '\\.') + ')$'
    return new RegExp(pattern, 'i').test(fileName.toLowerCase())
  }

  handleErrors(errors: FileError[]): string[] {
    return errors.map(error => {
      switch (error) {
        case FileError.TOO_MANY_FILES:
          return 'You only can upload one file'
        case FileError.NO_FILE_SELECTED:
          return 'No file selected'
        case FileError.BAD_EXTENSION:
          return 'Not an accepted file type'
        case FileError.FILE_TOO_BIG:
          return 'Filesize is too big'
        case FileError.UPLOAD_FAILED:
          return 'Error while uploading'
      }
    })
  }

  validateFiles(files: FileList): { valid: boolean; errors: string[] } {
    let valid = true,
      uploadErrors: FileError[] = []

    if (!files || !files[0]) {
      uploadErrors = [...uploadErrors, FileError.NO_FILE_SELECTED]
      valid = false
    } else {
      if (files.length > 1) {
        uploadErrors = [...uploadErrors, FileError.TOO_MANY_FILES]
        valid = false
      }
      const file = files[0]
      if (!this.matchesAllowedExtensions(file.name)) {
        uploadErrors = [...uploadErrors, FileError.BAD_EXTENSION]
        valid = false
      }
      if (file.size > this.props.config.maxFileSize) {
        uploadErrors = [...uploadErrors, FileError.FILE_TOO_BIG]
        valid = false
      }
    }

    return {
      valid: valid,
      errors: this.handleErrors(uploadErrors)
    }
  }

  readFile(file: File) {
    return new Promise(resolve => {
      const reader = new FileReader()

      reader.onload = function(e: ProgressEvent) {
        const dataUrl = e.target.result
        resolve({ file, dataUrl })
      }

      reader.readAsDataURL(file)
    })
  }

  render() {
    const { config } = this.props
    return (
      <Uploader
        request={{
          fileName: config.paramName,
          url: config.url,
          method: 'POST',
          fields: config.getAdditionalFields
            ? config.getAdditionalFields()
            : {},
          headers: {
            Accept: 'application/json'
          }
        }}
        onComplete={({ response }: any) => {
          if (this.props.onImageUploaded) {
            const { url } = response
            this.props.onImageUploaded({ url })
          }
        }}
        onError={() => {
          alert(this.handleErrors([FileError.UPLOAD_FAILED]))
        }}
        uploadOnSelection={true}
      >
        {({
          onFiles,
          progress,
          complete,
          canceled,
          failed
        }: {
          onFiles: Function
          progress?: number
          complete?: boolean
          canceled?: boolean
          failed?: boolean
        }) => (
          <div>
            <UploadField
              onFiles={(files: FileList) => {
                const validation = this.validateFiles(files)
                if (!validation.valid) {
                  alert(validation.errors.join('\n'))
                } else {
                  const { onImageLoaded } = this.props
                  if (onImageLoaded) {
                    this.readFile(files[0]).then(data => onImageLoaded(data))
                  }
                  onFiles(files)
                }
              }}
              uploadProps={{
                accept: 'image/*'
              }}
            >
              <button>Durchsuchen...</button>
            </UploadField>
            <Text>
              {progress ? `Progress: ${progress}` : null}
              {complete ? 'Complete!' : null}
              {canceled ? 'Canceled!' : null}
              {failed ? 'Failed!' : null}
            </Text>
          </div>
        )}
      </Uploader>
    )
  }
}
