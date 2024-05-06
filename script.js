const items = [
    { category: 'category1', image: 'bajaj.jfif', description: 'Bajaj Pulsar NS200', price: 2950 },
    { category: 'category1', image: 'voge.jfif', description: 'Voge 300 AC', price: 2800 },
    { category: 'category1', image: 'geon.jfif', description: 'Geon Scrambler 300', price: 2400 },
    { category: 'category1', image: 'pulsar.jfif', description: 'Bajaj Pulsar 250', price: 3400 },
    { category: 'category2', image: 'gns.jfif', description: 'Geon GNS 300', price: 3100 },
    { category: 'category2', image: 'loncin.jfif', description: 'Loncin LX300', price: 2500 },
    { category: 'category2', image: 'tekken.jfif', description: 'Exdrive Tekken 250', price: 2000 },
    { category: 'category2', image: 'rottor.jfif', description: 'Rottor F1', price: 2200 },
    { category: 'category2', image: 'nc250.jpg', description: 'Exdrive Hyper NC 250', price: 2800 },
    { category: 'category2', image: 'nc450.jpg', description: 'Zuumav S8-NC 450', price: 4200 },
];

const gallery = document.querySelector('.gallery');
const modalDescription = document.getElementById('modal-description');

const cartItems = [];
const cartModal = document.getElementById('cart-modal');
const cartItemsContainer = document.getElementById('cart-items');
const totalPriceElement = document.getElementById('total-price');

function displayRandomItem() {
    const randomItem = items[Math.floor(Math.random() * items.length)];
    const description = randomItem.category === 'category1' ? 'Гарний дорожній мото' : 'Гарний ендуро мото';
    modalDescription.textContent = description;
    const itemElement = createGalleryItem(randomItem);
    gallery.innerHTML = '';
    gallery.appendChild(itemElement);

    
    if (document.body.classList.contains('page-main')) {
        const galleryItem = document.querySelector('.gallery-item');
        galleryItem.style.marginLeft = '20px';
    }
}

function displayItemsByCategory(category) {
    gallery.innerHTML = '';
    items.forEach(item => {
        if (item.category === category) {
            const itemElement = createGalleryItem(item);
            gallery.appendChild(itemElement);
        }
    });
}

function createGalleryItem(item) {
    const itemElement = document.createElement('div');
    itemElement.classList.add('gallery-item');
    itemElement.innerHTML = `
        <p>${item.description}</p>
        <img src="${item.image}" alt="${item.description}">
        <p class="item-price">Ціна: ${item.price} $</p>
        <button class="item-btn" onclick="addToCart('${item.description}', ${item.price}, '${item.image}')">Додати до Кошика</button>
    `;
    return itemElement;
}

function addToCart(description, price, image) {
    const existingItem = cartItems.find(item => item.description === description);

    if (existingItem) {
        
        existingItem.quantity += 1;
    } else {
        
        const item = { description, price, image, quantity: 1 };
        cartItems.push(item);
    }

    
    renderCart();

    
    alert(`Додано до кошика: ${description} за ${price} $`);
}

function renderCart() {
    
    cartItemsContainer.innerHTML = '';

    
    cartItems.forEach(item => {
        const cartItemElement = document.createElement('div');
        cartItemElement.classList.add('cart-item');
        cartItemElement.innerHTML = `
            <img src="${item.image}" alt="${item.description}">
            <p>${item.description}</p>
            <p>Ціна: ${item.price} $</p>
            <p>Кількість: ${item.quantity}</p>
            <button class="increase-btn" onclick="increaseQuantity('${item.description}')">+</button>
            <button onclick="removeFromCart('${item.description}')">Видалити</button>
        `;
        cartItemsContainer.appendChild(cartItemElement);
    });

    
    const totalPrice = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    totalPriceElement.textContent = `Загальна вартість: ${totalPrice} $`;
}

function removeFromCart(description) {
    const itemIndex = cartItems.findIndex(item => item.description === description);
    if (itemIndex !== -1) {
        cartItems.splice(itemIndex, 1); 
        renderCart(); 
    }
}

function increaseQuantity(description) {
    const item = cartItems.find(item => item.description === description);
    if (item) {
        item.quantity += 1;
        renderCart(); 
    }
}

document.addEventListener('DOMContentLoaded', function() {
    
    const isMainPage = document.querySelector('.filter-btn[data-filter="random"]').classList.contains('active');
    if (isMainPage) {
        document.body.classList.add('page-main');
    } else {
        document.body.classList.remove('page-main');
    }

    displayRandomItem();
});

