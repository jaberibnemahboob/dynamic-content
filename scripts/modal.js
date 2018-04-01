let product_link = 'http://kea-alt-del.dk/t5/api/product?id=';
let modal_image_path = "http://kea-alt-del.dk/t5/site/imgs/medium/";
let modal = document.querySelector(".modal");

function openModal(id){
    document.querySelector("article.modal").style.display = 'block';
    getDetailsData(product_link,id);
}
document.querySelector(".modal button.close").addEventListener("click",function(){
    document.querySelector("article.modal").style.display = 'none';
});
function getDetailsData(link,id){
    fetch(link+id).then(function(response){
        return response.json();
    }).then(function(json){
        return loadIntoModal(json);
    });
}
function loadIntoModal(product){
    console.log(product);
    modal.querySelector('.item_img').style.backgroundImage = 'url('+modal_image_path + product.image + '-md.jpg'+')';
    modal.querySelector('.item_img').style.backgroundSize = 'cover';
    modal.querySelector('.item_img').style.backgroundPosition = 'center';
    modal.querySelector('.name').textContent = product.name;
    modal.querySelector('.category a').textContent = product.category;
    modal.querySelector('.description span.content').textContent = product.longdescription;
    if(product.discount){
        let newPrice = Math.round((product.price * (1 - product.discount / 100) * 100))/100;
        //1. cross out the old price
        modal.querySelector('.price span.oldprice span').textContent = product.price;
        modal.querySelector('.price span.oldprice').classList.remove('color-info');
        modal.querySelector('.price span.oldprice').classList.add('color-txt');
        modal.querySelector('.price span.oldprice').classList.add("discountprice");
        //2. show the new price
        modal.querySelector('.price span.newprice span').textContent = newPrice;
        modal.querySelector('.price span.newprice').classList.remove('hidden');
    }else{
        modal.querySelector('.price span.oldprice span').textContent = product.price;
    }

    if(product.alcohol){
        modal.querySelector('.alcohol.icon').classList.add("active");
        modal.querySelector('.alcohol.status.icon.notok').classList.remove("active");
        modal.querySelector('.alcohol.status.icon.ok').classList.add("active");
    }else{
        modal.querySelector('.alcohol.status.icon.notok').classList.add("active");
        modal.querySelector('.alcohol.status.icon.ok').classList.remove("active");
    }
    modal.querySelector('.alcohol-data').textContent = product.alcohol + '%';

    if(product.vegetarian){
        modal.querySelector('.vegetarian.icon').classList.add("active");
        modal.querySelector('.vegetarian.status.icon.notok').classList.remove("active");
        modal.querySelector('.vegetarian.status.icon.ok').classList.add("active");
    }else{
        modal.querySelector('.vegetarian.status.icon.notok').classList.add("active");
        modal.querySelector('.vegetarian.status.icon.ok').classList.remove("active");
    }

    if(product.region!=''){
        modal.querySelector('.region.icon').classList.add("active");
        modal.querySelector('.region-data').textContent = product.region;
    }

    if(product.star!=''){
        modal.querySelector('.star.icon').classList.add("active");
        modal.querySelector('.star-data').textContent = product.stars;
    }


    if(product.soldout){modal.querySelector('.soldout').classList.remove("hidden");}

}
