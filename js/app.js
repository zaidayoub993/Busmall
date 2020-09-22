'use strict';

/********************************************************************************
*         Global variables                                                      *
********************************************************************************/
//Element node variables for each image displayed
var product1 = document.getElementById('product1');
var product2 = document.getElementById('product2');
var product3 = document.getElementById('product3');

//Element nodes for product names
var prodName1 = document.getElementById('prodName1');
var prodName2 = document.getElementById('prodName2');
var prodName3 = document.getElementById('prodName3');

//Element node variables for form and table
var productForm = document.getElementById('productSelector');
var productChart = document.getElementById('productChart');
var productVoteResults = document.getElementById('productVoteResults');

//Arrays for charting
var chartProductArray = [];
var chartPercentagesArray = [];
// var chartLikesArray = [];
// var chartDisplaysArray = [];
hideChart();

/********************************************************************************
*         Product Constructor                                                   *
********************************************************************************/
//Arrays for Constructor
Product.productArray = [];
Product.lastRoundArray = [];
Product.selectedIndexArray = [];
Product.voteCount = 0;

//constructor for Product objects
function Product(name, src){
  this.name = name;
  this.src = src;

  this.likesCount = 0;
  this.displayCount = 0;
  this.percentageLikes = 0;

  Product.productArray.push(this);
};

/********************************************************************************
*         Product helper functions                                              *
********************************************************************************/

//Create random number by Product array range
Product.randomNumber = function(){
  var randomNumber = Math.floor(Math.random() * this.productArray.length);
  return randomNumber;
};

//Chooses three random numbers for selecting images
Product.chooseThreeImages = function(){
  //find first random number
  do {
    Product.indexNumber1 = Product.randomNumber();
  } while (Product.lastRoundArray.includes(Product.indexNumber1));

  //find second random number
  do {
    Product.indexNumber2 = Product.randomNumber();
  } while (Product.indexNumber2 === Product.indexNumber1 || Product.lastRoundArray.includes(Product.indexNumber2));

  //find third random number
  do{
    Product.indexNumber3 = Product.randomNumber();
  } while (Product.indexNumber3 === Product.indexNumber2 || Product.indexNumber3 === Product.indexNumber1 || Product.lastRoundArray.includes(Product.indexNumber3));

  Product.lastRoundArray = [Product.indexNumber1, Product.indexNumber2, Product.indexNumber3];
};

//function in constructer to change image source of images on the site and adds displayCount
Product.renderProducts = function(){
  Product.chooseThreeImages();

  product1.src = Product.productArray[Product.indexNumber1].src;
  product2.src = Product.productArray[Product.indexNumber2].src;
  product3.src = Product.productArray[Product.indexNumber3].src;
  Product.selectedIndexArray = [Product.indexNumber1, Product.indexNumber2, Product.indexNumber3];

  prodName1.innerText = Product.productArray[Product.indexNumber1].name;
  prodName2.innerText = Product.productArray[Product.indexNumber2].name;
  prodName3.innerText = Product.productArray[Product.indexNumber3].name;

  Product.productArray[Product.indexNumber1].displayCount++;
  Product.productArray[Product.indexNumber2].displayCount++;
  Product.productArray[Product.indexNumber3].displayCount++;
};

//Function in constructer to calculate percentage clicked
Product.calcPercent = function (){
  for (var product in Product.productArray){
    Product.productArray[product].percentageLikes = parseFloat(100 * (Product.productArray[product].likesCount / Product.productArray[product].displayCount));
  }
};

/********************************************************************************
 *         Event Listeners and Handlers                                          *
 ********************************************************************************/
productForm.addEventListener('submit', handleVoteSubmit);

function handleVoteSubmit(event) {
  event.preventDefault();
  var productForm = document.getElementsByName('productVote');

  for (var i = 0 ; i < productForm.length; i++){
    if (productForm[i].checked) {
      var selectedIndex = Product.selectedIndexArray[productForm[i].dataset.index];
      Product.productArray[selectedIndex].likesCount++;
    }
  }
  Product.voteCount++;

  if (Product.voteCount === 25){
    displayResults();
    createChartArrays();
    drawChart();
  } else {
    Product.renderProducts();
  }
}

