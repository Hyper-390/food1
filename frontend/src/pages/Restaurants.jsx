import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { restaurantsAPI } from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Restaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    cuisine: searchParams.get('cuisine') || '',
    rating: searchParams.get('rating') || '',
    city: searchParams.get('city') || ''
  });

  const cuisineTypes = ['Italian', 'Chinese', 'Mexican', 'Indian', 'American', 'Thai', 'Japanese', 'Mediterranean'];

  useEffect(() => {
    fetchRestaurants();
  }, [searchParams]);

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      let response;
      
      const queryParams = {};
      Object.keys(filters).forEach(key => {
        const value = searchParams.get(key) || filters[key];
        if (value) queryParams[key] = value;
      });

      if (Object.keys(queryParams).length > 0) {
        response = await restaurantsAPI.search(queryParams);
      } else {
        response = await restaurantsAPI.getAll();
      }
      
      setRestaurants(response.data.data);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);

    // Update URL params
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      cuisine: '',
      rating: '',
      city: ''
    });
    setSearchParams(new URLSearchParams());
  };

  const handleSearch = (e) => {
    e.preventDefault();
    handleFilterChange('search', filters.search);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="container py-8">
          <h1 className="text-3xl font-bold mb-6">Restaurants</h1>
          
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mb-6">
            <div className="flex gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search restaurants, cuisines, or dishes..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="form-control"
                />
              </div>
              <button type="submit" className="btn btn-primary">
                Search
              </button>
            </div>
          </form>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Cuisine:</label>
              <select
                value={filters.cuisine}
                onChange={(e) => handleFilterChange('cuisine', e.target.value)}
                className="form-control w-auto"
              >
                <option value="">All Cuisines</option>
                {cuisineTypes.map((cuisine) => (
                  <option key={cuisine} value={cuisine}>
                    {cuisine}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Rating:</label>
              <select
                value={filters.rating}
                onChange={(e) => handleFilterChange('rating', e.target.value)}
                className="form-control w-auto"
              >
                <option value="">Any Rating</option>
                <option value="4">4+ Stars</option>
                <option value="3">3+ Stars</option>
                <option value="2">2+ Stars</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">City:</label>
              <input
                type="text"
                placeholder="Enter city"
                value={filters.city}
                onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                onBlur={(e) => handleFilterChange('city', e.target.value)}
                className="form-control w-auto"
              />
            </div>

            {(filters.search || filters.cuisine || filters.rating || filters.city) && (
              <button
                onClick={clearFilters}
                className="btn btn-outline btn-small"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="container py-8">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <LoadingSpinner size="large" text="Loading restaurants..." />
          </div>
        ) : restaurants.length === 0 ? (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.463-.64-6.32-1.709C3.632 12.146 2 10.167 2 7.9A7.967 7.967 0 0112 0c4.418 0 8 3.582 8 8 0 2.172-.86 4.14-2.255 5.291L21 22l-3-3z"/>
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No restaurants found</h3>
              <p className="text-gray-600 mb-4">
                We couldn't find any restaurants matching your criteria. Try adjusting your filters or search terms.
              </p>
              <button
                onClick={clearFilters}
                className="btn btn-primary"
              >
                Clear Filters
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600">
                Found {restaurants.length} restaurant{restaurants.length !== 1 ? 's' : ''}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {restaurants.map((restaurant) => (
                <Link
                  key={restaurant._id}
                  to={`/restaurants/${restaurant._id}`}
                  className="restaurant-card"
                >
                  <img
                    src={restaurant.images?.[0] || 'https://images.pexels.com/photos/260922/pexels-photo-260922.jpeg?auto=compress&cs=tinysrgb&w=400'}
                    alt={restaurant.name}
                    onError={(e) => {
                      e.target.src = 'https://images.pexels.com/photos/260922/pexels-photo-260922.jpeg?auto=compress&cs=tinysrgb&w=400';
                    }}
                  />
                  <div className="restaurant-card-body">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold">{restaurant.name}</h3>
                      {restaurant.isOpen ? (
                        <span className="badge badge-success text-xs">Open</span>
                      ) : (
                        <span className="badge badge-danger text-xs">Closed</span>
                      )}
                    </div>
                    
                    <p className="cuisine text-sm text-gray-600 mb-2">
                      {restaurant.cuisine?.join(', ')}
                    </p>
                    
                    <div className="flex items-center gap-2 mb-2">
                      <div className="rating flex items-center">
                        <span className="text-yellow-500">⭐</span>
                        <span className="text-sm font-medium">
                          {restaurant.rating ? restaurant.rating.toFixed(1) : 'New'}
                        </span>
                        <span className="text-sm text-gray-500">
                          ({restaurant.totalReviews || 0} reviews)
                        </span>
                      </div>
                    </div>
                    
                    <div className="delivery-info flex justify-between text-sm text-gray-600">
                      <span>
                        {restaurant.deliveryTime?.min}-{restaurant.deliveryTime?.max} min
                      </span>
                      <span>${restaurant.deliveryFee?.toFixed(2)} delivery</span>
                    </div>
                    
                    {restaurant.minimumOrder && (
                      <p className="text-xs text-gray-500 mt-1">
                        Min. order: ${restaurant.minimumOrder.toFixed(2)}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Restaurants;