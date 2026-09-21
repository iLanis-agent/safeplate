/* SafePlate engine - restriction filtering logic, pure functions. */
(function (global) {
  'use strict';

  /* Every restriction and the ingredient tags it forbids. Kosher/halal also
     carry combo rules handled in violations(). */
  var RESTRICTIONS = {
    'vegan': { tags: ['meat', 'fish', 'shellfish', 'dairy', 'egg', 'honey'], label: 'Vegan' },
    'vegetarian': { tags: ['meat', 'fish', 'shellfish'], label: 'Vegetarian' },
    'gluten-free': { tags: ['gluten'], label: 'Gluten-free' },
    'nut-free': { tags: ['nuts'], label: 'Nut-free' },
    'dairy-free': { tags: ['dairy'], label: 'Dairy-free' },
    'egg-free': { tags: ['egg'], label: 'Egg-free' },
    'kosher': { tags: ['pork', 'shellfish'], label: 'Kosher' },
    'halal': { tags: ['pork', 'alcohol'], label: 'Halal' },
    'sesame-free': { tags: ['sesame'], label: 'Sesame-free' },
    'soy-free': { tags: ['soy'], label: 'Soy-free' }
  };

  /* The built-in dish bank. tags = ingredients that common restrictions forbid. */
  var DISHES = [
    { name: 'Margherita pizza', course: 'main', tags: ['gluten', 'dairy'] },
    { name: 'Pepperoni pizza', course: 'main', tags: ['gluten', 'dairy', 'meat', 'pork'] },
    { name: 'Grilled salmon', course: 'main', tags: ['fish'] },
    { name: 'Chicken stir-fry', course: 'main', tags: ['meat', 'soy', 'sesame'] },
    { name: 'Beef burger', course: 'main', tags: ['gluten', 'meat'] },
    { name: 'Cheeseburger', course: 'main', tags: ['gluten', 'meat', 'dairy'] },
    { name: 'Falafel in pita', course: 'main', tags: ['gluten', 'sesame'] },
    { name: 'Shakshuka', course: 'main', tags: ['egg'] },
    { name: 'Pad thai', course: 'main', tags: ['egg', 'nuts', 'fish'] },
    { name: 'Sushi rolls', course: 'main', tags: ['fish', 'soy', 'sesame'] },
    { name: 'Veggie sushi', course: 'main', tags: ['soy', 'sesame'] },
    { name: 'Mushroom risotto', course: 'main', tags: ['dairy'] },
    { name: 'Pad see ew', course: 'main', tags: ['meat', 'soy', 'gluten', 'egg'] },
    { name: 'Baked ziti', course: 'main', tags: ['gluten', 'dairy'] },
    { name: 'Chicken schnitzel', course: 'main', tags: ['meat', 'gluten', 'egg'] },
    { name: 'Fish and chips', course: 'main', tags: ['fish', 'gluten'] },
    { name: 'Lamb kebab plate', course: 'main', tags: ['meat'] },
    { name: 'Tofu poke bowl', course: 'main', tags: ['soy', 'sesame'] },
    { name: 'Lentil curry with rice', course: 'main', tags: [] },
    { name: 'Roasted vegetable tray', course: 'side', tags: [] },
    { name: 'Hummus', course: 'side', tags: ['sesame'] },
    { name: 'Greek salad', course: 'side', tags: ['dairy'] },
    { name: 'Caesar salad', course: 'side', tags: ['fish', 'dairy', 'egg'] },
    { name: 'Caprese salad', course: 'side', tags: ['dairy'] },
    { name: 'Tabbouleh', course: 'side', tags: ['gluten'] },
    { name: 'French fries', course: 'side', tags: [] },
    { name: 'Baked potato', course: 'side', tags: [] },
    { name: 'Garden salad', course: 'side', tags: [] },
    { name: 'Coleslaw', course: 'side', tags: ['egg'] },
    { name: 'Fruit platter', course: 'dessert', tags: [] },
    { name: 'Apple pie', course: 'dessert', tags: ['gluten', 'dairy', 'egg'] },
    { name: 'Chocolate mousse', course: 'dessert', tags: ['dairy', 'egg'] },
    { name: 'Fruit sorbet', course: 'dessert', tags: [] },
    { name: 'Baklava', course: 'dessert', tags: ['nuts', 'gluten', 'honey'] },
    { name: 'Panna cotta', course: 'dessert', tags: ['dairy'] },
    { name: 'Rice pudding', course: 'dessert', tags: ['dairy'] },
    { name: 'Banana bread', course: 'dessert', tags: ['gluten', 'egg', 'nuts'] },
    { name: 'Dark chocolate bark', course: 'dessert', tags: ['nuts'] },
    { name: 'Tiramisu', course: 'dessert', tags: ['gluten', 'dairy', 'egg', 'alcohol'] }
  ];

  /* Which restrictions does this dish violate? Kosher's meat+dairy combo rule lives here. */
  function violations(dish, restrictions) {
    var out = [];
    for (var i = 0; i < restrictions.length; i++) {
      var r = RESTRICTIONS[restrictions[i]];
      if (!r) continue;
      var hit = false;
      for (var t = 0; t < r.tags.length; t++) {
        if (dish.tags.indexOf(r.tags[t]) !== -1) { hit = true; break; }
      }
      if (!hit && restrictions[i] === 'kosher') {
        if (dish.tags.indexOf('meat') !== -1 && dish.tags.indexOf('dairy') !== -1) hit = true;
      }
      if (hit) out.push(restrictions[i]);
    }
    return out;
  }

  function dishSafe(dish, restrictions) {
    return violations(dish, restrictions).length === 0;
  }

  /* Dishes everyone can eat: union of all guests' restrictions. */
  function filterDishes(dishes, restrictions) {
    var out = [];
    for (var i = 0; i < dishes.length; i++) {
      if (dishSafe(dishes[i], restrictions)) out.push(dishes[i]);
    }
    return out;
  }

  /* Near misses: dishes blocked by exactly one restriction (swappable ideas). */
  function nearMisses(dishes, restrictions) {
    var out = [];
    for (var i = 0; i < dishes.length; i++) {
      var v = violations(dishes[i], restrictions);
      if (v.length === 1) out.push({ dish: dishes[i], blockedBy: v[0] });
    }
    return out;
  }

  var api = { RESTRICTIONS: RESTRICTIONS, DISHES: DISHES, violations: violations, dishSafe: dishSafe, filterDishes: filterDishes, nearMisses: nearMisses };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else global.SafePlate = api;
})(typeof window !== 'undefined' ? window : globalThis);
