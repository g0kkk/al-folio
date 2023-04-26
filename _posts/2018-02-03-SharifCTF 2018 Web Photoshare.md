---
layout: post
title:  "Session_id manipulation - SharifCTF 2018"
subtitle: 'Sharif CTF 2018 PhotoShare Web Challenge'
date:   2018-02-04 00:06:31
tags:
- Web, CTF, Bruteforce, Session_id manipulation
---

So this was my very next CTF after Acebear which was a Fun CTF. Talking about this challenge, the only reason why I'm writing a write up
is that this challenge had comparatively very less solves.

The description talks about the username which is `jack` and states that `password: Year and month of Jack's birthday.`. So the first step
that came into my mind was bruteforcing the hell out of there( <a href="https://github.com/gokulkrishna01/gokulkrishna01.github.io/blob/master/exploit.py">Exploit</a> ) and had a very hard time in finding them
as the DOB was kinda screwed up. Finally after around one hour, managed to get the DOB, `195408` which was the password and took us to the
next page, `GetImages` wherein there were a lot of images being showed up and also, a functionality to upload the image.

The very next thing that had came into my mind was `Image upload vulnerability` and tried to play it with a lot. Since they were only accepting
images, I tried to append php code towards the end of an image and upload. I tried downloading the image that was uploaded but only to see that
the php code was stripped off. I tried to play it with so long but nothing came out of the way.

Then after sometime, I noticed something in the description which was, ` Login to this website as admin.` which I did not care much in the
beginning. So the next thing what had come into my mind was, XSS. Ah damn, well, I was looking for all the other places where I could trigger
XSS payload but hardluck, nothing worked. As I was running out of ideas, one of my team mate said they have given a hint and that was
`No need for XSS or bypassing the uploader`. Well, now I was stuck and thinking of all the other possibilities and checked out the cookies
randomly only to see that `Session_id` was an md5 encrypted one which when decrypted gave `jackxx` where `xx` represents the number possibly
depecting the number of logins attempted with that user in a time frame.

So I modified the `session_id` cookie to `md5(admin1)` where `1` was just a random number and then after refresh, I was taken to another page
which was to answer a secret question. Well, tried every shit over there only to see that it was nothing but again guessing with some damn thing.
Later, the admin said that the answer to that question is on the server and tried every single word over there only to see that the answer was
from an image which was `Mr. Tashakkor` wherein it was refered to as the `name of the first teacher`.

That was it with a pretty badly designed challenge and a lot of guessing. Well, I appreciate the effort for hosting these challenges but I
personally don't find fun in playing these kind of challenges.

Flag: `SharifCTF{kmvfwmj6sea7get9wggu249ehjc8hmdd}`

Reach me out on <a href="https://twitter.com/gkgkrishna33">Twitter</a>.
