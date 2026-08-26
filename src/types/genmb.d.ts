export type GenMBUser = { id: string; email: string; name: string; picture: string }
type KVRecord = { key: string; value: any }
type CommerceCart = { items: Array<{ productId: string; qty: number; title: string; priceCents: number; price: number; image: string }>; subtotal: number; subtotalCents: number; tax: number; shipping: number; total: number; totalCents: number; currency: string }

declare global {
  interface Window {
    GENMB_APP_ID?: string
    genmb: {
      auth: { ready: () => Promise<void>; signIn: () => Promise<GenMBUser | null>; sendMagicLink: (email: string) => Promise<{ success: boolean; data: unknown }>; signUp: (email: string, password: string, name?: string) => Promise<{ success: boolean; data: unknown }>; verifySignUp: (email: string, code: string) => Promise<GenMBUser | null>; signInWithPassword: (email: string, password: string) => Promise<GenMBUser | null>; requestPasswordReset: (email: string) => Promise<void>; confirmPasswordReset: (email: string, code: string, newPassword: string) => Promise<{ success: boolean; data: unknown }>; signOut: () => Promise<void>; getUser: () => GenMBUser | null; isAuthenticated: () => boolean; onAuthStateChange: (callback: (user: GenMBUser | null) => void) => () => void }
      billing: { ready: () => Promise<void>; checkout: (options: { amount: number; currency: string; productName: string; successUrl?: string; cancelUrl?: string; endUserEmail?: string; metadata?: Record<string, string> }) => Promise<void>; verifySession: (sessionId: string) => Promise<{ paid: boolean; amountCents: number; currency: string }> }
      kv: { get: (key: string) => Promise<any>; set: (key: string, value: any) => Promise<void>; delete: (key: string) => Promise<{ deleted: boolean }>; list: (prefix: string) => Promise<{ data: KVRecord[]; total: number }>; increment: (key: string, by?: number) => Promise<number> }
      address: { validate: (address: Address) => Promise<{ valid: boolean; normalized?: Address; suggestions?: Address[]; confidence: number }>; autocomplete: (query: string, options?: unknown) => Promise<{ results: Array<{ description: string; placeId: string }>; mapsKeyConfigured?: boolean }>; format: (address: Address, locale?: string) => string }
      commerce: { addToCart: (productId: string, qty?: number) => Promise<void>; getCart: () => Promise<CommerceCart>; removeFromCart: (productId: string) => Promise<void>; clearCart: () => Promise<void>; estimateShipping: (address: Address, items?: unknown[]) => Promise<{ rates: Array<{ name: string; carrier: string; amount: number; deliveryDays: number }> }> }
      adminTable: { buildEmptyView: () => { filters: any[]; sort: any; hiddenColumns: string[]; pageSize: number; groupBy: string | null }; filterRows: <T>(rows:T[], filters:any[])=>T[]; exportCsv: (rows:any[], columns:any[])=>void; exportXlsx: (rows:any[], columns:any[])=>Promise<void> }
      inventory: { variants:{ list:(opts?:{productId?:string})=>Promise<any[]> }; locations:{ list:()=>Promise<any[]> }; stock:{ adjust:(variantId:string,locationId:string,delta:number,reason:string)=>Promise<void> } }
    }
  }
}
export type Address = { line1: string; line2?: string; city: string; region: string; postalCode: string; country: string; countryCode: string }
