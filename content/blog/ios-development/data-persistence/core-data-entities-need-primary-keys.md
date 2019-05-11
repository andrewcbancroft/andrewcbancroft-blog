---
title: Do Core Data Entities Need Primary Keys?
author: Andrew
type: blog
date: 2018-08-10T22:31:47+00:00
aliases:
  - /2018/08/10/core-data-entities-need-primary-keys/
categories:
  - Swift
tags:
  - Core Data
  - Primary Key

---
In this video I pop the hood on Core Data&#8217;s SQLite persistent store to discover the details about whether or not you need to add a property representing a &#8220;primary key&#8221; for your Core Data Entities. Take a look and be sure to subscribe for to stay connected to future screen casts!

<div style="position:relative;height:0;padding-bottom:56.25%">
</div>

# Transcript

I had a question asked to me recently to the effect of… “Do I need to create a Primary Key property when I model my Core Data Entities?”

I’m going to tackle answering this one with an Xcode sample project I built a while back and put out on GitHub…

If you go to https://github.com/andrewcbancroft/Zootastic, you’ll be able to clone the repository and follow along with me if you’d like.

This repo is Zoo-themed … don’t judge -haha My kids love animals so I couldn’t help myself…

The Core Data model for this project looks like this. I’m going to focus in on just _one_ of those entities in this video…namely, the Zoo entity.

With that context in mind, let’s think about primary keys… Do you need them when you’re modeling Entities in a Core Data project?

Let’s consider what primary keys are _for_, first of all. Essentially what you’re after when you specify a Primary Key in a relational database is a guarantee of the uniqueness of a row in a table…

You want to make sure that a given representation…a given instance…one row of an Entity can be uniquely identified, and that’s typically done by adding an ID column with a sequential, unrepeated integer value called a Primary Key.

That way even though two rows may have similar information, such as these two zoos with the same name, you can always represent the City Zoo in Denver Colorado with the unique ID of 1, and the City Zoo in Oklahoma City, OK with the ID of 3.

Suppose our data model has this Zoo entity with two properties: Location and Name…

The question at hand is… Do you add this ZooID property? Or not?

By far the most common use-case with apps using Core Data is to use the NSSQLiteStoreType as the underlying persistent store.

What this means is that Core Data acts as an abstraction layer over the underlying persistent store, which happens to be a SQLite relational database under the hood.

When you create Entities with Attributes in your core data model, those turn into Tables with Columns in the SQLite database.

What I want to do right now is show you what happens when your data model is initialized in an app using Core Data with a SQLite persistent store, and what you’re going to discover is that Core Data’s got your back when it comes to Primary Keys.

Watch this…

I’m going to edit the scheme of the Zootastic app to show you how to get a little bit of extra debug information related to the SQL queries that are being run under the hood as Core Data interacts with your persistent store.

Under Run, you can add an argument that’s passed when the app is launched to get this extra debug information. Use the -com.apple.CoreData.SQLDebug switch and pass 1 as the argument.

Running the app loads a ton of text into the debug console’s output, but what I’m interested in showing you is right up here at the top.

Do you see this right here? Core Data sends a CREATE TABLE statement to the SQLite database engine, and within the columns it creates is this Z_PK integer column as a… Primary Key.

But I haven’t listed a PK property in my Entity!

Seeing the fact that even though I don’t put in a special primary key property, Core Data still creates that column in the SQLite database, I think you can answer the question on your own.

My answer would be, “No… you don’t need to specify a special ID property to serve as your entity’s Primary Key because Core Data knows this internally and creates one automatically.”

Now just in case you’re skeptical and don’t believe that the column is actually IN the database, I want to show you explicitly.

At the top of this debug output, do you see this? it’s a path to the sqlite database file that the app is using. I’m going to copy it and jump over to a terminal session.

cd to that directory and list its contents.

Zootastic.sqlite is what I want to peek into, so I’ll run sqlite3 with that file specified.

If you run .table, sqlite will list out all the tables in this database file.

Running .schema on ZZOO shows you that yes indeed the primary key column is present in the database table that holds the Zoos for the app.

Selecting all columns from the ZZOO table shows that it’s populated with integer values as you’d expect.

Bottom line? You don’t need to explicitly create an ID column to serve as a primary key. Core Data takes care of that for you.

If you’re learning Core Data, you might enjoy my Core Data Fundamentals with Swift course on Pluralsight. I cover the essentials to get you up and running with Core Data in your apps developed for Apple’s platforms.

Thank you for watching!