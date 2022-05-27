// Styles
import './VBadge.sass'

// Components
import { VIcon } from '@/components/VIcon'

// Composables
import { makeRoundedProps, useRounded } from '@/composables/rounded'
import { makeTagProps } from '@/composables/tag'
import { makeThemeProps, useTheme } from '@/composables/theme'
import { makeTransitionProps, MaybeTransition } from '@/composables/transition'
import { useBackgroundColor, useTextColor } from '@/composables/color'
import { useLocale } from '@/composables/locale'
import { makeLocationProps, useLocation } from '@/composables/location'

// Utilities
import { computed, toRef } from 'vue'
import { defineComponent, pick } from '@/util'

export const VBadge = defineComponent({
  name: 'VBadge',

  inheritAttrs: false,

  props: {
    bordered: Boolean,
    color: String,
    content: [Number, String],
    dot: Boolean,
    floating: Boolean,
    icon: String,
    inline: Boolean,
    label: {
      type: String,
      default: '$vuetify.badge',
    },
    max: [Number, String],
    modelValue: {
      type: Boolean,
      default: true,
    },
    textColor: String,

    ...makeLocationProps({ location: 'top end' } as const),
    ...makeRoundedProps(),
    ...makeTagProps(),
    ...makeThemeProps(),
    ...makeTransitionProps({ transition: 'scale-rotate-transition' }),
  },

  setup (props, ctx) {
    const { backgroundColorClasses, backgroundColorStyles } = useBackgroundColor(toRef(props, 'color'))
    const { roundedClasses } = useRounded(props)
    const { t } = useLocale()
    const { textColorClasses, textColorStyles } = useTextColor(toRef(props, 'textColor'))
    const { themeClasses } = useTheme()

    const { locationStyles } = useLocation(props, true, computed(() => {
      return props.floating
        ? (props.dot ? 2 : 4)
        : (props.dot ? 8 : 12)
    }))

    return () => {
      const value = Number(props.content)
      const content = (!props.max || isNaN(value)) ? props.content
        : value <= props.max ? value
        : `${props.max}+`

      const [badgeAttrs, attrs] = pick(ctx.attrs as Record<string, any>, [
        'aria-atomic',
        'aria-label',
        'aria-live',
        'role',
        'title',
      ])

      return (
        <props.tag
          class={[
            'v-badge',
            {
              'v-badge--bordered': props.bordered,
              'v-badge--dot': props.dot,
              'v-badge--floating': props.floating,
              'v-badge--inline': props.inline,
            },
          ]}
          { ...attrs }
        >
          <div class="v-badge__wrapper">
            { ctx.slots.default?.() }

            <MaybeTransition transition={ props.transition }>
              <span
                v-show={ props.modelValue }
                class={[
                  'v-badge__badge',
                  backgroundColorClasses.value,
                  roundedClasses.value,
                  textColorClasses.value,
                  themeClasses.value,
                ]}
                style={[
                  backgroundColorStyles.value,
                  textColorStyles.value,
                  props.inline ? {} : locationStyles.value,
                ]}
                aria-atomic="true"
                aria-label={ t(props.label, value) }
                aria-live="polite"
                role="status"
                { ...badgeAttrs }
              >
                {
                  props.dot ? undefined
                  : ctx.slots.badge ? ctx.slots.badge?.()
                  : props.icon ? <VIcon icon={ props.icon } />
                  : content
                }
              </span>
            </MaybeTransition>
          </div>
        </props.tag>
      )
    }
  },
})

export type VBadge = InstanceType<typeof VBadge>
