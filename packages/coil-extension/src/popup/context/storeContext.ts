import { createContext, useContext, useEffect, useState } from 'react'
import { StorageService } from '@web-monetization/wext/services'

import { PopupStateType, STORAGE_KEYS } from '../services/PopupState'
import { PopupHost } from '../types'

export type StorageEventPartial = Pick<StorageEvent, 'key' | 'newValue'>

export const useStoreState = (
  storage: Pick<StorageService, 'get'>,
  host: PopupHost
): PopupStateType => {
  const [store, setStore] = useState<PopupStateType>({} as PopupStateType)
  const [init, setInit] = useState(false)
  if (!init) {
    const defaultValue: Record<string, unknown> = {}
    STORAGE_KEYS.forEach(k => {
      defaultValue[k] = storage.get(k)
    })
    setStore(defaultValue)
    setInit(true)
  }
  useEffect(() => {
    const events = host.events
    events.on('storage', (evt: StorageEventPartial) => {
      if (evt.key && evt.newValue) {
        const key = evt.key
        setStore(old => ({
          ...old,
          [key]: storage.get(key)
        }))
      }
    })
  }, [])

  return store
}

export const StoreContext = createContext<PopupStateType>({})

export const useStore = () => {
  return useContext(StoreContext)
}
