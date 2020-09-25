# Labber Eats

## Introduction
Labber Eats offers a single page experience to both consumers and restaurant owners. This project was made using HTML, JS, JQuery, AJAX on the client-side and Node, Express, Sass and PG on the server-side.

This project was made during Lighthouse Labs Bootcamp as a group project to practice full-stack development skills.

### User stories

#### Hungry labber

1. As a hungry labber, I want to be able to browse and select menu items from the restaurant's site because I don't want to spend time ordering on site.

2. As a hungry labber, I want to be able to see the full details of my order (e.g. cost, items, quantities) before checking out so that I can confirm my order and know how much money to bring.

3. As a hungry labber, I want to know that the restaurant received and confirmed my order because I want to ensure that the restaurant will prepare my order.

4. As a hungry labber, I want to know how much time it will take so that I can show up at the right time.

5. As a hungry labber, I want to be able to leave comments to the restaurant (e.g. allergies, omissions/extras).

#### Restaurant

1. As a restaurant owner, I want to know when an order is placed and the details of the order so I can start preparing the order.

2. As a restaurant owner, I want to be able to notify the client whether the order is accepted or declined (e.g. missing ingredients).

3. As a restaurant owner, I want to be able to give an approx. time for when to pick up the order AND when the order is ready so that the client does not have to wait too long once he arrives at the restaurant.


## Final product

### Menu Item
!["Menu item"](https://github.com/NX915/labber-eats/blob/readme/docs/hover-menu-item.gif?raw=true)

### Smartphone navigation
!["Menu item"](https://github.com/NX915/labber-eats/blob/readme/docs/smartphone-demo.gif?raw=true)

### Control navigation
!["Menu item"](https://github.com/NX915/labber-eats/blob/readme/docs/control-navigation.gif?raw=true)

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
