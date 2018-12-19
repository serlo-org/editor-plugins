import {
  Editable,
  EditableIdentifier
} from '@splish-me/editor-core/lib/editable.component'
import * as R from 'ramda'
import * as React from 'react'

export interface Step {
  type: 'step'
  content: EditableIdentifier
  explanation: EditableIdentifier
}

export interface Content {
  type: 'content'
  content: EditableIdentifier
}

interface OneCol {
  type: '1-col'
  content: EditableIdentifier
}

interface TwoCols {
  type: '2-cols'
  content: [EditableIdentifier, EditableIdentifier | undefined]
}

const getExplanation = (
  step: Content | Step
): EditableIdentifier | undefined => {
  if (step.type === 'step') {
    return step.explanation
  }

  return undefined
}

const makeRows = (steps: Array<Content | Step>): Array<OneCol | TwoCols> => {
  let pendingContent: EditableIdentifier | undefined = undefined
  const ret: Array<OneCol | TwoCols> = []

  steps.forEach(step => {
    if (pendingContent) {
      ret.push({
        type: '2-cols',
        content: [pendingContent, getExplanation(step)]
      })
    }

    if ((!pendingContent && step.type === 'step') || step.type === 'content') {
      ret.push({
        type: '1-col',
        content: step.type === 'step' ? step.explanation : step.content
      })
    }

    pendingContent = step.type === 'step' ? step.content : undefined
  })

  if (pendingContent) {
    ret.push({
      type: '2-cols',
      content: [pendingContent, undefined]
    })
  }

  return ret
}

export interface EquationsProps {
  onChange: (state: Partial<EquationsPluginState>) => void
  state: EquationsPluginState
  readOnly?: boolean
}

export interface EquationsPluginState {
  steps: Array<Step | Content>
}

export interface EquationsState {
  phase: Phase
  width: Array<number | undefined>
  contentHeight: Array<number | undefined>
  explanationHeight: Array<number | undefined>
}

enum Phase {
  noJS = 0,
  hiddenRender = 1,
  maxWidth = 2,
  height = 3
}

