let productlist_link = "https://kea-alt-del.dk/t5/api/productlist";
let image_path = "https://kea-alt-del.dk/t5/site/imgs/small/";
let template = document.querySelector('.product_template').content;
let recipe_of_d_week = [];
let allproducts = [];
let orderby_query = '';
let initialFilterCalled = false;
let lastAddingCategory = '';
let isFirstProduct = false;


function getData(link,q){
    fetch(link).then(function(response){
        return response.json();
    }).then(function(json){
        allproducts = json;
        json = reorder(json, q);
        console.log(json);
        return show(json);
    });
}

function show(json){
    lastAddingCategory = '';
    removeAllFromRegular();
    removeAllFromFeatured();
    isFirstProduct = true;
    json.forEach(addItemToRegular);

    let count = 2;
    getRecipeOfDWeek(json,count).forEach(addItemToFeatured);

    setTimeout(function(){
        if(initialFilterCalled==false) initial_filter();
        initialFilterCalled = true;
    },1000);
}

function addItemToRegular(product){
    addItemToSection(product, 'section.regular_items .items');
}

function removeAllFromRegular(){
    document.querySelector('section.regular_items .items').innerHTML = '';
}

function addItemToFeatured(product){
    addItemToSection(product, 'section.featured_items .items');
}

function removeAllFromFeatured(){
    document.querySelector('section.featured_items .items').innerHTML = '';
}

function addItemToSection(product, secElem){
    //console.log(product);
    if(secElem == 'section.regular_items .items'){
        if(isFirstProduct){
            document.querySelectorAll('section.regular_items .categoryHeader').forEach(function(elem){
                elem.parentNode.removeChild(elem);
            });
            document.querySelectorAll('section.regular_items .items').forEach(function(elem){
                elem.parentNode.removeChild(elem);
            });
        }


        if(orderby_query == 'category' && lastAddingCategory.toLowerCase()!=product.category.toLowerCase()){
            console.log(product.category + ' => ' + lastAddingCategory);
            lastAddingCategory = product.category;
            let c = product.category;
            console.log(product.category + ' => ' + lastAddingCategory + ' => '+product.name);

            let h = document.createElement("header");
            h.classList.add("categoryHeader");
            h.innerHTML = '<h3>'+"Category: " + c.charAt(0).toUpperCase() + c.slice(1)+'<h3>';
            document.querySelector('section.regular_items').appendChild(h);

            let i = document.createElement("div");
            i.classList.add('items');
            i.classList.add('categoryItems');
            document.querySelector('section.regular_items').appendChild(i);
            isFirstProduct = false;
        }else if(isFirstProduct){
            let i = document.createElement("div");
            i.classList.add('items');
            document.querySelector('section.regular_items').appendChild(i);
            isFirstProduct = false;
        }
        section = document.querySelector(secElem + ':last-child');
    }else section = document.querySelector(secElem);


    let clone = template.cloneNode(true);
    clone.querySelector('.item_img').style.backgroundImage = 'url('+image_path + product.image + '-sm.jpg'+')';
    clone.querySelector('.item_img').style.backgroundSize = 'cover';
    clone.querySelector('.item_img').style.backgroundPosition = 'center';
    clone.querySelector('.name').textContent = product.name;
    clone.querySelector('.category a').textContent = product.category;
    clone.querySelector('.category a').href = '#'+product.category;
    clone.querySelector('.category a').addEventListener("click",function(){
        filter_products(product.category);
    });
    clone.querySelector('.description span.content').textContent = product.shortdescription;
    if(secElem == 'section.featured_items .items') clone.querySelector('.description').classList.remove('hidden');


    if(product.alcohol){clone.querySelector('.alcohol').classList.add("active");}
    if(product.vegetarian){clone.querySelector('.vegetarian').classList.add("active");}
    if(product.soldout){clone.querySelector('.soldout').classList.remove("hidden");}

    if(product.discount){
        let newPrice = Math.round((product.price * (1 - product.discount / 100) * 100))/100;
        //1. cross out the old price
        clone.querySelector('.price span.oldprice span').textContent = product.price;
        clone.querySelector('.price span.oldprice').classList.remove('color-info');
        clone.querySelector('.price span.oldprice').classList.add('color-txt');
        clone.querySelector('.price span.oldprice').classList.add("discountprice");
        //2. show the new price
        clone.querySelector('.price span.newprice span').textContent = newPrice;
        clone.querySelector('.price span.newprice').classList.remove('hidden');
    }else{
        clone.querySelector('.price span.oldprice span').textContent = product.price;
    }


    clone.querySelector('.details-button').id = product.id;


    clone.querySelector("article").classList.add(product.category);
    clone.querySelector("article").classList.add('item-'+product.id);
    if(product.discount) clone.querySelector("article").classList.add('discount');
    section.appendChild(clone);
}

