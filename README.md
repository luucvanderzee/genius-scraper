# genius-scaper

To download the list of hiphop artists from Last.FM:

```js
npm run artists
```

I have done this some time in May 2020, and combined the results with the `artists-wiki.txt` file in the `output` folder (which contains a list of rappers from the Wikipedia page for [mumble rap artists](https://en.wikipedia.org/wiki/List_of_mumble_rap_artists)). I did this because I was afraid that these kind of rappers would be underrepresented on Last.FM, and as a result I would not have enough observations for recent years. Next, I manually cleaned up the file (including removing artists that did not seem 'hiphop' to me). The result is the `output/artists-cleaned.txt` file.

Subsequently, I collected up to 20 URLs from each artist through the [Genius](./genius.com) API on 23-05-2020 with the following command:

```js
npm run songurls
```

The result is the `output/songURLs.csv` file.

After this step, I downloaded all the lyrics from the Genius URLs with the following command:

```js
npm run songsraw
```

This command will create a file called `output/songsRaw.csv`, but this file is too big to put on Github.

The last step is to clean this data up a bit. To do this, run:

```js
npm run cleansongs
```