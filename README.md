# gt_fsf_hw18_budgetTracker
This assignment introduced us to PWA concepts and asked us to build a site based on related concepts and libraries. As the project was focused mainly on PWA concepts I kept with a bare minimum for UI. 
## Table of Contents
1. [Description](#Description)
3. [Usage](#Usage)
4. [Installation](#Installation)
5. [Licenses](#Licenses)
6. [Questions](#Questions)
7. [Credits](#Credits)

## Description
**Deployed App (Heroku)**      
https://warm-temple-75134.herokuapp.com/

**Walkthrough Video**       
Below is a link to a walkthrough video hosted on my google drive (for data size purposes). Here I demo the app and walk through the methods I used to achieve the assignment requirements. 
  https://drive.google.com/file/d/1OtZyX5OPfYWOHvWXTx3zRew7b3GJb8D9/view?usp=sharing


**Dashboard Snapshot** 
![image](https://user-images.githubusercontent.com/72420733/115616104-c9050480-a2bd-11eb-882d-ea164d7c11a3.png)



This assignment required us to build upon our knowledge of mongoDB, indexedDB, and other aspects of a Progressive Web Application (manifest, service worker etc) to complete a transaction tracking application that can be used offline. 

It takes an offline first approach to server resources from the cache if availible. A user is able to see transaction totals, as well as enter new transactions and see changes to the chart adn the total value even if they have no internet connection. The user can also download this so that it acts more closley to a native application from a user experience perspective.

In terms of displaying the page and allowing for charts to render, button presses to work etc even if a user if offline, I cached the assets needed to do this using code within my service-worker js script. This is why users can load the latest information and interface to it with out being online. If they try and create new transactions while offline, they are able to do this. First their transaction is added to a running array for transactions (once its created). Then their transactions are held in an indexedDB I established within a "pending" object store. Every time the application is run there is a check for if the application is online. If the application is detected to be back online, it will then check the indexedDB and if pending transactions exist I bulk update them to my mongo server and then clear out the records kept in my indexed db as they are no longer pending, and are now synced with the master db. It will then pull back the latest data from the DB to display in the table and chart view. 

This assignment was a good introduction to utilization of PWA concepts, and various ways you can provide users with functionality without having to rely on a connectoin to your server. In additoin, I was able to further build upon skills I learned in the class to diagnose a bug and make changes to the starter code so that it works to my intent. My trouble shooting process for this and solution documentation can be seen below:

![image](https://user-images.githubusercontent.com/72420733/115615864-7cb9c480-a2bd-11eb-8366-a456ef77a645.png)

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
