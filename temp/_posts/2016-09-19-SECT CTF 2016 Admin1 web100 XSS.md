---
layout: post
title:  "SECT CTF 2016 Web Challenge"
subtitle: 'ADMIN 1 WEB 100 (XSS)- SECT CTF 2016'
date:   2016-09-16 00:20:31
tags:
- SECT CTF, XSS
---
This CTF comes after the previous MMA CTF which got over on 5th September. One of the things that attracted me was that, it included XSS challenges.


Challenge URL : http://xss1.sect.ctf.rocks

The challenge was presented with a text box and we were asked to call `alert(1)`.

<figure class="foto-legenda">
	<img src="../assets/ctfwriteup/SECT/homescreen.png" alt="">
</figure>

Then, I tried viewing the source code

<figure class="foto-legenda">
	<img src="../assets/ctfwriteup/SECT/source-code.png" alt="">
</figure>


And I was able to find something written down inside the script tags. Then I understood essentially my target was to by pass the var a=””;. So for that, I tried injecting a payload into the URL which was like `http://xss1.sect.ctf.rocks/?xss=%22;alert(1)//`. That threw me an error which said that `dontrunthisscript is not defined`. Now the payload became more simple as my requirement was to create a new function and then call `alert(1)` inside and eventually got submitted the same URL, got into the index.php page and boom, flag was there!

Flag: `sect{h0ist_uR_funct10n5_h0ist_y0_w1fe}`
