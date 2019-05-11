---
title: Testing is to Software as Experiment is to Science
author: Andrew
type: blog
date: 2015-04-30T04:01:24+00:00
aliases:
  - /2015/04/29/testing-is-to-software-as-experiment-is-to-science/
dsq_thread_id:
  - "3724284911"
categories:
  - .Net Development
  - Swift
tags:
  - Unit Testing

---
> The principle of science, the definition, almost, is the following: The test of all knowledge is experiment.

> The sole test of the validity of any idea is experiment.

These quote came from [Chapter 1][1] and [Chapter 2][2] of the [Feynman Lectures on Physics][3].

I&#8217;m not a physicist, but the software developer in me resonated with the connection between _experimentation_ and _validation_ of what we know about the world around us. Almost immediately, I related it to the world of software.

<div class="resources">
  <div class="resources-header">
    Jump to&#8230;
  </div>
  
  <ul class="resources-content">
    <li>
      <a href="#validity-confirmed-by-experiments">Validity is confirmed by experiments (tests)</a>
    </li>
    <li>
      <a href="#repeated-experiments-most-valuable">Repeated experiments (tests) are most valuable</a>
    </li>
    <li>
      <a href="#experimentation-creative-effort">Experimentation (testing) is a creative effort</a>
    </li>
    <li>
      <a href="#related">You might also enjoy…</a>
    </li>
    <li>
      <a href="#share">Was this article helpful? Please share!</a>
    </li>
  </ul>
</div>

<a name="validity-confirmed-by-experiments" class="jump-target"></a>

### Validity is confirmed by experiments (tests)

The universe around us is an immense mystery. We have many ideas about it, but the ideas that are validated by experiment are the ones we cling to more tightly than the ones that remain in the realm of guess and theory.

How do we know that things are valid within a software application? The answer, of course, is by _testing_ that software&#8230; experimenting with it, if you will, and observing the outcomes of those experiments.

Your software is a universe of mystery until it&#8217;s tested.

<a name="repeated-experiments-most-valuable" class="jump-target"></a>

### Repeated experiments (tests) are most valuable

Experiments that are conducted _multiple times_ are significantly more valuable than a single observation made from a single experiment. Repeated experiments increase the probability that what was observed was not an accident, but was truly the result of correct procedure validating a correct hypothesis. Performing the experiments as identically as possible to one other is the key to trusting the results.

Likewise, repeated testing of software is far more valuable than testing it once and walking away. Repeated tests done identically over time provide the reassurance we need to know _for sure_ that our software behaves as we expect as it morphs to accommodate new ideas and new needs.

Sure, we could spin up the app in a simulator and click/tap through it to see if pressing [Button X] does what its label implies it will do. But I&#8217;ve heard it said that if we have to do it more than once, it should be _automated_.

Testing is one of those things that needs to be done often. Pretty much any time the app&#8217;s code changes (even just a little bit!), there is warrant to check and make sure the universe as we knew it still obeys all the laws we previously discovered.

Repeated tests are just as valuable to software as repeated experiment is to science. The more we can automate them, the greater the consistency in our repeated observations of how the software behaves.

<a name="experimentation-creative-effort" class="jump-target"></a>

### Experimentation (testing) is a creative effort

Designing the right experiment to elicit the right conditions to make that _one critical_ observation is a creative process. Sometimes, scientists have to go to great lengths to make their observations. But they all find it worth it when their experiment yields results!

I work with some amazing scientists on a day-to-day basis. Watching them work and hearing about some of the things they have to do in order to test their ideas is so fascinating to me. For example, one of our Principal Investigators is making observations about how microgravity affects a plant&#8217;s cell walls. To do that, he had to literally [launch his plant&#8217;s seeds into space][4]! [They&#8217;re aboard the International Space Station][5]. Growing plants! In _space_! I&#8217;m blown away by these guys!

While we needn&#8217;t launch our code into space just to experiment with it, sometimes we have to get creative in order to make the observations we need to make from our code. Automated testing isn&#8217;t easy. Running the app and clicking a button and watching what happens with our own eyes is easy, but it&#8217;s tedious and I&#8217;m lazy!

Creating the right environment (in code) for a test to verify what it needs can take effort, but in the end, when the test yields results time after time after time, I&#8217;ve always found that it&#8217;s worth it!

### Wrapping up

My hope is that seeing automated unit testing from a slightly different perspective has sparked some thoughts and ideas in your mind. How can you begin experiment with your code with automated tests? How can you begin to make repeatable observations about your code so that you know, _for sure_, that it works, even _after_ you go about making changes to it as time goes along?

I&#8217;ve devoted a bit time to writing about unit testing in Swift since the language was released. I hope this article adds something unique to the collection and that it gets you motivated to validate your software universe with tests!

<a name="related" class="jump-target"></a>

<div class="resources">
  <div class="resources-header">
    You might also enjoy&#8230;
  </div>
  
  <ul class="resources-content">
    <li>
      <i class="fa fa-angle-right"></i> <a href="http://www.andrewcbancroft.com/2014/12/29/getting-started-unit-testing-swift/" title="Getting Started with Unit Testing in Swift">Getting Started with Unit Testing in Swift</a>
    </li>
    <li>
      <i class="fa fa-angle-right"></i> <a href="http://www.andrewcbancroft.com/2014/12/19/swift-unit-testing-resources/" title="Swift Unit Testing Resources">Swift Unit Testing Resources</a>
    </li>
  </ul>
</div>

<a name="share" class="jump-target"></a>

 [1]: http://www.feynmanlectures.caltech.edu/I_01.html#Ch1-S1
 [2]: http://www.feynmanlectures.caltech.edu/I_02.html
 [3]: http://www.feynmanlectures.caltech.edu/
 [4]: http://www.noble.org/blog/plants-in-space/archive/
 [5]: http://www.nasa.gov/mission_pages/station/research/experiments/1062.html