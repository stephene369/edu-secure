import { isTextReversed, autoCorrectReversedText } from '../../../utils/textUtils'

describe('Text Display Utils', () => {
  test('detects reversed text', () => {
    const reversedText = "enil dnoces eht si sihtenehpetS s i eman ym ,olleH"
    expect(isTextReversed(reversedText)).toBe(true)
  })
  
  test('corrects reversed text', () => {
    const reversedText = "enil dnoces eht si sihtenehpetS s i eman ym ,olleH"
    const corrected = autoCorrectReversedText(reversedText)
    expect(corrected).toBe("Hello, my name is Stephen this is the second line")
  })
  
  test('leaves normal text unchanged', () => {
    const normalText = "Hello, my name is Stephen"
    expect(autoCorrectReversedText(normalText)).toBe(normalText)
  })
})