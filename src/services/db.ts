import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  type DocumentData
} from 'firebase/firestore'
import { db, hasConfig } from './firebase'
import type { Order, Review, User, Product, Category } from '@/types'

function checkDb() {
  if (!hasConfig || !db) {
    throw new Error('Firebase not configured')
  }
  return db
}

// ---------- Products ----------

export async function fetchProducts(): Promise<Product[]> {
  const _db = checkDb()
  const snap = await getDocs(collection(_db, 'products'))
  return snap.docs.map(d => ({ id: Number(d.id), ...d.data() } as unknown as Product))
}

export async function saveProduct(product: Product) {
  const _db = checkDb()
  await setDoc(doc(_db, 'products', String(product.id)), product as unknown as DocumentData)
}

// ---------- Categories ----------

export async function fetchCategories(): Promise<Category[]> {
  const _db = checkDb()
  const snap = await getDocs(collection(_db, 'categories'))
  return snap.docs.map(d => d.data() as Category)
}

// ---------- Reviews ----------

export async function fetchReviews(): Promise<Review[]> {
  const _db = checkDb()
  const snap = await getDocs(collection(_db, 'reviews'))
  return snap.docs.map(d => ({ id: Number(d.id), ...d.data() } as unknown as Review))
}

export async function saveReview(review: Review) {
  const _db = checkDb()
  await setDoc(doc(_db, 'reviews', String(review.id)), review as unknown as DocumentData)
}

export async function fetchProductReviews(productId: number): Promise<Review[]> {
  const _db = checkDb()
  const q = query(collection(_db, 'reviews'), where('productId', '==', productId), orderBy('createdAt', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: Number(d.id), ...d.data() } as unknown as Review))
}

// ---------- Orders ----------

export async function fetchOrders(): Promise<Order[]> {
  const _db = checkDb()
  const snap = await getDocs(collection(_db, 'orders'))
  return snap.docs.map(d => ({ id: Number(d.id), ...d.data() } as unknown as Order))
}

export async function saveOrder(order: Order) {
  const _db = checkDb()
  await setDoc(doc(_db, 'orders', String(order.id)), order as unknown as DocumentData)
}

export async function fetchUserOrders(userId: number): Promise<Order[]> {
  const _db = checkDb()
  const q = query(collection(_db, 'orders'), where('userId', '==', userId))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: Number(d.id), ...d.data() } as unknown as Order))
}

// ---------- Users ----------

export async function fetchUsers(): Promise<User[]> {
  const _db = checkDb()
  const snap = await getDocs(collection(_db, 'users'))
  return snap.docs.map(d => ({ id: Number(d.id), ...d.data() } as unknown as User))
}

export async function saveUser(user: User) {
  const _db = checkDb()
  await setDoc(doc(_db, 'users', String(user.id)), user as unknown as DocumentData)
}