function getRandomInteger(max, min){
    return Math.floor(Math.random() * (max - min)) + Math.ceil(min);
}

function getRecipeOfDWeek(recipeList, count){
    for(var i=0; i<count; i++){
        recipe_of_d_week[i] = recipeList[getRandomInteger(recipeList.length,1)];
    }
    return recipe_of_d_week;
}

function filter_products(category){

    if(orderby_query == 'category'){
        orderby_query = '';
        document.querySelectorAll('section.regular_items .categoryHeader').forEach(function(elem){
            elem.parentNode.removeChild(elem);
        });
        document.querySelectorAll('section.regular_items .categoryItems').forEach(function(elem){
            elem.parentNode.removeChild(elem);
        });

        let i = document.createElement("div");
        i.classList.add('items');
        document.querySelector('section.regular_items').appendChild(i);

        getData(productlist_link,'');
    }

    setTimeout(function(){
        document.querySelector(".recipeHeader span").textContent = "Recipes: " + category.charAt(0).toUpperCase() + category.slice(1) + " Courses";
        document.querySelectorAll('section.regular_items .items article').forEach(filter_hide);
        document.querySelectorAll('section.regular_items .items article:not(.'+category+')').forEach(filter_show);
    },1000);
}

function filter_show(product){
    product.classList.add('hidden');
}

function filter_hide(product){
    product.classList.remove('hidden');
}

function initial_filter(){
    let url = window.location.href;
    if (url.indexOf('#') > -1){
        let urlSegment = url.split("#");
        filter_products(urlSegment[1]);
    }
}

function reorder(products, q){
    let sproducts = [];
    let i = 0;
    let j = 0;
    if(q=='') return products;
    else{
        switch(q){
            case 'category':
                //get all categories first
                let categories = [];
                let catStr = '';
                sproducts = new Array();
                for(i=0;i<products.length;i++){
                    if(catStr.toLowerCase().indexOf('++'+products[i].category.toLowerCase()+'++') == -1){
                        categories.push(products[i].category);
                        catStr = catStr + '++'+products[i].category.toLowerCase()+'++';
                    }
                }
                categories.sort();
                for(i=0;i<categories.length;i++){
                    for(j=0;j<products.length;j++){
                        if(products[j].category == categories[i]) {
                            sproducts.push(products[j]);
                        }
                    }
                }
                break;
            case 'price':
                let nprice = 0;
                let prices = [];
                let priceStr = '';
                sproducts = new Array();
                for(i=0;i<products.length;i++){
                    if(products[i].discount > 0) nprice = Math.round(products[i].price * (1 - products[i].discount / 100));
                    else nprice = products[i].price;
                    console.log(nprice);
                    products[i].reduced_price = nprice;
                    if(priceStr.toLowerCase().indexOf('++'+nprice+'++') == -1){
                        prices.push(nprice);
                        priceStr = priceStr + '++'+nprice+'++';
                    }
                }
                prices.sort(function(a, b){return a-b});
                console.log(prices);
                for(i=0;i<prices.length;i++){
                    for(j=0;j<products.length;j++){
                        if(products[j].reduced_price == prices[i]){
                            sproducts.push(products[j]);
                        }
                    }
                }
                break;
            default:
                break;
        }
        return sproducts;
    }
}

function orderby(q){
    orderby_query = q;
    document.querySelector(".recipeHeader span").textContent = "Recipes: Order By (" + q.charAt(0).toUpperCase() + q.slice(1) + ")";
    getData(productlist_link,q);
}


orderby('category');
