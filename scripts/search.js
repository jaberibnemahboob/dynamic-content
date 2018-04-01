let searchbox = document.querySelector("input[name='search']");
let query = '';
function submitSearchForm(){
    query = searchbox.value;
    setTimeout(search(query),500);
    return false;
}
function search(q){
    query = q;
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

        if(q.toLowerCase()!="alcohol" && q.toLowerCase()!="discount" && q.toLowerCase()!="vegetarian" && q.toLowerCase() != "soldout" && q.toLowerCase() != "sold out" && q.toLowerCase() != "sold") {
            document.querySelector(".recipeHeader span").textContent = "Recipes: Search By (" + q.charAt(0).toUpperCase() + q.slice(1) + ")";
        }
        else {
            document.querySelector(".recipeHeader span").textContent = "Recipes: Filter By (" + q.charAt(0).toUpperCase() + q.slice(1) + ")";
        }
        allproducts.forEach(search_hide);
        allproducts.forEach(search_product);
    }, 1000);
}
function search_product(product){
    for(key in product){
        if(typeof product[key] === 'string'){
            if(product[key].toLowerCase().indexOf(query.toLowerCase()) != -1){
                search_show(product);
                break;
            }
        }else if(typeof product[key] === 'number' && key=='alcohol' && query.length > 3 && 'alcohol'.indexOf(query.toLocaleLowerCase()) != -1){
            if(product[key]>0){
                search_show(product);
                break;
            }
        }else if(typeof product[key] === 'number' && key=='discount' && query.length > 3 && 'discount'.indexOf(query.toLocaleLowerCase()) != -1){
            if(product[key]>0){
                search_show(product);
                break;
            }
        }else if(typeof product[key] === 'boolean' && key=='vegetarian' && query.length > 3 && 'vegetarian'.indexOf(query.toLocaleLowerCase()) != -1){
            if(product[key]){
                search_show(product);
                break;
            }
        }else if(typeof product[key] === 'boolean' && (key=='soldout' || key=='sold out' || key=='sold') && query.length > 3 && 'soldout'.indexOf(query.toLocaleLowerCase()) != -1){
            if(product[key]){
                search_show(product);
                break;
            }
        }
    }
}
function search_show(product){
    document.querySelector('section.regular_items .items article.item-'+product.id).classList.remove("hidden");
}
function search_hide(product){
    document.querySelector('section.regular_items .items article.item-'+product.id).classList.add("hidden");

}
