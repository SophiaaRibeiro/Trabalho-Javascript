
const chips = document.querySelectorAll('.chip');
const cards = document.querySelectorAll('.coffee-card');

if (chips.length > 0) {

    chips.forEach(chip => {

        chip.addEventListener('click', () => {

            chips.forEach(btn =>
                btn.classList.remove('active')
            );

            chip.classList.add('active');

            const category =
                chip.dataset.filter;

            cards.forEach(card => {

                const tag =
                    card.dataset.category;

                if (category === 'todos') {

                    card.style.display = 'block';
                    return;

                }

                if (tag === category) {

                    card.style.display = 'block';

                } else {

                    card.style.display = 'none';

                }

            });

        });

    });

}


const searchInput = document.querySelector('.search-wrap input');

if (searchInput) {

    searchInput.addEventListener('input', () => {

        const value = searchInput.value.toLowerCase();

        cards.forEach(card => {

            const coffeeName = card.querySelector('.card-name')
                .textContent
                .toLowerCase();

            if (coffeeName.includes(value)) {

                card.style.display = 'block';

            } else {

                card.style.display = 'none';

            }

        });

    });

}


const orderButtons = document.querySelectorAll('.btn-primary');

if (orderButtons.length > 0) {

    orderButtons.forEach(button => {

        button.addEventListener('click', (event) => {

            const card = button.closest('.coffee-card');

            if (!card) return;

            event.preventDefault();

            const coffeeName =
                card.querySelector('.card-name').textContent;

            const coffeePrice =
                card.querySelector('.card-price').textContent;

            const coffeeImage =
                card.querySelector('.card-img').src;

            const product = {
                name: coffeeName,
                price: coffeePrice,
                image: coffeeImage,
                quantity: 1
            };

            let cart =
                JSON.parse(localStorage.getItem('cart')) || [];

            const existingProduct = cart.find(
                item => item.name === product.name
            );

            if (existingProduct) {

                existingProduct.quantity++;

            } else {

                cart.push(product);

            }

            localStorage.setItem(
                'cart',
                JSON.stringify(cart)
            );

            showToast('Produto adicionado ao carrinho ☕');



        });

    });

}


const favButtons =
    document.querySelectorAll('.btn-fav');


let favorites =
    JSON.parse(
        localStorage.getItem('favorites')
    ) || [];



favButtons.forEach(button => {

    const card =
        button.closest('.coffee-card');

    if (!card) return;

    const coffeeName =
        card.querySelector('.card-name')
        .textContent;

    const icon =
        button.querySelector('i');

    const exists = favorites.find(
        item => item.name === coffeeName
    );

    if (exists) {

        button.classList.add('active');

        icon.classList.remove('fa-regular');
        icon.classList.add('fa-solid');

    }

});



if (favButtons.length > 0) {

    favButtons.forEach(button => {

        button.addEventListener('click', () => {

            const usuarioLogado = getUsuarioLogado ? getUsuarioLogado() : null;

            if (!usuarioLogado) {
                showToast('Faça login para favoritar ☕');
                setTimeout(() => {
                    window.location.href = '../pages/login.html';
                }, 1500);
                return;
            }

            const icon =
                button.querySelector('i');

            button.classList.toggle('active');

            const card =
                button.closest('.coffee-card');

            if (!card) return;

            const product = {

                name:
                    card.querySelector('.card-name')
                    .textContent,

                price:
                    card.querySelector('.card-price')
                    .textContent,

                image:
                    card.querySelector('.card-img')
                    .src,

                tag:
                    card.querySelector('.tag')
                    .textContent,

                desc:
                    card.querySelector('.card-desc')
                    .textContent,

                tagClass:
                    card.querySelector('.tag')
                    .classList[1]

            };

            if (button.classList.contains('active')) {

                icon.classList.remove('fa-regular');
                icon.classList.add('fa-solid');

                const exists = favorites.find(
                    item => item.name === product.name
                );

                if (!exists) {

                    favorites.push(product);

                }

                showToast(
                    'Adicionado aos favoritos ❤️'
                );

            }


            else {

                icon.classList.remove('fa-solid');
                icon.classList.add('fa-regular');

                favorites = favorites.filter(
                    item => item.name !== product.name
                );

                showToast(
                    'Removido dos favoritos 💔'
                );

            }

            localStorage.setItem(
                'favorites',
                JSON.stringify(favorites)
            );

        });

    });

}


