import React, {useEffect, useMemo, useRef, useState} from "react";
import {polarToCartesian, convertedObj2Table} from "@/utils/util.ts";
import {RadialMenuItem} from "@/types/type";
import {DragEndEvent, DragStartEvent, useDndMonitor} from "@dnd-kit/core";

interface menuLabelProps {
    items: RadialMenuItem[];
    radius?: number;
    spacing?: number;
    sparsityRatio?: number;
    size?: {width: number, height: number};
    extendLength?:number;
}

const MenuLabel:React.FC<menuLabelProps> = ({
                                                items,
                                                radius = 155,
                                                spacing = 10,
                                                sparsityRatio = 0,
                                                size = {width:500,height:500},
                                                extendLength = 10,
                                            }) => {

    const containerRef = useRef<SVGSVGElement>(null);

    const center = {x: size.width / 2, y: size.height / 2};

    const [showLabel, setShowLabel] = useState(true);
    const [isOdd, setIsOdd] = useState(false);

    useDndMonitor({
        onDragStart(event: DragStartEvent) {

        },
        onDragEnd(event: DragEndEvent) {

        }
    })
    const linePointsPosition = useMemo(() => {
        const sectorAngle = 360/items.length;
        const isOdd = items.length%2 > 0;
        setIsOdd(isOdd);
        const sectorRadians = Math.PI*2/items.length;
        const halfIndex = Math.floor(items.length/2)
        const rightItems = items.slice(0, halfIndex+1)

        const gapsArrayMin = rightItems.map((item, i) => {
            const currentPoint = polarToCartesian(center.x, center.y, radius, i*sectorAngle);
            const prevPoint = polarToCartesian(center.x, center.y, radius, (i-1)*sectorAngle);
            return i==0?0:Math.abs(currentPoint.y - prevPoint.y);
        })

        const maxGap = Math.max(...gapsArrayMin)

        const gapsArray = gapsArrayMin.map((gap, i) => i==0?0:(maxGap-gap)*sparsityRatio+gap)

        const labelsCenterRatio = isOdd?1/(Math.cos(sectorRadians/2)+1):0.5
        const initalLabelYPosition = size.height/2 - labelsCenterRatio * gapsArray.reduce((acc, curr) => acc + curr + spacing, -spacing)

        const labelsYPosition = gapsArray.reduce((acc, curr, index) => {
            const heightSum = acc[index - 1] + curr + spacing
            return index==0?[...acc]:[...acc, heightSum]
        } , [initalLabelYPosition])


        const midPointsRight = labelsYPosition.map((value, i) => {

            let uniFormPosY = value

            if(value<0) {
                uniFormPosY = 0
            } else if(value>size.height) {
                uniFormPosY = size.height
            }

            const labelRad = Math.PI/2 - i*sectorRadians
            const xOffest = labelRad===0?(radius+spacing):(size.height/2-uniFormPosY)/Math.tan(labelRad)
            const posY = xOffest>size.width/2?size.height/2-Math.tan(labelRad)*size.width/2:uniFormPosY
            // console.log(labelRad, xOffest)

            return {
                x: Math.round(size.width/2 + Math.min(xOffest, size.width/2)),
                y: Math.round(posY),
            }
        })

        const midPointsLeft = midPointsRight.slice(1).map((point) => ({...point, x: size.width-point.x})).reverse()

        const midPoints = midPointsRight.slice(0, isOdd?undefined:midPointsRight.length-1).concat(midPointsLeft)

        const linePoints = midPoints.map((point, i) => {
            const isLeft = i>items.length/2
            // const isRight = i>0&&i<items.length/2
            const isTop = i===0
            const isBottom = i===items.length/2

            let posX = point.x
            let posY = point.y

            if(isTop||isBottom) {
                posX = size.width/2;
                if(isTop) {
                    posY = Math.max(point.y - extendLength*0, 0)
                } else {
                    posY = Math.min(point.y + extendLength*0, size.height)
                }
            } else {
                if (isLeft) {
                    posX = Math.max(point.x - extendLength, 0)
                } else {
                    posX = Math.min(point.x + extendLength, size.width)
                }
            }
            return {
                id: items[i].id,
                mid: {
                    x: point.x,
                    y: Math.max(point.y, 0), //最上方中心点Y坐标clamp
                },
                end: {
                    x: posX,
                    y: posY,
                }
            }
        })

        const sortedLinePoints = linePoints.sort((a, b) => {
            if (a.id > b.id) {
                return 1;
            } else if (a.id < b.id) {
                return  -1;
            } else {
                return 0
            }
        });

        console.table(
            convertedObj2Table({
                // labelsCenterRatio,
                items,
                // gapsArrayMin,
                // gapsArray,
                // maxGap,
                // labelsYPosition,
                // midPointsLeft,
                // midPoints,
                linePoints
            })

        )

        return sortedLinePoints
    }, [items])




    return (
        <svg
            className="radial-menu-labels"
            ref={containerRef}
            viewBox={`0 0 ${size.width} ${size.height}`}
        >
            <defs>
                <radialGradient id="radialStroke" cx="50%" cy="50%" r="50%" gradientUnits="userSpaceOnUse">
                    <stop offset={`${200/Math.min(size.width, size.height)*100}%`} stopColor='transparent'/>
                    <stop offset="100%" stopColor="#ffffff"/>
                </radialGradient>

            </defs>
            {linePointsPosition.map((point, i) => {
                return (
                    <path
                        data-key={point.id}
                        key={point.id}
                        stroke="url(#radialStroke)"
                        strokeWidth={1}
                        fill="none"
                        d={`M ${center.x} ${center.y} L ${point.mid.x} ${point.mid.y} L ${point.end.x} ${point.end.y}`}
                    />
                )
            })}

        </svg>
    )
}

export default MenuLabel