import { processRawLines, getRawLines } from '../utils/cleaning.js'
import missyElliotSnippet from './__data__/608-missy-elliot.js'
import publicEnemySnippet from './__data__/239-public-enemy.js'

const missyElliotRawLines = getRawLines(missyElliotSnippet)
const publicEnemyRawLines = getRawLines(publicEnemySnippet)

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

  test('Missy Elliot lines 65-75 ([Break] does not count as song part)', () => {
    const result = processRawLines(missyElliotRawLines).slice(65, 75)

    const expectedResult = [
      'When I do my thang',
      "Got the place on fire, burnin' down to flames",
      "She's a bitch",
      'When you say my name',
      "Talk mo' junk but won't look my way",
      "She's a bitch",
      'See I got more cheese',
      'So back on up while I roll up my sleeves',
      "She's a bitch",
      "You can't see me, Joe"
    ]

    expect(result).toEqual(expectedResult)
  })

  test('Public enemy lines xx-xx ([Refrain] and [Chorus] tags)', () => {
    const result = processRawLines(publicEnemyRawLines).slice(32, 50)

    const expectedResult = [
      '2, 7, 5, 4, 8 she watched she said',
      'All added up to zero, and nothing in her head',
      'She turns and turns',
      'and she hopes the soaps',
      "Are for real, she learns that it ain't true, nope",
      "But she won't survive and rather die in a lie",
      'Fall a fool for some dude on a tube',
      "I don't think I can handle she goes channel to channel",
      'Cold looking for that hero',
      ',',
      'she watch channel zero',
      'She watch, she watch, she watch, she watch',
      'She watch, she watch, she watch, she watch',
      'She watch, she watch, she watch, she watch',
      'She watch, she watch, she watch, she watch',
      'She watch, she watch, she watch, she watch',
      'She watch, she watch, she watch, she watch',
      'She watch, she watch, she watch, she watch'
    ]

    expect(result).toEqual(expectedResult)
  })
})
