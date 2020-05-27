import { getRawLines } from '../utils/cleaning.js'
import rapGodSnippet from './__data__/0-rapgod.js'
import deadPrezSnippet from './__data__/1500-dead-prez.js'

const rapGod = getRawLines(rapGodSnippet)
const deadPrez = getRawLines(deadPrezSnippet)

describe('getRawLines', () => {
  test('Rap god first ten lines', () => {
    const result = rapGod.slice(0, 10)

    const expectedResult = [
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

    expect(result).toEqual(expectedResult)
  })

  test('Rap god lines 30-40 (contains line which is just "\'")', () => {
    const result = rapGod.slice(30, 40)

    const expectedResult = [
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

    expect(result).toEqual(expectedResult)
  })

  test('Rap god lines 40-50', () => {
    const result = rapGod.slice(40, 50)

    const expectedResult = [
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

    expect(result).toEqual(expectedResult)
  })

  test('Dead prez lines 35-45 (contains line with the "sameI\'m")', () => {
    const result = deadPrez.slice(35, 45)

    const expectedResult = [
      "I'm down for running up on them crackers in their city hall",
      "We ride for y'all, all my dogs, stay real",
      "Nigga don't think these record deals gon' feed your seeds and pay your bills",
      'Because they not',
      "MC's get a little bit of love and think they hot",
      'Talking bout how much money they got;',
      "Nigga, all y'all records sound the same",
      "I'm sick of that fake-thug-R&B-rap-scenario, all day on the radio",
      'Same scenes in the video',
      'Monotonous material'
    ]

    expect(result).toEqual(expectedResult)
  })
})
