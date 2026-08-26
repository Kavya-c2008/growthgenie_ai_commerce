import type { Product } from '../data/products'
import { money, salePrice } from './utils'

export type AgentResult = { text: string; products: Product[]; askFollowUp?: boolean; comparison?: boolean }
const stopWords = new Set(['i','need','want','a','an','the','for','with','and','or','to','me','show','find','looking','under','around','best','please','some','my','rs','rupees','inr'])
const budgetFrom = (query: string) => {
  const match = query.replace(/,/g,'').match(/(?:under|below|less than|budget|within|₹|rs\.?|inr)\s*(?:of\s*)?(\d{3,6})/i)
  return match ? Number(match[1]) : undefined
}
export const scoreProduct = (product: Product, text: string) => {
  const query = text.toLowerCase(); const tokens = query.split(/[^a-z0-9]+/).filter(word => word.length > 2 && !stopWords.has(word))
  const haystack = [product.name,product.description,product.category,product.brand,...product.tags,...Object.values(product.specs ?? {})].join(' ').toLowerCase()
  let score = product.rating * 7 + product.popularity / 11 + product.discount / 3 + (product.aiScore ?? 0) / 10
  tokens.forEach(token => { if (haystack.includes(token)) score += 20 })
  const budget = budgetFrom(query); if (budget) score += salePrice(product.price,product.discount) <= budget ? 32 : -45
  const rating = query.match(/(?:rated|rating|at least)\s*(\d(?:\.\d)?)/i); if (rating && product.rating >= Number(rating[1])) score += 18
  if (/value|budget|affordable/.test(query)) score += (1 - salePrice(product.price,product.discount) / Math.max(1,budget ?? 80000)) * 16
  if (/sale|discount/.test(query)) score += product.discount * 2
  if (query.includes(product.brand.toLowerCase())) score += 28
  return score
}
export function runAgent(input:string, products:Product[], history:string[]):AgentResult {
  const contextual = [...history.slice(-4),input].join(' '); const query = contextual.toLowerCase()
  const named = products.filter(p => input.toLowerCase().includes(p.name.toLowerCase()) || input.toLowerCase().includes(p.name.toLowerCase().split(' ').slice(0,2).join(' ')))
  if (/compare/.test(query) && named.length >= 2) { const [a,b] = named.slice(0,2); const winner = scoreProduct(a,input) >= scoreProduct(b,input) ? a : b; return { comparison:true, products:[a,b], text:`**${a.name}** costs ${money(salePrice(a.price,a.discount))}, is rated ${a.rating}/5, and is strongest for ${a.tags.slice(0,2).join(' + ')}. **${b.name}** costs ${money(salePrice(b.price,b.discount))}, is rated ${b.rating}/5, and is strongest for ${b.tags.slice(0,2).join(' + ')}. My best overall pick is **${winner.name}** because it delivers the highest balance of rating, product fit, discount, and AI value score.` } }
  if (/cart|checkout/.test(query)) return {products:[],text:'Your next step is ready: review quantities and coupon savings in Cart, then continue to Checkout. I can also recommend one more item if you share a category or budget.'}
  const ranked = products.filter(p=>p.stock>0).sort((a,b)=>scoreProduct(b,contextual)-scoreProduct(a,contextual)).slice(0,3)
  if (!ranked.length) return {products:[],text:'I could not find an in-stock match. Tell me the category, a budget such as ₹30,000, or the feature that matters most.'}
  const top=ranked[0]; const need = !budgetFrom(query) && !/(laptop|phone|headphone|watch|beauty|fashion|home|gaming|gift|sports)/.test(query)
  return {products:ranked,askFollowUp:need,text:`My top pick is **${top.name}** at ${money(salePrice(top.price,top.discount))}. It has a ${top.rating}/5 rating, an AI fit score of ${top.aiScore ?? 90}/100, and is particularly strong for ${top.tags.slice(0,2).join(' and ')}. I included two close alternatives so you can compare price, value, and features. ${need ? 'What category, budget, or must-have feature should I optimize for?' : 'Use Add to cart, save a favorite, or compare the options side by side.'}`}
}
