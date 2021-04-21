# gt_fsf_hw18_budgetTracker
This assignment introduced us to PWA concepts and asked us to build a site based on related concepts and libraries. 
## Table of Contents
1. [Description](#Description)
3. [Usage](#Usage)
4. [Installation](#Installation)
5. [Licenses](#Licenses)
6. [Questions](#Questions)
7. [Credits](#Credits)

## Description
**Deployed App (Heroku)**      
INPUT

**Walkthrough Video**       
Below is a link to a walkthrough video hosted on my google drive (for data size purposes). Here I demo the app and walk through the methods I used to achieve the assignment requirements. 
https://drive.google.com/file/d/1OtZyX5OPfYWOHvWXTx3zRew7b3GJb8D9/view?usp=sharing


**Dashboard Snapshot** 
![image](https://user-images.githubusercontent.com/72420733/115468722-7c5bf380-a201-11eb-8d87-39c1a8a25ba3.png)


This assignment required us to build upon our knowledge of mongoDB, indexedDB, and other aspects of a Progressive Web Application (manifest, service worker etc) to complete a transaction tracking application that can be used offline. 

It takes an offline first approach to server resources from the cache if availible. A user is able to see transaction totals, as well as enter new transactions and see changes to the chart adn the total value even if they have no internet connection. The user can also download this so that it acts more closley to a native application from a user experience perspective.

In terms of displaying the page and allowing for charts to render, button presses to work etc even if a user if offline, I cached the assets needed to do this using code within my service-worker js script. This is why users can load the latest information and interface to it with out being online. If they try and create new transactions while offline, they are able to do this. First their transaction is added to a running array for transactions (once its created). Then their transactions are held in an indexedDB I established within a "pending" object store. Every time the application is run there is a check for if the application is online. If the application is detected to be back online, it will then check the indexedDB and if pending transactions exist I bulk update them to my mongo server and then clear out the records kept in my indexed db as they are no longer pending, and are now synced with the master db. It will then pull back the latest data from the DB to display in the table and chart view. 

This assignment was a good introduction to utilization of PWA concepts, and various ways you can provide users with functionality without having to rely on a connectoin to your server. In additoin, I was able to further build upon skills I learned in the class to diagnose a bug and make changes to the starter code so that it works to my intent. My trouble shooting process for this and solution documentation can be seen below:
HW 18 bug

Wednesday, April 21, 2021
3:20 PM

Sometimes, when I refresh after changing from online to offline, my application will not work. Its not very repeatable, but it happens. 

It has something to do with transaction not populating at beginning of the script on time…


CONFIRMED that More specifically when I examine this, it looks like sometimes the /api/ intercept cloned result is only one transaction instead of the full amount like it should be any time this api/transactions call is made when the application opens or refreshes. That means when I am offline and I pull from the last successful response cloned, it gives me a singel value and not an array meaning my array methods fail. 

What is happening during failure- 1 item shown in response when multiple are on db


What should be happening- all db items cloned in response


The problem to look for is where in the process it messes up and only caches one item on refresh instead of all the returned responses. 

	- Pattern to reproduce
	Go online, and add a transaction (don’t refresh or add another one). 
		- Problem
			§ What happens here is the cache intercept that should only be keeping record of all my transactions returned is only keeping record of that new transaction created, not all of them on the db (its doing what its supposed to but I need to change the behavior)!
			§ So, if I refresh again or go offline from there, it then tries to get my latest array (of all latest transactions) but it does not work. 
	
Question
	- Is there any need to cache response for created transactions?
		- I think, no. This is because if a creates transaction is done offline it just goes to array anyways I don’t ever have to pull just the last created transaction. 
Solution, 
	• Change the path to intercept so that it only gets the call for GETTING all transactions. 
Change the client route, and api route on the server to match the one I specify for intercept. ![image](https://user-images.githubusercontent.com/72420733/115615864-7cb9c480-a2bd-11eb-8366-a456ef77a645.png)


Lastly, as the assignment was not focused on UI I made only some minor updates to some starter code to have a front end to work with, however no time was spent optmizing the look and feel (which is why its pretty bare bones for the most part). 

## Usage
This application can be used online or offline to keep a simple record of transactions, so that a total balance / amount transacted can be tracked over time. 

## Installation
To install this application you just need to ensure that you have nodeJS and run the npm i command to get required dependencies. The package.json list which ones were utilized.

## Licenses
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)  
https://opensource.org/licenses/MIT

## Questions
Email me at ryanjohnson9685@gmail.com for more information.

## Credits
For this assignment I utilized class notes and recordings, as well as some MDM and W3 schools resources. I also utilized fairly new docs on indexedDB and service-workers etc availible from google.
