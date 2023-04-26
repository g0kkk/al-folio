---
layout: post
title:  "CodeGatePreQuals 2018"
subtitle: 'CodeGate 2018 PreQuals Writeup'
date:   2018-02-04 00:06:31
tags:
- Web, CTF, SQLi, Web Security
---

As usual, the CTF contained pretty hard challenges and there were only two web challenges. The challenge name was `SimpleCMS` which is basically a Content Management System for which they gave the source code. Woah, neet and clean and yes, setting up a challenge locally is nothing more awesome!

Moving onto the challenge, from the very first view, it seems to be SQLi but I was obvious that there were some filters as I tried to register with a password as `password` which was basically denied and that was because `or` was filtered by the `waf` file.

Since an instance was running locally, I was able to figure out that the `flag` was in the third column of the table named `xx_flag` where in `xx` denoted a random str. Also, there is a column in the table but then even that has a random str appended towards the beginning. So now, I knew that I have to get the table name, column name as well. The next question was, SQLi - how, where?

The next step was finding out where the injection point is and after a fair amount of time, I was able to find that, query is `LOWER({$column[$i]}) like '%{$search}%' {$operator}` and yes, possibly injection in `{$search}`. Moreover, I did not find `LIKE` keyword to be listed in the blacklist.

Taking a look at the `search code` in the file `Board.class.php` gives us more information about the search function.

```
<?php
function action_search(){
			$column = Context::get('col');
			$search = Context::get('search');
			$type = strtolower(Context::get('type'));
			$operator = 'or';

			if($type === '1'){
				$operator = 'or';
			}
			else if($type === '2'){
				$operator = 'and';
			}
			if(preg_match('/[\<\>\'\"\\\'\\\"\%\=\(\)\/\^\*\-`;,.@0-9\s!\?\[\]\+_&$]/is', $column)){
				$column = 'title';
			}
			$query = get_search_query($column, $search, $operator);
			$result = DB::fetch_multi_row('board', '', '', '0, 10','date desc', $query);
			include(CMS_SKIN_PATH . 'board.php');
		}
		function action_read(){
			$idx = Context::get('idx');
			if(!$idx)
				alert('not found', 'back');
			$query = array('idx'=>$idx);

			$result = DB::fetch_row('board', $query);
			include(CMS_SKIN_PATH . 'post.php');
		}
	}
  ?>
```

In the above code, which is pretty weird, you can see that a newline can cause an error.

So building up the payload:

```
http://13.125.3.183/index.php?act=board&mid=search&col=title#&type=1&search=test%0a)<0 union select 1,(select table_name from mysql.innodb_table_stats limit 2,1),3,4,5#
```
which fetches the `{table_prefix}` and also, `information_schema` can't be used and that is also blacklisted and finally building the payload to get the `flag` using `join` fetches us `flag{you_are_error_based_sqli_master_XDDDD_XD_SD_xD}`.


Reach me out on <a href="https://twitter.com/gkgkrishna33">Twitter</a>.
