import { hasConfig } from './firebase'
import { fetchProducts, fetchCategories, fetchReviews, fetchOrders, fetchUsers } from './db'
import { useProductsStore } from '@/stores/products'
import { useCartStore } from '@/stores/cart'
import { useAuthStore } from '@/stores/auth'

export async function syncFromFirestore() {
  if (!hasConfig) return

  try {
    const productsStore = useProductsStore()
    const cartStore = useCartStore()
    const authStore = useAuthStore()

    const [products, categories, reviews, orders, users] = await Promise.all([
      fetchProducts(),
      fetchCategories(),
      fetchReviews(),
      fetchOrders(),
      fetchUsers()
    ])

    if (products.length > 0) productsStore.products = products
    if (categories.length > 0) productsStore.categories = categories
    if (reviews.length > 0) productsStore.reviews = reviews

    const persistedOrders = cartStore.orders
    if (orders.length > 0) {
      const mergedOrders = [...orders]
      for (const o of persistedOrders) {
        if (!mergedOrders.find(m => m.id === o.id)) {
          mergedOrders.push(o)
        }
      }
      cartStore.orders = mergedOrders
    }
  } catch (e) {
    console.warn('Firestore sync failed, using local data', e)
  }
}
