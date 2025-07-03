"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  subCategory: string;
  status: "In Stock" | "Low Stock" | "Out of Stock";
  imageUrl: string;
}

interface CartItem extends MenuItem {
  quantity: number;
}

const categories = ["All", "Burgers", "Pizza", "Salads", "Desserts", "Pasta"];

// Example subcategories for each category
const subCategories: { [key: string]: string[] } = {
  Burgers: ["Beef Burgers", "Chicken Burgers", "Veggie Burgers"],
  Pizza: ["Margherita", "Pepperoni", "BBQ Chicken"],
  Salads: ["Caesar", "Greek", "Garden"],
  Desserts: ["Brownies", "Ice Cream", "Cakes"],
  Pasta: ["Alfredo", "Bolognese", "Carbonara"],
};

const initialMenuItems: MenuItem[] = [
  {
    id: 1,
    name: "Classic Cheeseburger",
    category: "Burgers",
    subCategory: "Beef Burgers",
    status: "In Stock",
    price: 12.99,
    description: "Juicy beef patty with melted cheese, lettuce, tomato, and special sauce.",
    imageUrl: "https://public.readdy.ai/ai/img_res/f2d1c74d64489b64476350553be4a38e.jpg",
  },
  {
    id: 2,
    name: "Margherita Pizza",
    category: "Pizza",
    subCategory: "Margherita",
    status: "In Stock",
    price: 14.99,
    description: "Traditional pizza with tomato sauce, fresh mozzarella, and basil.",
    imageUrl: "https://public.readdy.ai/ai/img_res/910319bc9cc0e339d24b4fa22800fe5b.jpg",
  },
  {
    id: 3,
    name: "Caesar Salad",
    category: "Salads",
    subCategory: "Caesar",
    status: "Low Stock",
    price: 9.99,
    description: "Crisp romaine lettuce with Caesar dressing, croutons, and parmesan.",
    imageUrl: "https://public.readdy.ai/ai/img_res/aa33ecaa22a914d1408b3a50da001629.jpg",
  },
  {
    id: 4,
    name: "Chocolate Brownie",
    category: "Desserts",
    subCategory: "Brownies",
    status: "Out of Stock",
    price: 6.99,
    description: "Rich chocolate brownie with walnuts and a fudgy center.",
    imageUrl: "https://public.readdy.ai/ai/img_res/47fd27ebb3e4ed6f3e7ea25556c361ed.jpg",
  },
  {
    id: 5,
    name: "Chicken Alfredo",
    category: "Pasta",
    subCategory: "Alfredo",
    status: "In Stock",
    price: 15.99,
    description: "Fettuccine pasta with creamy alfredo sauce and grilled chicken.",
    imageUrl: "https://public.readdy.ai/ai/img_res/d41e462e3c6035e22ec983120ae5aab9.jpg",
  },
];

