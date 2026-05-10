import { mount, flushPromises } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import Writings from './writings.vue'

describe('Writings.vue', () => {
  const mockWorks = [
    { postId: 1, title: 'ТВІР 1', genres: [{ name: 'Драма' }], likes: 10, comments: 2 },
    { postId: 2, title: 'ТВІР 2', genres: [{ name: 'Комедія' }], likes: 5, comments: 0 },
    { postId: 3, title: 'ТВІР 3', genres: [{ name: 'Фентезі' }], likes: 20, comments: 5 }
  ]

  beforeEach(() => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockWorks)
      })
    )
  })

  afterEach(() => {
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
          // Це створить фейковий тег <drafts-stub></drafts-stub> у віртуальному DOM
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
    
    // Перевіряємо, що зрендерилися картки, не прив'язуючись до їхнього тексту
    const cards = wrapper.findAll('.work-card')
    expect(cards.length).toBeGreaterThan(0)
  })

  it('показує loading стан', () => {
    const wrapper = createWrapper()
    // Текст точно збігається з твоїм: "Завантаження..."
    expect(wrapper.text()).toContain('Завантаження...')
  })

  it('рендерить список творів після завантаження', async () => {
    const wrapper = createWrapper()
    await flushPromises()

    // Рахуємо кількість зрендерених div з класом work-card
    const cards = wrapper.findAll('.work-card')
    expect(cards.length).toBe(3)
  })

  it('показує повідомлення якщо творів немає', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([])
      })
    )

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
    
    // НАЙНАДІЙНІШИЙ спосіб знайти стаб у Vue Test Utils
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