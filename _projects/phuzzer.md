---
layout: page
title: Phuzzer
description: A framework to invoke AFL like fuzzer
importance: 2
category: work
---

Phuzzer is a Python module that provides a wrapper for interacting with fuzzers like AFL (American Fuzzy Lop). It supports starting an AFL instance, adding slave workers, injecting and retrieving testcases, and checking various performance metrics. It requires several dependencies, including shellphish-afl, driller, and tracer, which can be installed using pip. The fuzzer can be used either by using the shellphuzz script or programmatically by importing the fuzzer module. The module is based on the one used by Shellphish in Mechanical Phish, their CRS for the Cyber Grand Challenge.

Note: *Have added in a few functionalities that incorportate some of the new AFL based fuzzers*
