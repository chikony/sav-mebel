export interface User {
  id: number
  email: string
  name: string
  phone?: string
  avatar?: string
  role: 'user' | 'admin'
  createdAt: string
}

export interface Product {
  id: number
  name: string
  description: string
  price: number
  category: string
  images: string[]
  inStock: boolean
  rating: number
  reviewCount: number
  specifications: Record<string, string>
  createdAt: string
}

export interface Review {
  id: number
  productId: number
  userId: number
  userName: string
  rating: number
  comment: string
  createdAt: string
}

export interface CartItem {
  productId: number
  product: Product
  quantity: number
}

export interface OrderItem {
  productId: number
  productName: string
  productImage: string
  price: number
  quantity: number
}

export interface Order {
  id: number
  userId: number
  items: OrderItem[]
  totalAmount: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  shippingAddress: {
    name: string
    phone: string
    address: string
    city: string
    postalCode: string
  }
  paymentMethod: 'card' | 'cash'
  createdAt: string
  deliveredAt?: string
}

export interface Category {
  id: string
  name: string
  description: string
  image: string
}