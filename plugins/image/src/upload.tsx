import { Uploader, UploadField } from '@navjobs/upload'
import { UploadProgress } from '@serlo/editor-ui'
import * as React from 'react'

export class Upload extends React.Component<UploadProps> {
  matchesAllowedExtensions(fileName: string) {
    const extension = fileName.slice(fileName.lastIndexOf('.') + 1)
    return this.props.config.allowedExtensions.indexOf(extension) >= 0
  }

  handleErrors(errors: FileErrorCode[]): FileError[] {
    return errors.map(error => ({
      errorCode: error,
      message: this.errorCodeToMessage(error)
    }))
  }
  defaultOnError(errors: FileError[]): void {
    alert(errors.map(error => error.message).join('\n'))
  }

  errorCodeToMessage(error: FileErrorCode) {
    switch (error) {
      case FileErrorCode.TOO_MANY_FILES:
        return 'You can only upload one file'
      case FileErrorCode.NO_FILE_SELECTED:
        return 'No file selected'
      case FileErrorCode.BAD_EXTENSION:
        return 'Not an accepted file type'
      case FileErrorCode.FILE_TOO_BIG:
        return 'Filesize is too big'
      case FileErrorCode.UPLOAD_FAILED:
        return 'Error while uploading'
    }
  }

  validateFiles(files: FileList): { valid: boolean; errors: FileError[] } {
    let valid = true,
      uploadErrors: FileErrorCode[] = []

    if (!files || !files[0]) {
      uploadErrors = [...uploadErrors, FileErrorCode.NO_FILE_SELECTED]
      valid = false
    } else {
      if (files.length > 1) {
        uploadErrors = [...uploadErrors, FileErrorCode.TOO_MANY_FILES]
        valid = false
      }
      const file = files[0]
      if (!this.matchesAllowedExtensions(file.name)) {
        uploadErrors = [...uploadErrors, FileErrorCode.BAD_EXTENSION]
        valid = false
      }
      if (file.size > this.props.config.maxFileSize) {
        uploadErrors = [...uploadErrors, FileErrorCode.FILE_TOO_BIG]
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
        // @ts-ignore FIXME
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
          const errors = this.handleErrors([FileErrorCode.UPLOAD_FAILED])
          if (this.props.onError) {
            this.props.onError(errors)
          } else {
            this.defaultOnError(errors)
          }
        }}
        uploadOnSelection
      >
        {({
          onFiles,
          ...progressProps
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
                  if (this.props.onError) {
                    this.props.onError(validation.errors)
                  } else {
                    this.defaultOnError(validation.errors)
                  }
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
              <UploadProgress {...progressProps} />
            </UploadField>
          </div>
        )}
      </Uploader>
    )
  }
}

export interface UploadProps {
  config: UploadConfig
  onError?: (errors: FileError[]) => void
  onImageLoaded?: Function
  onImageUploaded?: Function
}

export interface UploadConfig {
  url: string
  maxFileSize: number
  allowedExtensions: string[]
  paramName?: string
  getAdditionalFields?: Function
}

type FileError = {
  errorCode: FileErrorCode
  message: string
}

enum FileErrorCode {
  TOO_MANY_FILES,
  NO_FILE_SELECTED,
  BAD_EXTENSION,
  FILE_TOO_BIG,
  UPLOAD_FAILED
}
