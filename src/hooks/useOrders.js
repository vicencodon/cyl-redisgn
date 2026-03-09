import { useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export function useOrders() {
  const { user, isLoggedIn } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)

  // Crea un pedido completo con sus líneas
  const createOrder = useCallback(
    async ({ items, total, shippingMethod, paymentMethod, shippingAddress }) => {
      setLoading(true)
      setError(null)

      // 1. Insertar cabecera del pedido
      const { data: order, error: orderErr } = await supabase
        .from('orders')
        .insert({
          user_id:          isLoggedIn ? user.id : null,
          status:           'pending',
          total,
          shipping_method:  shippingMethod,
          payment_method:   paymentMethod,
          shipping_address: shippingAddress,
        })
        .select()
        .single()

      if (orderErr) {
        setError(orderErr.message)
        setLoading(false)
        return null
      }

      // 2. Insertar líneas de pedido
      const lines = items.map((i) => ({
        order_id:   order.id,
        product_id: i.id,
        name:       i.name,
        price:      i.price,
        quantity:   i.quantity,
      }))

      const { error: itemsErr } = await supabase.from('order_items').insert(lines)

      if (itemsErr) {
        setError(itemsErr.message)
        setLoading(false)
        return null
      }

      setLoading(false)
      return order.id
    },
    [isLoggedIn, user]
  )

  // Obtiene el historial de pedidos del usuario autenticado
  const fetchMyOrders = useCallback(async () => {
    if (!isLoggedIn) return []
    setLoading(true)
    const { data, error: err } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .order('created_at', { ascending: false })

    setLoading(false)
    if (err) { setError(err.message); return [] }
    return data ?? []
  }, [isLoggedIn])

  return { createOrder, fetchMyOrders, loading, error }
}