const StaticMenu: React.FC<{
  menuItems: MenuItem[];
  categories: string[];
  subCategories: { [key: string]: string[] };
  onSwitch: () => void;
}> = ({ menuItems, categories, onSwitch }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const carouselRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const slides = carouselRef.current?.querySelectorAll('.carousel-slide');
    if (!slides || slides.length === 0) return;

    slides.forEach((slide, index) => {
      slide.classList.toggle('opacity-100', index === currentSlide);
    });

    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [currentSlide]);

  const filteredItems = menuItems.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-end mb-4">
          <button
            onClick={onSwitch}
            className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Switch to Order
          </button>
        </div>
        {/* Search Bar */}
        <div className="mb-8 flex justify-center">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search menu..."
            className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
          />
        </div>
        {/* Hero Section with Carousel Background */}
        <div className="relative mb-12 overflow-hidden rounded-xl h-72 md:h-96">
          <div className="relative h-full w-full" ref={carouselRef}>
            <div className="carousel flex transition-transform duration-700 ease-in-out" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
              {menuItems.map((item, idx) => (
                <div
                  key={item.id}
                  className="flex-shrink-0 w-full h-72 md:h-96 bg-cover bg-center"
                  style={{ backgroundImage: `url("${item.imageUrl}")` }}
                  aria-hidden={idx !== currentSlide}
                />
              ))}
            </div>
            {/* Carousel Controls */}
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-40 text-white rounded-full p-2 z-10 hover:bg-opacity-70 transition"
              onClick={() => setCurrentSlide((prev) => (prev === 0 ? menuItems.length - 1 : prev - 1))}
              aria-label="Previous Slide"
            >
              <i className="fas fa-chevron-left"></i>
            </button>
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-40 text-white rounded-full p-2 z-10 hover:bg-opacity-70 transition"
              onClick={() => setCurrentSlide((prev) => (prev + 1) % menuItems.length)}
              aria-label="Next Slide"
            >
              <i className="fas fa-chevron-right"></i>
            </button>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
              {menuItems.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-3 w-3 rounded-full border-2 transition-all duration-300 ${currentSlide === idx ? 'bg-amber-600 border-amber-600' : 'bg-white border-white opacity-60'}`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
          <div className="absolute inset-0 z-10 py-16 md:py-24 px-6 bg-black bg-opacity-50 text-center flex flex-col items-center justify-center h-full">
            <h2 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">Our Menu</h2>
            <p className="text-gray-100 max-w-2xl mx-auto drop-shadow">
              Discover our carefully crafted dishes made with the finest ingredients.
              From appetizers to desserts, every bite tells a story of passion and flavor.
            </p>
          </div>
        </div>
        {/* Categories */}
        <div className="mb-8 overflow-x-auto pb-2">
          <div className="flex space-x-2 min-w-max">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`!rounded-button whitespace-nowrap px-6 py-2 rounded-full font-medium cursor-pointer transition-colors ${
                  selectedCategory === category
                    ? 'bg-amber-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
        {/* Menu Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map(item => (
            <div key={item.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 overflow-hidden">
                <Image
                  src={item.imageUrl}
                  width={300}
                  height={200}
                  alt={item.name}
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-gray-800">{item.name}</h3>
                  <span className="text-lg font-semibold text-amber-600">₦{item.price.toFixed(2)}</span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg bg-gray-100 text-gray-900 px-2 py-1 rounded">
                    {item.subCategory}
                  </span>
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      item.status === "In Stock"
                        ? "bg-green-100 text-green-700"
                        : item.status === "Low Stock"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
                <p className="text-gray-600 mb-4 line-clamp-2">{item.description}</p>
                {/* No Add to Cart button here */}
              </div>
            </div>
          ))}
        </div>
      </main>
      {/* Footer added here */}
      <footer className="bg-gray-800 text-white py-8 mt-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Native Delight Plus</h3>
              <p className="text-gray-300">
                Serving exquisite delicacies since 2020. Our passion is to create memorable dining experiences.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Hours</h3>
              <ul className="text-gray-300">
                <li>Monday - Friday: 11am - 10pm</li>
                <li>Saturday: 10am - 11pm</li>
                <li>Sunday: 10am - 9pm</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Contact</h3>
              <ul className="text-gray-300">
                <li className="flex items-center mb-2">
                  <i className="fas fa-map-marker-alt mr-2"></i>
                </li>
                <li className="flex items-center mb-2">
                  <i className="fas fa-phone mr-2"></i>
                </li>
                <li className="flex items-center">
                  <i className="fas fa-envelope mr-2"></i>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} Native delight plus. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
};