export class Equations extends React.Component<EquationsProps, EquationsState> {
  private calculateLayout() {
    const rows = makeRows(this.props.state.steps)

    this.setState({
      phase: Phase.hiddenRender,
      width: rows.map(() => {
        return undefined
      }),
      contentHeight: rows.map(() => {
        return undefined
      }),
      explanationHeight: R.init(
        rows.map(() => {
          return undefined
        })
      )
    })
  }
  state: EquationsState = {
    phase: Phase.noJS,
    width: [],
    contentHeight: [],
    explanationHeight: []
  }
  public componentDidMount() {
    this.calculateLayout()
    window.addEventListener('resize', () => {
      this.calculateLayout()
    })
  }
  private renderHidden() {
    const { state } = this.props
    const rows = makeRows(state.steps)

    if (this.state.phase < Phase.hiddenRender) {
      return null
    }
    return (
      <div>
        {rows.map((row, index) => {
          if (row.type === '1-col') {
            return (
              <div
                key={index}
                // className="row"
                style={{
                  visibility:
                    this.state.phase < Phase.height ? 'hidden' : undefined
                }}
              >
                <div>
                  <Editable id={row.content} />
                </div>
              </div>
            )
          }

          let column = false
          if (this.state.phase === Phase.height) {
            const diff =
              (this.state.explanationHeight[index] || 0) -
              (this.state.contentHeight[index] || 0)
            if (diff > 30) column = true
          }

          console.log(this.state.width)
          return (
            <div
              key={index}
              // className="row"
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                flexDirection: column ? 'column' : undefined,
                visibility:
                  this.state.phase < Phase.height ? 'hidden' : undefined
              }}
            >
              <div
                style={{
                  flexShrink: this.state.phase < Phase.height ? 0 : undefined,
                  paddingRight: '10px',
                  width:
                    this.state.phase < Phase.maxWidth
                      ? 'auto'
                      : R.reduce(R.max, 0, this.state.width.filter(Boolean)) +
                        10
                }}
                ref={ref => {
                  if (index === 0) {
                    console.log(
                      index,
                      this.state.phase,
                      ref && JSON.stringify(ref.offsetWidth)
                    )
                  }
                  if (!ref) {
                    return
                  }

                  /* if (ref.style.width !== 'auto') {
                      console.log(ref.style.width)
                      return
                    } */

                  if (
                    this.state.phase < Phase.maxWidth &&
                    this.state.width[index] === undefined
                  ) {
                    this.setState(
                      state => {
                        return {
                          width: R.update(index, ref.offsetWidth, state.width)
                        }
                      },
                      () => {
                        const all = this.state.width.every((width, index) => {
                          return (
                            width !== undefined || rows[index].type === '1-col'
                          )
                        })

                        if (all) {
                          this.setState(state => {
                            if (state.phase < Phase.maxWidth) {
                              return { phase: Phase.maxWidth }
                            }

                            return null
                          })
                        }
                      }
                    )
                  } else if (
                    this.state.phase === Phase.maxWidth &&
                    this.state.contentHeight[index] === undefined
                  ) {
                    this.setState(
                      state => {
                        return {
                          contentHeight: R.update(
                            index,
                            ref.offsetHeight,
                            state.contentHeight
                          )
                        }
                      },
                      () => {
                        const allContent = this.state.contentHeight.every(
                          (contentHeight, index) => {
                            return (
                              contentHeight !== undefined ||
                              rows[index].type === '1-col'
                            )
                          }
                        )

                        const allExplanations = this.state.explanationHeight.every(
                          (explanationHeight, index) => {
                            return (
                              explanationHeight !== undefined ||
                              rows[index].type === '1-col'
                            )
                          }
                        )

                        if (allContent && allExplanations) {
                          this.setState(state => {
                            if (state.phase < Phase.height) {
                              return { phase: Phase.height }
                            }

                            return null
                          })
                        }
                      }
                    )
                  }
                }}
              >
                <Editable id={row.content[0]} />
              </div>
              {row.content[1] === undefined ? null : (
                <div
                  ref={ref => {
                    if (!ref) {
                      return
                    }

                    if (
                      this.state.phase === Phase.maxWidth &&
                      this.state.explanationHeight[index] === undefined
                    ) {
                      this.setState(
                        state => {
                          return {
                            explanationHeight: R.update(
                              index,
                              ref.offsetHeight,
                              state.explanationHeight
                            )
                          }
                        },
                        () => {
                          const allContent = this.state.contentHeight.every(
                            (contentHeight, index) => {
                              return (
                                contentHeight !== undefined ||
                                rows[index].type === '1-col'
                              )
                            }
                          )

                          const allExplanations = this.state.explanationHeight.every(
                            (explanationHeight, index) => {
                              return (
                                explanationHeight !== undefined ||
                                rows[index].type === '1-col'
                              )
                            }
                          )

                          if (allContent && allExplanations) {
                            this.setState(state => {
                              if (state.phase < Phase.height) {
                                return { phase: Phase.height }
                              }

                              return null
                            })
                          }
                        }
                      )
                    }
                  }}
                >
                  <Editable id={row.content[1]} />
                </div>
              )}
            </div>
          )
        })}
      </div>
    )
  }
  public render() {
    const { state } = this.props

    const rows = makeRows(state.steps)
    return (
      <React.Fragment>
        {this.state.phase === Phase.noJS ? (
          <React.Fragment>
            {rows.map((row, index) => {
              if (row.type === '1-col') {
                return (
                  <div key={index} className="row">
                    <div className="col-sm-12">
                      <Editable id={row.content} />
                    </div>
                  </div>
                )
              }
              return (
                <div key={index} className="row">
                  <div className="col-sm-12 col-md-6">
                    <Editable id={row.content[0]} />
                  </div>
                  {row.content[1] === undefined ? null : (
                    <div className="col-sm-12 col-md-6">
                      <Editable id={row.content[1]} />
                    </div>
                  )}
                </div>
              )
            })}
          </React.Fragment>
        ) : null}
        {this.renderHidden()}
      </React.Fragment>
    )
  }
}
