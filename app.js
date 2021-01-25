const overlay = document.querySelector(".overlay");

const hamburgerLogo = document.querySelector(".hamburger-logo");
const hamburger = document.querySelector(".hamburger");
const links = document.querySelectorAll(".links");

const bar = document.querySelectorAll(".bar");
const bar1 = document.querySelector(".bar1");
const bar2 = document.querySelector(".bar2");
const bar3 = document.querySelector(".bar3");

const cartLogo = document.querySelector(".cart-logo");
const cartContainer = document.querySelector(".cart-container");
const cart = document.querySelector(".cart");
const btnCloseCart = document.querySelector(".close-cart");

const nameLogo = document.querySelector(".name-logo");
const desktopLinks = document.querySelector(".desktop-links");
const colorLinks = document.querySelectorAll(".color-links");

const navBar = document.querySelector(".nav-bar");

const productsBox = document.querySelectorAll(".products-box");
const productsImage = document.querySelectorAll(".products-image");
const productsText = document.querySelectorAll(".products-text");
const productsType = document.querySelectorAll(".products-type");
const productsPrice = document.querySelectorAll(".products-price");

const productsPage = document.querySelector(".products-page");
const productsPageImage = document.querySelector(".products-page-image");
const productsPageText = document.querySelector(".products-page-text");
const productsPageType = document.querySelector(".products-page-type");
const productsPagePrice = document.querySelector(".products-page-price");
const productsPageSize = document.querySelector(".products-page-size");
const productsPageQuantity = document.querySelector(".products-page-quantity");

const btnClosePage = document.querySelector(".close-page");

const checkout = document.querySelector(".checkout");

cartLogo.addEventListener("click", () => {
	cartContainer.classList.add("cart-toggle");
	document.body.style.overflow = "hidden";
});

const closeCart = () => {
	cartContainer.classList.remove("cart-toggle");
	document.body.style.overflow = "visible";
};

btnCloseCart.addEventListener("click", closeCart);

const removeCartItemButtons = document.querySelectorAll(".btn-danger");

const addToCartButton = document.querySelector(".shop-item-button");

addToCartButton.addEventListener("click", () => {
	let cartItems = document.getElementsByClassName("cart")[0];
	let cartItemNames = cartItems.getElementsByClassName("cart-item-title");
	let cartSizeInput = document.getElementsByClassName("cart-size");
	for (let i = 0; i < cartItemNames.length; i++) {
		if (cartItemNames[i].textContent == productsPageText.textContent && cartSizeInput[i].textContent == productsPageSize.value) {
			alert("Item is already in the cart");
			return;
		}
	}
	addItemToCart();
	closePage();
	updateCartTotal();
});

let arr = [];
const addItemToCart = () => {
	let cartRow = document.createElement("div");
	cartRow.classList.add("cart-row");
	let cartItems = document.getElementsByClassName("cart")[0];

	let cartObj = {
		image: productsPageImage.src.trim(),
		name: productsPageText.textContent.trim(),
		type: productsPageType.textContent.trim(),
		size: productsPageSize.value.trim(),
		quantity: productsPageQuantity.value.trim(),
		price: productsPagePrice.textContent.trim(),
	};

	let cartObjSerialized = JSON.stringify(cartObj);

	if (localStorage.cart) {
		arr = [localStorage.cart];
	} else {
		arr = [];
	}

	if (localStorage.cart && localStorage.cart.includes(cartObjSerialized.slice(0, cartObjSerialized.lastIndexOf("quantity")))) {
		alert("Item is already in the cart");
		return;
	}

	arr.push(cartObjSerialized);
	localStorage.setItem("cart", arr);

	let cartRowContents = `  
		<img class="cart-item-image cart-column" src="${productsPageImage.src}">
		<div class="cart-item cart-column">
			<span class="cart-item-title">${productsPageText.textContent}</span>
			<span class="cart-item-type">${productsPageType.textContent}</span>
			<p class="cart-size">Size: ${productsPageSize.value}</p>
			<p class="cart-quantity">Quantity: ${productsPageQuantity.value}</p>
			<p class="btn btn-danger">Remove</button>
		</div>
		<div class="cart-column-price">
			<span class="cart-price">${productsPagePrice.textContent}</span>
		</div>`;
	cartRow.innerHTML = cartRowContents;
	cartItems.append(cartRow);

	cartRow.getElementsByClassName("btn-danger")[0].addEventListener("click", (e) => {
		const buttonClicked = e.target;
		buttonClicked.parentElement.parentElement.remove();
		let cartElement = buttonClicked.parentElement.firstElementChild.textContent.trim();

		let cartString = localStorage.getItem("cart");

		if (cartString) {
			let cartSplit = cartString.replaceAll("},{", "}%{").split("%");
			for (let i = 0; i < cartSplit.length; i++) {
				if (cartSplit[i].includes(cartElement)) {
					cartSplit.splice(i, i + 1);
				}
			}
			localStorage.setItem("cart", cartSplit);
		}
		updateCartTotal();
	});
};

