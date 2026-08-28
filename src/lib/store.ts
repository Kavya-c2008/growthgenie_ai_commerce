import type { Address } from '../types/genmb'
import { seedProducts, type Product } from '../data/products'

export type CartItem = {
  productId: string
  quantity: number
}

export type Cart = {
  items: CartItem[]
  couponCode?: string
}

export type UserProfile = {
  id: string
  name: string
  email: string
  role: 'customer' | 'admin'
  joinedAt: string
  preferences: string[]
}

export type OrderStatus =
  | 'Processing'
  | 'Paid'
  | 'Packed'
  | 'Shipped'
  | 'Delivered'
  | 'Cancelled'

export type Order = {
  id: string
  userId: string
  email: string
  items: CartItem[]
  address: Address
  subtotal: number
  discount: number
  total: number
  couponCode?: string
  status: OrderStatus
  createdAt: string
  paymentSessionId: string
}

export type Review = {
  id: string
  productId: string
  userId: string
  author: string
  rating: number
  comment: string
  createdAt: string
}

export type Conversation = {
  id: string
  role: 'user' | 'agent'
  text: string
  productIds?: string[]
  createdAt: string
}

export type Coupon = {
  code: string
  label: string
  percent: number
  minSpend: number
}

const key = {
  product: (id: string) => `product:${id}`,
  profile: (id: string) => `user:${id}:profile`,
  cart: (id: string) => `user:${id}:cart`,
  wishlist: (id: string) => `user:${id}:wishlist`,
  address: (id: string, addressId: string) =>
    `user:${id}:address:${addressId}`,
  order: (id: string, orderId: string) =>
    `user:${id}:order:${orderId}`,
  globalOrder: (orderId: string) => `order:${orderId}`,
  review: (productId: string, reviewId: string) =>
    `review:${productId}:${reviewId}`,
  conversation: (id: string, conversationId: string) =>
    `user:${id}:conversation:${conversationId}`,
}

const requireKV = () => {
  if (!window.genmb?.kv) {
    throw new Error(
      'The secure GrowthGenie data service is not available yet. Please refresh and try again.'
    )
  }

  return window.genmb.kv
}

/*
 * Seed the remote catalog when the GenMB data service is available.
 * If GenMB is unavailable, the application will use seedProducts locally.
 */
export async function ensureCatalog() {
  const kv = requireKV()

  const state = (await kv.get('catalog:seeded')) as {
    version?: number
  } | null

  if (!state || (state.version ?? 0) < 2) {
    for (const product of seedProducts) {
      const existing = await kv.get(key.product(product.id))

      if (!existing) {
        await kv.set(key.product(product.id), product)
      }
    }

    await kv.set('coupon:WELCOME10', {
      code: 'WELCOME10',
      label: '10% off your first order',
      percent: 10,
      minSpend: 1500,
    } satisfies Coupon)

    await kv.set('coupon:SPRING15', {
      code: 'SPRING15',
      label: '15% off orders over ₹15,000',
      percent: 15,
      minSpend: 15000,
    } satisfies Coupon)

    await kv.set('catalog:seeded', {
      seededAt: new Date().toISOString(),
      version: 2,
    })
  }
}

/*
 * Return products from GenMB when available.
 * Otherwise return the local seed catalog.
 */
export async function listProducts(): Promise<Product[]> {
  try {
    await ensureCatalog()

    const result = await requireKV().list('product:')

    const remoteProducts = result.data
      .map((row) => row.value as Product)
      .filter(Boolean)

    if (remoteProducts.length > 0) {
      return remoteProducts.sort(
        (a, b) => b.popularity - a.popularity
      )
    }
  } catch {
    // GenMB unavailable — use local catalog.
  }

  return [...seedProducts].sort(
    (a, b) => b.popularity - a.popularity
  )
}

/*
 * Get one product.
 * Use the remote product first, then fall back to local seedProducts.
 */
export async function getProduct(
  id: string
): Promise<Product | null> {
  try {
    await ensureCatalog()

    const remoteProduct = await requireKV().get(key.product(id))

    if (remoteProduct) {
      return remoteProduct as Product
    }
  } catch {
    // GenMB unavailable — use local catalog.
  }

  return (
    seedProducts.find((product) => product.id === id) ?? null
  )
}

export async function saveProduct(product: Product) {
  await requireKV().set(key.product(product.id), product)
}

export async function removeProduct(id: string) {
  await requireKV().delete(key.product(id))
}

