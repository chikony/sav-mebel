import type { Product, Category, Review, User, Order } from '@/types'
import catTables from '@/assets/cat-tables.webp'
import catChairs from '@/assets/cat-chairs.jpg'
import catWardrobes from '@/assets/cat-wardrobes.jpg'

export const mockCategories: Category[] = [
  {
    id: 'sofas',
    name: 'Диваны',
    description: 'Уютные диваны для вашей гостиной',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400'
  },
  {
    id: 'beds',
    name: 'Кровати',
    description: 'Комфортные кровати для здорового сна',
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400'
  },
  {
    id: 'tables',
    name: 'Столы',
    description: 'Обеденные и рабочие столы',
    image: catTables
  },
  {
    id: 'chairs',
    name: 'Стулья',
    description: 'Стильные стулья для любого интерьера',
    image: catChairs
  },
  {
    id: 'wardrobes',
    name: 'Шкафы',
    description: 'Вместительные шкафы для хранения',
    image: catWardrobes
  },
  {
    id: 'kitchens',
    name: 'Кухни',
    description: 'Современные кухонные гарнитуры',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400'
  }
]

export const mockProducts: Product[] = [
  {
    id: 1,
    name: 'Диван "Скандинавия"',
    description: 'Современный трехместный диван в скандинавском стиле. Обивка из качественной ткани, каркас из массива березы. Идеально подходит для современной гостиной.',
    price: 45990,
    category: 'sofas',
    images: [
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600',
      'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=600'
    ],
    inStock: true,
    rating: 4.8,
    reviewCount: 24,
    specifications: {
      'Ширина': '220 см',
      'Глубина': '95 см',
      'Высота': '85 см',
      'Материал': 'Ткань, дерево',
      'Цвет': 'Серый'
    },
    createdAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 2,
    name: 'Кровать "Классика"',
    description: 'Двуспальная кровать с мягким изголовьем. Ортопедическое основание, подъемный механизм для хранения белья.',
    price: 35990,
    category: 'beds',
    images: [
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600',
      'https://images.unsplash.com/photo-1511300636442-4e11e7e1e7f3?w=600'
    ],
    inStock: true,
    rating: 4.9,
    reviewCount: 18,
    specifications: {
      'Ширина': '160 см',
      'Длина': '200 см',
      'Высота': '120 см',
      'Материал': 'Экокожа, металл',
      'Цвет': 'Бежевый'
    },
    createdAt: '2024-02-10T10:00:00Z'
  },
  {
    id: 3,
    name: 'Обеденный стол "Лофт"',
    description: 'Стол в стиле лофт с массивной деревянной столешницей и металлическими ножками. Вмещает до 6 человек.',
    price: 28990,
    category: 'tables',
    images: [
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600',
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600'
    ],
    inStock: true,
    rating: 4.7,
    reviewCount: 12,
    specifications: {
      'Ширина': '180 см',
      'Глубина': '90 см',
      'Высота': '75 см',
      'Материал': 'Дуб, металл',
      'Цвет': 'Натуральный'
    },
    createdAt: '2024-01-20T10:00:00Z'
  },
  {
    id: 4,
    name: 'Стул "Модерн"',
    description: 'Эргономичный стул с мягкой сидушкой и спинкой. Подходит для кухни, офиса или гостиной.',
    price: 8990,
    category: 'chairs',
    images: [
      'https://images.unsplash.com/photo-1506461883276-594a12b11cf3?w=600',
      'https://images.unsplash.com/photo-1505740101123-34c5f4eb4e0f?w=600'
    ],
    inStock: true,
    rating: 4.5,
    reviewCount: 31,
    specifications: {
      'Ширина': '45 см',
      'Глубина': '50 см',
      'Высота': '85 см',
      'Материал': 'Ткань, дерево',
      'Цвет': 'Синий'
    },
    createdAt: '2024-02-05T10:00:00Z'
  },
  {
    id: 5,
    name: 'Шкаф-купе "Престиж"',
    description: 'Вместительный шкаф-купе с зеркальными дверями. Три секции, внутреннее наполнение: полки, ящики, штанга.',
    price: 52990,
    category: 'wardrobes',
    images: [
      'https://images.unsplash.com/photo-1600585153490-76fb20a32601?w=600',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=600'
    ],
    inStock: true,
    rating: 4.6,
    reviewCount: 9,
    specifications: {
      'Ширина': '270 см',
      'Глубина': '60 см',
      'Высота': '240 см',
      'Материал': 'ЛДСП, зеркало',
      'Цвет': 'Белый'
    },
    createdAt: '2024-01-25T10:00:00Z'
  },
  {
    id: 6,
    name: 'Угловой диван "Комфорт"',
    description: 'Большой угловой диван с оттоманкой. Спальное место 140х200 см. Механизм трансформации "дельфин".',
    price: 62990,
    category: 'sofas',
    images: [
      'https://images.unsplash.com/photo-1567016432779-094069958ea5?w=600',
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600'
    ],
    inStock: true,
    rating: 4.9,
    reviewCount: 42,
    specifications: {
      'Ширина': '280 см',
      'Глубина': '180 см',
      'Высота': '90 см',
      'Материал': 'Велюр, дерево',
      'Цвет': 'Изумрудный'
    },
    createdAt: '2024-02-01T10:00:00Z'
  },
  {
    id: 7,
    name: 'Кухонный гарнитур "Модерн"',
    description: 'Современный кухонный гарнитур с фасадами из МДФ в эмали. В комплекте: верхние и нижние шкафы, мойка, фурнитура.',
    price: 125990,
    category: 'kitchens',
    images: [
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600',
      'https://images.unsplash.com/photo-1600585153490-76fb20a32601?w=600'
    ],
    inStock: true,
    rating: 4.8,
    reviewCount: 7,
    specifications: {
      'Ширина': '300 см',
      'Глубина': '60 см',
      'Высота': '220 см',
      'Материал': 'МДФ, фурнитура Blum',
      'Цвет': 'Серый матовый'
    },
    createdAt: '2024-02-15T10:00:00Z'
  },
  {
    id: 8,
    name: 'Письменный стол "Офис"',
    description: 'Функциональный письменный стол с тремя ящиками и кабель-менеджментом. Подходит для домашнего офиса.',
    price: 18990,
    category: 'tables',
    images: [
      'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=600',
      'https://images.unsplash.com/photo-1533090481720-856c6e795c7e?w=600'
    ],
    inStock: true,
    rating: 4.4,
    reviewCount: 15,
    specifications: {
      'Ширина': '140 см',
      'Глубина': '70 см',
      'Высота': '75 см',
      'Материал': 'ЛДСП, металл',
      'Цвет': 'Дуб сонома'
    },
    createdAt: '2024-01-30T10:00:00Z'
  }
]

