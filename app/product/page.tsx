'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import {
  RiHomeLine, RiTBoxLine, RiHistoryLine, RiTruckLine,
  RiUserLine, RiLogoutBoxLine, RiSearchLine,
  RiAddLine, RiEditLine, RiDeleteBinLine,
  RiFileListLine, RiPriceTag3Line, RiStarLine,
  RiFilterLine, RiSortAsc
} from 'react-icons/ri';
import { useCurrency } from '../contexts/CurrencyContext';
import Sidebar from '../components/Sidebar';
import CustomCursor from '../components/CustomCursor';

// Sample products data
const products = [
  {
    id: 'PRD001',
    name: 'Wireless Headphones',
    category: 'Electronics',
    price: 99.99,
    stock: 45,
    status: 'Active',
    rating: 4.5,
    image: '/product1.jpg'
  },
  {
    id: 'PRD002',
    name: 'Smart Watch',
    category: 'Electronics',
    price: 199.99,
    stock: 30,
    status: 'Active',
    rating: 4.2,
    image: '/product2.jpg'
  },
  {
    id: 'PRD003',
    name: 'Laptop Backpack',
    category: 'Accessories',
    price: 49.99,
    stock: 60,
    status: 'Active',
    rating: 4.8,
    image: '/product3.jpg'
  },
  {
    id: 'PRD004',
    name: 'Bluetooth Speaker',
    category: 'Electronics',
    price: 79.99,
    stock: 0,
    status: 'Out of Stock',
    rating: 4.0,
    image: '/product4.jpg'
  },
];

// Product categories
const categories = [
  'All Categories',
  'Electronics',
  'Accessories',
  'Clothing',
  'Home & Living'
];

export default function ProductPage() {
  const [activeSection, setActiveSection] = useState('product');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [sortBy, setSortBy] = useState('name');
  const [showAddModal, setShowAddModal] = useState(false);
  const { convertAmount } = useCurrency();

  // Filter and sort products
  const filteredProducts = products
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'All Categories' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'price') return a.price - b.price;
      if (sortBy === 'stock') return b.stock - a.stock;
      return 0;
    });

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-blue-900/20 to-black">
      <CustomCursor />
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      
      <main className="ml-16 transition-all duration-300">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white">Products</h1>
              <p className="text-gray-400 text-sm mt-1">Manage your product inventory</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              onClick={() => setShowAddModal(true)}
              className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition-colors"
            >
              <RiAddLine className="mr-2" />
              Add Product
            </motion.button>
          </div>

          {/* Filters and Search */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none min-w-[160px]"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none min-w-[140px]"
            >
              <option value="name">Sort by Name</option>
              <option value="price">Sort by Price</option>
              <option value="stock">Sort by Stock</option>
            </select>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden group"
              >
                <div className="relative h-48">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                    <h3 className="text-white font-semibold truncate">{product.name}</h3>
                    <div className="flex items-center mt-1">
                      <RiStarLine className="text-yellow-400 mr-1" />
                      <span className="text-white text-sm">{product.rating}</span>
                    </div>
                  </div>
                </div>
                <div className="p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">{product.category}</span>
                    <span className="text-white font-semibold">{convertAmount(product.price)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      product.stock > 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                    }`}>
                      {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                    </span>
                    <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                      >
                        <RiEditLine className="text-blue-400" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                      >
                        <RiDeleteBinLine className="text-red-400" />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
