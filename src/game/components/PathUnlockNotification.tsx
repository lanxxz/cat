/**
 * PathUnlockNotification - 路径解锁通知组件
 * 
 * Animated overlay that appears when a new enemy path is unlocked.
 * 新敌人路径解锁时显示的动画覆盖层。
 * 
 * Displays: "🚀 {pathName} 路线解锁！" with bounce animation.
 * 显示："🚀 {路径名称} 路线解锁！" 带弹跳动画。
 */

interface PathUnlockNotificationProps {
  /** Path display name / 路径显示名称 */
  name: string;
  /** Path color for background / 路径颜色用于背景 */
  color: string;
}

/**
 * PathUnlockNotification component / 路径解锁通知组件
 * 
 * Renders a full-screen centered notification with the path's theme color.
 * 使用路径的主题颜色渲染全屏居中通知。
 */
export function PathUnlockNotification({ name, color }: PathUnlockNotificationProps) {
  return (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: color,
        color: 'white',
        padding: '15px 30px',
        borderRadius: '12px',
        fontSize: '24px',
        fontWeight: 'bold',
        fontFamily: 'Fredoka One, cursive',
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
        animation: 'bounce 0.5s ease-out',
        zIndex: 100,
      }}
    >
      🚀 {name} 路线解锁！
    </div>
  );
}

export default PathUnlockNotification;
