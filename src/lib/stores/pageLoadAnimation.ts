import { writable } from 'svelte/store';

interface TextAnimation {
  title: string;
  subtitle: string;
  titleTyped: string;
  subtitleTyped: string;
  isAnimating: boolean;
}

function createPageLoadAnimation() {
  const { subscribe, set, update } = writable<TextAnimation>({
    title: '',
    subtitle: '',
    titleTyped: '',
    subtitleTyped: '',
    isAnimating: false
  });

  const typeText = async (text: string, delay: number = 25): Promise<string[]> => {
    const chars: string[] = [];
    for (let i = 0; i <= text.length; i++) {
      chars.push(text.slice(0, i));
      await new Promise(resolve => setTimeout(resolve, delay));
    }
    return chars;
  };

  return {
    subscribe,
    startAnimation: async (title: string, subtitle: string) => {
      set({
        title,
        subtitle,
        titleTyped: '',
        subtitleTyped: '',
        isAnimating: true
      });

      // Type title first
      const titleChars = await typeText(title);
      for (const char of titleChars) {
        update(state => ({ ...state, titleTyped: char }));
      }

      // Then type subtitle
      const subtitleChars = await typeText(subtitle);
      for (const char of subtitleChars) {
        update(state => ({ ...state, subtitleTyped: char }));
      }

      update(state => ({ ...state, isAnimating: false }));
    }
  };
}

export const pageLoadAnimation = createPageLoadAnimation(); 