document.querySelector('.filter-btn[data-filter="random"]').addEventListener('click', () => {
    
    document.body.classList.add('page-main');
    displayRandomItem();
});

document.querySelector('.filter-btn[data-filter="category1"]').addEventListener('click', () => {
    
    document.body.classList.remove('page-main');
    displayItemsByCategory('category1');
});

document.querySelector('.filter-btn[data-filter="category2"]').addEventListener('click', () => {
    
    document.body.classList.remove('page-main');
    displayItemsByCategory('category2');
});

document.querySelector('.close').addEventListener('click', () => {
    cartModal.style.display = 'none';
});

window.addEventListener('click', (event) => {
    if (event.target === cartModal) {
        cartModal.style.display = 'none';
    }
});

document.querySelector('.basket-icon').addEventListener('click', () => {
    cartModal.style.display = 'block';
    renderCart();
});

document.querySelectorAll('.filter-btn').forEach(button => {
    button.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        button.classList.add('active');

        const filter = button.getAttribute('data-filter');
        if (filter === 'random') {
            displayRandomItem();
        } else if (filter === 'category1') {
            displayItemsByCategory('category1');
        } else if (filter === 'category2') {
            displayItemsByCategory('category2');
        }
    });
});


function displayChart(chartType) {
    const category1Count = items.filter(item => item.category === 'category1').length;
    const category2Count = items.filter(item => item.category === 'category2').length;

    const labels = ['Дорожні', 'Ендуро'];
    const data = [category1Count, category2Count];

    const chartCanvas = document.getElementById('chart');
    const ctx = chartCanvas.getContext('2d');

    
    if (window.myChart) {
        window.myChart.destroy();
    }

    window.myChart = new Chart(ctx, {
        type: chartType,
        data: {
            labels: labels,
            datasets: [{
                label: 'Кількість товарів',
                data: data,
                backgroundColor: ['#FF6384', '#36A2EB'],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    const chartSelector = document.getElementById('chart-type');

    chartSelector.addEventListener('change', function() {
        const selectedChartType = chartSelector.value;
        displayChart(selectedChartType);
    });
});

document.addEventListener('DOMContentLoaded', function() {
    
    updateNews();
});

function updateNews() {
    const newsElement = document.querySelector('.news');
    newsElement.innerHTML = `
        <h3>Новини про мотоцикли:</h3>
        
        <p>Електричні мотоцикли стають все популярнішими: У 2024 році спостерігається зростання популярності електричних мотоциклів. Компанії, такі як Harley-Davidson, Zero Motorcycles, та інші, активно розробляють нові моделі з високим діапазоном ходу та вражаючими характеристиками.

        Зростання інтересу до мотоциклів для пригод: Ендуро та подібні типи мотоциклів для пригод набувають популярності серед прихильників активного відпочинку. Нові моделі з покращеними технічними характеристиками та збільшеною міцністю стають бажаними серед пригодників.

        Технологічні нововведення в безпеці та зручності: Компанії постійно вдосконалюють технології безпеки для мотоциклів, включаючи системи ABS, контроль тяги, а також розробки для підвищення комфорту водіїв, такі як інтелектуальні екрани та системи звукозаглушення шуму вітру.

        Розширення ринку малокубатурних мотоциклів: Малокубатурні мотоцикли знову здобувають популярність, особливо серед новачків та міських жителів. Виробники пропонують більше моделей з потужністю до 300 см³, що відповідає вимогам нових ринків.

        Ростуть можливості кастомізації: Кастомізація мотоциклів стає більш доступною завдяки широкому асортименту підшипників та аксесуарів, що дозволяє власникам персоналізувати свої машини згідно з власними вподобаннями.</p>
    `;
}

const scrollToTopBtn = document.getElementById("scrollToTopBtn");


function toggleScrollToTopBtn() {
    if (document.body.scrollTop > window.innerHeight / 3 || document.documentElement.scrollTop > window.innerHeight / 3) {
        scrollToTopBtn.style.display = "block";
    } else {
        scrollToTopBtn.style.display = "none";
    }
}


scrollToTopBtn.addEventListener("click", () => {
    document.body.scrollTop = 0; 
    document.documentElement.scrollTop = 0; 
});


window.onscroll = () => {
    toggleScrollToTopBtn();
};