export const mockReviews: Review[] = [
  {
    id: 1,
    productId: 1,
    userId: 1,
    userName: 'Александр М.',
    rating: 5,
    comment: 'Отличный диван! Очень удобный и красивый. Качество на высоте, сборка простая.',
    createdAt: '2024-02-20T10:00:00Z'
  },
  {
    id: 2,
    productId: 1,
    userId: 2,
    userName: 'Елена К.',
    rating: 4,
    comment: 'Диван хороший, но доставка задержалась на неделю. В остальном все отлично.',
    createdAt: '2024-02-18T10:00:00Z'
  },
  {
    id: 3,
    productId: 2,
    userId: 3,
    userName: 'Дмитрий П.',
    rating: 5,
    comment: 'Кровать просто супер! Спальное место огромное, подъемный механизм работает отлично.',
    createdAt: '2024-02-15T10:00:00Z'
  },
  {
    id: 4,
    productId: 3,
    userId: 4,
    userName: 'Ольга С.',
    rating: 5,
    comment: 'Стол очень стильный, вписался в интерьер идеально. Качество дерева отличное.',
    createdAt: '2024-02-10T10:00:00Z'
  }
]

export const mockUsers: User[] = [
  {
    id: 1,
    email: 'admin@sav-mebel.ru',
    name: 'Администратор',
    phone: '+7 (999) 000-00-01',
    role: 'admin',
    createdAt: '2024-01-01T10:00:00Z'
  },
  {
    id: 2,
    email: 'user@example.com',
    name: 'Иван Иванов',
    phone: '+7 (999) 123-45-67',
    role: 'user',
    createdAt: '2024-01-15T10:00:00Z'
  }
]

export const mockOrders: Order[] = [
  {
    id: 1,
    userId: 2,
    items: [
      {
        productId: 1,
        productName: 'Диван "Скандинавия"',
        productImage: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400',
        price: 45990,
        quantity: 1
      }
    ],
    totalAmount: 45990,
    status: 'delivered',
    shippingAddress: {
      name: 'Иван Иванов',
      phone: '+7 (999) 123-45-67',
      address: 'ул. Ленина, д. 10, кв. 5',
      city: 'Москва',
      postalCode: '101000'
    },
    paymentMethod: 'card',
    createdAt: '2024-02-01T10:00:00Z',
    deliveredAt: '2024-02-05T14:30:00Z'
  },
  {
    id: 2,
    userId: 2,
    items: [
      {
        productId: 3,
        productName: 'Обеденный стол "Лофт"',
        productImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400',
        price: 28990,
        quantity: 1
      },
      {
        productId: 4,
        productName: 'Стул "Модерн"',
        productImage: 'https://images.unsplash.com/photo-1506461883276-594a12b11cf3?w=400',
        price: 8990,
        quantity: 4
      }
    ],
    totalAmount: 64950,
    status: 'shipped',
    shippingAddress: {
      name: 'Иван Иванов',
      phone: '+7 (999) 123-45-67',
      address: 'ул. Ленина, д. 10, кв. 5',
      city: 'Москва',
      postalCode: '101000'
    },
    paymentMethod: 'card',
    createdAt: '2024-02-20T10:00:00Z'
  }
]