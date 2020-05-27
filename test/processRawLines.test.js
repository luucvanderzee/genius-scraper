import { processRawLines } from '../utils/cleaning.js'

describe('processRawLines', () => {
  test('Rap god first ten lines', () => {
    const rawLines = [
      '[Intro]',
      'Look, I was gonna go easy on you not to hurt your feelings.',
      "But I'm only going to get this one chance.",
      '(Six minutes— Six minutes—)',
      "Something's wrong, I can feel it.",
      "(Six minutes, Slim Shady, you're on!)",
      "Just a feeling I've got. Like something's about to happen, but I don't know what. If that means what I think it means, we're in trouble, big trouble; And if he is as bananas as you say, I'm not taking any chances.",
      'You are just what the doc ordered.',
      '[Chorus]',
      "I'm beginnin' to feel like a Rap God, Rap God"
    ]

    const expectedResult = [
      'Look, I was gonna go easy on you not to hurt your feelings.',
      "But I'm only going to get this one chance.",
      '(Six minutes— Six minutes—)',
      "Something's wrong, I can feel it.",
      "(Six minutes, Slim Shady, you're on!)",
      "Just a feeling I've got. Like something's about to happen, but I don't know what. If that means what I think it means, we're in trouble, big trouble; And if he is as bananas as you say, I'm not taking any chances.",
      'You are just what the doc ordered.',
      "I'm beginnin' to feel like a Rap God, Rap God"
    ]

    expect(processRawLines(rawLines)).toEqual(expectedResult)
  })

  test('Rap god lines 30-40 (contains line which is just "\'")', () => {
    const rawLines = [
      'Over the back of a couple of faggots and crack it in half',
      'Only realized it was ironic, I was signed to Aftermath after the fact',
      'How could I not blow? All I do is drop F-bombs',
      'Feel my wrath of attack',
      "Rappers are havin' a rough time period, here's a maxi pad",
      "It's actually disastrously bad for the wack",
      "While I'm masterfully constructing this masterpiece as",
      '[Chorus]',
      "Cause I'm beginnin' to feel like a Rap God, Rap God",
      'All my people from the front to the back nod, back nod'
    ]

    const expectedResult = [
      'Over the back of a couple of faggots and crack it in half',
      'Only realized it was ironic, I was signed to Aftermath after the fact',
      'How could I not blow? All I do is drop F-bombs',
      'Feel my wrath of attack',
      "Rappers are havin' a rough time period, here's a maxi pad",
      "It's actually disastrously bad for the wack",
      "While I'm masterfully constructing this masterpiece as",
      "Cause I'm beginnin' to feel like a Rap God, Rap God",
      'All my people from the front to the back nod, back nod'
    ]

    expect(processRawLines(rawLines)).toEqual(expectedResult)
  })

  test('Rap god lines 40-50', () => {
    const rawLines = [
      'Now, who thinks their arms are long enough to slap box, slap box?',
      "Let me show you maintainin' this shit ain't that hard, that hard",
      'Everybody wants the key and the secret to rap immortality like Ι have got',
      '[Verse 2]',
      "Well, to be truthful the blueprint's",
      'Simply rage and youthful exuberance',
      'Everybody loves to root for a nuisance',
      'Hit the Earth like an asteroid',
      'Did nothing but shoot for the Moon since (Pew!)',
      "MCs get taken to school with this music'"
    ]

    const expectedResult = [
      'Now, who thinks their arms are long enough to slap box, slap box?',
      "Let me show you maintainin' this shit ain't that hard, that hard",
      'Everybody wants the key and the secret to rap immortality like Ι have got',
      "Well, to be truthful the blueprint's",
      'Simply rage and youthful exuberance',
      'Everybody loves to root for a nuisance',
      'Hit the Earth like an asteroid',
      'Did nothing but shoot for the Moon since (Pew!)',
      "MCs get taken to school with this music'"
    ]

    expect(processRawLines(rawLines)).toEqual(expectedResult)
  })
})
