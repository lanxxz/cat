/**
 * Tutorial Guide / 教程向导
 *
 * Step-by-step in-game guidance overlay for Level 1 (Tutorial).
 * Rendered as a DOM overlay above the canvas, showing instruction text
 * per tutorial step with optional directional arrow.
 * 逐步游戏内指导覆盖层，在画布上方显示教程步骤说明文字及可选的指示箭头。
 */

import type { Language } from '../types';
import type { TutorialStep } from '../types';
import { TEXT } from '../i18n';
import {
  tutorialOverlayContainer,
  tutorialTextBox,
  tutorialArrow
} from '../styles';

interface TutorialGuideProps {
  /** Current tutorial step (0 = inactive) / 当前教程步骤 (0 = 未激活) */
  step: TutorialStep;
  /** Active language / 当前语言 */
  lang: Language;
  /** Current game level / 当前游戏关卡 */
  level: number;
}

/**
 * Maps tutorial step numbers to their corresponding i18n text keys.
 * Step 0 is handled by the early return, so we only map 1-4.
 */
const STEP_TEXTS: Record<number, keyof ReturnType<typeof TEXT>> = {
  1: 'tutorialStep1',
  2: 'tutorialStep2',
  3: 'tutorialStep3',
  4: 'tutorialStep4',
};

/**
 * TutorialGuide component - shows step instructions as a DOM overlay
 * over the canvas. Returns null when tutorial is inactive (step=0)
 * or not on Level 1.
 */
export default function TutorialGuide({ step, lang, level }: TutorialGuideProps) {
  // Hide when tutorial is inactive or not Level 1
  if (step === 0 || level !== 1) return null;

  const textKey = STEP_TEXTS[step];
  if (!textKey) return null;

  const t = TEXT(lang);
  const text = t[textKey];

  // Step 2 (select tower) shows a downward arrow pointing to the tower panel
  const showArrow = step === 2;

  return (
    <div style={tutorialOverlayContainer}>
      <div style={tutorialTextBox}>
        {text}
      </div>
      {showArrow && (
        <div
          style={tutorialArrow}
          role="img"
          aria-label={lang === 'zh' ? '向下箭头' : 'downward arrow'}
        >
          👇
        </div>
      )}
    </div>
  );
}
