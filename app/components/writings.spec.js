import { mount, flushPromises } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import Writings from './profileWritings.vue' 

describe('Writings.vue', () => {
  const mockWorks = [
    { postId: 1, title: 'ТВІР 1', genres: [{ name: 'Драма' }], likesCount: 10, commentsCount: 2 },
    { postId: 2, title: 'ТВІР 2', genres: [{ name: 'Комедія' }], likesCount: 5, commentsCount: 0 },
    { postId: 3, title: 'ТВІР 3', genres: [{ name: 'Фентезі' }], likesCount: 20, commentsCount: 5 }
  ]

  beforeEach(() => {
    vi.stubGlobal('$fetch', vi.fn(() => Promise.resolve(mockWorks)))
    
    vi.stubGlobal('useRuntimeConfig', vi.fn(() => ({
      public: { apiBase: 'https://localhost:7014' }
    })))
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  const createWrapper = (isOwner = false, isAuthor = true) => {
    return mount(Writings, {
      props: {
        username: 'Sofiydes',
        isOwner,
        isAuthor
      },
      global: {
        stubs: {
          Drafts: true 
        }
      }
    })
  }

  it('за замовчуванням відкриті "Твори"', async () => {
    const wrapper = createWrapper()
    await flushPromises()

    const tabs = wrapper.findAll('.tab-btn')
    expect(tabs[0].classes()).toContain('active')
    
    const cards = wrapper.findAll('.work-card')
    expect(cards.length).toBeGreaterThan(0)
  })

  it('показує loading стан', async () => {
    let resolveFetch;
    vi.stubGlobal('$fetch', vi.fn(() => new Promise(resolve => {
       resolveFetch = resolve;
    })))

    const wrapper = createWrapper()
    
    expect(wrapper.text()).toContain('Завантаження творів...')
    
    resolveFetch(mockWorks)
    await flushPromises()
  })

  it('рендерить список творів після завантаження', async () => {
    const wrapper = createWrapper()
    await flushPromises()

    const cards = wrapper.findAll('.work-card')
    expect(cards.length).toBe(3)
    
    expect(wrapper.text()).toContain('ТВІР 1')
  })

  it('показує повідомлення якщо творів немає', async () => {
    vi.stubGlobal('$fetch', vi.fn(() => Promise.resolve([])))

    const wrapper = createWrapper()
    await flushPromises()

    expect(wrapper.text()).toContain('Творів не знайдено.')
  })

  it('перемикає на вкладку "Чернетки" тільки для власника-автора', async () => {
    const wrapper = createWrapper(true, true)
    await flushPromises()

    const tabs = wrapper.findAll('.tab-btn')
    expect(tabs.length).toBe(2)

    await tabs[1].trigger('click')

    expect(tabs[1].classes()).toContain('active')
    
    expect(wrapper.find('drafts-stub').exists()).toBe(true)
  })

  it('не показує вкладку "Чернетки" якщо автор, але не owner', async () => {
    const wrapper = createWrapper(false, true)
    await flushPromises()

    const tabs = wrapper.findAll('.tab-btn')
    expect(tabs.length).toBe(1) 
    
    expect(wrapper.find('drafts-stub').exists()).toBe(false)
  })

  it('взагалі нічого не відображає, якщо користувач не є автором (навіть якщо owner)', async () => {
    const wrapper = createWrapper(true, false)
    await flushPromises()

    const container = wrapper.find('.works-container')
    expect(container.exists()).toBe(false)
  })
})