function showToast(message) {

    const container =
        document.getElementById('toast-container');

    if (!container) return;

    const toast = document.createElement('div');

    toast.classList.add('toast');

    toast.textContent = message;

    container.appendChild(toast);

    setTimeout(() => {

        toast.remove();

    }, 3000);

}


const productModal =
  document.getElementById("productModal");

const modalName =
  document.getElementById("modalProductName");

const modalDesc =
  document.getElementById("modalProductDesc");

const modalPrice =
  document.getElementById("modalProductPrice");

const modalTag =
  document.getElementById("modalProductTag");

const mainImage =
  document.getElementById("mainImage");

let currentProduct = null;

    function openProductModal(card){

    productModal.classList.add("show");

    const name =
        card.querySelector(".card-name").textContent;

    const desc =
        card.querySelector(".card-desc").textContent;

    const price =
        card.querySelector(".card-price").textContent;

    const image =
        card.querySelector(".card-img").src;

    const tag =
        card.querySelector(".tag").textContent;

    const tagClass =
        card.querySelector(".tag").classList[1];

    modalName.textContent = name;

    modalDesc.textContent = desc;

    modalPrice.textContent = price;

    modalTag.textContent = tag;

    modalTag.className = `tag ${tagClass}`;

    mainImage.src = image;

    const img1 = card.dataset.img1;
    const img2 = card.dataset.img2;
    const img3 = card.dataset.img3;

    const thumbsContainer =
    document.querySelector(".product-thumbs");

    thumbsContainer.innerHTML = `
        <img src="${img1}" class="thumb active">
        <img src="${img2}" class="thumb">
        <img src="${img3}" class="thumb">`;

    const thumbs =
    document.querySelectorAll('.thumb');

    thumbs.forEach(thumb => {

        thumb.addEventListener('click', () => {

            mainImage.src = thumb.src;

            thumbs.forEach(t =>
                t.classList.remove('active')
            );

            thumb.classList.add('active');

        });

    });
    

    quantity = 1;

    quantityValue.textContent = 1;

    currentPrice =
        parseInt(price.replace("R$", "").trim());

        basePrice = currentPrice;

    
    currentProduct = {
        name,
        desc,
        image,
        tag,
        price: currentPrice
    };

    }

function closeProductModal() {

  productModal.classList.remove("show");
  resetSizeSelection();

}





const sizeButtons =
  document.querySelectorAll('.size-btn');

const productPrice =
  document.querySelector('.product-price');

let currentPrice = 14;
let basePrice = 14;

sizeButtons.forEach(button => {

  button.addEventListener('click', () => {

    sizeButtons.forEach(btn =>
      btn.classList.remove('active')
    );

    button.classList.add('active');

    const size =
      button.textContent.trim().toLowerCase();

    if(size === 'mini'){

      currentPrice = basePrice;

    }

    if(size === 'médio'){

      currentPrice = basePrice + 2;

    }

    if(size === 'grande'){

      currentPrice = basePrice + 6;

    }

    updateTotalPrice();

  });

});

function resetSizeSelection() {
  sizeButtons.forEach(btn => btn.classList.remove('active'));

  sizeButtons[0].classList.add('active');

  currentPrice = basePrice;
  updateTotalPrice();
}





let quantity = 1;

const quantityValue =
  document.getElementById('quantityValue');

function updateTotalPrice(){

  const total = currentPrice * quantity;

  productPrice.textContent =
    `R$ ${total}`;

}

document.getElementById('increaseQty')
.addEventListener('click', () => {

  quantity++;

  quantityValue.textContent = quantity;

  updateTotalPrice();

});

document.getElementById('decreaseQty')
.addEventListener('click', () => {

  if(quantity > 1){

    quantity--;

    quantityValue.textContent = quantity;

    updateTotalPrice();

  }

});

const addToCartModal =
  document.getElementById('addToCartModal');

if(addToCartModal){

  addToCartModal.addEventListener('click', () => {

    const product = {

        name: currentProduct.name,

        price: `R$ ${currentPrice}`,

        image: currentProduct.image,

        quantity: quantity

    };

    let cart =
      JSON.parse(localStorage.getItem('cart')) || [];

    cart.push(product);

    localStorage.setItem(
      'cart',
      JSON.stringify(cart)
    );

    showToast('Produto adicionado ao carrinho ☕');

closeProductModal();

  });

}
