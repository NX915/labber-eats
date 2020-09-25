# Labber Eats

## Introduction
Labber Eats offers a single page experience to both consumers and restaurant owners. This project was made using HTML, JS, JQuery, AJAX on the client-side and Node, Express, Sass and PG on the server-side.

This project was made during Lighthouse Labs Bootcamp as a group project to practice full-stack development skills.

## Getting Started

1. Create the `.env` by using `.env.example` as a reference: `cp .env.example .env`
2. Update the .env file with your correct local information 
  - username: `labber` 
  - password: `labber` 
  - database: `midterm`
3. Install dependencies: `npm i`
4. Fix to binaries for sass: `npm rebuild node-sass`
5. Reset database: `npm run db:reset`
  - Check the db folder to see what gets created and seeded in the SDB
7. Run the server: `npm run local`
  - Note: nodemon is used, so you should not have to restart your server
8. Visit `http://localhost:8080/`

## Tech Stack

- Node 10.x or above
- NPM 5.x or above
- PG 6.x
- jQuery
- Sass
- Express
- EJS
- Twilio
- git

## Acknowledgment

To populate the menu, we used photos taken from [unsplash](https://unsplash.com/).
