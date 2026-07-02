import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { CartItem, Product, Order } from '@/types'
import { useProductsStore } from './products'
import { useAuthStore } from './auth'
import { mockOrders } from '@/data/mockData'
import { hasConfig } from '@/services/firebase'
import { saveOrder as fbSaveOrder } from '@/services/db'

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([])
  const orders = ref<Order[]>([])
  const lastAddedProduct = ref<{ name: string; image: string } | null>(null)

  const totalCount = computed(() => 
    items.value.reduce((sum, item) => sum + item.quantity, 0)
  )

  const totalPrice = computed(() => 
    items.value.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
  )

  function addToCart(product: Product, quantity: number = 1) {
    const existingItem = items.value.find(item => item.productId === product.id)
    
    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      items.value.push({
        productId: product.id,
        product,
        quantity
      })
    }

    lastAddedProduct.value = {
      name: product.name,
      image: product.images[0]
    }
  }

  function removeFromCart(productId: number) {
    items.value = items.value.filter(item => item.productId !== productId)
  }

  function updateQuantity(productId: number, quantity: number) {
    const item = items.value.find(item => item.productId === productId)
    if (item) {
      if (quantity <= 0) {
        removeFromCart(productId)
      } else {
        item.quantity = quantity
      }
    }
  }

  function clearCart() {
    items.value = []
  }

  function createOrder(shippingAddress: Order['shippingAddress'], paymentMethod: Order['paymentMethod']): Order {
    const productsStore = useProductsStore()
    
    const orderItems = items.value.map(item => ({
      productId: item.productId,
      productName: item.product.name,
      productImage: item.product.images[0],
      price: item.product.price,
      quantity: item.quantity
    }))

    const authStore = useAuthStore()

    const newOrder: Order = {
      id: orders.value.length + 1,
      userId: authStore.user?.id || 0,
      items: orderItems,
      totalAmount: totalPrice.value,
      status: 'pending',
      shippingAddress,
      paymentMethod,
      createdAt: new Date().toISOString()
    }

    orders.value.push(newOrder)
    clearCart()

    // Sync to Firestore if configured
    if (hasConfig) {
      fbSaveOrder(newOrder).catch(() => {})
    }
    
    return newOrder
  }

  function getOrdersByUserId(userId: number): Order[] {
    return orders.value.filter(order => order.userId === userId)
  }

  function getOrderById(orderId: number): Order | undefined {
    return orders.value.find(order => order.id === orderId)
  }

  return {
    items,
    orders,
    lastAddedProduct,
    totalCount,
    totalPrice,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    createOrder,
    getOrdersByUserId,
    getOrderById
  }
}, {
  persist: {
    afterRestore: (ctx) => {
      // Ensure orders are never empty on page load — seed from mock data
      if (ctx.store.orders.length === 0) {
        ctx.store.orders = mockOrders
      }
    }
  }
})