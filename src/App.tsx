import { useState } from 'react'
import OperaPanel from '@/components/operatedPanel';
import {RadialMenuItem} from "@/types/type";
import {useMenuItemStore} from "@/stores/store.ts";
import {ConfigProvider, theme} from 'antd';
import './App.css'

function App() {
    const {menuItems, setMenuItems} = useMenuItemStore()

    // const handleItemClick = (item: RadialMenuItem) => {
    //     console.log('Selected:', item);
    //     // 在此处添加点击处理逻辑
    // };

    const handleItemAdd = () => {
        const newMenuItems = [...menuItems, {
            id: `add_${menuItems.length + 1}`,
            label: `Item ${menuItems.length + 1}`,
            color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
            icon: `item-${menuItems.length + 1}`,
            command: ` `,
        }];
        setMenuItems(newMenuItems)
    }

    const handleItemRemove = () => {
        const newMenuItems = menuItems.slice(0, -1)
        console.log(newMenuItems)
        setMenuItems(newMenuItems)
    }

  return (
      <ConfigProvider
        theme={{
            token: {
                colorPrimary: '#7A3DE8',
            },
            algorithm: theme.darkAlgorithm,
        }}
      >
          <div className="app-container bg-neutral-800 flex w-screen h-screen box-border p-6 flex justify-between items-center selection:bg-violet-900 selection:text-neutral-200">
              {/* 环形菜单 */}
              <OperaPanel/>

              {/*/!* 动态控制示例 *!/*/}
              {/*<div className="controls">*/}
              {/*    <button*/}
              {/*        onClick={handleItemAdd}*/}
              {/*        disabled={menuItems.length >= 12}*/}
              {/*    >*/}
              {/*        Add Item*/}
              {/*    </button>*/}

              {/*    <button*/}
              {/*        onClick={handleItemRemove}*/}
              {/*        disabled={menuItems.length <= 2}*/}
              {/*    >*/}
              {/*        Remove Item*/}
              {/*    </button>*/}
              {/*</div>*/}
          </div>
      </ConfigProvider>
  )
}

export default App
