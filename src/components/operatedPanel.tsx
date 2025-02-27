import React from "react";
import {
    DndContext,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
    DragOverlay,
} from "@dnd-kit/core";

import {
    arrayMove,
    SortableContext,
} from "@dnd-kit/sortable";

import { useMenuItemStore } from "@/stores/store";
import {sectorCollisionDetection, rotateAround} from "@/utils/util"
import RadialMenu from "@/components/RadialMenu/radialMenu";
import CommandList from "@/components/commandList";
import { RadialMenuItem } from "@/types/type";
import MenuLabel from "@/components/menuLabel.tsx";

const OperaPanel: React.FC= () => {

    const { menuItems, setMenuItems } = useMenuItemStore();

    const listItems:RadialMenuItem[] = [
        { id: 6, label: 'Home1', color: '#7d4ecd', icon: 'home1', command: '' },
        { id: 7, label: 'Settings1', color: '#ff385d', icon: 'settings1', command: ''},
        { id: 8, label: 'Profile1', color: '#ebff6b', icon: 'profile1', command: ''},
    ]

    const sensors = useSensors(
        useSensor(PointerSensor)
    );

    const size = {
        width: 600,
        height: 480,
    }

    const handleDragOver = (event: DragEndEvent) => {
        const { active, over } = event;
        // console.log(
        //     "handleDragOver:",
        //     // listItems.some((item)=>item.id === active.id),
        //     over?.id,
        //     over,
        //     menuItems);
        //
        if(!menuItems.some((item)=>item.id === `radMenu-${active.id}`)
            &&over?.id
        ) {
            const draggedItem = listItems.find((item) => item.id === active.id);
            const overIndex = menuItems.findIndex((item) => item.id === over.id);

            if (!draggedItem) return;
            const addItem = {...draggedItem, id:`radMenu-${draggedItem.id}` };
            // console.log(addItem)

            // 创建去重后的新数组（移除可能存在的重复项）
            const filteredItems = menuItems.filter(item => item.id !== draggedItem.id);

            // 插入到目标位置
            const newItems = [
                ...filteredItems.slice(0, overIndex),
                addItem,
                ...filteredItems.slice(overIndex)
            ];

            setMenuItems(newItems);
        } else {
            // console.log("filter");
            
            // setMenuItems(prev => prev.filter(item => item.id !== active.id));
        }
    }

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        // console.log("handleDragEnd:", active, over);
        if(over?.id !== 'trashBin') {
            if (active.id !== over?.id) {
                const oldIndex = menuItems.findIndex((item) => item.id === active.id);
                const newIndex = menuItems.findIndex((item) => item.id === over?.id);

                let newItems = menuItems;
                // 列表变动
                if(newIndex>-1&&oldIndex>-1) {
                    newItems = arrayMove(menuItems, oldIndex, newIndex);
                }


                setMenuItems(newItems);
            }
        } else {
            if(menuItems.length>2) {
                setMenuItems(prev => prev.filter(item => item.id !== active.id));
            }
            console.log(listItems);
        }
    };
    

    return (
        <>
            <DndContext
                sensors={sensors}
                collisionDetection={sectorCollisionDetection}
                modifiers={[rotateAround]}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
            >
                <SortableContext items={menuItems}>
                    <div className="radial-wrap" style={{ width: size.width , height: size.height }}>
                        <MenuLabel
                            items={menuItems}
                            size={size}
                            radius={180}
                            sparsityRatio={0.2}
                            spacing={20}
                            extendLength={1000}
                        />
                        <RadialMenu/>
                        <DragOverlay>
                            <div>1111</div>
                        </DragOverlay>
                    </div>
                    <CommandList items={listItems}/>
                </SortableContext>
            </DndContext>
        </>
    );
};

export default OperaPanel;