---
layout: post
title:  "Bandit Walkthrough"
subtitle: 'Bandit Walkthrough'
date:   2016-05-11 14:20:31
tags:
- Bandit, wargame, OvertheWire
---

First of all, I would like to thank the orgs of OverTheWire for making this awesome set of challenges and I would like those who are reading this first to try out the challenges and then go through this.

<b>`Level 0` & `level0 -> level1`</b>:

The description of the task is:
```
The goal of this level is for you to log into the game using SSH. The host to which you need to connect is bandit.labs.overthewire.org, on port 2220. The username is bandit0 and the password is bandit0. Once logged in, go to the Level 1 page to find out how to beat Level 1.
```

As they say, do an `ssh` to a specified host running on specified port. Also, they have mentioned the username and the password.

`NOTE`: For those who don't know what `SSH` is, it is a cryptographic network protocol for operating services securely over an unsecured network (Source: Wikipedia).

<b>Command</b>: `ssh bandit0@bandit.labs.overthewire.org -p 2220`
<b>Password</b>: `bandit0`

Once we are connected, we are required to get the password for the next level and that is how it goes. Also, in the home page of the wargame, they have mentioned a few commands that has to be known to bypass this level, that is `level0 -> level1`.

Simply do a `ls` which lists the files which in turn shows, `readme`. To see what is inside, simply do a `cat readme` which gives you the password for the next level.

##`level1 -> level2`:
SSH into `level1` - `ssh bandit1@bandit.labs.overthewire.org -p 2220` to obtain the password for `level2`.

Once logged in, we can see a file with the name `-`(dash). As suggested in the challenge page, our goal is to read the file which has a `dash`. Googling can simply give you the answer which is:

```
cat <- -
```

There is a redirection symbol `<-` being used and that is, for commands which get input from stdin, we can use that symbol.

##`level2 -> level3`:

The description is:
```
The password for the next level is stored in a file called spaces in this filename located in the home directory
```
After logging in with the password got from the previous level, you are given a file with spaces in between and that contains the password.

Since they contain spaces, one of the way I could find was to give it inside double quotes.

```
cat "spaces in this filename"
```

Will be posting rest of the solutions soon.
