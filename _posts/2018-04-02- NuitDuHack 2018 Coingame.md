---
layout: post
title:  "NuitDuHack 2018 CoinGame"
subtitle: 'NuitDuHack 2018 CoinGame Challenge writeup'
date:   2018-04-02 00:06:31
tags:
- Web, CTF, LFI, Web Security
---

I did not get much time to play this CTF but within the time frame, CoinGame was one of the challenges which I was able to solve. This challenge had comparatively lesser solves than other web challenges but was easy.

Challenge link : `http://coingame.challs.malice.fr/`

Points: `200`

So about this challenge, we get a welcome page wherein it is written `CURL service`
<figure class="foto-legenda">
	<img src="../assets/nuitduhack/HomeScreen.png" alt="">
</figure>


and a textbox wherein we can give url's (hopefully).

<figure class="foto-legenda">
	<img src="../assets/nuitduhack/cURL_request.png" alt="">
</figure>

The source code revealed nothing. But after giving `google.com` in the textbox, we were able to notice a particular request being set and showing us a page with response status `302`. The URL was perfect enough to understand what it was, LFI.

<figure class="foto-legenda">
	<img src="../assets/nuitduhack/url.png" alt="">
</figure>

The very next step was to see what is inside `/etc/passwd`. `http://coingame.challs.malice.fr/curl.php?way=../../../etc/passwd` reveals nothing but, `http://coingame.challs.malice.fr/curl.php?way=file:///etc/passwd` gave us the list of every registered user that has access to that system.

<figure class="foto-legenda">
	<img src="../assets/nuitduhack/etc.png" alt="">
</figure>

One particular thing that caught in my mind was <a href="https://en.wikipedia.org/wiki/Trivial_File_Transfer_Protocol">tftp</a>. Since the challenge description had mentioned a game, I quickly googled and got the link to the same <a href="https://github.com/totheyellowmoon/CoinGame/">repo</a>.

Since the file names were there, I quickly tried to see if the files that exist in the challenge server are the same. I then gave in `http://coingame.challs.malice.fr/curl.php?way=file:///home/CoinGame/Bonus.py` which gave me the `Bonus.py` file.

<figure class="foto-legenda">
	<img src="../assets/nuitduhack/coingamedir.png" alt="">
</figure>

I assumed that all the other challenge file names would be the same and we have to only find the files which are altered by the admin of the challenge. I was quickly going through the files in the github repo and found that there were a lot of files and manually fetching would be cumbersome.

So with the help of my team mate, `dnvira`, we got a <a href="https://github.com/gokulkrishna01/gokulkrishna01.github.io/tree/master/scripts/NuitDu">script</a> which would actually wget the entire files and subdirectories.

Comparing the hashes of the cloned repo and the one we got from the challenge server gave us a few files being differentiate from others. I was going through a few of them and apparently a few images in `gameAnimationImages` had flag written at the bottom end.

`flag{_Rends_l'_......`

There were two places wherein I was stuck. One was using `tftp` which would have been a way to proceed further and the next one, fetching all the files. Apparently the former one was where I was stuck for long time.

Reach me out on <a href="https://twitter.com/gkgkrishna33">Twitter.
