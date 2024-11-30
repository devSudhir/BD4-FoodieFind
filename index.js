const express = require('express');
const { resolve } = require('path');

const cors = require('cors');
const { open } = require('sqlite');
const sqlite3 = require('sqlite3').verbose();


const app = express();
app.use(cors());
app.use(express.json());
const port = 3010;

//const dbPath = resolve(__dirname, "./BD4_Assignment1/database.sqlite");
// console.log("dbPath", dbPath)


let db;
(async () => {
  db = await open({
    filename: resolve(__dirname, "./BD4_Assignment1/database.sqlite"),
    driver: sqlite3.Database,
  });
})();

app.use(express.static('static'));

app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'pages/index.html'));
});

async function fetchAllRestaurants() {
  const query = 'Select * from restaurants';
  const response = await db.all(query, []);
  return response;
}

app.get('/restaurants', async (req, res) => {
  try {
    const result = await fetchAllRestaurants();
    if (result.length === 0) {
      res.status(404).json({ error: 'Restaurants not found!' });
    } else {
      res.status(200).json({ restaurants: result });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

async function fetchRestaurantById(id) {
  const query = 'Select * from restaurants where id = ?';
  const response = await db.get(query, [id]);
  return response;
}

app.get('/restaurants/details/:restaurantId', async (req, res) => {
  const restaurantId = req.params.restaurantId;
  try {
    const result = await fetchRestaurantById(restaurantId);
    if (result == undefined) {
      res.status(404).json({ error: 'Restaurant not found!' });
    } else {
      res.status(200).json({ restaurant: result });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

async function filterRestaurantsByCuisine(cuisine) {
  const query = 'Select * from restaurants where cuisine = ?';
  const response = await db.all(query, [cuisine]);
  return response;
}

app.get('/restaurants/cuisine/:cuisine', async (req, res) => {
  const cuisine = req.params.cuisine;
  try {
    const result = await filterRestaurantsByCuisine(cuisine);
    if (result.length === 0) {
      res.status(404).json({ error: 'Restaurant not found with cuisine!' });
    } else {
      res.status(200).json({ restaurants: result });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

async function filterRestaurantsByIsVegAndHasOutdoorSeatingAndIsLuxury(
  isVeg,
  hasOutdoorSeating,
  isLuxury
) {
  const query =
    'Select * from restaurants where isVeg = ? and hasOutdoorSeating = ? and isLuxury = ?';
  const response = await db.all(query, [isVeg, hasOutdoorSeating, isLuxury]);
  return response;
}

app.get('/restaurants/filter', async (req, res) => {
  const { isVeg, hasOutdoorSeating, isLuxury } = req.query;
  try {
    const result =
      await filterRestaurantsByIsVegAndHasOutdoorSeatingAndIsLuxury(
        isVeg,
        hasOutdoorSeating,
        isLuxury
      );
    if (result.length === 0) {
      res
        .status(404)
        .json({ error: 'Restaurant not found with these filters!' });
    } else {
      res.status(200).json({ restaurants: result });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

async function fetchRestaurantsSorByRatingDesc() {
  const query = 'Select * from restaurants order by rating desc';
  const response = await db.all(query, []);
  return response;
}

app.get('/restaurants/sort-by-rating', async (req, res) => {
  try {
    const result = await fetchRestaurantsSorByRatingDesc();
    if (result.length === 0) {
      res.status(404).json({ error: 'Restaurants not found!' });
    } else {
      res.status(200).json({ restaurants: result });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

async function fetchAllDishes() {
  const query = 'Select * from dishes';
  const response = await db.all(query, []);
  return response;
}

app.get('/dishes', async (req, res) => {
  try {
    const result = await fetchAllDishes();
    if (result.length === 0) {
      res.status(404).json({ error: 'dishes not found!' });
    } else {
      res.status(200).json({ dishes: result });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

async function fetchDishById(id) {
  const query = 'Select * from dishes where id = ?';
  const response = await db.get(query, [id]);
  return response;
}

app.get('/dishes/details/:dishId', async (req, res) => {
  const dishId = req.params.dishId;
  try {
    const result = await fetchDishById(dishId);
    if (result == undefined) {
      res.status(404).json({ error: 'dish not found!' });
    } else {
      res.status(200).json({ dish: result });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

async function filterDishesBasedOnVegOrNonVeg(isVeg) {
  const query = 'Select * from dishes where isVeg = ?';
  const response = await db.all(query, [isVeg]);
  return response;
}

app.get('/dishes/filter', async (req, res) => {
  const isVeg = req.query.isVeg;
  try {
    const result = await filterDishesBasedOnVegOrNonVeg(isVeg);
    if (result.length === 0) {
      res.status(404).json({ error: 'dishes not found!' });
    } else {
      res.status(200).json({ dishes: result });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

async function getDishesSortedByPriceAsc() {
  const query = 'Select * from dishes order by price';
  const response = await db.all(query, []);
  return response;
}

app.get('/dishes/sort-by-price', async (req, res) => {
  try {
    const result = await getDishesSortedByPriceAsc();
    if (result.length === 0) {
      res.status(404).json({ error: 'dishes not found!' });
    } else {
      res.status(200).json({ dishes: result });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
