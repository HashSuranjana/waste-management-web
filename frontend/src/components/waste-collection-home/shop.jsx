import React, {useState} from 'react'
import {Link} from "react-router-dom";

const Shop = () => {
    const shopData = {
        categories: [
            "Bins & Containers",
            "Safety Equipment",
            "Recycling Equipment",
            "Waste Processing",
            "Educational Materials",
            "Organic Products",
            "Plastic Recycling"
        ],
        products: [
            {
                id: 1,
                name: "Large Recycling Bin",
                category: "Bins & Containers",
                description: "120L capacity recycling bin with color-coded compartments",
                price: 89.99,
                stock: 15,
                rating: 4.5,
                image: "https://via.placeholder.com/300x200?text=Recycling+Bin"
            },
            {
                id: 2,
                name: "Safety Gloves",
                category: "Safety Equipment",
                description: "Heavy-duty gloves for waste handling",
                price: 24.99,
                stock: 50,
                rating: 4.2,
                image: "https://via.placeholder.com/300x200?text=Safety+Gloves"
            },
            {
                id: 3,
                name: "Plastic Shredder",
                category: "Recycling Equipment",
                description: "Industrial-grade plastic waste shredder",
                price: 2499.99,
                stock: 3,
                rating: 4.8,
                image: "https://via.placeholder.com/300x200?text=Plastic+Shredder"
            },
            {
                id: 4,
                name: "Paper Baler",
                category: "Recycling Equipment",
                description: "Compact paper and cardboard baler",
                price: 1899.99,
                stock: 2,
                rating: 4.7,
                image: "https://via.placeholder.com/300x200?text=Paper+Baler"
            },
            {
                id: 5,
                name: "Glass Crusher",
                category: "Recycling Equipment",
                description: "Commercial glass crushing machine",
                price: 2999.99,
                stock: 1,
                rating: 4.9,
                image: "https://via.placeholder.com/300x200?text=Glass+Crusher"
            },
            {
                id: 6,
                name: "Composting Unit",
                category: "Waste Processing",
                description: "Large-scale organic waste composting system",
                price: 3499.99,
                stock: 2,
                rating: 4.6,
                image: "https://via.placeholder.com/300x200?text=Composting+Unit"
            },
            {
                id: 7,
                name: "Recycling Education Kit",
                category: "Educational Materials",
                description: "Complete educational kit for teaching recycling",
                price: 149.99,
                stock: 20,
                rating: 4.4,
                image: "https://via.placeholder.com/300x200?text=Education+Kit"
            },
            {
                id: 8,
                name: "Electronic Waste Bin",
                category: "Bins & Containers",
                description: "Secure container for e-waste collection",
                price: 199.99,
                stock: 8,
                rating: 4.3,
                image: "https://via.placeholder.com/300x200?text=E-Waste+Bin"
            },
            {
                id: 9,
                name: "Hazardous Waste Container",
                category: "Bins & Containers",
                description: "Specialized container for hazardous materials",
                price: 299.99,
                stock: 5,
                rating: 4.7,
                image: "https://via.placeholder.com/300x200?text=Hazardous+Waste+Container"
            },
            {
                id: 10,
                name: "Recycling Sorting Station",
                category: "Recycling Equipment",
                description: "Multi-compartment sorting station",
                price: 599.99,
                stock: 4,
                rating: 4.5,
                image: "https://via.placeholder.com/300x200?text=Sorting+Station"
            },
            {
                id: 11,
                name: "Premium Organic Compost",
                category: "Organic Products",
                description: "High-quality organic compost made from recycled food waste, perfect for gardening",
                price: 29.99,
                stock: 50,
                rating: 4.8,
                image: "https://via.placeholder.com/300x200?text=Organic+Compost"
            },
            {
                id: 12,
                name: "Home Composting Kit",
                category: "Organic Products",
                description: "Complete kit for home composting including bin, starter mix, and guide",
                price: 79.99,
                stock: 25,
                rating: 4.6,
                image: "https://via.placeholder.com/300x200?text=Composting+Kit"
            },
            {
                id: 13,
                name: "Herb Garden Starter Kit",
                category: "Organic Products",
                description: "Everything needed to start your own organic herb garden",
                price: 49.99,
                stock: 30,
                rating: 4.7,
                image: "https://via.placeholder.com/300x200?text=Herb+Garden+Kit"
            },
            {
                id: 14,
                name: "Vegetable Grow Kit",
                category: "Organic Products",
                description: "Complete kit for growing organic vegetables at home",
                price: 59.99,
                stock: 20,
                rating: 4.5,
                image: "https://via.placeholder.com/300x200?text=Vegetable+Grow+Kit"
            },
            {
                id: 15,
                name: "Recycled Plastic Pellets (5kg)",
                category: "Plastic Recycling",
                description: "High-quality recycled plastic pellets for manufacturing",
                price: 89.99,
                stock: 15,
                rating: 4.4,
                image: "https://via.placeholder.com/300x200?text=Plastic+Pellets"
            },
            {
                id: 16,
                name: "Plastic Recycling Bundle (10kg)",
                category: "Plastic Recycling",
                description: "Mixed recycled plastic materials for industrial use",
                price: 149.99,
                stock: 10,
                rating: 4.3,
                image: "https://via.placeholder.com/300x200?text=Plastic+Bundle"
            },
            {
                id: 17,
                name: "Organic Fertilizer Mix",
                category: "Organic Products",
                description: "Natural fertilizer made from composted organic waste",
                price: 39.99,
                stock: 40,
                rating: 4.7,
                image: "https://via.placeholder.com/300x200?text=Organic+Fertilizer"
            },
            {
                id: 18,
                name: "Indoor Plant Grow Kit",
                category: "Organic Products",
                description: "Complete kit for growing plants indoors with recycled materials",
                price: 69.99,
                stock: 15,
                rating: 4.6,
                image: "https://via.placeholder.com/300x200?text=Indoor+Grow+Kit"
            }
        ]
    };

    const [searchQuery, setSearchQuery] = useState('');
    const [shopCategory, setShopCategory] = useState('all');
    const [cart, setCart] = useState([]);
    const addToCart = (product) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.id === product.id);
            if (existingItem) {
                return prevCart.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prevCart, { ...product, quantity: 1 }];
        });
    };

    const removeFromCart = (productId) => {
        setCart(prevCart => prevCart.filter(item => item.id !== productId));
    };

    const updateQuantity = (productId, quantity) => {
        if (quantity < 1) return;
        setCart(prevCart =>
            prevCart.map(item =>
                item.id === productId
                    ? { ...item, quantity }
                    : item
            )
        );
    };

    const shopTransactions = [
        {
            id: 1,
            date: '2024-03-15',
            time: '10:30 AM',
            customer: 'John Smith',
            items: [
                { name: 'Large Recycling Bin', quantity: 1, price: 89.99 },
                { name: 'Safety Gloves', quantity: 2, price: 24.99 }
            ],
            total: 139.97,
            paymentMethod: 'Credit Card',
            status: 'Completed',
            reference: 'SHOP-2024-001'
        },
        {
            id: 2,
            date: '2024-03-15',
            time: '02:15 PM',
            customer: 'Jane Doe',
            items: [
                { name: 'Plastic Recycling Bundle', quantity: 1, price: 149.99 },
                { name: 'Recycling Education Kit', quantity: 1, price: 149.99 }
            ],
            total: 299.98,
            paymentMethod: 'Credit Card',
            status: 'Completed',
            reference: 'SHOP-2024-002'
        },
        {
            id: 3,
            date: '2024-03-15',
            time: '04:45 PM',
            customer: 'Robert Johnson',
            items: [
                { name: 'Premium Organic Compost', quantity: 3, price: 29.99 },
                { name: 'Home Composting Kit', quantity: 1, price: 79.99 }
            ],
            total: 169.96,
            paymentMethod: 'Cash',
            status: 'Completed',
            reference: 'SHOP-2024-003'
        },
        {
            id: 4,
            date: '2024-03-15',
            time: '05:30 PM',
            customer: 'Emily Davis',
            items: [
                { name: 'Herb Garden Starter Kit', quantity: 2, price: 49.99 },
                { name: 'Organic Fertilizer Mix', quantity: 1, price: 39.99 }
            ],
            total: 139.97,
            paymentMethod: 'Bank Transfer',
            status: 'Pending',
            reference: 'SHOP-2024-004'
        }
    ];

    const shopTransactionStats = {
        totalTransactions: shopTransactions.length,
        totalRevenue: shopTransactions.reduce((sum, t) => sum + t.total, 0),
        completedTransactions: shopTransactions.filter(t => t.status === 'Completed').length,
        pendingTransactions: shopTransactions.filter(t => t.status === 'Pending').length,
        averageTransactionValue: shopTransactions.reduce((sum, t) => sum + t.total, 0) / shopTransactions.length,
        topSellingItems: [
            { name: 'Premium Organic Compost', quantity: 3 },
            { name: 'Herb Garden Starter Kit', quantity: 2 },
            { name: 'Safety Gloves', quantity: 2 }
        ]
    };


    return (
        <div className="shop">
            <h2>Shop</h2>

            {/* Shop Navigation */}
            <div className="shop-nav">
                <button className="shop-nav-btn active">Products</button>
                <Link to="/shop-transactions" className="shop-nav-btn">
                    Transaction History
                </Link>
            </div>

            {/* Shop Content */}
            <div className="shop-content">
                <div className="shop-controls">
                    <div className="search-bar">
                        <input
                            type="text"
                            placeholder="Search recycling products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="category-filter">
                        <select
                            value={shopCategory}
                            onChange={(e) => setShopCategory(e.target.value)}
                        >
                            <option value="">All Categories</option>
                            {shopData.categories.map((category) => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="shop-content">
                    <div className="products-grid">
                        {shopData.products
                            .filter((product) => {
                                const matchesCategory = !shopCategory || product.category === shopCategory;
                                const matchesSearch = !searchQuery ||
                                    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                    product.description.toLowerCase().includes(searchQuery.toLowerCase());
                                return matchesCategory && matchesSearch;
                            })
                            .map((product) => (
                                <div key={product.id} className="product-card">
                                    <img src={product.image} alt={product.name} />
                                    <div className="product-info">
                                        <h3>{product.name}</h3>
                                        <p className="product-category">{product.category}</p>
                                        <p className="product-description">{product.description}</p>
                                        <div className="product-rating">
                                            {'★'.repeat(Math.floor(product.rating))}
                                            {'☆'.repeat(5 - Math.floor(product.rating))}
                                        </div>
                                        <p className="product-price">${product.price.toFixed(2)}</p>
                                        <p className="product-stock">
                                            {product.stock > 0
                                                ? `${product.stock} in stock`
                                                : 'Out of stock'}
                                        </p>
                                        <button
                                            className="add-to-cart-btn"
                                            onClick={() => addToCart(product)}
                                            disabled={product.stock === 0}
                                        >
                                            Add to Cart
                                        </button>
                                    </div>
                                </div>
                            ))}
                    </div>
                    <div className="shopping-cart">
                        <h3>Shopping Cart</h3>
                        {cart.length === 0 ? (
                            <p className="empty-cart">Your cart is empty</p>
                        ) : (
                            <>
                                <div className="cart-items">
                                    {cart.map((item) => (
                                        <div key={item.id} className="cart-item">
                                            <img src={item.image} alt={item.name} />
                                            <div className="cart-item-info">
                                                <h4>{item.name}</h4>
                                                <p>${item.price.toFixed(2)}</p>
                                            </div>
                                            <div className="cart-item-actions">
                                                <input
                                                    type="number"
                                                    min="1"
                                                    value={item.quantity}
                                                    onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                                                />
                                                <button
                                                    className="remove-btn"
                                                    onClick={() => removeFromCart(item.id)}
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="cart-summary">
                                    <p>
                                        Total: $
                                        {cart
                                            .reduce((total, item) => total + item.price * item.quantity, 0)
                                            .toFixed(2)}
                                    </p>
                                    <button className="checkout-btn">Proceed to Checkout</button>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Add Shop Transaction Statistics */}
                <div className="shop-stats">
                    <div className="stat-card">
                        <div className="stat-icon">💰</div>
                        <div className="stat-info">
                            <h3>Total Revenue</h3>
                            <p className="stat-value">${shopTransactionStats.totalRevenue.toFixed(2)}</p>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon">🛒</div>
                        <div className="stat-info">
                            <h3>Total Transactions</h3>
                            <p className="stat-value">{shopTransactionStats.totalTransactions}</p>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon">✅</div>
                        <div className="stat-info">
                            <h3>Completed</h3>
                            <p className="stat-value">{shopTransactionStats.completedTransactions}</p>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon">⏳</div>
                        <div className="stat-info">
                            <h3>Pending</h3>
                            <p className="stat-value">{shopTransactionStats.pendingTransactions}</p>
                        </div>
                    </div>
                </div>

                {/* Add Shop Transaction History */}
                <div className="shop-transactions">
                    <h3>Transaction History</h3>
                    <table className="data-table">
                        <thead>
                        <tr>
                            <th>Date & Time</th>
                            <th>Customer</th>
                            <th>Items</th>
                            <th>Total</th>
                            <th>Payment Method</th>
                            <th>Status</th>
                            <th>Reference</th>
                        </tr>
                        </thead>
                        <tbody>
                        {shopTransactions.map(transaction => (
                            <tr key={transaction.id}>
                                <td>{transaction.date} {transaction.time}</td>
                                <td>{transaction.customer}</td>
                                <td>
                                    <ul className="transaction-items">
                                        {transaction.items.map((item, index) => (
                                            <li key={index}>
                                                {item.quantity}x {item.name} (${item.price.toFixed(2)})
                                            </li>
                                        ))}
                                    </ul>
                                </td>
                                <td>${transaction.total.toFixed(2)}</td>
                                <td>{transaction.paymentMethod}</td>
                                <td>
                                                        <span className={`status-badge ${transaction.status.toLowerCase()}`}>
                                                            {transaction.status}
                                                        </span>
                                </td>
                                <td>{transaction.reference}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                {/* Add Top Selling Items */}
                <div className="top-selling-items">
                    <h3>Top Selling Items</h3>
                    <div className="items-grid">
                        {shopTransactionStats.topSellingItems.map((item, index) => (
                            <div key={index} className="item-card">
                                <h4>{item.name}</h4>
                                <p>Quantity Sold: {item.quantity}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Shop
