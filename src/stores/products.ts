import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Product, Review, Category } from '@/types'
import { mockProducts, mockCategories, mockReviews } from '@/data/mockData'
import { hasConfig } from '@/services/firebase'
import { saveReview as fbSaveReview } from '@/services/db'

export const useProductsStore = defineStore('products', () => {
  const products = ref<Product[]>(mockProducts)
  const categories = ref<Category[]>(mockCategories)
  const reviews = ref<Review[]>(mockReviews)
  const loading = ref(false)

  const featuredProducts = computed(() => 
    products.value.filter(p => p.rating >= 4.5).slice(0, 8)
  )

  const newProducts = computed(() => 
    [...products.value].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ).slice(0, 8)
  )

  function getProductById(id: number): Product | undefined {
    return products.value.find(p => p.id === id)
  }

  function getProductsByCategory(categoryId: string): Product[] {
    if (categoryId === 'all') return products.value
    return products.value.filter(p => p.category === categoryId)
  }

  function getProductReviews(productId: number): Review[] {
    return reviews.value.filter(r => r.productId === productId)
  }

  function addReview(review: Omit<Review, 'id' | 'createdAt'>) {
    const newReview: Review = {
      ...review,
      id: reviews.value.length + 1,
      createdAt: new Date().toISOString()
    }
    reviews.value.push(newReview)
    
    // Update product rating
    const product = products.value.find(p => p.id === review.productId)
    if (product) {
      const productReviews = reviews.value.filter(r => r.productId === review.productId)
      const totalRating = productReviews.reduce((sum, r) => sum + r.rating, 0)
      product.rating = Math.round((totalRating / productReviews.length) * 10) / 10
      product.reviewCount = productReviews.length
    }

    // Sync to Firestore if configured
    if (hasConfig) {
      fbSaveReview(newReview).catch(() => {})
    }
  }

  function addProduct(product: Omit<Product, 'id' | 'createdAt' | 'reviewCount' | 'rating'>) {
    const newProduct: Product = {
      ...product,
      id: products.value.length + 1,
      rating: 0,
      reviewCount: 0,
      createdAt: new Date().toISOString()
    }
    products.value.push(newProduct)
    return newProduct
  }

  function updateProduct(id: number, updates: Partial<Product>) {
    const index = products.value.findIndex(p => p.id === id)
    if (index !== -1) {
      products.value[index] = { ...products.value[index], ...updates }
    }
  }

  function deleteProduct(id: number) {
    products.value = products.value.filter(p => p.id !== id)
    reviews.value = reviews.value.filter(r => r.productId !== id)
  }

  return {
    products,
    categories,
    reviews,
    loading,
    featuredProducts,
    newProducts,
    getProductById,
    getProductsByCategory,
    getProductReviews,
    addReview,
    addProduct,
    updateProduct,
    deleteProduct
  }
}, {
  persist: true
})