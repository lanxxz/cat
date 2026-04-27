/**
 * LevelAnnouncement - 关卡公告组件
 * 
 * Centered overlay that displays level transition announcements.
 * 显示关卡过渡公告的居中覆盖层。
 * 
 * Used for:
 * - "第一关：萌新防御" (Level 1 start)
 * - "第一关通过！" (Level 1 complete)
 * - "第二关：进阶挑战" (Level 2 start)
 */

import {
  levelAnnouncementOverlay,
  levelAnnouncementSubtitle,
} from '../styles';

interface LevelAnnouncementProps {
  /** Main announcement text / 主公告文本 */
  text: string;
  /** Optional subtitle text / 可选副标题文本 */
  subtitle?: string;
}

/**
 * LevelAnnouncement component / 关卡公告组件
 * 
 * Renders a bouncing announcement overlay with pink background.
 * 渲染带粉色背景的弹跳公告覆盖层。
 */
export function LevelAnnouncement({ text, subtitle }: LevelAnnouncementProps) {
  return (
    <div style={levelAnnouncementOverlay}>
      <div>{text}</div>
      {subtitle && (
        <div style={levelAnnouncementSubtitle}>{subtitle}</div>
      )}
    </div>
  );
}

export default LevelAnnouncement;
