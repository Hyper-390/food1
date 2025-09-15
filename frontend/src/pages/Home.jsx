import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { restaurantsAPI } from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Home = () => {
  const [featuredRestaurants, setFeaturedRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchFeaturedRestaurants();
  }, []);

  const fetchFeaturedRestaurants = async () => {
    try {
      const response = await restaurantsAPI.getAll({ limit: 6 });
      setFeaturedRestaurants(response.data.data);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/restaurants?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero">
        <div className="container text-center">
          <h1 className="fade-in">Delicious Food, Delivered Fast</h1>
          <p className="fade-in">Order from your favorite restaurants and enjoy fresh meals delivered to your door</p>
          
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="search-bar mt-8 fade-in">
            <div className="relative">
              <svg className="search-icon w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
              <input
                type="text"
                placeholder="Search restaurants, cuisines, or dishes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              <button type="submit" className="absolute right-2 top-1/2 transform -translate-y-1/2 btn btn-primary">
                Search
              </button>
            </div>
          </form>

          <div className="flex justify-center mt-8">
            <Link to="/restaurants" className="btn btn-large btn-primary">
              Browse Restaurants
            </Link>
          </div>
        </div>
      </section>

      {/* Popular Cuisines */}
      <section className="py-16 bg-white">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">Popular Cuisines</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {[
              { name: 'Italian', image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=300', color: 'bg-red-100' },
              { name: 'Chinese', image: 'https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg?auto=compress&cs=tinysrgb&w=300', color: 'bg-yellow-100' },
              { name: 'Mexican', image: 'https://images.pexels.com/photos/461198/pexels-photo-461198.jpeg?auto=compress&cs=tinysrgb&w=300', color: 'bg-orange-100' },
              { name: 'Indian', image: 'https://images.pexels.com/photos/2474658/pexels-photo-2474658.jpeg?auto=compress&cs=tinysrgb&w=300', color: 'bg-yellow-100' },
              { name: 'American', image: 'https://images.pexels.com/photos/70497/pexels-photo-70497.jpeg?auto=compress&cs=tinysrgb&w=300', color: 'bg-blue-100' },
              { name: 'Thai', image: 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=300', color: 'bg-green-100' }
            ].map((cuisine, index) => (
              <Link
                key={index}
                to={`/restaurants?cuisine=${cuisine.name}`}
                className={`${cuisine.color} rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1`}
              >
                <img 
                  src={cuisine.image} 
                  alt={cuisine.name}
                  className="w-16 h-16 object-cover rounded-full mx-auto mb-3"
                />
                <h3 className="font-semibold text-gray-800">{cuisine.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Restaurants */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Featured Restaurants</h2>
            <p className="text-gray-600">Discover amazing restaurants in your area</p>
          </div>

          {loading ? (
            <div className="flex justify-center">
              <LoadingSpinner size="large" text="Loading restaurants..." />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredRestaurants.map((restaurant) => (
                <Link
                  key={restaurant._id}
                  to={`/restaurants/${restaurant._id}`}
                  className="restaurant-card fade-in"
                >
                  <img
                    src={restaurant.images?.[0] || 'https://images.pexels.com/photos/260922/pexels-photo-260922.jpeg?auto=compress&cs=tinysrgb&w=400'}
                    alt={restaurant.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="restaurant-card-body">
                    <h3>{restaurant.name}</h3>
                    <p className="cuisine">{restaurant.cuisine?.join(', ')}</p>
                    <div className="rating">
                      <span>⭐</span>
                      <span>{restaurant.rating ? restaurant.rating.toFixed(1) : 'New'}</span>
                      <span>({restaurant.totalReviews} reviews)</span>
                    </div>
                    <div className="delivery-info">
                      <span>{restaurant.deliveryTime?.min}-{restaurant.deliveryTime?.max} min</span>
                      <span>${restaurant.deliveryFee?.toFixed(2)} delivery</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link to="/restaurants" className="btn btn-outline btn-large">
              View All Restaurants
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-gray-600">Order food in 3 simple steps</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4">Choose Restaurant</h3>
              <p className="text-gray-600">Browse through hundreds of restaurants and find your favorite cuisine</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m2.6 8L6 5H3m4 8a2 2 0 10-2 2m8-2a2 2 0 10-2 2m2-2H9"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4">Place Order</h3>
              <p className="text-gray-600">Add items to cart, customize your order, and proceed to secure checkout</p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4">Fast Delivery</h3>
              <p className="text-gray-600">Track your order in real-time and enjoy fresh food delivered to your door</p>
            </div>
          </div>
        </div>
      </section>

      {/* Download App Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Get the FoodDelivery App</h2>
              <p className="text-lg mb-8 opacity-90">
                Download our mobile app for faster ordering, exclusive deals, and seamless food delivery experience.
              </p>
              <div className="flex space-x-4">
                <img 
                  src="https://via.placeholder.com/150x50/000/fff?text=App+Store" 
                  alt="Download on App Store" 
                  className="h-12 cursor-pointer hover:opacity-80 transition-opacity"
                />
                <img 
                  src="https://via.placeholder.com/150x50/000/fff?text=Google+Play" 
                  alt="Get it on Google Play" 
                  className="h-12 cursor-pointer hover:opacity-80 transition-opacity"
                />
              </div>
            </div>
            <div className="text-center">
              <img 
                src="https://via.placeholder.com/300x600/4299e1/fff?text=Mobile+App" 
                alt="Mobile App Preview" 
                className="max-w-xs mx-auto"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;