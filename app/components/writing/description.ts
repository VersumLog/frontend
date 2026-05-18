import { Mark, mergeAttributes } from '@tiptap/core'
import type { CommandProps } from '@tiptap/core'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    description: {
      setDescription: (text: string) => ReturnType
      unsetDescription: () => ReturnType
    }
  }
}

export const DescriptionMark = Mark.create({
  name: 'description',

  addAttributes() {
    return {
      text: {
        default: null,
        parseHTML: element => element.getAttribute('data-description'),
        renderHTML: attributes => {
          if (!attributes.text) return {}
          return { 'data-description': attributes.text }
        },
      },
    }
  },

  parseHTML() {
    return [{ tag: 'span[data-description]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['span', mergeAttributes(HTMLAttributes, { class: 'has-description' }), 0]
  },

  addCommands() {
    return {
      setDescription: (text: string) => ({ commands }: CommandProps) => {
        return commands.setMark(this.name, { text })
      },
      unsetDescription: () => ({ commands }: CommandProps) => {
        return commands.unsetMark(this.name)
      },
    }
  },
})