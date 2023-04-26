---
layout: post
title:  "ASIS Quals 2018 Good WAF"
subtitle: 'ASIS Quals 2018 - Good WAF Web Challenge'
date:   2018-05-01 02:06:31
tags:
- ASIS Quals, SQLi, Web Application Firewall
---

Challenge name: `Good WAF`
Description: `WAFs cannot detect parameters filled with opaque data such as base64. Consequently, We've tuned our WAF to be more strong checking these inputs.`
Link: http://167.99.12.110/

We were greeted with the following page
<figure class="foto-legenda">
	<img src="../assets/asisquals/GreetPage.png" alt="">
</figure>

written `GET news by object (base64(json_object)) parameter`.


That was basically the first step for the challenge which was nothing else but a `GET` parameter `object` which should have a `json_object` encoded in `base64`. Initially I was trying to find the parameter which was in the application and that was, `data`. So passed `base64_encoded({"data":1})` and gave us the first data associated to that. It was a news and basically that showed us it was nothing, but SQLi.

So first attempt was to enumerate and break the query. The `base64_encoded({"data":"1"})` and up gave the result of the corresponding number. While I had passed `base64_encoded({"data":"'"})`, it showed `blocked by WAF`. Well, that was pretty much sure and the easiest bypass was to include a space in between which was nothing but, `base64_encoded({ "data" : "'"})`. Bingo, the following page was reflected with that payload

<figure class="foto-legenda">
	<img src="../assets/asisquals/sql1.png" alt="">
</figure>

With this, I found the name of the `database()` (check below for the payload) which was `waf_portal` and also the table name(check below for payload), `access_logscredentialsnews` which more of looked like three table names and hence parting them, `access_logs`, `credentials` and `news` (understood this while trying to find the column name :P).

The next step was to find what all are there in the three tables and grab them. Well, poking around for sometime gave me nothing in credentials (basically the flag). I was able to find a user named `valid_user` with password as `5f4dcc3b5aa765d61d8327deb882cf99` and role was `administrator`. Now with this, I had seen a class in the `style.css` file which was `.login-form` making me think that there should be a login form. The next step was to identify how to get to the login page and accessed the `access_log` table to find anything. There were a quite a number of `id`'s and iterating through each, in the `13`th one, I was able to find `?action=log-in`.

The next step was to login with the username and password that we had got. The password looked more of like an `md5` and googling it cracked it which was `password`. So now we have the username:`valid_user` and password:`password`.

The first way was trying to reach the `log-in` page. Accessing `http://167.99.12.110/?action=log-in` resulted in an error which was
```
Notice: Undefined index: credentials in /var/www/html/index.php on line 21

Notice: Undefined index: credentials in /var/www/html/index.php on line 22
Invalid Credentials.
```

Very well, that error confirmed that we had to pass `username` and the `password` as `credentials` through a `GET` request. Going ahead, `http://167.99.12.110/?credentials=&action=log-in` threw another interesting error,

```
Notice: Uninitialized string offset: 0 in /var/www/html/index.php on line 21

Notice: Uninitialized string offset: 1 in /var/www/html/index.php on line 22
Invalid Credentials
```

which was nothing but passing it as an array.

The final payload was:
`http://167.99.12.110/?credentials[]=valid_user&credentials[]=password&action=log-in`

and Bingo, `ASIS{e279aaf1780c798e55477a7afc7b2b18}`.





Payload for database:   `base64_encoded({  "data"  :  " ' UNION SELECT 1,database() -- "  })`


Payload for table name: `base64_encoded({ "data"  :  "' UNION select 1,table_name from information_schema.tables where table_schema=database() -- " })`

Reach me out on <a href="https://twitter.com/gkgkrishna33/status/991191742257946624">Twitter</a> for more queries.
