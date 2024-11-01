const menu = document.getElementById("menu");
const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");
const closeModalBtn = document.getElementById("close-modal-btn");
const cartCounter = document.getElementById("cart-count");
const adressInput = document.getElementById("adress");
const adressWarn = document.getElementById("adress-warn");

let cart = [];

cartBtn.addEventListener("click", function () {
    cartModal.style.display = "flex";
    updateCartModal();
});

cartModal.addEventListener("click", function (event) {
    if (event.target === cartModal) {
        cartModal.style.display = "none";
    }
});

closeModalBtn.addEventListener("click", function () {
    cartModal.style.display = "none";
});

menu.addEventListener("click", (event) => {
    let parentButton = event.target.closest(".add-to-cart-btn");

    if (parentButton) {
        const name = parentButton.getAttribute("data-name");
        const price = parseFloat(parentButton.getAttribute("data-price"));
        addToCart(name, price);
    }
});

function addToCart(name, price) {
    const existingItem = cart.find((item) => item.name === name);

    if (existingItem) {
        existingItem.quantity += 1; 
    } else {
        cart.push({
            name,
            price,
            quantity: 1,
        });
    }

    updateCartModal();
    updateCartCount();
}

function updateCartModal() {
    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach((item) => {
        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col");

        cartItemElement.innerHTML = `
            <div class="flex items-center justify-between">
                <div>
                    <p class="font-medium">${item.name}</p>
                    <p> Qtd: ${item.quantity}</p>
                    <p class="font-medium mt-2">$ ${item.price.toFixed(2)}</p>
                </div>

                <button onClick="removeCartItems('${item.name}')"> 
                    remover
                </button>
            </div>
        `;

        cartItemsContainer.appendChild(cartItemElement);
    });

    if (cart.length === 0) {
        cartTotal.innerHTML = "0.00";
    } else {
        cartTotal.innerHTML = `${calculateCartTotal()}`;
    }
}

function updateCartCount() {
    cartCounter.innerHTML = cart.length;
}

function removeCartItems(name) {
    cart = cart.filter((item) => {
        return item.name !== name;
    });

    updateCartModal();
    updateCartCount();
}

function calculateCartTotal() {
    let total = 0;
    cart.forEach((item) => {
        total += item.price * item.quantity;
    });
    return total.toFixed(2);
}

adressInput.addEventListener("input", function (event) {
    let inputValue = event.target.value;

    if (inputValue !== "") {
        adressWarn.classList.add("hidden");
    }
});

checkoutBtn.addEventListener("click", function () {
    const isOpen = checkRestaurantOpen();
    if (!isOpen) {

        Toastify({
			text: "RESTAURANTE FECHADO NO MOMENTO!",
			duration: 3000,
			close: true,
			gravity: "top", 
			position: "right", 
			stopOnFocus: true, 
			style: {
			  background: "#ef4444",
			},
		}).showToast();

        return;
    }

    if (cart.length === 0) return;
    if (adressInput.value === "") {
        adressWarn.classList.remove("hidden");
        return;
    }

    const cartItems = cart.map((item) => {
        return ` ${item.name} Quantidade: (${item.quantity}) Preço: $${item.price} |`;
    }).join("");

    const message = encodeURIComponent(cartItems);
    const phone = "351968899318";

    window.open(`https://wa.me/${phone}?text=${message} Endereço: ${adressInput.value}`, "_blank");

    cart = [];
    updateCartModal();
});

function checkRestaurantOpen() {
    const data = new Date();
    const hora = data.getHours();
    return hora >= 16 && hora < 22;
}

const spanItem = document.getElementById("date-span");
const isOpen = checkRestaurantOpen();

if (isOpen) {
    spanItem.classList.remove("bg-red-500");
    spanItem.classList.add("bg-green-600");
} else {
    spanItem.classList.remove("bg-green-600");
    spanItem.classList.add("bg-red-500");
}
