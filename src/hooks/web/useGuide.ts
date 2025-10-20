import { Config, driver } from 'driver.js'
import 'driver.js/dist/driver.css'
import { useDesign } from '@/hooks/web/useDesign'



const { variables } = useDesign()

export const useGuide = (options?: Config) => {
  const driverObj = driver(
    options || {
      showProgress: true,
      nextBtnText: '下一步',
      prevBtnText: '上一步',
      doneBtnText: '结束',
      steps: [
        {
          element: `#${variables.namespace}-menu`,
          popover: {
            title: '菜单',
            description: '以路由的结构渲染的菜单栏',
            side: 'right'
          }
        },
        {
          element: `#${variables.namespace}-tool-header`,
          popover: {
            title: '工具',
            description: '用于设置定制系统',
            side: 'left'
          }
        },
        {
          element: `#${variables.namespace}-tags-view`,
          popover: {
            title: '标签页',
            description: '用于记录路由历史记录',
            side: 'bottom'
          }
        }
      ]
    }
  )

  return {
    ...driverObj
  }
}