const Foodmenu: React.FC = () => {
  const [showOrder, setShowOrder] = useState(false);

  // Move all state and logic for menuItems, cart, etc. here as before
  const [menuItems] = useState<MenuItem[]>(initialMenuItems);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [orderPlaced, setOrderPlaced] = useState<boolean>(false);
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const carouselRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const slides = carouselRef.current?.querySelectorAll('.carousel-slide');
    if (!slides || slides.length === 0) return;

    slides.forEach((slide, index) => {
      slide.classList.toggle('opacity-100', index === currentSlide);
    });

    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [currentSlide]);

  const filteredItems = menuItems.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (item: MenuItem) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        return prevItems.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      } else {
        return [...prevItems, { ...item, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (id: number) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(id);
      return;
    }
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const placeOrder = () => {
    if (cartItems.length === 0) return;
    setOrderPlaced(true);
    setTimeout(() => {
      setCartItems([]);
      setIsCartOpen(false);
      setOrderPlaced(false);
    }, 3000);
  };

  useEffect(() => {
    if (cartItems.length === 0 && isCartOpen) {
      setIsCartOpen(false);
    }
  }, [cartItems, isCartOpen]);

  if (!showOrder) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="sticky top-0 z-50 bg-white shadow-md">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center">
              <i className="fas fa-utensils text-amber-600 text-2xl mr-2"></i>
              <h1 className="text-2xl font-bold text-gray-800">Native Delight Plus</h1>
            </div>
          </div>
        </header>
        <StaticMenu
          menuItems={initialMenuItems}
          categories={categories}
          subCategories={subCategories}
          onSwitch={() => setShowOrder(true)}
        />
        {/* Footer can be reused here if needed */}
      </div>
    );
  }

  // --- The original menu with add to cart and order ---
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <i className="fas fa-utensils text-amber-600 text-2xl mr-2"></i>
            <h1 className="text-2xl font-bold text-gray-800">Native Delight Plus</h1>
          </div>
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative !rounded-button whitespace-nowrap bg-amber-600 text-white px-4 py-2 rounded-lg flex items-center cursor-pointer hover:bg-amber-700 transition-colors"
          >
            <i className="fas fa-shopping-cart mr-2"></i>
            <span>Cart</span>
            {getTotalItems() > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
                {getTotalItems()}
              </span>
            )}
          </button>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        {/* Add Return to Static Menu Button */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setShowOrder(false)}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Return to Static Menu
          </button>
        </div>
        {/* Search Bar */}
        <div className="mb-8 flex justify-center">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search menu..."
            className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600"
          />
        </div>
        {/* Hero Section with Carousel Background */}
        <div className="relative mb-12 overflow-hidden rounded-xl h-72 md:h-96">
          <div className="relative h-full w-full" ref={carouselRef}>
            <div className="carousel flex transition-transform duration-700 ease-in-out" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
              {menuItems.map((item, idx) => (
                <div
                  key={item.id}
                  className="flex-shrink-0 w-full h-72 md:h-96 bg-cover bg-center"
                  style={{ backgroundImage: `url("${item.imageUrl}")` }}
                  aria-hidden={idx !== currentSlide}
                />
              ))}
            </div>
            {/* Carousel Controls */}
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-40 text-white rounded-full p-2 z-10 hover:bg-opacity-70 transition"
              onClick={() => setCurrentSlide((prev) => (prev === 0 ? menuItems.length - 1 : prev - 1))}
              aria-label="Previous Slide"
            >
              <i className="fas fa-chevron-left"></i>
            </button>
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-40 text-white rounded-full p-2 z-10 hover:bg-opacity-70 transition"
              onClick={() => setCurrentSlide((prev) => (prev + 1) % menuItems.length)}
              aria-label="Next Slide"
            >
              <i className="fas fa-chevron-right"></i>
            </button>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
              {menuItems.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-3 w-3 rounded-full border-2 transition-all duration-300 ${currentSlide === idx ? 'bg-amber-600 border-amber-600' : 'bg-white border-white opacity-60'}`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
          <div className="absolute inset-0 z-10 py-16 md:py-24 px-6 bg-black bg-opacity-50 text-center flex flex-col items-center justify-center h-full">
            <h2 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">Our Menu</h2>
            <p className="text-gray-100 max-w-2xl mx-auto drop-shadow">
              Discover our carefully crafted dishes made with the finest ingredients.
              From appetizers to desserts, every bite tells a story of passion and flavor.
            </p>
          </div>
        </div>
        {/* Categories */}
        <div className="mb-8 overflow-x-auto pb-2">
          <div className="flex space-x-2 min-w-max">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`!rounded-button whitespace-nowrap px-6 py-2 rounded-full font-medium cursor-pointer transition-colors ${
                  selectedCategory === category
                    ? 'bg-amber-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
        {/* Menu Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map(item => (
            <div key={item.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 overflow-hidden">
                <Image
                  src={item.imageUrl}
                  width={300}
                  height={200}
                  alt={item.name}
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-gray-800">{item.name}</h3>
                  <span className="text-lg font-semibold text-amber-600">₦{item.price.toFixed(2)}</span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg bg-gray-100 text-gray-900 px-2 py-1 rounded">
                    {item.subCategory}
                  </span>
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      item.status === "In Stock"
                        ? "bg-green-100 text-green-700"
                        : item.status === "Low Stock"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
                <p className="text-gray-600 mb-4 line-clamp-2">{item.description}</p>
                <button
                  onClick={() => addToCart(item)}
                  className="!rounded-button whitespace-nowrap w-full bg-amber-600 text-white py-2 rounded-lg font-medium hover:bg-amber-700 transition-colors flex items-center justify-center cursor-pointer"
                >
                  <i className="fas fa-plus mr-2"></i>
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
      {/* Cart Sidebar */}
      <div className={`fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity ${isCartOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className={`absolute right-0 top-0 h-full bg-white w-full max-w-md transform transition-transform ${isCartOpen ? 'translate-x-0' : 'translate-x-full'} overflow-y-auto`}>
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Your Cart</h2>
              <button
                onClick={() => setIsCartOpen(false)}
                className="text-gray-500 hover:text-gray-700 cursor-pointer"
              >
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>
            {cartItems.length === 0 ? (
              <div className="text-center py-8">
                <i className="fas fa-shopping-cart text-gray-300 text-5xl mb-4"></i>
                <p className="text-gray-500">Your cart is empty</p>
              </div>
            ) : (
              <>
                <div className="space-y-4 mb-6">
                  {cartItems.map(item => (
                    <div key={item.id} className="flex items-center border-b border-gray-200 pb-4">
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        width={80}
                        height={80}
                        className="w-20 h-20 object-cover rounded-lg mr-4"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-800">{item.name}</h3>
                        <p className="text-gray-600 text-sm">₦{item.price.toFixed(2)}</p>
                        <div className="flex items-center mt-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="!rounded-button whitespace-nowrap text-gray-500 hover:text-gray-700 cursor-pointer"
                          >
                            <i className="fas fa-minus"></i>
                          </button>
                          <span className="mx-3">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="!rounded-button whitespace-nowrap text-gray-500 hover:text-gray-700 cursor-pointer"
                          >
                            <i className="fas fa-plus"></i>
                          </button>
                        </div>
                      </div>
                      <span className="font-medium">₦{(item.price * item.quantity).toFixed(2)}</span>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="!rounded-button whitespace-nowrap ml-4 text-red-500 hover:text-red-700 cursor-pointer"
                      >
                        <i className="fas fa-trash"></i> Remove
                      </button>
                    </div>
                  ))}
                </div>
                <div className="border-t border-gray-200 pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>N{getTotalPrice().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-2">
                    <span>Total</span>
                    <span>₦{(getTotalPrice()).toFixed(2)}</span>
                  </div>
                </div>
                <button
                  onClick={placeOrder}
                  className={`!rounded-button whitespace-nowrap w-full mt-6 py-3 rounded-lg font-medium text-white cursor-pointer ${
                    orderPlaced
                      ? 'bg-green-600'
                      : 'bg-amber-600 hover:bg-amber-700'
                  } transition-colors`}
                  disabled={orderPlaced}
                >
                  {orderPlaced ? (
                    <div className="flex items-center justify-center">
                      <i className="fas fa-check mr-2"></i>
                      Order Placed!
                    </div>
                  ) : (
                    'Place Order'
                  )}
                </button>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="!rounded-button whitespace-nowrap w-full mt-4 py-3 rounded-lg font-medium text-gray-800 bg-gray-200 hover:bg-gray-300 transition-colors"
                >
                  Back to Menu
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Native Delight Plus</h3>
              <p className="text-gray-300">
                Serving exquisite delicacies since 2020. Our passion is to create memorable dining experiences.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Hours</h3>
              <ul className="text-gray-300">
                <li>Monday - Friday: 11am - 10pm</li>
                <li>Saturday: 10am - 11pm</li>
                <li>Sunday: 10am - 9pm</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Contact</h3>
              <ul className="text-gray-300">
                <li className="flex items-center mb-2">
                  <i className="fas fa-map-marker-alt mr-2"></i>
                </li>
                <li className="flex items-center mb-2">
                  <i className="fas fa-phone mr-2"></i>
                </li>
                <li className="flex items-center">
                  <i className="fas fa-envelope mr-2"></i>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} Native delight plus. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Foodmenu;