const getStorage = () => {
	let cartString = localStorage.getItem("cart");

	if (cartString) {
		let cartSplit = cartString.replaceAll("},{", "}%{").split("%");
		for (let i = 0; i < cartSplit.length; i++) {
			let cartObj = cartSplit[i];
			let cartFinal = JSON.parse(cartObj);

			let cartRow = document.createElement("div");
			cartRow.classList.add("cart-row");
			let cartItems = document.getElementsByClassName("cart")[0];

			let cartRowContents = `  
				<img class="cart-item-image cart-column" src="${cartFinal.image}">
				<div class="cart-item cart-column">
					<span class="cart-item-title">${cartFinal.name}</span>
					<span class="cart-item-type">${cartFinal.type}</span>
					<p class="cart-size">Size: ${cartFinal.size}</p>
					<p class="cart-quantity">Quantity: ${cartFinal.quantity}</p>
					<p class="btn btn-danger">Remove</button>
				</div>
				<div class="cart-column-price">
					<span class="cart-price">${cartFinal.price}</span>
				</div>`;
			cartRow.innerHTML = cartRowContents;
			cartItems.append(cartRow);

			cartRow.getElementsByClassName("btn-danger")[0].addEventListener("click", (e) => {
				const buttonClicked = e.target;
				buttonClicked.parentElement.parentElement.remove();
				let cartElement = buttonClicked.parentElement.firstElementChild.textContent.trim();

				let cartString = localStorage.getItem("cart");

				if (cartString) {
					let cartSplit = cartString.replaceAll("},{", "}%{").split("%");
					for (let i = 0; i < cartSplit.length; i++) {
						if (cartSplit[i].includes(cartElement)) {
							cartSplit.splice(i, i + 1);
						}
					}
					localStorage.setItem("cart", cartSplit);
				}
				updateCartTotal();
			});
		}
	}
};

const updateCartTotal = () => {
	const cartItemContainer = document.getElementsByClassName("cart")[0];
	const cartRows = cartItemContainer.getElementsByClassName("cart-row");
	let total = 0;
	for (let i = 0; i < cartRows.length; i++) {
		let cartRow = cartRows[i];
		let priceElement = cartRow.getElementsByClassName("cart-price")[0];
		let price = parseFloat(priceElement.textContent.replace("$", ""));
		total = total + price;
	}
	document.getElementsByClassName("cart-total-price")[0].textContent = `Total: $${total}`;
	document.getElementsByClassName("checkout")[0].innerHTML = `<button class="btn-checkout">Checkout</button>`;
	if (document.getElementsByClassName("cart-total-price")[0].textContent == `Total: $0`) {
		document.getElementsByClassName("checkout")[0].innerHTML = ``;
		document.getElementsByClassName("cart-total-price")[0].innerHTML = `<p>YOUR CART IS EMPTY</p>`;
	}

	let btnCheckout = document.querySelector(".btn-checkout");
	if (btnCheckout) {
		btnCheckout.addEventListener("click", () => {
			alert("Thank you for your purchase");
			while (cart.hasChildNodes()) {
				cart.removeChild(cart.firstChild);
			}
			document.getElementsByClassName("cart-total-price")[0].textContent = `Total: $0`;
			updateCartTotal();
			cartContainer.classList.remove("cart-toggle");
			localStorage.clear();
		});
	}
};

window.onscroll = () => {
	const top = window.scrollY;
	if (top >= 50) {
		navBar.classList.add("change-color");
		cartLogo.src = `cart_black.png`;
		bar1.classList.add("change-color-bar");
		bar2.classList.add("change-color-bar");
		bar3.classList.add("change-color-bar");
		nameLogo.classList.add("change-color-name");
		for (let i = 0; i < colorLinks.length; i++) {
			colorLinks[i].classList.add("change-color-name");
		}
	} else {
		navBar.classList.remove("change-color");
		cartLogo.src = `cart.png`;
		bar1.classList.remove("change-color-bar");
		bar2.classList.remove("change-color-bar");
		bar3.classList.remove("change-color-bar");
		nameLogo.classList.remove("change-color-name");
		for (let i = 0; i < colorLinks.length; i++) {
			colorLinks[i].classList.remove("change-color-name");
		}
	}
};

hamburgerLogo.addEventListener("click", () => {
	toggleHamburger();
});

links.forEach((button) => {
	button.addEventListener("click", () => {
		bar1.classList.remove("change1");
		bar2.classList.remove("change2");
		bar3.classList.remove("change3");
		hamburger.classList.remove("hamburger-toggle");
	});
});

document.addEventListener("keydown", (e) => {
	if (e.key === "Escape" && hamburger.classList.contains("hamburger-toggle")) {
		toggleHamburger();
	}
});

const toggleHamburger = () => {
	bar1.classList.toggle("change1");
	bar2.classList.toggle("change2");
	bar3.classList.toggle("change3");
	hamburger.classList.toggle("hamburger-toggle");
};

for (let i = 0; i < productsBox.length; i++) {
	productsBox[i].addEventListener("click", () => {
		productsPage.classList.remove("hidden");
		overlay.classList.remove("hidden");
		productsPageText.textContent = productsText[i].textContent;
		productsPageType.textContent = productsType[i].textContent;
		productsPageImage.src = productsImage[i].src;

		productsPagePrice.textContent = `$${productsPageQuantity.value * productsPrice[i].textContent.replace("$", "").trim()}`;

		productsPageQuantity.addEventListener("change", () => {
			if (productsPageQuantity.value < 1) {
				productsPageQuantity.value = 1;
			}
			let originalPrice = productsPrice[i].textContent.replace("$", "").trim();
			let newPrice = `$${productsPageQuantity.value * originalPrice}`;
			productsPagePrice.textContent = newPrice;
		});
	});
}

const closePage = () => {
	overlay.classList.add("hidden");
	productsPage.classList.add("hidden");
};

overlay.addEventListener("click", closePage);
btnClosePage.addEventListener("click", closePage);

document.addEventListener("keydown", (e) => {
	if (e.key === "Escape" && !productsPage.classList.contains("hidden")) {
		closePage();
	} else if (e.key === "Escape" && !cartContainer.classList.contains("hidden")) {
		closeCart();
	}
});

const main = () => {
	getStorage();
	updateCartTotal();
};

main();
