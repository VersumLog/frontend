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

  //isAuthor за замовчуванням true, щоб інші тести не ламалися
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
    expect(wrapper.text()).toContain('ТВІР 1')
  })

  it('показує loading стан', () => {
    const wrapper = createWrapper()
    expect(wrapper.text()).toContain('Завантаження творів...')
  })

  it('рендерить список творів після завантаження', async () => {
    const wrapper = createWrapper()
    await flushPromises()

    const cards = wrapper.findAll('.work-card')
    expect(cards).toHaveLength(3)
    expect(wrapper.text()).toContain('ТВІР 2')
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
    const wrapper = createWrapper(true, true) // isOwner = true, isAuthor = true
    await flushPromises()

    const tabs = wrapper.findAll('.tab-btn')

    expect(tabs.length).toBe(2)

    await tabs[1].trigger('click')

    expect(tabs[1].classes()).toContain('active')
    expect(wrapper.findComponent({ name: 'Drafts' }).exists()).toBe(true)
  })

  it('не показує вкладку "Чернетки" якщо автор, але не owner', async () => {
    const wrapper = createWrapper(false, true) // isOwner = false, isAuthor = true
    await flushPromises()

    const tabs = wrapper.findAll('.tab-btn')

    expect(tabs.length).toBe(1)
    expect(wrapper.findComponent({ name: 'Drafts' }).exists()).toBe(false)
  })

  it('взагалі нічого не відображає, якщо користувач не є автором (навіть якщо owner)', async () => {
    const wrapper = createWrapper(true, false) // isOwner = true, isAuthor = false
    await flushPromises()

    const container = wrapper.find('.works-container')
    
    expect(container.exists()).toBe(false)
  })
})