---
layout: post
title:  "SunshineCTF 2018 "
subtitle: 'Sunshine CTF 2018 web challenges'
date:   2018-04-09 00:06:31
tags:
- Web Security, CTF, command injection, SSRF, X-Forwarding-For 
---

For this CTF, there were four web challenges which were fairly easy and the overall CTF was fun.

# Challenge 1 - Web 50 Evaluation

Link: `http://evaluation.web1.sunshinectf.org`

Description: `Evaluate your life. How are you doing, and are you doing the best you can possibly do? Look deeper within yourself, beyond the obvious. Look at the source of it all.`

This challenge took us to a page revealing following source code:

{% highlight php %}
```
<?php
include "flag.php";
error_reporting(0);
show_source(__FILE__);
$a = @$_REQUEST['hello'];
eval("var_dump($a);");
?>
```
{% endhighlight %}

Pretty much evident that we need to pass a `GET` parameter which was `hello`. Since whatever input we are giving is going to get evaluated and we know that the flag is inside `flag.php`,

<b>hello=`cat flag.php | grep sun -ni`<b>

gave the flag.

Final payload: <b>http://evaluation.web1.sunshinectf.org/?hello=`cat%20flag.php%20|%20grep%20sun%20-ni`<b>

# Challenge 2 - Web 100 Marceau

Link: `http://marceau.web1.sunshinectf.org`

Description: `Hey my friend tells me that the flag is in this site's source code. Idk how to read that though, lol (ðŸ…±ï¸retty lame tbh ðŸ˜‚)`

We were greeted with the following text in the challenge page which was in between `marquee` tags:

`You specifically want my PHP source. Why did you accept anything else?`

Apart from this, by the time I started playing the CTF, there was a hint already provided which made it pretty easy where the hint was:

`Hint 2018-04-06 00:20 UTC: There are many different types of MIMEs, but only a handful were truly legendary...`

Intercepting with burp and modifying `Accept:` to `text/php` reveals the flag. For this, a quick googling of `PHP MIME types` gave the further insight.

# Challenge 3 - Web 150 Home Sweet Home

Link: `http://web1.sunshinectf.org:50005`

Description: `Looks like this site is doing some IP filtering. That's very FORWARD thinking of them.`

Well, description itself says that we need to use `X-Forwarded-For` and that was it for the challenge.

The challenge page is greeted with `14.212.11.223 This IP address is not authorized`.

Intercepting the request and adding `X-Forwarded-For:127.0.0.1` gives us the flag.

# Challenge 4 - Web 250 SearchBar

Link: `http://search-box.web1.sunshinectf.org`

Description: ```This search engine doesn't look very secure.
Or well coded.
Or competent in any way shape or form.
This should be easy.
Note: flag is in /etc/flag.txt
```

We were greeted with a page wherein `https://www.google.com` was filled and also a submit button. Clicking on the submit button takes a to a page where it is shown as fetching the source code. Okay, now since our aim was to read the `flag` from the location we know, I tried fuzzing through the search bar and found that `www.google.com` was necessary and also they were using `parse_url`. I had recently read a <a href="https://medium.com/secjuice/php-ssrf-techniques-9d422cb28d51">blog</a> regarding the same.

I then used another scheme which was `file://` but then using `/` soon after being used for scheme was also blocked. And hence, a simple payload `http://search-box.web1.sunshinectf.org/?submit=Submit&site=file://www.google.com/etc/flag.txt#` gave the flag.