export async function ensureProfile(
  user: {
    id: string
    name: string
    email: string
  }
): Promise<UserProfile> {
  const kv = requireKV()

  const existing = (await kv.get(
    key.profile(user.id)
  )) as UserProfile | null

  if (existing) {
    return existing
  }

  const profile: UserProfile = {
    id: user.id,
    email: user.email,
    name:
      user.name ||
      user.email.split('@')[0],
    role:
      user.email.toLowerCase() ===
      'admin@growthgenie.ai'
        ? 'admin'
        : 'customer',
    joinedAt: new Date().toISOString(),
    preferences: [],
  }

  await kv.set(key.profile(user.id), profile)

  return profile
}

export async function saveProfile(
  profile: UserProfile
) {
  await requireKV().set(
    key.profile(profile.id),
    profile
  )
}

export async function listProfiles(): Promise<
  UserProfile[]
> {
  const result = await requireKV().list('user:')

  return result.data
    .filter((row) => row.key.endsWith(':profile'))
    .map((row) => row.value as UserProfile)
}

const localCartKey = (userId: string) =>
  `growthgenie_cart_${userId}`

export async function getCart(
  userId: string
): Promise<Cart> {
  try {
    const saved = localStorage.getItem(
      localCartKey(userId)
    )

    return saved
      ? JSON.parse(saved)
      : { items: [] }
  } catch {
    return { items: [] }
  }
}

export async function saveCart(
  userId: string,
  cart: Cart
) {
  localStorage.setItem(
    localCartKey(userId),
    JSON.stringify(cart)
  )

  try {
    await requireKV().set(
      key.cart(userId),
      cart
    )
  } catch {
    // Local storage is the fallback/source of truth.
  }
}
const localWishlistKey = (userId: string) =>
  `growthgenie_wishlist_${userId}`

export async function getWishlist(
  userId: string
): Promise<string[]> {
  try {
    const saved = localStorage.getItem(
      localWishlistKey(userId)
    )

    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

export async function saveWishlist(
  userId: string,
  wishlist: string[]
) {
  localStorage.setItem(
    localWishlistKey(userId),
    JSON.stringify(wishlist)
  )

  // Also try GenMB when it is available.
  try {
    await requireKV().set(
      key.wishlist(userId),
      wishlist
    )
  } catch {
    // Local storage is the fallback/source of truth.
  }
}

export async function listAddresses(
  userId: string
): Promise<Array<Address & { id: string }>> {
  const result = await requireKV().list(
    `user:${userId}:address:`
  )

  return result.data.map(
    (row) =>
      row.value as Address & {
        id: string
      }
  )
}

export async function saveAddress(
  userId: string,
  address: Address & { id: string }
) {
  await requireKV().set(
    key.address(userId, address.id),
    address
  )
}

export async function deleteAddress(
  userId: string,
  addressId: string
) {
  await requireKV().delete(
    key.address(userId, addressId)
  )
}

export async function listOrders(
  userId?: string
): Promise<Order[]> {
  const result = await requireKV().list(
    userId
      ? `user:${userId}:order:`
      : 'order:'
  )

  return result.data
    .map((row) => row.value as Order)
    .sort(
      (a, b) =>
        Date.parse(b.createdAt) -
        Date.parse(a.createdAt)
    )
}

export async function getOrder(
  userId: string,
  orderId: string
): Promise<Order | null> {
  return (
    (await requireKV().get(
      key.order(userId, orderId)
    )) as Order | null
  )
}

export async function saveOrder(
  order: Order
) {
  const kv = requireKV()

  await kv.set(
    key.order(order.userId, order.id),
    order
  )

  await kv.set(
    key.globalOrder(order.id),
    order
  )
}

export async function updateOrder(
  order: Order
) {
  await saveOrder(order)
}

export async function getCoupon(
  code: string
): Promise<Coupon | null> {
  return (
    (await requireKV().get(
      `coupon:${code.toUpperCase()}`
    )) as Coupon | null
  )
}

export async function listReviews(
  productId: string
): Promise<Review[]> {
  const result = await requireKV().list(
    `review:${productId}:`
  )

  return result.data
    .map((row) => row.value as Review)
    .sort(
      (a, b) =>
        Date.parse(b.createdAt) -
        Date.parse(a.createdAt)
    )
}

export async function saveReview(
  review: Review
) {
  await requireKV().set(
    key.review(
      review.productId,
      review.id
    ),
    review
  )
}

export async function listConversation(
  userId: string
): Promise<Conversation[]> {
  const result = await requireKV().list(
    `user:${userId}:conversation:`
  )

  return result.data
    .map((row) => row.value as Conversation)
    .sort(
      (a, b) =>
        Date.parse(a.createdAt) -
        Date.parse(b.createdAt)
    )
}

export async function saveConversation(
  userId: string,
  message: Conversation
) {
  await requireKV().set(
    key.conversation(userId, message.id),
    message
  )
}