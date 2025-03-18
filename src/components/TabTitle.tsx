import React, { useState, useMemo } from "react";
import {Segmented, Button, Popover} from 'antd';
import {PlusOutlined} from "@ant-design/icons";
import {GlobalRadialMenuItem, RadialMenuItem} from "@/types/type";

const itemTemplate: RadialMenuItem[] = [
    { id: 'radMenu-151', label: 'Selection mode: set control-point', icon: 'selection-mode-set-control-point', command: 'selection:mode:set:control-point' },
    { id: 'radMenu-152', label: 'Selection mode: set edge', icon: 'selection-mode-set-edge', command: 'selection:mode:set:edge' },
    { id: 'radMenu-153', label: 'Selection mode: set face', icon: 'selection-mode-set-face', command: 'selection:mode:set:face' },
    { id: 'radMenu-154', label: 'Selection mode: set solid', icon: 'selection-mode-set-solid', command: 'selection:mode:set:solid' },
]



const Tabunit:React.FC<{
    selected: boolean,
    index: number;
    label: string;
    onDelete: (index: number) => void;
}> = ({selected, index, label, onDelete }) => {

    return (
        <Popover content={(<Button onClick={()=>onDelete(index)} danger>Delete</Button>)} title={null} trigger='contextMenu'>
            <span className={` ${selected?'font-bold':''}`}>{label}</span>
        </Popover>
    )
}

const TabTitle:React.FC< {
    index: number;
    globalItems: GlobalRadialMenuItem[];
    onSwitch: (index:number) => void;
    onItemsChange: (newItems: GlobalRadialMenuItem[]) => void;
}> = ({index, globalItems, onSwitch, onItemsChange}) => {

    // const [index, setIndex] = useState(0);

    const handleMenuDelete = (index:number) => {
        onItemsChange(globalItems.filter((_, idx:number) => idx !== index));
    }

    const segmentOptions = useMemo(() => {
        return globalItems.map((item, idx) => ({
            value: item.name,
            label: (
                <Tabunit
                    index={idx}
                    selected={idx === index}
                    label={item.name}
                    onDelete={handleMenuDelete}
                />
                // <div className='inline-flex gap-1 group'>
                //     <span className={idx==index?'font-bold':''}>{item.name}</span>
                //     <CloseOutlined className='!hidden group-hover:!inline-flex hover:!text-red-400'/>
                // </div>
            ),
        }))
    }, [globalItems.length, globalItems.map(item => item.name)])


    const handleMenuSwitch = (value: string) => {
        const index = segmentOptions.findIndex(option => option.value === value);
        onSwitch(index);
    }

    const handleAdd = () => {
        const newItems:GlobalRadialMenuItem[] = [...globalItems, {
            name: `New Radial Menu-${globalItems.length}`,
            command: `radial: menu-${globalItems.length}`,
            items: itemTemplate
        }]
        onItemsChange(newItems)
    }

    return (
        <div className="pt-8 flex justify-between items-center gap-4">
            <Segmented
                value={segmentOptions[index].value}
                size="large"
                options={segmentOptions}
                onChange={handleMenuSwitch}
                className='select-none gabarito-regular'
            />
            <Button size="large" type="primary" onClick={handleAdd} icon={<PlusOutlined/>}/>
        </div>
    )
}

export default TabTitle;