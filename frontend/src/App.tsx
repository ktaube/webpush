
import PWABadge from './PWABadge.tsx'
import './App.css'
import { useEffect, useState } from 'react'

// Taken from https://www.npmjs.com/package/web-push
function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4)
  const base64 = `${base64String}${padding}`
    .replace(/-/g, '+')
    .replace(/_/g, '/')

  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i)
    outputArray[i] = rawData.charCodeAt(i)

  return outputArray
}

function App() {
  const [subscription, setSubscription] = useState<PushSubscriptionJSON | undefined>(undefined)
  const [error, setError] = useState<Error | undefined>(undefined)

  useEffect(() => {
    if (subscription) return
    const getRegistration = async () => {
      try {
        const registration = await navigator.serviceWorker.getRegistration()
        const subscribed = await registration?.pushManager.getSubscription()
        if (subscribed) return
        const subscription = await registration?.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(import.meta.env.VITE_VAPID_PUBLIC_KEY)
        })
        setSubscription(subscription?.toJSON())
      } catch (error) {
        setError(error as Error)
      }
    }
    getRegistration()
  }, [subscription])

  return (
    <>
    hello 123
      <button onClick={async () => {
        await Notification.requestPermission()

      }}>subscribe</button>
      {subscription && JSON.stringify(subscription)}
      {JSON.stringify(error)}
      <PWABadge />
    </>
  )
}

export default App
