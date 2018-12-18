import {
  Editable,
  EditableIdentifier
} from '@splish-me/editor-core/lib/editable.component'
import * as React from 'react'
import S from 'string'
import A from 'algebra.js'
import { Feedback } from './feedback.component'

export interface WrongAnswerProps {
  id: EditableIdentifier
  value: string
  feedback: EditableIdentifier
}
export interface InputfieldRendererProps {
  state: {
    correctValue: string
    wrongAnswers: WrongAnswerProps[]
    type: string
  }
}

export class Display extends React.Component<InputfieldRendererProps> {
  state = {
    positiveFeedback: false,
    negativeFeedbackIndex: -1,
    showFeedback: false
  }
  input = React.createRef()

  checkAnswer = (event: React.FormEvent) => {
    event.preventDefault()
    const { state } = this.props
    const { correctValue, wrongAnswers, type } = state
    if (
      this.matchesInput(
        { type: type, value: correctValue },
        this.input.current.value
      )
    ) {
      this.setState({ positiveFeedback: true, showFeedback: true })
    } else {
      const index = wrongAnswers.findIndex((wrongAnswer: WrongAnswerProps) => {
        return this.matchesInput(
          { type: type, value: wrongAnswer.value },
          this.input.current.value
        )
      })
      // const matchedAnswer = wrongAnswers[index] || {}
      this.setState({
        negativeFeedbackIndex: index,
        showFeedback: true,
        positiveFeedback: false
      })
    }
  }

  matchesInput = (field: { type: string; value: string }, input: string) => {
    try {
      const solution = this.normalize(field.type, field.value)
      const submission = this.normalize(field.type, input)

      switch (field.type) {
        case 'input-expression-equal-match-challenge':
          console.log(solution, submission)
          return solution.subtract(submission).toString() === '0'
        default:
          return solution === submission
      }
    } catch (err) {
      // e.g. if user input could not be parsed
      return false
    }
  }

  normalize = (type: string, string: string) => {
    const normalizeNumber = function(string: string) {
      return S(string).replaceAll(',', '.').s
    }
    const temp = S(string).collapseWhitespace()

    switch (type) {
      case 'input-number-exact-match-challenge':
        return S(normalizeNumber(temp))
          .replaceAll(' /', '/')
          .replaceAll('/ ', '/').s
      case 'input-expression-equal-match-challenge':
        console.log(temp)
        return A.parse(normalizeNumber(temp))
      default:
        return temp.s.toUpperCase()
    }
  }

  render() {
    const { state } = this.props
    const { type, wrongAnswers } = state
    return (
      <div className="new-text-exercise active">
        <form className="input-challenge-group" onSubmit={this.checkAnswer}>
          <div className="input-challenge-input-wrapper pull-right">
            <input
              className="input-challenge-input"
              data-type={type}
              type="text"
              placeholder="Deine Lösung"
              ref={this.input}
            />
          </div>
          <div
            style={{
              clear: 'both'
            }}
          />
          {this.state.showFeedback ? (
            this.state.positiveFeedback ? (
              <div>
                <Feedback boxFree isTrueAnswer>
                  Sehr gut!
                </Feedback>
              </div>
            ) : this.state.negativeFeedbackIndex !== -1 ? (
              <Feedback boxFree>
                <Editable
                  id={wrongAnswers[this.state.negativeFeedbackIndex].feedback}
                />
              </Feedback>
            ) : (
              <Feedback boxFree> Leider falsch!</Feedback>
            )
          ) : null}
          <div className="input-challenge-solution">
            <button className="btn btn-primary btn-xs input-challenge-submit pull-right">
              <span className="input-challenge-submit-check">
                <i className="fa fa-check-circle" />
                Stimmt's?
              </span>
              <span className="input-challenge-submit-correct">
                <i className="fa fa-smile-o" />
                Stimmt!
              </span>
            </button>
            <div style={{ clear: 'both' }} />
          </div>
        </form>
      </div>
    )
  }
}
