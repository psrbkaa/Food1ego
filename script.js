let order = [];
const storeLocation = { lat: -6.200000, lng: 106.800000 }; // Lokasi penjual (misalnya Jakarta)

function toggleMenu() {
    const menu = document.getElementById("menu");
    menu.style.display = menu.style.display === "none" ? "block" : "none";
}

function toggleDrinksMenu() {
    const drinksMenu = document.getElementById("drinks-menu");
    drinksMenu.style.display = drinksMenu.style.display === "none" ? "block" : "none";
}

function updateDimsumPriceAndImage(price, imageUrl) {
    document.getElementById("harga").innerText = "Rp " + price.toLocaleString("id-ID");
    document.getElementById("dimsum-image").src = imageUrl;
}

function addDimsumToOrder() {
    const qty = parseInt(document.getElementById("qty-dimsum").value);
    const selectedPrice = parseInt(document.querySelector('input[name="jumlah-isi"]:checked').value);
    if (qty <= 0 || isNaN(qty)) {
        alert("Masukkan jumlah yang valid!");
        return;
    }
    order.push({ name: "Dimsum Mentai", price: selectedPrice, quantity: qty });
    updateOrderList();
}

function addToOrder(name, price, qtyId, flavorId = null) {
    const quantity = parseInt(document.getElementById(qtyId).value);
    const flavorElement = flavorId ? document.getElementById(flavorId) : null;
    const flavor = flavorElement && flavorElement.value ? flavorElement.value : '';

    if (quantity <= 0 || isNaN(quantity)) {
        alert("Masukkan jumlah yang valid!");
        return;
    }

    const itemName = flavor ? `${name} (${flavor})` : name;
    order.push({ name: itemName, price, quantity });
    updateOrderList();
}

function updateOrderList() {
    const orderList = document.getElementById("order-list");
    orderList.innerHTML = "";

    order.forEach((item, index) => {
        const li = document.createElement("li");
        li.textContent = `${item.quantity}x ${item.name} - Rp ${(item.price * item.quantity).toLocaleString("id-ID")}`;
        
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Hapus";
        deleteButton.className = "delete-button";
        deleteButton.onclick = () => removeItemFromOrder(index);

        li.appendChild(deleteButton);
        orderList.appendChild(li);
    });
}

function removeItemFromOrder(index) {
    order.splice(index, 1);
    updateOrderList();
}
function toggleDeliveryAddress() {
    const deliveryOption = document.querySelector('input[name="delivery"]:checked').value;
    const addressField = document.getElementById('delivery-address');
    
    if (deliveryOption === 'diantar') {
        addressField.style.display = 'block';
    } else {
        addressField.style.display = 'none';
    }
}

function validateContact() {
    const contactInput = document.getElementById('customer-contact');
    const contactError = document.getElementById('contact-error');

    // Hapus karakter yang bukan angka
    contactInput.value = contactInput.value.replace(/\D/g, '');

    if (contactInput.value === '') {
        contactError.style.display = 'block';
    } else {
        contactError.style.display = 'none';
    }
}


function submitOrder() {
    const name = document.getElementById('customer-name').value;
    const contact = document.getElementById('customer-contact').value;
    const deliveryOption = document.querySelector('input[name="delivery"]:checked').value;
    const address = document.getElementById('address').value;

    if (!name || !contact) {
        alert("Harap isi nama dan kontak Anda.");
        return;
    }

    if (deliveryOption === 'diantar' && !address) {
        alert("Harap isi alamat pengantaran.");
        return;
    }

    let orderDetails = `Nama: ${name}\nKontak: ${contact}\n`;
    orderDetails += `Pengantaran: ${deliveryOption === 'diantar' ? 'Diantar' : 'Ambil Sendiri'}\n`;
    if (deliveryOption === 'diantar') {
        orderDetails += `Alamat: ${address}\n`;
    }

    alert("Pesanan Anda berhasil dikirim!\n\n" + orderDetails);
}

function openMap() {
    const mapURL = `https://maps.app.goo.gl/sw4wwepeS3tWAcJz8`;
    window.open(mapURL, "_blank");
}
    let dailyTransactions = [];
    let isAuthenticated = false;

    function submitOrder() {
        const name = document.getElementById("customer-name").value;
        const contact = document.getElementById("customer-contact").value;
        const address = document.getElementById("address").value;
        const deliveryOption = document.querySelector('input[name="delivery"]:checked').value;

        if (!name || !contact) {
            alert("Harap isi nama dan kontak!");
            return;
        }

        let orderText = order.map(o => `- ${o.quantity}x ${o.name} (Rp ${(o.price * o.quantity).toLocaleString()})`).join("%0A");

        if (deliveryOption === "diantar" && !address) {
            alert("Harap masukkan alamat pengantaran!");
            return;
        }

        const totalAmount = order.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const timestamp = new Date().toLocaleString("id-ID");

        dailyTransactions.push({
            timestamp,
            name,
            contact,
            deliveryOption,
            address: address || "Ambil Sendiri",
            items: order.map(item => `${item.quantity}x ${item.name}`).join(", "),
            totalAmount
        });

        const message = `Halo, ${name} ingin memesan:%0A${orderText}%0A%0ANama: ${name}%0AKontak: ${contact} %0AAlamat :${address}`;
        const phoneNumber = "6289508505031";
        const whatsappURL = `https://wa.me/${phoneNumber}?text=${message}`;

        window.open(whatsappURL, "_blank");
        order = [];
        updateOrderList();

        document.getElementById("customer-name").value = "";
        document.getElementById("customer-contact").value = "";
        document.getElementById("address").value = "";
    }