/********************************************************************************
 *         Changing Displays                                                     *
 ********************************************************************************/

//Removes voting and displays results
var displayResults = function() {
  //removes form and disables listener
  productForm.style.display = 'none';
  productChart.style.display = 'inline';
  productForm.removeEventListener(event, handleVoteSubmit);

  Product.calcPercent();

  createHeaderRow();

  var trEl = document.createElement('tr');
  var thEl = document.createElement('th');
  var tdEl = document.createElement('td');
  for (var i = 0; i < Product.productArray.length; i++){
    trEl = document.createElement('tr');

    thEl = document.createElement('th');
    thEl.textContent = Product.productArray[i].name;
    trEl.appendChild(thEl);

    tdEl = document.createElement('td');
    tdEl.textContent = Product.productArray[i].likesCount;
    trEl.appendChild(tdEl);

    tdEl = document.createElement('td');
    tdEl.textContent = Product.productArray[i].displayCount;
    trEl.appendChild(tdEl);

    productVoteResults.appendChild(trEl);
  }

  productVoteResults.style.display = 'inline';
};

var createHeaderRow = function(){
  var trEl = document.createElement('tr');

  var thEl = document.createElement('th');
  thEl.textContent = 'Product Name';
  trEl.appendChild(thEl);

  thEl = document.createElement('th');
  thEl.textContent = 'Number of Likes';
  trEl.appendChild(thEl);

  thEl = document.createElement('th');
  thEl.textContent = 'Times displayed';
  trEl.appendChild(thEl);

  productVoteResults.appendChild(trEl);
};

/********************************************************************************
*         Charting                                                              *
********************************************************************************/
var createChartArrays = function(){
  for (var product in Product.productArray){
    chartProductArray.push(Product.productArray[product].name);
    chartPercentagesArray.push(Product.productArray[product].percentageLikes);
    console.log(chartPercentagesArray);
    //future potential charting
    // chartLikesArray.push(Product.productArray[product].likesCount);
    // chartDisplaysArray.push(Product.productArray[product].displayCount);
  }
};

var chartColors = [
  '#FFCCCC', '#FFEECC', '#FFDDCC', '#FFCCCC', '#FFBBCC', '#FFAACC', '#CCFFFF', '#CCEEFF', '#CCDDFF', '#CCCCFF', '#CCBBFF', '#CCAAFF', '#BFFCC6', '#DBFFD6', '#F3FFE3', '#E7FFAC', '#FFFFD1', '#FFABA1', '#D5AAFF', '#AFF8D8'
];

var data = {
  datasets: [{
    data: chartPercentagesArray,
    backgroundColor: chartColors,
  }],

  labels: chartProductArray
};

function drawChart() {
  var ctx = document.getElementById('productChart').getContext('2d');
  var percentageChart = new Chart (ctx, {
    type:'bar',
    data: data,
  });
  drawChart = true;
  productChart.hidden = false;
};

function hideChart () {
  productChart.hidden = true;
}



/********************************************************************************
 *         Add instances and call functions for running                          *
 ********************************************************************************/
//Add Product instances
new Product('bag', './images/products/bag.jpg');
new Product('banana', './images/products/banana.jpg');
new Product('bathroom', './images/products/bathroom.jpg');
new Product('boots', './images/products/boots.jpg');
new Product('breakfast', './images/products/breakfast.jpg');
new Product('bubblegum', './images/products/bubblegum.jpg');
new Product('chair', './images/products/chair.jpg');
new Product('cthulhu', './images/products/cthulhu.jpg');
new Product('dog-duck', './images/products/dog-duck.jpg');
new Product('dragon', './images/products/dragon.jpg');
new Product('pen', './images/products/pen.jpg');
new Product('pet-sweep', './images/products/pet-sweep.jpg');
new Product('scissors', './images/products/scissors.jpg');
new Product('shark', './images/products/shark.jpg');
new Product('sweep', './images/products/sweep.jpg');
new Product('tauntaun', './images/products/tauntaun.jpg');
new Product('unicorn', './images/products/unicorn.jpg');
new Product('usb', './images/products/usb.gif');
new Product('water-can', './images/products/water-can.jpg');
new Product('wine-glass', './images/products/wine-glass.jpg');
Product.renderProducts();
