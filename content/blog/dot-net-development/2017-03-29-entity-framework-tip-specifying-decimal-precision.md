---
title: Entity Framework Tip – Specifying Decimal Precision
author: Andrew
type: blog
date: 2017-03-29T20:57:27+00:00
aliases:
  - /2017/03/29/entity-framework-tip-specifying-decimal-precision/
dsq_thread_id:
  - "5678313316"
categories:
  - 'C#'
tags:
  - Entity Framework
  - Precision

---
By default, Entity Framework takes the .Net `decimal` Type and maps it to SQL Server&#8217;s `decimal(18,2)` data type.

If you&#8217;ve got a property on an Entity that is of Type `decimal`, but down in your database, you&#8217;re allowing for greater precision than 2 decimal places ([_scale_][1] is actually the proper term for the number of places after the decimal), you need to tell Entity Framework this information. Otherwise, decimal values that you save to your database will be truncated at the default **2** decimal places.

## Updating decimal scale with Entity Framework

To tell Entity Framework that you need different precision than `decimal(18,2)`, you need to **open your DbContext** implementation.

Then take a look at your `OnModelCreating` override.

If you haven&#8217;t implemented an override yet, go ahead and create one. If you&#8217;ve already got some Code First stuff in your `OnModelCreating` override, add to it by following this example:

<pre class="lang:c# decode:true ">protected override void OnModelCreating(DbModelBuilder modelBuilder)
{
    modelBuilder.Entity&lt;NameOfEntity>()
                .Property(p => p.NameOfProperty)
                .HasPrecision(9, 4); // or whatever your schema specifies
}
</pre>

It&#8217;s as simple as that! Once you make this update, your decimal values won&#8217;t be truncated at the second decimal place anymore. They&#8217;ll be as precise as you&#8217;ve specified in your call to `HasPrecision()`.

 [1]: https://docs.microsoft.com/en-us/sql/t-sql/data-types/precision-scale-and-length-transact-sql