This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
And with help of [this article by Christian Sepulveda](https://medium.freecodecamp.org/building-an-electron-application-with-create-react-app-97945861647c).

## Project Purpose
The goal of BudgetPro is to streamline my own budgeting process which is currently done in a series of counter-intuitive spreadsheets.  I have found existing SaaS budgeting systems (Mint, Cleo, YNAB, etc.) unsatisfactory for many reasons including:

### 1. Privacy concerns
are they selling my data?  Do I really want to distribute my financial data over more parts of internet than I already do?
#### How does BudgetPro address this?
BudgetPro will never request access to your bank or credit accounts, you are responsible for downloading .csv files of your transactions and importing them into a database hosted on your own machine.  BudgetPro is a Desktop App (using Electron) and is not a Wep Application, does not operate on the internet, and will never initiate a connection with any remote servers.

### 2. Coercive categorization
I want complete control over how transactions are attributed to different usages.  Sometimes Uber is for entertainment and sometimes it's for travel, and when things are auto-categorized, this is going to get missed.
#### How does BudgetPro address this?
In the beginning, every transaction will be uncategorized, as time goes on and you select your desired budget category for each transaction, you have the option to make a default category for that vendor, or leave it open.  Either way, it will always be easy to recategorize individual transactions as necessary and we will suggest categories based on your behavior only.

### 3. End of month confusion 
What happens to overspent and underspent categories at the end of the month? What if I made more/less money than I expected? Where does that go? 
#### How does BudgetPro address this?
My budgeting style is all about the idea of creating 'funds' for each of your financial responsibilities that carry over month to month, or can even impact how other funds receive money for the next month.  Want the money you don't spend on groceries in June to go towards Entertainment in July?  This dispursement is part of the basic structure of your budget so that you know where every penny is supposed to be.

## Project Goals/Roadmap

- [x] Create robust database structure for creating relationships between transactions, months, categories and budgets

- [x] Transaction category assignment

- [ ] Vendor default category assignment

- [ ] Monthly Budget Overview Page

- [x] Budget Creation Page

- [ ] Monthly close-out

- [ ] Monthly in-flow

- [ ] Vendor category suggestions

- [ ] Trends page (with suggestions on how budget may be adjusted)

- [ ] Support upload via CSV of transactions in-app

## To run project
run npm install, duh

make sure you have mysql installed globally, and the connection in /mainProcess/database.js is correct and initialize the schema present in that directory

In the project directory, run:

### `npm run start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser, but you will get critical errors, because of funny electron things.

Next run:

### `npm run electron .`

This will start electron and open a Desktop window porting the webpacked content of http://localhost:3000.  It will also create a connection with a local mysql database which can be configured in ./src/mainProcess/database.js
