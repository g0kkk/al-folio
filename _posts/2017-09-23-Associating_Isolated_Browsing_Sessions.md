---
layout: post
title:  "One Side-Channel to Bring Them All and in the Darkness Bind Them: Associating Isolated Browsing Sessions"
subtitle: 'Review on the paper One Side-Channel to Bring Them All and in the Darkness Bind Them: Associating Isolated Browsing Sessions'
date:   2017-09-23 00:06:31
tags:
- Web, Web Privacy
---

After reading through papers intensively on Web Privacy, I was currently reading a recently released paper in USENIX, <a href="https://www.usenix.org/conference/woot17/workshop-program/presentation/van-goethem">One Side-Channel to Bring Them All and in the Darkness Bind Them: Associating Isolated Browsing Sessions</a>. In recent findings, researchers have shown that unwanted web tracking is on the rise, as advertisers are trying to capitalize on users’ online activity, using increasingly intrusive and sophisticated techniques. Among all the techniques that has been found, browser fingerprinting has received the most attention since it allows trackers to uniquely identify users despite the clearing of cookies and the use of a browser’s private model.

In the research paper <a href="http://ieeexplore.ieee.org/document/7958618/"> XHOUND: Quantifying the Fingerprintability of Browser Extensions</a>, the authors <a href="https://twitter.com/nicknikiforakis"> Nick Nikiforakis</a> and <a href ="https://twitter.com/o_starov"> Oleksii Starov </a>, have investigated and quantified the fingerprintability of browser extensions, such as, AdBlock and Ghostery which most of the users rely upon. The authors have shown that an extension’s organic activity in a page’s DOM can be used to infer its presence.

In the paper <a href ="http://randomwalker.info/publications/OpenWPM_1_million_site_tracking_measurement.pdf">Online Tracking: A 1-million-site Measurement and Analysis</a> by <a href="https://twitter.com/search?q=Steven%20Englehardt&src=typd">Steven Englehardt</a> and <a href="https://twitter.com/random_walker">Arvind Narayanan</a> released the measurement of the top 1 million sites using the self-developed tool which gave an answers to the question "Who are the largest trackers?", "Which sites embed the largest number of trackers?" and "Which tracking technologies are used, and who is using them?". The exposure of the data made many of the trackers to withdraw their tracking from several websites or change their way of tracking.

As the title of this article suggests, here it is all about the paper which was published recently in USENIX. In this paper, the authors <a href ="https://twitter.com/tomvangoethem">Tom Van Goethem</a> and Wouter Joosen evaluate the browser’s threat surface with regard to fingerprinting and tracking in the context of isolated browsing sessions which is between regular browsing sessions versus the incognito sessions. The authors also show how the IP address of Tor users are revealed when they use a concurrent browsing session.

The authors bring provide three major/key contributions which are little explored in the area of privacy which are
<ol>
<li>Shows that Side-Channel attacks on modern web browsers are a serious threat for fingerprinting</li>
<li>The authors discover three Side-Channel attacks that can be abused to track users along private browsing mode.</li>
<li>The proposed fingerprinting technique can be used to reveal the IP address of Tor users.</li>
</ol>

The authors then explore the Threat models of which the first scenario is, user/victim is using multiple browsing session that are isolated from each other (Normal mode and Private). The adversary which the authors consider capable of running javascript code in victims browser maybe through an advertisement which associates different sessions thus revealing victim's identity. If this attack scenario, then the privacy is broken. The authors then stress on the outcome if such a attack happens. Unless a user uses a browser like Tor, the IP address of a user will be known to all parties. Unless the IP is the same for a larger group of people, the IP address can be used to track people. There are several ways through which this can be blocked of which one such way is using a VPN or using an HTTP proxy.

In order to show the Proof of work, the authors make an abstraction of the browser model. There are five conceptual operations of which two are browser-specific operations and the rest are based on the interactions with the host device. Since there were a lot of research on this topic, the authors first mentions about the side-channel attack that can be used to detect the presence of browser extensions which is possible even in incognito mode.

For developing an extension, it is required to define a manifest file that details the properties of the extension. The property `web_accessible_resources` (v1) can be used to indicate which resources are allowed to be accessed from the web. As from the paper, `An important observation that forms the basis for the timing attack is that the browser will always need to evaluate the extension’s manifest to determine whether a requested resource can be accessed. First, the browser has to determine the default behavior: allow-by-default or whitelist-only. Next, in case only whitelisted resources are allowed, the browser has to loop over all web_accessible_resources entries (which can include wildcards) and evaluate whether any of these match the requested resource.`

Since the above attack or measurement can only be done in browsers which have extensions installed, this introduces a timing side-channel attack. So the authors, to determine the presence of an extension, uses the `Fetch API` and request a randomly selected end point of an extension. The extensions in chrome will be `chrome-extension://UUID/resource` where is an identifier which is unique for an extension, `endkbihdcjinhjdoflohffjofphpofhc` for an extension that I had built.

So the scenario mentioned in the paper is like, `the attacker starts a timer and stores the result of performance.now() in a varaible`. After a period of time, the result is returned and moreover, the same thing is done for an arbitrary extension ID as well. This difference in time return helps an attacker to identify/track user.

The defence proposed by the attacker was two, one being the extension ID unguessable and the other, a constant execution time when trying to access a resource of an extension. The way in which the authors have crafted this is just amazing. Kudos to the authors and thanks for this wonderful paper. Reach me out on <a href="https://twitter.com/gkgkrishna33/status/942980228044877824">Twitter</a> for any queries.
