import { createContext, useContext, useState, useCallback } from 'react'
import ToastNotification from '../components/ui/ToastNotification'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [items, setItems] = useState([])
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [toast, setToast] = useState({ isVisible: false, message: '' })

  const openDrawer  = useCallback(() => setIsDrawerOpen(true), [])
  const closeDrawer = useCallback(() => setIsDrawerOpen(false), [])

  const addToCart = useCallback((product, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === product.id)
      if (existing) {
        return prev.map((i) =>
          i.id === product.id ? { ...i, quantity: i.quantity + quantity } : i
        )
      }
      return [
        ...prev,
        {
          id: product.id,
          slug: product.slug,
          name: product.name,
          brand: product.brand ?? null,
          category: product.category ?? null,
          tipo: product.tipo ?? null,
          price: product.price,
          originalPrice: product.originalPrice ?? null,
          inStock: product.inStock ?? true,
          quantity,
        },
      ]
    })
    setToast({ isVisible: true, message: 'Añadido al carrito' })
    setIsDrawerOpen(true)
  }, [])

  const removeFromCart = useCallback((id) => {
    setItems((prev) => prev.filter((i) => i.id !== id))
  }, [])

  const updateQuantity = useCallback((id, quantity) => {
    if (quantity < 1) return
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, quantity } : i)))
  }, [])

  const clearCart = useCallback(() => setItems([]), [])

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0)
  const subtotal   = items.reduce((sum, i) => sum + i.price * i.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        items, addToCart, removeFromCart, updateQuantity, clearCart,
        totalItems, subtotal,
        isDrawerOpen, openDrawer, closeDrawer,
      }}
    >
      {children}
      <ToastNotification 
        message={toast.message} 
        isVisible={toast.isVisible} 
        onClose={() => setToast({ ...toast, isVisible: false })} 
      />
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside CartProvider')
  return ctx
}
