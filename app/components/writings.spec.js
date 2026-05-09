import { mount, flushPromises } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import WorksBoard from './writings.vue' 

describe('WorksBoard.vue', () => {
  const mockWorks = [
    { postId: 1, title: 'НАЗВА ТВОРУ 1', genres: [{ name: 'Драма' }], likes: 10, comments: 2 },
    { postId: 2, title: 'НАЗВА ТВОРУ 2', genres: [{ name: 'Комедія' }], likes: 5, comments: 0 },
    { postId: 3, title: 'НАЗВА ТВОРУ 3', genres: [{ name: 'Фентезі' }], likes: 20, comments: 5 },
    { postId: 4, title: 'НАЗВА ТВОРУ 4', genres: [{ name: 'Романтика' }], likes: 0, comments: 0 },
    { postId: 5, title: 'НАЗВА ТВОРУ 5', genres: [{ name: 'Детектив' }], likes: 2, comments: 1 }
  ]

  beforeEach(() => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockWorks),
      })
    )
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  const createWrapper = () => {
    return mount(WorksBoard, {
      props: {
        username: 'Sofiydes'
      },
      global: {
        stubs: {
          Drafts: true 
        }
      }
    })
  }

  it('рендерить вкладку "Твори" за замовчуванням', async () => {
    const wrapper = createWrapper()
    
    await flushPromises() 
    
    const worksButton = wrapper.findAll('.tab-btn')[0]
    expect(worksButton.classes()).toContain('active')

    expect(wrapper.find('.scrollable-list').exists()).toBe(true)
  })

  it('відображає текст завантаження, поки дані не прийшли', () => {
    const wrapper = createWrapper()
    expect(wrapper.text()).toContain('Завантаження творів...')
  })

  it('відображає правильну кількість творів у списку після завантаження', async () => {
    const wrapper = createWrapper()
    await flushPromises() 
    
    const workCards = wrapper.findAll('.work-card')
    
    expect(workCards.length).toBe(5)
    expect(wrapper.text()).toContain('НАЗВА ТВОРУ 1')
  })

  it('відображає повідомлення, якщо творів немає', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]),
      })
    )

    const wrapper = createWrapper()
    await flushPromises() 

    expect(wrapper.text()).toContain('Творів не знайдено.')
  })

  it('перемикає на вкладку "Чернетки" при кліку', async () => {
    const wrapper = createWrapper()
    await flushPromises() 
    
    const draftsButton = wrapper.findAll('.tab-btn')[1]
    
    await draftsButton.trigger('click')
    
    expect(draftsButton.classes()).toContain('active')
    const worksButton = wrapper.findAll('.tab-btn')[0]
    expect(worksButton.classes()).not.toContain('active')

    expect(wrapper.find('.scrollable-list').exists()).toBe(false)
    
    expect(wrapper.findComponent({ name: 'Drafts' }).exists()).toBe(true)
  })
})